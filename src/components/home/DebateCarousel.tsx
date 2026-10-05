"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useLanguage } from '../providers/LanguageContext';
import { Gavel, ArrowRight, ChevronDown } from 'lucide-react';

interface DebateArticle {
    id: number;
    mainTopic?: string;
    topic?: string;
    subTopic: string;
    article: string;
    slug: string;
    order: number;
    language: string;
    audioPath: string | null;
    articleImage: string;
    created_at: string;
    updated_at: string;
}

interface DebateCategory {
    name: string;
    description: string;
    image: string | null;
    articleList: DebateArticle[];
}



interface DebateCarouselProps {
    h: any;
}

// Module-level in-memory cache
const carouselDebateCache: Record<string, DebateCategory[]> = {};

export const DebateCarousel: React.FC<DebateCarouselProps> = ({ h }) => {
    const { locale } = useLanguage();
    const [categories, setCategories] = useState<DebateCategory[]>(() => {
        return carouselDebateCache[locale] || [];
    });
    const [loading, setLoading] = useState(() => {
        return !carouselDebateCache[locale] || carouselDebateCache[locale].length === 0;
    });

    useEffect(() => {
        let isMounted = true;

        const fetchDebates = async () => {
            const normalizeResponse = (payload: any): DebateCategory[] => {
                if (Array.isArray(payload)) return payload;
                return payload?.results || [];
            };

            if (!carouselDebateCache[locale] || carouselDebateCache[locale].length === 0) {
                setLoading(true);
            }

            try {
                const response = await axios.get(`https://api.askharekrishna.com/api/v1/debate/articles/?language=${locale}`);
                let data = normalizeResponse(response.data);

                // Fallback to English if a locale has no debate content yet.
                const hasTopicData = data.some((cat) => (cat.articleList || []).length > 0);
                if (!hasTopicData && locale !== 'en') {
                    const fallbackResponse = await axios.get('https://api.askharekrishna.com/api/v1/debate/articles/?language=en');
                    data = normalizeResponse(fallbackResponse.data);
                }

                carouselDebateCache[locale] = data;
                if (isMounted) {
                    setCategories(data);
                }
            } catch (err) {
                console.error('Debate fetch failed:', err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        fetchDebates();

        return () => {
            isMounted = false;
        };
    }, [locale]);



    return (
        <>
            <div className="w-full bg-background-light dark:bg-background-dark pt-8 pb-4">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4">
                    <div>
                        <span className="inline-block mb-2 text-primary font-bold uppercase tracking-[0.2em] text-xs">
                             {locale === 'ta' ? 'தர்க்கம் மற்றும் தத்துவம்' : 'Logic & Philosophy'}
                        </span>
                        <h2 className="text-3xl font-bold tracking-tight text-text-main dark:text-white md:text-4xl leading-tight">
                            {h?.debateTopics || (locale === 'ta' ? 'விவாதங்கள்' : 'Debates')}
                        </h2>
                        <p className="mt-2 text-text-muted dark:text-gray-400 font-medium">
                            {h?.debateDesc || (locale === 'ta' ? 'வேத தர்க்கம் மற்றும் தத்துவத்தின் ஆழமான ஆய்வுகள்.' : 'Explore the systematic ways to answer challenging questions.')}
                        </p>
                    </div>
                    <Link href="/debate" className="font-bold transition-colors inline-flex text-primary hover:text-primary-dark text-sm sm:text-base items-center gap-1.5 group shrink-0">
                        <span>{h?.viewAll || (locale === 'ta' ? 'அனைத்தையும் காண்க' : 'View All')}</span> 
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            <div className="w-full bg-background-light dark:bg-background-dark pb-20 overflow-hidden">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                             Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="h-48 bg-white dark:bg-[#2a2418] rounded-2xl border border-gray-100 dark:border-neutral-800 animate-pulse"></div>
                            ))
                        ) : categories.length === 0 ? (
                            <div className="col-span-full rounded-2xl border border-dashed border-[#e7dfcf] dark:border-neutral-800 bg-white dark:bg-[#2a2418] p-10 text-center">
                                <h3 className="text-xl font-bold text-text-main dark:text-white">
                                    {locale === 'ta' ? 'விவாதங்கள் விரைவில்' : 'Debates Coming Soon'}
                                </h3>
                                <p className="mt-2 text-text-muted dark:text-gray-400">
                                    {locale === 'ta' ? 'விவாத பட்டியல் விரைவில் இங்கே தெரியும்.' : 'Debate topics will appear here shortly.'}
                                </p>
                            </div>
                        ) : (
                            categories.slice(0, 6).map((category, index) => (
                                <div
                                    key={category?.name || `category-${index}`}
                                    className="rounded-2xl bg-white dark:bg-[#2a2418] border border-[#e7dfcf] dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                                >
                                    <div className="w-full flex items-center gap-4 p-6 text-left">
                                        <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
                                            <Gavel size={28} />
                                        </div>
                                        <div>
                                        <h3 className="text-lg font-bold text-text-main dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                                                {category?.name || 'Debate Topic'}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="px-6 flex-grow">
                                        <p className="text-sm text-text-muted dark:text-gray-400 line-clamp-3">
                                            {category?.description || (locale === 'ta' ? 'விவாதங்கள் மற்றும் தத்துவங்கள்' : 'Explore debates and logic principles.')}
                                        </p>
                                    </div>
                                    <div className="px-6 py-5 mt-auto">
                                        <Link href={`/debate?category=${encodeURIComponent(category?.name || '')}`} className="inline-flex items-center text-sm font-bold text-primary hover:text-primary-dark transition-colors group/link">
                                            <span>{locale === 'ta' ? 'அனைத்து கட்டுரைகளைக் காண்க' : 'View All in Topic'}</span>
                                            <ArrowRight size={14} className="ml-2 group-hover/link:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Mobile View All Debates Button */}
                    <div className="mt-8 flex justify-center sm:hidden">
                        <Link
                            href="/debate"
                            className="w-full py-3.5 px-6 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary dark:text-primary-light font-bold text-sm flex items-center justify-center gap-2 border border-primary/25 transition-all active:scale-[0.98] shadow-xs"
                        >
                            <span>{h?.viewAll || (locale === 'ta' ? 'அனைத்து விவாதங்களையும் காண்க' : 'View All Debates')}</span>
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};
