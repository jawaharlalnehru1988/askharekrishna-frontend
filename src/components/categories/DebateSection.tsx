"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    ArrowRight, 
    Loader2, 
    Gavel,
    ChevronDown
} from 'lucide-react';
import { useLanguage } from '../providers/LanguageContext';
import Link from 'next/link';

interface DebateArticle {
    id: number;
    subTopic: string;
    slug: string;
}

interface DebateCategory {
    name: string;
    description: string;
    image: string | null;
    articleList: DebateArticle[];
}

const DebateSection = () => {
    const { locale } = useLanguage();
    const [categories, setCategories] = useState<DebateCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDebates = async () => {
            const normalizeResponse = (payload: any): DebateCategory[] => {
                if (Array.isArray(payload)) return payload;
                return payload?.results || [];
            };

            try {
                setLoading(true);
                const response = await axios.get(`https://api.askharekrishna.com/api/v1/debate/articles/?language=${locale}`);
                let data = normalizeResponse(response.data);

                const hasTopicData = data.some((cat) => (cat.articleList || []).length > 0);
                if (!hasTopicData && locale !== 'en') {
                    const fallbackResponse = await axios.get('https://api.askharekrishna.com/api/v1/debate/articles/?language=en');
                    data = normalizeResponse(fallbackResponse.data);
                }

                setCategories(data);
            } catch (err) {
                console.error('Debate fetch failed:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDebates();
    }, [locale]);

    if (loading && categories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-background-light dark:bg-background-dark">
                <Loader2 size={40} className="text-primary animate-spin mb-4" />
                <p className="text-text-muted animate-pulse font-medium">
                    {locale === 'ta' ? 'விவாதங்களை ஏற்றுகிறது...' : 'Loading Debates...'}
                </p>
            </div>
        );
    }

    return (
        <section className={`py-20 bg-gradient-to-b from-[#fdfbf7] to-background-light dark:from-[#2a2418] dark:to-background-dark border-[#f3efe7] dark:border-neutral-800/50`}>
            <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className={'text-center w-full max-w-3xl mx-auto'}>
                        <span className="inline-block mb-3 text-primary font-bold uppercase tracking-[0.2em] text-xs">
                            {locale === 'ta' ? 'தர்க்கம் மற்றும் தத்துவம்' : 'Logic & Philosophy'}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-text-main dark:text-white leading-tight">
                            {locale === 'ta' ? 'விவாதங்கள்' : 'Debates'}
                        </h2>
                        <p className="text-lg text-text-muted dark:text-gray-400 leading-relaxed">
                            {locale === 'ta' ? 'வேத தர்க்கம் மற்றும் தத்துவத்தின் ஆழமான ஆய்வுகள்.' : 'Deep dives into Vedic logic and philosophy to answer challenging questions.'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-48 bg-white dark:bg-[#2a2418] rounded-2xl border border-gray-100 dark:border-neutral-800 animate-pulse"></div>
                        ))
                    ) : categories.length === 0 ? (
                        <div className="col-span-full py-20 text-center">
                            <div className="size-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Gavel size={32} className="text-text-muted" />
                            </div>
                            <h3 className="text-xl font-bold text-text-main dark:text-white mb-2">
                                {locale === 'ta' ? 'விவாதங்கள் எதுவும் இல்லை' : 'No Debates Found'}
                            </h3>
                        </div>
                    ) : (
                        categories.map((category) => (
                            <div
                                key={category.name}
                                className="rounded-2xl bg-white dark:bg-[#2a2418] border border-[#e7dfcf] dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                            >
                                <div className="w-full flex items-center gap-4 p-6 text-left">
                                    <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
                                        <Gavel size={28} />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="text-lg font-bold text-text-main dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                                            {category.name}
                                        </h3>
                                        <p className="text-xs text-text-muted dark:text-gray-400 mt-1">
                                            {(category.articleList || []).length} {locale === 'ta' ? 'உட்தலைப்புகள்' : 'Subtopics'}
                                        </p>
                                    </div>
                                    <ChevronDown
                                        size={18}
                                        className="text-text-muted transition-transform rotate-180"
                                    />
                                </div>

                                <div className="px-6 pb-6 border-t border-[#f3efe7] dark:border-neutral-800">
                                    <ul className="mt-4 space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                                        {(category.articleList || []).map((article) => (
                                            <li key={article.slug}>
                                                <Link
                                                    href={`/debate/${article.slug}`}
                                                    className="group flex items-center justify-between gap-3 text-sm text-text-main dark:text-gray-200 hover:text-primary py-2"
                                                >
                                                    <span className="line-clamp-2">{article.subTopic}</span>
                                                    <ArrowRight size={14} className="shrink-0 text-text-muted group-hover:text-primary" />
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default DebateSection;
