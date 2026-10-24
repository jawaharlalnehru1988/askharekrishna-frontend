"use client";

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
    Loader2, 
    ArrowLeft, 
    Share2, 
    ChevronLeft, 
    ChevronRight, 
    Copy, 
    Check, 
    BookOpen,
    ArrowUp,
    Volume2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLanguage } from '../providers/LanguageContext';
import Link from 'next/link';
import { AudioPlayer } from '@/components/audio/AudioPlayer';

interface QuestionNav {
    slug: string;
    question_code: string;
    question: string;
}

interface QuestionDetail {
    id: number;
    question_code: string;
    slug: string;
    order: number;
    image: string | null;
    is_published: boolean;
    question: string;
    answer: string;
    summary: string;
    audioPath?: string | null;
    section: {
        id: number;
        section_number: number;
        slug: string;
        title: string;
    };
}

interface RitvikDetailProps {
    slug: string;
}

const navLabels: Record<string, { prev: string; next: string; backToIndex: string }> = {
    en: { prev: 'Previous Question', next: 'Next Question', backToIndex: 'All Questions & Overview' },
    ta: { prev: 'முந்தைய கேள்வி', next: 'அடுத்த கேள்வி', backToIndex: 'அனைத்து வினாக்களும் முன்னுரையும்' },
};

