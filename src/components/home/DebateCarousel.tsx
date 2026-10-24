"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useLanguage } from '../providers/LanguageContext';
import { Gavel, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

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

const ensureAbsoluteUrl = (path: string | null | undefined): string => {
    if (!path) return '';
    if (path.includes('127.0.0.1') || path.includes('localhost')) {
        return path.replace(/^https?:\/\/[^/]+/, 'https://api.askharekrishna.com');
    }
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const clean = path.startsWith('/') ? path : `/${path}`;
    if (!clean.startsWith('/media/')) {
        return `https://api.askharekrishna.com/media${clean}`;
    }
    return `https://api.askharekrishna.com${clean}`;
};

// Module-level in-memory cache
const carouselDebateCache: Record<string, DebateCategory[]> = {};

export const DebateCarousel: React.FC<DebateCarouselProps> = ({ h }) => {
    const { locale } = useLanguage();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [categories, setCategories] = useState<DebateCategory[]>(() => {
        return carouselDebateCache[locale] || [];
    });
    const [loading, setLoading] = useState(() => {
        return !carouselDebateCache[locale] || carouselDebateCache[locale].length === 0;
    });

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

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
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                        <div className="flex-1 pr-2">
                            <span className="inline-block mb-1.5 text-primary font-bold uppercase tracking-[0.2em] text-xs">
                                 {locale === 'ta' ? 'தர்க்கம் மற்றும் தத்துவம்' : 'Logic & Philosophy'}
                            </span>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-text-main dark:text-white leading-tight">
                                {h?.debateTopics || (locale === 'ta' ? 'விவாதங்கள்' : 'Debates')}
                            </h2>
                            <p className="mt-2 text-sm sm:text-base text-text-muted dark:text-gray-400 font-medium max-w-2xl">
                                {h?.debateDesc || (locale === 'ta' ? 'வேத தர்க்கம் மற்றும் தத்துவத்தின் ஆழமான ஆய்வுகள்.' : 'Explore the systematic ways to answer challenging questions.')}
                            </p>
                        </div>

                        {/* Top-Right Controls */}
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0 pt-1">
                            {/* Navigation Arrows for desktop/tablet */}
                            <div className="hidden sm:flex items-center gap-1.5">
                                <button
                                    onClick={() => scroll('left')}
                                    aria-label="Previous topics"
                                    className="size-9 rounded-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#2a2418] flex items-center justify-center text-text-main dark:text-white hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all shadow-xs cursor-pointer active:scale-95"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button
                                    onClick={() => scroll('right')}
                                    aria-label="Next topics"
                                    className="size-9 rounded-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#2a2418] flex items-center justify-center text-text-main dark:text-white hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all shadow-xs cursor-pointer active:scale-95"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>

                            <Link
                                href="/debate"
                                className="inline-flex items-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-primary text-white hover:bg-primary-dark font-bold text-xs sm:text-sm md:text-base shadow-sm hover:shadow transition-all duration-200 active:scale-95 shrink-0"
                            >
                                <span>{h?.viewAll || (locale === 'ta' ? 'அனைத்தையும் காண்க' : 'View All')}</span>
                                <ArrowRight size={16} className="sm:size-[18px] transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full bg-background-light dark:bg-background-dark pb-20 overflow-hidden">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth"
                    >
                        {loading ? (
                             Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="h-64 bg-white dark:bg-[#2a2418] rounded-2xl border border-gray-100 dark:border-neutral-800 animate-pulse shrink-0 w-[85vw] sm:w-[340px] lg:w-[370px]"></div>
                            ))
                        ) : categories.length === 0 ? (
                            <div className="w-full md:col-span-full rounded-2xl border border-dashed border-[#e7dfcf] dark:border-neutral-800 bg-white dark:bg-[#2a2418] p-10 text-center shrink-0">
                                <h3 className="text-xl font-bold text-text-main dark:text-white">
                                    {locale === 'ta' ? 'விவாதங்கள் விரைவில்' : 'Debates Coming Soon'}
                                </h3>
                                <p className="mt-2 text-text-muted dark:text-gray-400">
                                    {locale === 'ta' ? 'விவாத பட்டியல் விரைவில் இங்கே தெரியும்.' : 'Debate topics will appear here shortly.'}
                                </p>
                            </div>
                        ) : (
                            categories.map((category, index) => {
                                const imageUrl = ensureAbsoluteUrl(category?.image);
                                return (
                                    <div
                                        key={category?.name || `category-${index}`}
                                        className="group rounded-2xl bg-white dark:bg-[#2a2418] border border-[#e7dfcf] dark:border-neutral-800 hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col shrink-0 w-[85vw] sm:w-[340px] lg:w-[370px] snap-center sm:snap-start"
                                    >
                                        <Link
                                            href={`/debate?category=${encodeURIComponent(category?.name || '')}&lang=${locale}`}
                                            className="relative h-48 w-full overflow-hidden bg-neutral-900 block group/img cursor-pointer"
                                        >
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={category?.name || 'Debate Topic'}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                                                    <Gavel size={40} />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                                            <div className="absolute bottom-3 left-4 flex items-center gap-2">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-amber-300 text-xs font-semibold border border-white/10 shadow-sm">
                                                    <Gavel size={13} />
                                                    <span>{(category.articleList || []).length} {locale === 'ta' ? 'கட்டுரைகள்' : 'Articles'}</span>
                                                </span>
                                            </div>
                                        </Link>

                                        <div className="p-6 flex flex-col flex-grow">
                                            <Link href={`/debate?category=${encodeURIComponent(category?.name || '')}&lang=${locale}`}>
                                                <h3 className="text-lg font-bold text-text-main dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                                                    {category?.name || 'Debate Topic'}
                                                </h3>
                                            </Link>
                                            <p className="mt-2 text-sm text-text-muted dark:text-gray-400 line-clamp-2 leading-relaxed">
                                                {category?.description || (locale === 'ta' ? 'விவாதங்கள் மற்றும் தத்துவங்கள்' : 'Explore debates and logic principles.')}
                                            </p>
                                            <div className="mt-5 pt-4 border-t border-[#f3efe7] dark:border-neutral-800/80 flex items-center justify-between mt-auto">
                                                <Link
                                                    href={`/debate?category=${encodeURIComponent(category?.name || '')}&lang=${locale}`}
                                                    className="inline-flex items-center text-sm font-bold text-primary hover:text-primary-dark transition-colors group/link"
                                                >
                                                    <span>{locale === 'ta' ? 'அனைத்து கட்டுரைகளையும் காண்க' : 'View All in Topic'}</span>
                                                    <ArrowRight size={14} className="ml-1.5 group-hover/link:translate-x-1 transition-transform" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
