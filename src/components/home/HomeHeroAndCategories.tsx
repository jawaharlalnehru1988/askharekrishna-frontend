"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '../providers/LanguageContext';
import axios from 'axios';

interface Story {
    id: number;
    storyCategoryName: string;
    mainTopicName: string;
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

interface HomeHeroAndCategoriesProps {
    h: any;
}

const DEFAULT_CATEGORY_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuDhY_NhYKWePf34oB7wsKgQDF5IjaU3WgdzzbrjTS3ns1F6W8yWb0hQZCj98d_vYe02FNG6CA5T-LktpHeVuKwjEpHPEZtpocboX-DLIeS3_BqL3PbkrKqU2FSdrslrYXtD9NjwtQTHnutwd5klsS35nQ4WPe5Z9BZ4yDSAAv2c_YB2YXWEBOAqrn-Z5dn9drBhxOA1MgWtI52f9jLA8n8rSZQgSNl5ZHggjBUZF3j460L_EJMsB4p7OMLRdwxdFmlPYg99hEdZ9BbX";

const ICON_MAPPER: Record<string, string> = {
    "Ramayanam": "history_edu",
    "Mahabharatam": "swords",
    "Puranams": "auto_stories",
    "Bhagavad Gita": "menu_book",
    "Srimad Bhagavatam": "menu_book",
};

export const HomeHeroAndCategories: React.FC<HomeHeroAndCategoriesProps> = ({ h }) => {
    const { locale } = useLanguage();
    const [stories, setStories] = React.useState<Story[]>([]);
    const [debateArticles, setDebateArticles] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [storiesRes, debateRes] = await Promise.all([
                    axios.get(`https://api.askharekrishna.com/api/v1/stories/articles/?language=${locale === 'en' ? 'en' : 'ta'}&page_size=500`),
                    axios.get(`https://api.askharekrishna.com/api/v1/debate/articles/?language=${locale === 'en' ? 'en' : 'ta'}&page_size=500`)
                ]);

                // Handle both direct array and paginated results
                const storiesData = Array.isArray(storiesRes.data) ? storiesRes.data : (storiesRes.data.results || []);
                setStories(storiesData);

                const debateData = Array.isArray(debateRes.data) ? debateRes.data : (debateRes.data.results || []);
                setDebateArticles(debateData);
            } catch (err) {
                console.error('Home data fetch failed:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [locale]);

    const storyCategories: Category[] = React.useMemo(() => {
        const uniqueCategories = Array.from(new Set(stories.map(s => s.storyCategoryName).filter(Boolean)));
        return uniqueCategories.map(cat => ({
            title: cat,
            description: h.categories.storiesDesc || "Explore divine pastimes and teachings",
            backgroundImage: DEFAULT_CATEGORY_IMAGE,
            icon: ICON_MAPPER[cat] || "book_2",
            href: `/stories?category=${encodeURIComponent(cat)}`
        }));
    }, [stories, h.categories]);

    const debateCategories: Category[] = React.useMemo(() => {
        const uniqueCategories = Array.from(new Set(debateArticles.map(a => a.debateCategoryName).filter(Boolean)));
        return uniqueCategories.map(cat => ({
            title: cat,
            description: h.debateDesc || "Deep dives into Vedic logic and philosophy",
            backgroundImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDT45XlV17fLImZ5J2UfLxvD9yWclvE9Z_j_S2pG4r0TNR_B5h8_VpW9Gz6Xg7mR4J3p_S8V0U2T1-L6J7uV2pG4r0TNR_B5h8_VpW9Gz6Xg7mR4J3p_S8V0U2", // Use a placeholder or mapping
            icon: "gavel",
            href: `/faqs?category=${encodeURIComponent(cat)}`
        }));
    }, [debateArticles, h.debateDesc]);

    return (
        <>
            {/* Hero Section */}
            <div className="w-full bg-background-light dark:bg-background-dark">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-10">
                    <div
                        className="relative overflow-hidden rounded-2xl md:rounded-3xl min-h-[500px] flex items-center justify-center text-center p-8 shadow-lg bg-cover bg-center"
                        style={{
                            backgroundImage: "linear-gradient(rgba(34, 28, 16, 0.3), rgba(34, 28, 16, 0.7)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuDPIsGRXR8PvbkG6ZAq3c64SP-oypwcu2SkvwWLXcTrTFPFOOAM48KeD4X8Ma2JdiIX2imkVBKtAnUSowQvzRPu-Ei3QRq4OBtsUwQ0jQ3eZmgAO_QWDrdgfEvGODnZgXmi62iu9e2SO-9JjzxkNumScIJ_bEwVreheEkt7xDU9MJz4WbRnAEFVqHfpQxVQzNl25SdkIoeMH2BLmjdhSZiwVAUlzVZyJCitjgcLqlDwxPEsgA1juXU-kKE3HNbjLzL9bp1FUaoxNy6K')"
                        }}
                    >
                        <div className="relative z-10 flex flex-col items-center gap-6 max-w-3xl animate-fade-in-up">
                            {h.hero.liveKirtan && (
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-medium tracking-wider uppercase mb-2">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                    {h.hero.liveKirtan}
                                </div>
                            )}
                            <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight drop-shadow-md">
                                {h.hero.title}<br /> <span className="text-primary">{h.hero.subtitle}</span>
                            </h1>
                            <p className="max-w-2xl text-lg font-medium leading-relaxed text-gray-100 md:text-xl drop-shadow">
                                {h.hero.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stories Categories Header */}
            <div className="w-full bg-background-light dark:bg-background-dark pt-8 pb-4">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8 flex justify-between items-end">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-text-main dark:text-white md:text-3xl leading-tight">{h.audioCategories}</h2>
                        <p className="mt-2 text-text-muted dark:text-gray-400">{h.audioDesc}</p>
                    </div>
                    <Link href="/stories" className="hidden font-bold transition-colors sm:flex text-primary hover:text-yellow-600 text-sm items-center gap-1">
                        {h.viewAll} <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </Link>
                </div>
            </div>

            {/* Stories Categories Horizontal Carousel (All Screens) */}
            <div className="w-full bg-background-light dark:bg-background-dark pb-12 overflow-hidden">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-hide sm:overflow-x-auto sm:pb-6">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex flex-col gap-4 p-4 bg-white dark:bg-[#2a2418] rounded-2xl border border-gray-100 dark:border-neutral-800 animate-pulse">
                                    <div className="w-full aspect-[4/3] bg-gray-100 dark:bg-neutral-800 rounded-xl"></div>
                                    <div className="h-6 w-32 bg-gray-100 dark:bg-neutral-800 rounded"></div>
                                    <div className="h-4 w-full bg-gray-100 dark:bg-neutral-800 rounded"></div>
                                </div>
                            ))
                        ) : (
                            storyCategories.map((category) => (
                                <Link
                                    key={category.title}
                                    href={category.href}
                                    className="group flex flex-col gap-4 p-4 rounded-2xl bg-white dark:bg-[#2a2418] border border-transparent hover:border-primary/30 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 flex-shrink-0 w-[260px] md:w-[280px] snap-center"
                                >
                                    <div className="w-full aspect-[4/3] bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden relative">
                                        <div
                                            className="absolute inset-0 transition-transform duration-500 bg-cover bg-center group-hover:scale-110"
                                            style={{ backgroundImage: `url('${category.backgroundImage}')` }}
                                        ></div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute bottom-3 left-3 text-white">
                                            <span className="mb-1 text-3xl material-symbols-outlined text-primary">
                                                {category.icon}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold transition-colors text-text-main dark:text-white group-hover:text-primary">
                                            {category.title}
                                        </h3>
                                        <p className="mt-1 text-sm transition-colors text-text-muted dark:text-gray-400 line-clamp-2 italic">
                                            {category.description}
                                        </p>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Debate Categories Header */}
            {!loading && debateArticles.length > 0 && (
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
            )}

            {/* Debate Categories Horizontal Carousel (All Screens) */}
            {!loading && debateArticles.length > 0 && (
                <div className="w-full bg-background-light dark:bg-background-dark pb-20 overflow-hidden">
                    <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                        <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-hide sm:overflow-x-auto sm:pb-6">
                            {debateCategories.map((category) => (
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
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
