import React from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollText, ArrowLeft, Home, ChevronLeft, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { headers } from 'next/headers';
import { Locale } from '@/lib/dictionaries';
import { ShareButtons } from '@/components/categories/ShareButtons';
import AudioPlayer from '@/components/audio/AudioPlayer';
import ClientAudioWrapper from '@/components/stories/ClientAudioWrapper'; // We'll create this to handle client-side audio state
import { PoojaVidhiQuiz } from '@/components/pooja-vidhis/PoojaVidhiQuiz';

interface StoryQuestionOption {
    id: number;
    order: number;
    option_text: string;
    is_correct: boolean;
}

interface StoryQuestion {
    id: number;
    order: number;
    question_text: string;
    is_active: boolean;
    options: StoryQuestionOption[];
}

interface StoryArticle {
    id: number;
    mainTopic: number | string;
    subTopic: string;
    article: string;
    slug: string;
    order: number;
    language: string;
    audioPath: string | null;
    imagePath: string | null;
    articleImage?: string | null;
    questions?: StoryQuestion[];
    topicName?: string;
}

export default async function StoryArticlePage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const headersList = await headers();
    const hostHeader = headersList.get('host') || headersList.get('x-forwarded-host') || '';
    const lowerHost = hostHeader.toLowerCase();
    let derivedLocale: Locale = 'en';
    if (lowerHost.startsWith('tamil.') || lowerHost.startsWith('ta.')) {
        derivedLocale = 'ta';
    } else if (lowerHost.startsWith('hindi.') || lowerHost.startsWith('hi.')) {
        derivedLocale = 'hi';
    }
    const locale = (headersList.get('x-locale') as Locale) || derivedLocale;
    let matchedStory: StoryArticle | null = null;
    const allStories: StoryArticle[] = [];
    let topicName = '';

    try {
        const res = await fetch(`https://api.askharekrishna.com/api/v1/stories/articles/?language=${locale}`, { next: { revalidate: 60 } });
        if (res.ok) {
            const data = await res.json();
            const categories = Array.isArray(data) ? data : (data.results || []);
            
            categories.forEach((cat: any) => {
                cat.articleList.forEach((story: StoryArticle) => {
                    allStories.push({ ...story, topicName: cat.name });
                });
            });
            
            matchedStory = allStories.find((s) => s.id === parseInt(id, 10)) || null;
            if (matchedStory) {
                topicName = matchedStory.topicName || '';
            }
        }
    } catch (e) {
        console.error("Error fetching story", e);
    }

    if (!matchedStory) {
        return notFound();
    }

    // Determine absolute URL for sharing.
    const host = headersList.get('host') || 'askharekrishna.com';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const articleUrl = `${protocol}://${host}/stories/${id}`;

    // Find next and prev stories for the Audio Player if needed, or just navigation
    const currentIndex = allStories.findIndex((s) => s.id === matchedStory.id);
    const nextStory = currentIndex !== -1 && currentIndex < allStories.length - 1 ? allStories[currentIndex + 1] : null;
    const prevStory = currentIndex > 0 ? allStories[currentIndex - 1] : null;

    const ensureAbsoluteUrl = (path: string | null | undefined) => {
        if (!path) return "";
        if (path.startsWith('http')) return path;
        const apiBase = "https://api.askharekrishna.com";
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${apiBase}${cleanPath}`;
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-200">
            <Navbar />
            <main className="flex-grow pt-12 pb-16 px-4 md:px-8 max-w-[1000px] mx-auto w-full">
                
                {/* Breadcrumbs */}
                <div className="flex flex-wrap items-center gap-4 mb-8">
                    <Link href="/" className="flex items-center text-sm font-bold text-text-muted hover:text-primary transition-colors">
                        <Home size={18} className="mr-1.5" /> Home
                    </Link>
                    <div className="size-1 rounded-full bg-border-light dark:bg-border-dark" />
                    <Link href="/stories" className="text-sm font-bold text-text-muted hover:text-primary transition-colors">
                        Stories
                    </Link>
                    <div className="size-1 rounded-full bg-border-light dark:bg-border-dark" />
                    <Link href={`/stories?topic=${encodeURIComponent(topicName)}`} className="text-sm font-bold text-text-muted hover:text-primary transition-colors">
                        {topicName}
                    </Link>
                </div>

                <div className="bg-white dark:bg-[#1a160f] rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-neutral-800">
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 border-b border-gray-100 dark:border-neutral-800 gap-4">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <ScrollText size={28} />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-black text-text-main dark:text-white line-clamp-2">{matchedStory.subTopic}</h1>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-10">
                        {(matchedStory.imagePath || matchedStory.articleImage) && (
                            <div className="relative h-[300px] md:h-[500px] w-full rounded-2xl overflow-hidden mb-10 shadow-lg border border-black/5 ring-1 ring-black/5">
                                <img
                                    src={ensureAbsoluteUrl(matchedStory.imagePath || matchedStory.articleImage)}
                                    alt={matchedStory.subTopic}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            </div>
                        )}

                        {matchedStory.audioPath && (
                            <div className="mb-12">
                                <ClientAudioWrapper 
                                    matchedStory={matchedStory}
                                    categoryName={topicName}
                                    nextStoryId={nextStory?.id}
                                    prevStoryId={prevStory?.id}
                                />
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
                                {matchedStory.article}
                            </ReactMarkdown>
                        </div>

                        <div className="mt-16 pt-10 border-t border-gray-100 dark:border-neutral-800">
                            <PoojaVidhiQuiz
                                articleId={matchedStory.id}
                                articleTitle={matchedStory.subTopic}
                                locale={locale}
                                questions={matchedStory.questions ?? []}
                                quizType="story"
                            />
                        </div>

                        <div className="mt-16 pt-10 border-t border-gray-100 dark:border-neutral-800 text-center">
                            <p className="text-sm font-bold text-text-muted mb-6 uppercase tracking-[0.3em]">
                                {locale === 'ta' ? 'இந்த கதையைப் பகிரவும்' : 'Share this Story'}
                            </p>
                            <ShareButtons 
                                articleUrl={articleUrl} 
                                subTopic={matchedStory.subTopic} 
                                messagePrefix="Check out this devotional story:"
                            />
                        </div>
                    </div>
                </div>

                {/* Navigation at bottom */}
                <div className="mt-12 flex flex-wrap justify-between gap-4">
                    {prevStory ? (
                        <Link
                            href={`/stories/${prevStory.id}`}
                            className="px-6 py-4 bg-background-light dark:bg-[#332d21] border border-border-light dark:border-neutral-800 rounded-2xl font-bold flex items-center gap-2 hover:bg-white dark:hover:bg-[#3e3729] transition-all shadow-sm"
                        >
                            <ChevronLeft size={20} />
                            Previous
                        </Link>
                    ) : <div />}
                    
                    {nextStory && (
                        <Link
                            href={`/stories/${nextStory.id}`}
                            className="px-6 py-4 bg-primary text-black rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-sm"
                        >
                            Next Story
                            <ChevronLeft size={20} className="rotate-180" />
                        </Link>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