export default function RitvikDetail({ slug }: RitvikDetailProps) {
    const { locale } = useLanguage();
    const currentLang = locale === 'ta' ? 'ta' : 'en';

    const [question, setQuestion] = useState<QuestionDetail | null>(null);
    const [allQuestions, setAllQuestions] = useState<QuestionNav[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);

        const fetchData = async () => {
            try {
                // Fetch current question
                const res = await axios.get(
                    `https://api.askharekrishna.com/api/v1/ritvik/questions/${slug}/?language=${currentLang}`
                );
                if (isMounted) {
                    setQuestion(res.data);
                }

                // Fetch all questions for prev/next navigation
                const allRes = await axios.get(
                    `https://api.askharekrishna.com/api/v1/ritvik/questions/?language=${currentLang}`
                );
                if (isMounted) {
                    const list = Array.isArray(allRes.data) ? allRes.data : (allRes.data.results || []);
                    setAllQuestions(list);
                }
            } catch (err: any) {
                if (isMounted) {
                    setError('Unable to load question details.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();
        return () => { isMounted = false; };
    }, [slug, currentLang]);

    const currentIndex = useMemo(() => {
        return allQuestions.findIndex(q => q.slug === slug);
    }, [allQuestions, slug]);

    const prevQuestion = currentIndex > 0 ? allQuestions[currentIndex - 1] : null;
    const nextQuestion = currentIndex !== -1 && currentIndex < allQuestions.length - 1 ? allQuestions[currentIndex + 1] : null;

    const handleCopy = () => {
        if (!question) return;
        const text = `${question.question_code}: ${question.question}\n\n${question.answer}\n\nRead more at: ${window.location.href}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        if (navigator.share && question) {
            try {
                await navigator.share({
                    title: `${question.question_code}: ${question.question}`,
                    text: question.question,
                    url: window.location.href,
                });
            } catch {
                handleCopy();
            }
        } else {
            handleCopy();
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-sm font-semibold text-text-muted">Loading...</p>
            </div>
        );
    }

    if (error || !question) {
        return (
            <div className="max-w-3xl mx-auto py-16 px-4 text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Question Not Found</h2>
                <p className="text-text-muted mb-8">{error || 'The requested question could not be found.'}</p>
                <Link
                    href="/ritvik-system"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Questions Index
                </Link>
            </div>
        );
    }

    const labels = navLabels[currentLang] || navLabels.en;

    return (
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            {/* Top Navigation & Breadcrumbs */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200 dark:border-neutral-800">
                <Link
                    href="/ritvik-system"
                    className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{labels.backToIndex}</span>
                </Link>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCopy}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
                        title="Copy text"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                    <button
                        onClick={handleShare}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                        title="Share"
                    >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share</span>
                    </button>
                </div>
            </div>

            {/* Section Tag & Question Title */}
            <div className="mb-6">
                <span className="inline-block px-3 py-1 text-xs font-black tracking-wider uppercase bg-primary/10 text-primary rounded-full mb-3">
                    {question.section?.title || (question.section?.section_number === 0 ? (currentLang === 'ta' ? 'முன்னுரை' : 'Introduction') : `Section ${question.section?.section_number}`)}
                </span>
                <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-primary font-mono shrink-0">
                        {question.question_code}
                    </span>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-text-main dark:text-white leading-tight">
                        {question.question}
                    </h1>
                </div>
            </div>

            {/* Audio Player if Available */}
            {question.audioPath && (
                <div className="my-6 p-4 rounded-2xl bg-primary/5 border border-primary/15 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-primary uppercase tracking-wider">
                        <Volume2 className="w-4 h-4" />
                        <span>Audio Discourse</span>
                    </div>
                    <AudioPlayer 
                        url={question.audioPath.startsWith('http') ? question.audioPath : `https://api.askharekrishna.com${question.audioPath.startsWith('/') ? '' : '/'}${question.audioPath}`}
                        title={question.question}
                    />
                </div>
            )}

            {/* Full Rich Markdown Answer */}
            <div className="prose prose-lg dark:prose-invert max-w-none text-text-main dark:text-gray-200 leading-relaxed space-y-4 my-8 font-sans">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h1: ({ node, ...props }) => <h2 className="text-2xl font-bold text-primary mt-8 mb-4 border-b border-primary/20 pb-2" {...props} />,
                        h2: ({ node, ...props }) => <h3 className="text-xl font-bold text-text-main dark:text-white mt-6 mb-3" {...props} />,
                        h3: ({ node, ...props }) => <h4 className="text-lg font-bold text-primary mt-4 mb-2" {...props} />,
                        h4: ({ node, ...props }) => <h5 className="text-base font-semibold text-text-muted mt-3 mb-1" {...props} />,
                        blockquote: ({ node, ...props }) => (
                            <blockquote className="border-l-4 border-primary bg-primary/5 dark:bg-primary/10 p-4 rounded-r-xl italic my-4 text-text-main dark:text-gray-100 shadow-sm" {...props} />
                        ),
                        code: ({ node, className, children, ...props }) => (
                            <code className="bg-amber-50 dark:bg-neutral-800 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded font-mono text-sm border border-amber-200/50 dark:border-neutral-700" {...props}>
                                {children}
                            </code>
                        ),
                        pre: ({ node, ...props }) => (
                            <pre className="bg-gray-900 text-amber-300 p-4 rounded-xl overflow-x-auto text-sm font-mono border border-neutral-800 my-4" {...props} />
                        ),
                        ul: ({ node, ...props }) => <ul className="list-disc pl-6 space-y-2 my-3" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal pl-6 space-y-2 my-3" {...props} />,
                        li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                        p: ({ node, ...props }) => <p className="my-3 leading-relaxed" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-bold text-text-main dark:text-white" {...props} />,
                    }}
                >
                    {question.answer}
                </ReactMarkdown>
            </div>

            {/* Bottom Prev / Next Navigation Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 pt-8 border-t border-gray-200 dark:border-neutral-800">
                {prevQuestion ? (
                    <Link
                        href={`/ritvik-system/${prevQuestion.slug}`}
                        className="group flex flex-col p-4 rounded-xl border border-gray-200 dark:border-neutral-800 hover:border-primary bg-white dark:bg-[#1a150c] shadow-sm hover:shadow transition-all"
                    >
                        <span className="flex items-center gap-1 text-xs font-bold text-primary mb-1">
                            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                            {labels.prev}
                        </span>
                        <span className="text-sm font-semibold text-text-main dark:text-gray-200 line-clamp-2">
                            {prevQuestion.question_code}: {prevQuestion.question}
                        </span>
                    </Link>
                ) : <div />}

                {nextQuestion && (
                    <Link
                        href={`/ritvik-system/${nextQuestion.slug}`}
                        className="group flex flex-col p-4 rounded-xl border border-gray-200 dark:border-neutral-800 hover:border-primary bg-white dark:bg-[#1a150c] shadow-sm hover:shadow transition-all sm:text-right"
                    >
                        <span className="flex items-center gap-1 text-xs font-bold text-primary mb-1 sm:justify-end">
                            {labels.next}
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <span className="text-sm font-semibold text-text-main dark:text-gray-200 line-clamp-2">
                            {nextQuestion.question_code}: {nextQuestion.question}
                        </span>
                    </Link>
                )}
            </div>

            {/* Back to top button */}
            <div className="flex justify-center mt-10">
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-text-muted hover:text-primary transition-colors cursor-pointer"
                >
                    <ArrowUp className="w-3.5 h-3.5" />
                    Back to Top
                </button>
            </div>
        </article>
    );
}
