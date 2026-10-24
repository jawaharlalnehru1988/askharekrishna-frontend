"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useLanguage } from '../providers/LanguageContext';
import { BookOpen, ArrowRight, Sparkles, Layers } from 'lucide-react';

interface RitvikQuestionSnippet {
    id: number;
    question_code: string;
    slug: string;
    section_number: number;
    question: string;
    summary: string;
}

export function RitvikCarousel() {
    const { locale } = useLanguage();
    const currentLang = locale === 'ta' ? 'ta' : 'en';

    const [allQuestions, setAllQuestions] = useState<RitvikQuestionSnippet[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'intro' | 'featured'>('intro');

    useEffect(() => {
        let isMounted = true;
        const fetchQuestions = async () => {
            try {
                const res = await axios.get(
                    `https://api.askharekrishna.com/api/v1/ritvik/questions/?language=${currentLang}`
                );
                if (isMounted) {
                    const list: RitvikQuestionSnippet[] = Array.isArray(res.data) ? res.data : (res.data.results || []);
                    setAllQuestions(list);
                }
            } catch {
                // Ignore
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchQuestions();
        return () => { isMounted = false; };
    }, [currentLang]);

    if (loading || allQuestions.length === 0) return null;

    // Introduction questions (Section 0)
    const introQuestions = allQuestions.filter(q => q.section_number === 0);

    // Featured questions across sections
    const featuredQuestions = [
        allQuestions.find(q => q.slug === 'q1-1'),
        allQuestions.find(q => q.slug === 'q1-3'),
        allQuestions.find(q => q.slug === 'q2-1'),
        allQuestions.find(q => q.slug === 'q3-2'),
        allQuestions.find(q => q.slug === 'q4-1'),
        allQuestions.find(q => q.slug === 'q8-1'),
    ].filter(Boolean) as RitvikQuestionSnippet[];

    const activeList = activeTab === 'intro' ? introQuestions : featuredQuestions;
    const totalCount = allQuestions.length;

    return (
        <section className="py-12 md:py-16 bg-[#faf8f4] dark:bg-[#120e08] border-y border-[#f3efe7] dark:border-neutral-800 transition-colors">
            <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-2">
                            <BookOpen className="w-4 h-4" />
                            <span>{currentLang === 'ta' ? 'அங்கீகரிக்கப்பட்ட சித்தாந்தம்' : 'Authorized Siddhanta'}</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-text-main dark:text-white tracking-tight">
                            {currentLang === 'ta' 
                                ? `இஸ்கானில் தீட்சை முறை (${totalCount} வினாக்கள்)` 
                                : `The Process of Diksha in ISKCON (${totalCount} Q&As)`}
                        </h2>
                        <p className="text-sm text-text-muted dark:text-gray-400 mt-1 max-w-xl">
                            {currentLang === 'ta'
                                ? 'ஸ்ரீல பிரபுபாதரின் நேரடி வழிகாட்டல்கள், சாஸ்திர மேற்கோள்கள் மற்றும் நிறுவன ஆவணங்கள்.'
                                : 'Srila Prabhupada’s direct directives, shastric evidence, and institutional documents.'}
                        </p>
                    </div>

                    <Link
                        href="/ritvik-system"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow-sm hover:shadow shrink-0 self-start md:self-auto"
                    >
                        <span>
                            {currentLang === 'ta' ? `அனைத்து ${totalCount} வினாக்களையும் காண்க` : `Explore All ${totalCount} Q&As`}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {/* Tab Selector: Introduction Q&As vs Key Evidences */}
                <div className="flex items-center gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('intro')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                            activeTab === 'intro'
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-white dark:bg-[#1a150c] text-text-muted border border-gray-200 dark:border-neutral-800 hover:text-text-main'
                        }`}
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>
                            {currentLang === 'ta' ? 'முன்னுரை வினாக்கள் (பிரிவு 0)' : 'Introduction Q&As (Section 0)'}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                            activeTab === 'intro' ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-neutral-800 text-text-muted'
                        }`}>
                            {introQuestions.length}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('featured')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                            activeTab === 'featured'
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-white dark:bg-[#1a150c] text-text-muted border border-gray-200 dark:border-neutral-800 hover:text-text-main'
                        }`}
                    >
                        <Layers className="w-3.5 h-3.5" />
                        <span>
                            {currentLang === 'ta' ? 'முக்கிய ஆதாரங்கள்' : 'Key Inquiries & Evidence'}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                            activeTab === 'featured' ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-neutral-800 text-text-muted'
                        }`}>
                            {featuredQuestions.length}
                        </span>
                    </button>
                </div>

                {/* Grid of Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeList.map(item => (
                        <Link
                            key={item.slug}
                            href={`/ritvik-system/${item.slug}`}
                            className="group flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-[#1a150c] border border-gray-200/80 dark:border-neutral-800 hover:border-primary shadow-sm hover:shadow-md transition-all"
                        >
                            <div>
                                <div className="flex items-center justify-between gap-2 mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono font-black text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                                            {item.question_code}
                                        </span>
                                        {item.section_number === 0 && (
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-100/60 dark:bg-amber-900/30 px-2 py-0.5 rounded">
                                                {currentLang === 'ta' ? 'முன்னுரை' : 'Introduction'}
                                            </span>
                                        )}
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                </div>
                                <h3 className="text-sm sm:text-base font-bold text-text-main dark:text-white group-hover:text-primary transition-colors line-clamp-2 mb-2">
                                    {item.question}
                                </h3>
                                {item.summary && (
                                    <p className="text-xs text-text-muted dark:text-gray-400 line-clamp-2 leading-relaxed">
                                        {item.summary}
                                    </p>
                                )}
                            </div>
                        </Link>
                    ))}

                    {/* 6th Slot on Intro Tab: CTA Card to Full Catalog */}
                    {activeTab === 'intro' && (
                        <Link
                            href="/ritvik-system"
                            className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-2 border-dashed border-primary/30 hover:border-primary shadow-sm hover:shadow-md transition-all text-center min-h-[160px]"
                        >
                            <div className="size-11 rounded-full bg-primary text-white flex items-center justify-center group-hover:scale-110 transition-transform mb-2.5 shadow-sm">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                            <h4 className="text-sm font-bold text-text-main dark:text-white group-hover:text-primary transition-colors">
                                {currentLang === 'ta' ? 'அனைத்து பிரிவுகளையும் காண்க' : 'Explore All 9 Sections'}
                            </h4>
                            <p className="text-xs text-text-muted dark:text-gray-400 mt-1">
                                {currentLang === 'ta'
                                    ? `அனைத்து ${totalCount} வினாக்களுக்கான சாஸ்திர ஆதாரங்கள்`
                                    : `Complete Shastric Evidence (${totalCount} Q&As)`}
                            </p>
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}
