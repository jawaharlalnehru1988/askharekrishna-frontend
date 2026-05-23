import React from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollText, ArrowLeft, Link2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { headers } from 'next/headers';
import { Locale } from '@/lib/dictionaries';
import { ShareButtons } from '@/components/categories/ShareButtons';
import { PoojaVidhiQuiz } from '@/components/pooja-vidhis/PoojaVidhiQuiz';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.askharekrishna.com/api';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PoojaVidhiQuestionOption {
    id: number;
    order: number;
    option_text: string;
    is_correct: boolean;
}

interface PoojaVidhiQuestion {
    id: number;
    order: number;
    question_text: string;
    is_active: boolean;
    options: PoojaVidhiQuestionOption[];
}

interface PoojaVidhiArticle {
    id: number;
    mainTopic: string;
    subTopic: string;
    article: string;
    slug: string;
    order: number;
    language: string;
    audioPath: string | null;
    articleImage: string | null;
    created_at: string;
    updated_at: string;
    questions?: PoojaVidhiQuestion[];
}

export default async function PoojaVidhiArticlePage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const headersList = await headers();
    const hostHeader = headersList.get('host') || headersList.get('x-forwarded-host') || '';
    const derivedLocale = hostHeader.startsWith('tamil.') || hostHeader.startsWith('ta.') ? 'ta' : 'en';
    const locale = (headersList.get('x-locale') as Locale) || derivedLocale;
    let matchedArticle: PoojaVidhiArticle | null = null;
    try {
        const res = await fetch(`${API_BASE_URL}/v1/pooja_vidhis/articles/${id}/`, { cache: 'no-store' });
        if (res.ok) {
            matchedArticle = await res.json();
        }
    } catch (e) {
        console.error("Error fetching article", e);
    }

    if (!matchedArticle) {
        return notFound();
    }

    const host = headersList.get('host') || 'askharekrishna.com';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const articleUrl = `${protocol}://${host}/pooja-vidhis/${id}`;
    const quizUrl = `${protocol}://${host}/pooja-vidhis/${id}/quiz`;

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-200">
            <Navbar />
            <main className="flex-grow py-20 px-4 md:px-8 max-w-[1000px] mx-auto w-full">
                <Link
                    href="/pooja-vidhis"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-bold mb-8 transition-colors"
                >
                    <ArrowLeft size={20} />
                    {locale === 'ta' ? 'பூஜை முறைகளுக்குத் திரும்பு' : 'Back to Pooja Vidhis'}
                </Link>

                <div className="bg-white dark:bg-[#1a160f] rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-neutral-800">
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 border-b border-gray-100 dark:border-neutral-800 gap-4">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <ScrollText size={28} />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-black text-text-main dark:text-white line-clamp-2">{matchedArticle.subTopic}</h1>
                                <p className="text-xs md:text-sm font-bold text-primary uppercase tracking-widest mt-1">{matchedArticle.mainTopic}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-10">
                        {matchedArticle.articleImage && (
                            <div className="relative h-[300px] md:h-[500px] w-full rounded-2xl overflow-hidden mb-10 shadow-lg">
                                <img
                                    src={matchedArticle.articleImage}
                                    alt={matchedArticle.subTopic}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            </div>
                        )}

                        <div className="prose prose-stone dark:prose-invert max-w-none 
                            prose-headings:font-black prose-headings:tracking-tight
                            prose-h1:text-4xl prose-h1:mb-8
                            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                            prose-p:text-lg prose-p:leading-relaxed prose-p:text-text-main dark:prose-p:text-gray-300
                            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic
                            prose-strong:text-primary prose-strong:font-bold">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {matchedArticle.article}
                            </ReactMarkdown>
                        </div>

                        <div className="mt-16 pt-10 border-t border-gray-100 dark:border-neutral-800">
                            <PoojaVidhiQuiz
                                articleId={matchedArticle.id}
                                articleTitle={matchedArticle.subTopic}
                                locale={locale}
                                questions={matchedArticle.questions ?? []}
                                quizType="pooja_vidhi"
                            />

                            <div className="mb-8 rounded-2xl border border-gray-100 dark:border-neutral-800 bg-gradient-to-r from-primary/10 to-primary/5 p-5 md:p-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-2">
                                            {locale === 'ta' ? 'வினாடி வினாவை மட்டும் பகிரவும்' : 'Share Quiz Only'}
                                        </p>
                                        <p className="text-sm text-text-muted dark:text-gray-300">
                                            {locale === 'ta'
                                                ? 'இந்த கட்டுரையின் வினாடி வினா பக்கத்தை மட்டும் தனியாக பகிரலாம்.'
                                                : 'Share only the quiz page for this article without the full reading content.'}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/pooja-vidhis/${id}/quiz`}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 font-black text-black transition-all hover:brightness-95"
                                    >
                                        <Link2 size={16} />
                                        {locale === 'ta' ? 'Quiz Page திற' : 'Open Quiz Page'}
                                    </Link>
                                </div>
                                <div className="mt-5">
                                    <ShareButtons
                                        articleUrl={quizUrl}
                                        subTopic={matchedArticle.subTopic}
                                        messagePrefix={locale === 'ta' ? 'இந்த வினாடி வினாவை முயற்சி செய்யுங்கள்:' : 'Try this devotional quiz:'}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 pt-10 border-t border-gray-100 dark:border-neutral-800 text-center">
                            <p className="text-sm font-bold text-text-muted mb-6 uppercase tracking-[0.3em]">
                                {locale === 'ta' ? 'இந்த விதிமுறையைப் பகிரவும்' : 'Share this Procedure'}
                            </p>
                            <ShareButtons 
                                articleUrl={articleUrl} 
                                subTopic={matchedArticle.subTopic} 
                                messagePrefix="Check out this Pooja Vidhi article:"
                            />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
