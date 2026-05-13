"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useLanguage } from '../providers/LanguageContext';

interface Story {
    id: number;
    subTopic: string;
    slug: string;
}

interface StoryCategory {
    name: string;
    description: string;
    image: string | null;
    articleList: Story[];
}

interface Category {
    title: string;
    description: string;
    backgroundImage: string;
    icon: string;
    href: string;
}

const DEFAULT_CATEGORY_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuDhY_NhYKWePf34oB7wsKgQDF5IjaU3WgdzzbrjTS3ns1F6W8yWb0hQZCj98d_vYe02FNG6CA5T-LktpHeVuKwjEpHPEZtpocboX-DLIeS3_BqL3PbkrKqU2FSdrslrYXtD9NjwtQTHnutwd5klsS35nQ4WPe5Z9BZ4yDSAAv2c_YB2YXWEBOAqrn-Z5dn9drBhxOA1MgWtI52f9jLA8n8rSZQgSNl5ZHggjBUZF3j460L_EJMsB4p7OMLRdwxdFmlPYg99hEdZ9BbX";

const ICON_MAPPER: Record<string, string> = {
    "Ramayanam": "history_edu",
    "Mahabharatam": "swords",
    "Puranams": "auto_stories",
    "Bhagavad Gita": "menu_book",
    "Srimad Bhagavatam": "menu_book",
};

interface StoriesCarouselProps {
    h: any;
}

export const StoriesCarousel: React.FC<StoriesCarouselProps> = ({ h }) => {
    const { locale } = useLanguage();
    const [categories, setCategories] = useState<StoryCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`https://api.askharekrishna.com/api/v1/stories/articles/?language=${locale === 'en' ? 'en' : 'ta'}`);
                const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
                setCategories(data);
            } catch (err) {
                console.error('Stories fetch failed:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStories();
    }, [locale]);

    const storyCategories: Category[] = useMemo(() => {
        return categories.map(cat => ({
            title: cat.name,
            description: cat.description || h.categories.storiesDesc || "Explore divine pastimes and teachings",
            backgroundImage: cat.image || DEFAULT_CATEGORY_IMAGE,
            icon: ICON_MAPPER[cat.name] || "book_2",
            href: `/stories?category=${encodeURIComponent(cat.name)}`
        }));
    }, [categories, h.categories]);

    return (
        <>
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
        </>
    );
};
