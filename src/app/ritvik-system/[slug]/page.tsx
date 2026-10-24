import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import RitvikDetail from '@/components/categories/RitvikDetail';
import { buildArticleMetadata, toAbsoluteMediaUrl, toPlainExcerpt } from '@/lib/metadata';

interface RitvikQuestionApiItem {
    id: number;
    question_code: string;
    question: string;
    answer: string;
    slug: string;
    image?: string | null;
}

async function fetchRitvikQuestion(slug: string, locale: string) {
    try {
        const res = await fetch(
            `https://api.askharekrishna.com/api/v1/ritvik/questions/${encodeURIComponent(slug)}/?language=${encodeURIComponent(locale)}`,
            { next: { revalidate: 60 } }
        );
        if (res.ok) {
            return await res.json();
        }
    } catch {
        // Fall back below
    }

    if (locale !== 'en') {
        try {
            const fallbackRes = await fetch(
                `https://api.askharekrishna.com/api/v1/ritvik/questions/${encodeURIComponent(slug)}/?language=en`,
                { next: { revalidate: 60 } }
            );
            if (fallbackRes.ok) {
                return await fallbackRes.json();
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
    const locale = (search?.lang || search?.language || 'en').toLowerCase();

    const data = await fetchRitvikQuestion(slug, locale);
    if (!data) {
        return {
            title: 'The Process of Diksha in ISKCON | Ask Hare Krishna',
            description: 'Initiation system in ISKCON according to Srila Prabhupada.',
        };
    }

    const image = data.image ? toAbsoluteMediaUrl(data.image) : null;

    return buildArticleMetadata({
        host: 'askharekrishna.com',
        path: `/ritvik-system/${slug}?lang=${locale}`,
        title: `${data.question_code}: ${data.question} | Ask Hare Krishna`,
        description: toPlainExcerpt(data.summary || data.answer || data.question),
        imageUrl: image,
    });
}

export default async function RitvikDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-200">
            <Navbar />
            <main className="flex-1">
                <RitvikDetail slug={slug} />
            </main>
            <Footer />
        </div>
    );
}
