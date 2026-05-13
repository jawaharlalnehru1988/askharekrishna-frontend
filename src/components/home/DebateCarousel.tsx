"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useLanguage } from '../providers/LanguageContext';
import { Gavel, ArrowRight } from 'lucide-react';

interface DebateArticle {
    id: number;
    topic: string;
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

interface CategoryCard {
    title: string;
    description: string;
    backgroundImage: string | null;
    icon: string;
    href: string;
}

interface DebateCarouselProps {
    h: any;
}

export const DebateCarousel: React.FC<DebateCarouselProps> = ({ h }) => {
    const { locale } = useLanguage();
    const [categories, setCategories] = useState<DebateCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDebates = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`https://api.askharekrishna.com/api/v1/debate/articles/?language=${locale === 'en' ? 'en' : 'ta'}`);
                const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
                setCategories(data);
            } catch (err) {
                console.error('Debate fetch failed:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDebates();
    }, [locale]);

    const categoryCards: CategoryCard[] = useMemo(() => {
        return categories.map(cat => ({
            title: cat.name,
            description: cat.description || h.debateDesc || "Deep dives into Vedic logic and philosophy",
            backgroundImage: cat.image,
            icon: "gavel",
            href: `/debate?category=${encodeURIComponent(cat.name)}`
        }));
    }, [categories, h.debateDesc]);

    if (!loading && categories.length === 0) return null;

    return (
        <>
            <div className="w-full bg-background-light dark:bg-background-dark pt-8 pb-4">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8 flex justify-between items-end">
                    <div>
                        <span className="inline-block mb-2 text-primary font-bold uppercase tracking-[0.2em] text-xs">
                             {locale === 'ta' ? 'தர்க்கம் மற்றும் தத்துவம்' : 'Logic & Philosophy'}
                        </span>
                        <h2 className="text-3xl font-bold tracking-tight text-text-main dark:text-white md:text-4xl leading-tight">
                            {h.debateTopics || (locale === 'ta' ? 'விவாதங்கள்' : 'Debates')}
                        </h2>
                        <p className="mt-2 text-text-muted dark:text-gray-400 font-medium">
                            {h.debateDesc || (locale === 'ta' ? 'வேத தர்க்கம் மற்றும் தத்துவத்தின் ஆழமான ஆய்வுகள்.' : 'Explore the systematic ways to answer challenging questions.')}
                        </p>
                    </div>
                    <Link href="/debate" className="hidden font-bold transition-colors sm:flex text-primary hover:text-primary-dark text-sm items-center gap-2 group">
                        {h.viewAll || 'View All'} 
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            <div className="w-full bg-background-light dark:bg-background-dark pb-20 overflow-hidden">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-hide sm:overflow-x-auto sm:pb-6 no-scrollbar">
                        {loading ? (
                             Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-48 w-[280px] md:w-[320px] bg-white dark:bg-[#2a2418] rounded-2xl border border-gray-100 dark:border-neutral-800 animate-pulse flex-shrink-0"></div>
                            ))
                        ) : (
                            categoryCards.map((category) => (
                                <Link
                                    key={category.title}
                                    href={category.href}
                                    className="group flex flex-col gap-4 p-6 rounded-2xl bg-white dark:bg-[#2a2418] border border-[#e7dfcf] dark:border-neutral-800 hover:border-primary/50 shadow-sm hover:shadow-xl transition-all duration-300 flex-shrink-0 w-[280px] md:w-[320px] snap-center"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-inner">
                                            <Gavel size={28} />
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="text-lg font-bold text-text-main dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                                                {category.title}
                                            </h3>
                                        </div>
                                    </div>
                                    <p className="text-sm text-text-muted dark:text-gray-400 line-clamp-3 leading-relaxed">
                                        {category.description}
                                    </p>
                                    <div className="mt-auto pt-4 flex items-center text-sm font-bold text-primary group-hover:translate-x-1 transition-transform">
                                        <span>{locale === 'ta' ? 'கட்டுரைகளைக் காண்க' : 'View Articles'}</span>
                                        <ArrowRight size={16} className="ml-2" />
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
