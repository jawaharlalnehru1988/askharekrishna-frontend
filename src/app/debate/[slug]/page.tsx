import React from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import DebateArticleDetail from '@/components/categories/DebateArticleDetail';
import { buildArticleMetadata, toAbsoluteMediaUrl, toPlainExcerpt } from '@/lib/metadata';

const VALID_LOCALES = ['ta', 'en', 'hi', 'kn', 'te', 'ml', 'bn'];

interface DebateArticleApiItem {
    id: number;
    subTopic: string;
    article: string;
    slug: string;
    articleImage?: string | null;
}

interface DebateCategoryApiItem {
    id: number;
    name: string;
    image?: string | null;
    articleList?: DebateArticleApiItem[];
}

async function fetchDebateArticleBySlug(slug: string, locale: string) {
    try {
        const response = await fetch(
            `https://api.askharekrishna.com/api/v1/debate/articles/?language=${encodeURIComponent(locale)}&slug=${encodeURIComponent(slug)}`,
            { next: { revalidate: 60 } }
        );
        if (response.ok) {
            const data = await response.json();
            const categories: DebateCategoryApiItem[] = Array.isArray(data) ? data : (data.results || []);
            for (const cat of categories) {
                if (cat.articleList && Array.isArray(cat.articleList)) {
                    const match = cat.articleList.find((a) => a.slug === slug && a.article && a.article.trim());
                    if (match) {
                        return {
                            article: match,
                            categoryName: cat.name || '',
                            categoryImage: cat.image || null,
                        };
                    }
                }
            }
        }
    } catch {
        // Fall back below if needed
    }

    if (locale !== 'en') {
        try {
            const fallbackResponse = await fetch(
                `https://api.askharekrishna.com/api/v1/debate/articles/?language=en&slug=${encodeURIComponent(slug)}`,
                { next: { revalidate: 60 } }
            );
            if (fallbackResponse.ok) {
                const data = await fallbackResponse.json();
                const categories: DebateCategoryApiItem[] = Array.isArray(data) ? data : (data.results || []);
                for (const cat of categories) {
                    if (cat.articleList && Array.isArray(cat.articleList)) {
                        const match = cat.articleList.find((a) => a.slug === slug);
                        if (match) {
                            return {
                                article: match,
                                categoryName: cat.name || '',
                                categoryImage: cat.image || null,
                            };
                        }
                    }
                }
            }
        } catch {
            // Ignore
        }
    }

    return null;
}

export async function generateMetadata({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>;
    searchParams?: Promise<{ lang?: string; language?: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const search = searchParams ? await searchParams : undefined;
    const queryLang = (search?.lang || search?.language || '').toLowerCase();

    const headersList = await headers();
    const hostHeader = headersList.get('host') || headersList.get('x-forwarded-host') || '';
    const lowerHost = hostHeader.toLowerCase();
    let derivedLocale = 'en';
    if (lowerHost.startsWith('tamil.') || lowerHost.startsWith('ta.')) {
        derivedLocale = 'ta';
    } else if (lowerHost.startsWith('hindi.') || lowerHost.startsWith('hi.')) {
        derivedLocale = 'hi';
    } else if (lowerHost.startsWith('kannada.') || lowerHost.startsWith('kn.')) {
        derivedLocale = 'kn';
    } else if (lowerHost.startsWith('telugu.') || lowerHost.startsWith('te.')) {
        derivedLocale = 'te';
    } else if (lowerHost.startsWith('malayalam.') || lowerHost.startsWith('ml.')) {
        derivedLocale = 'ml';
    } else if (lowerHost.startsWith('bengali.') || lowerHost.startsWith('bn.')) {
        derivedLocale = 'bn';
    }
    const headerLocale = headersList.get('x-locale');
    const locale = queryLang && VALID_LOCALES.includes(queryLang)
        ? queryLang
        : (headerLocale && VALID_LOCALES.includes(headerLocale) ? headerLocale : derivedLocale);

    const host = headersList.get('host') || headersList.get('x-forwarded-host') || 'askharekrishna.com';

    const result = await fetchDebateArticleBySlug(slug, locale);
    if (!result) {
        return {
            title: 'Debate Article | Ask Hare Krishna',
            description: 'Philosophical debate and deep dives into Vedic logic.',
        };
    }

    const { article, categoryImage } = result;
    const description = toPlainExcerpt(article.article || article.subTopic);
    const image = toAbsoluteMediaUrl(article.articleImage || categoryImage);
    const path = search?.lang ? `/debate/${slug}?lang=${locale}` : `/debate/${slug}`;

    return buildArticleMetadata({
        host,
        path,
        title: `${article.subTopic} | Ask Hare Krishna`,
        description,
        imageUrl: image,
    });
}

const Layout = ({ children }: { children: React.ReactNode }) => (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-200">
        <Navbar />
        {children}
        <Footer />
    </div>
);

export default async function DebateArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    
    return (
        <Layout>
            <DebateArticleDetail slug={slug} />
        </Layout>
    );
}
