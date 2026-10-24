import React from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import VaishnavaEtiquetteArticleDetail, { type EtiquetteArticle } from '@/components/categories/VaishnavaEtiquetteArticleDetail';
import { buildArticleMetadata, toPlainExcerpt } from '@/lib/metadata';

const VALID_LOCALES = ['ta', 'en', 'hi', 'kn', 'te', 'ml', 'bn'];

interface EtiquetteCategoryApiItem {
    id: number;
    name: string;
    image?: string | null;
    articleList?: EtiquetteArticle[];
}

async function fetchEtiquetteArticleBySlug(slug: string, locale: string) {
    try {
        const response = await fetch(
            `https://api.askharekrishna.com/api/v1/vaishnava_etiquettes/articles/?language=${encodeURIComponent(locale)}&slug=${encodeURIComponent(slug)}`,
            { next: { revalidate: 60 } }
        );
        if (response.ok) {
            const data = await response.json();
            const categories: EtiquetteCategoryApiItem[] = Array.isArray(data) ? data : (data.results || []);
            for (const cat of categories) {
                if (cat.articleList && Array.isArray(cat.articleList)) {
                    const match = cat.articleList.find((a) => (a.slug === slug || a.id?.toString() === slug) && a.article && a.article.trim());
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
                `https://api.askharekrishna.com/api/v1/vaishnava_etiquettes/articles/?language=en&slug=${encodeURIComponent(slug)}`,
                { next: { revalidate: 60 } }
            );
            if (fallbackResponse.ok) {
                const data = await fallbackResponse.json();
                const categories: EtiquetteCategoryApiItem[] = Array.isArray(data) ? data : (data.results || []);
                for (const cat of categories) {
                    if (cat.articleList && Array.isArray(cat.articleList)) {
                        const match = cat.articleList.find((a) => a.slug === slug || a.id?.toString() === slug);
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

    const result = await fetchEtiquetteArticleBySlug(slug, locale);
    if (!result) {
        return {
            title: 'Vaishnava Etiquettes & Sadācāra | AskHareKrishna',
            description: 'The sacred science of Vaishnava character and devotional conduct.',
        };
    }

    const { article } = result;
    const description = toPlainExcerpt(article.article || article.subTopic);
    const path = search?.lang ? `/vaishnava-etiquettes/${article.slug || slug}?lang=${locale}` : `/vaishnava-etiquettes/${article.slug || slug}`;

    return buildArticleMetadata({
        host,
        path,
        title: `${article.subTopic} | Vaishnava Etiquettes | AskHareKrishna`,
        description,
        imageUrl: 'https://api.askharekrishna.com/media/debate/article/harekrishnaPreaching.jpg',
    });
}

const Layout = ({ children }: { children: React.ReactNode }) => (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-200">
        <Navbar />
        {children}
        <Footer />
    </div>
);

export default async function VaishnavaEtiquetteDetailPage({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>;
    searchParams?: Promise<{ lang?: string; language?: string }>;
}) {
    const { slug } = await params;
    const search = searchParams ? await searchParams : undefined;
    const locale = (search?.lang || search?.language || 'en').toLowerCase();

    const result = await fetchEtiquetteArticleBySlug(slug, locale);

    const jsonLd = result ? {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Article",
                "headline": result.article.subTopic,
                "description": toPlainExcerpt(result.article.article || result.article.subTopic, 160),
                "image": "https://askharekrishna.com/askharekrishnalogo.jpg",
                "publisher": {
                    "@type": "Organization",
                    "name": "Ask Hare Krishna",
                    "url": "https://askharekrishna.com",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://askharekrishna.com/askharekrishnalogo.jpg"
                    }
                },
                "inLanguage": locale
            }
        ]
    } : null;

    return (
        <Layout>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <VaishnavaEtiquetteArticleDetail
                slug={slug}
                initialArticle={result?.article || null}
                initialCategoryName={result?.categoryName || ''}
            />
        </Layout>
    );
}
