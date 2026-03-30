"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '../providers/LanguageContext';

interface Story {
    id: number;
    mainTopic: string;
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
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                setLoading(true);
                const response = await fetch(`https://api.askharekrishna.com/api/v1/stories/articles/?language=${locale === 'en' ? 'en' : 'ta'}`);
                if (response.ok) {
                    const data = await response.json();
                    setStories(data);
                }
            } catch (err) {
                console.error('Home stories fetch failed:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStories();
    }, [locale]);

    const categories: Category[] = useMemo(() => {
        const uniqueTopics = Array.from(new Set(stories.map(s => s.mainTopic)));
        return uniqueTopics.map(topic => ({
            title: topic,
            description: h.categories.storiesDesc || "Explore divine pastimes and teachings",
            backgroundImage: DEFAULT_CATEGORY_IMAGE, // Can be refined to use specific images if mapping is provided
            icon: ICON_MAPPER[topic] || "book_2",
            href: `/stories?category=${encodeURIComponent(topic)}`
        }));
    }, [stories, h.categories]);

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
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-medium tracking-wider uppercase mb-2">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                {h.hero.liveKirtan}
                            </div>
                            <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight drop-shadow-md">
                                {h.hero.title}<br /> <span className="text-primary">{h.hero.subtitle}</span>
                            </h1>
                            <p className="max-w-2xl text-lg font-medium leading-relaxed text-gray-100 md:text-xl drop-shadow">
                                {h.hero.description}
                            </p>
                            <div className="flex flex-col w-full gap-4 mt-4 sm:flex-row justify-center">
                                <button className="flex items-center justify-center rounded-xl h-12 md:h-14 px-8 bg-primary hover:bg-yellow-500 text-[#1b170d] text-base font-bold tracking-wide transition-all hover:scale-105 shadow-lg shadow-primary/25 cursor-pointer">
                                    <span className="material-symbols-outlined mr-2">play_circle</span>
                                    {h.hero.startListening}
                                </button>
                                <button className="flex items-center justify-center rounded-xl h-12 md:h-14 px-8 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white text-base font-bold tracking-wide transition-all cursor-pointer">
                                    {h.hero.exploreLibrary}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories Header */}
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

            {/* Categories Grid */}
            <div className="w-full bg-background-light dark:bg-background-dark pb-20">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex flex-col gap-4 p-4 bg-white dark:bg-[#2a2418] rounded-2xl border border-gray-100 dark:border-neutral-800 animate-pulse">
                                    <div className="w-full aspect-[4/3] bg-gray-100 dark:bg-neutral-800 rounded-xl"></div>
                                    <div className="h-6 w-32 bg-gray-100 dark:bg-neutral-800 rounded"></div>
                                    <div className="h-4 w-full bg-gray-100 dark:bg-neutral-800 rounded"></div>
                                </div>
                            ))
                        ) : (
                            categories.map((category) => (
                                <Link
                                    key={category.title}
                                    href={category.href}
                                    className="group flex flex-col gap-4 p-4 rounded-2xl bg-white dark:bg-[#2a2418] border border-transparent hover:border-primary/30 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
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
        </>
    );
};
