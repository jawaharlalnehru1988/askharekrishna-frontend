"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useLanguage } from '../providers/LanguageContext';

interface DebateArticle {
    id: number;
    debateCategoryName: string;
    debateCategoryDescription?: string;
    debateCategoryImage?: string;
    mainTopicName: string;
    mainTopicImage?: string;
    subTopic: string;
    slug: string;
}

interface Category {
    title: string;
    description: string;
    backgroundImage: string;
    icon: string;
    href: string;
}

interface DebateCarouselProps {
    h: any;
}

export const DebateCarousel: React.FC<DebateCarouselProps> = ({ h }) => {
    const { locale } = useLanguage();
    const [debateArticles, setDebateArticles] = useState<DebateArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDebate = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`https://api.askharekrishna.com/api/v1/debate/articles/?language=${locale === 'en' ? 'en' : 'ta'}&page_size=500`);
                const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
                setDebateArticles(data);
            } catch (err) {
                console.error('Debate fetch failed:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDebate();
    }, [locale]);

    const debateCategories: Category[] = useMemo(() => {
        const uniqueCategories = Array.from(new Set(debateArticles.map(a => a.debateCategoryName).filter(Boolean)));
        return uniqueCategories.map(cat => {
            const firstArticle = debateArticles.find(a => a.debateCategoryName === cat);
            return {
                title: cat,
                description: firstArticle?.debateCategoryDescription || h.debateDesc || "Deep dives into Vedic logic and philosophy",
                backgroundImage: firstArticle?.debateCategoryImage || firstArticle?.mainTopicImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuDT45XlV17fLImZ5J2UfLxvD9yWclvE9Z_j_S2pG4r0TNR_B5h8_VpW9Gz6Xg7mR4J3p_S8V0U2T1-L6J7uV2pG4r0TNR_B5h8_VpW9Gz6Xg7mR4J3p_S8V0U2",
                icon: "gavel",
                href: `/faqs?category=${encodeURIComponent(cat)}`
            };
        });
    }, [debateArticles, h.debateDesc]);

    if (!loading && debateArticles.length === 0) return null;

    return (
        <>
            <div className="w-full bg-background-light dark:bg-background-dark pt-8 pb-4">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8 flex justify-between items-end">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-text-main dark:text-white md:text-3xl leading-tight">{h.debateTopics}</h2>
                        <p className="mt-2 text-text-muted dark:text-gray-400 font-medium">{h.debateDesc}</p>
                    </div>
                    <Link href="/faqs" className="hidden font-bold transition-colors sm:flex text-primary hover:text-yellow-600 text-sm items-center gap-1">
                        {h.viewAll} <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </Link>
                </div>
            </div>

            <div className="w-full bg-background-light dark:bg-background-dark pb-20 overflow-hidden">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-hide sm:overflow-x-auto sm:pb-6">
                        {loading ? (
                             Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-40 w-[260px] md:w-[280px] bg-white dark:bg-[#2a2418] rounded-2xl border border-gray-100 dark:border-neutral-800 animate-pulse flex-shrink-0"></div>
                            ))
                        ) : (
                            debateCategories.map((category) => (
                                <Link
                                    key={category.title}
                                    href={category.href}
                                    className="group flex flex-col gap-4 p-4 rounded-2xl bg-white dark:bg-[#2a2418] border border-[#e7dfcf] dark:border-neutral-800 hover:border-primary transition-all duration-300 flex-shrink-0 w-[260px] md:w-[280px] snap-center"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                            <span className="material-symbols-outlined text-2xl">{category.icon}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-text-main dark:text-white group-hover:text-primary transition-colors">
                                                {category.title}
                                            </h3>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-sm text-text-muted dark:text-gray-400 line-clamp-2">
                                        {category.description}
                                    </p>
                                    <div className="mt-4 flex items-center text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span>Read Articles</span>
                                        <span className="material-symbols-outlined text-base ml-1">arrow_forward</span>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
