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

interface TopicGroup {
    mainTopic: string;
    subTopics: string[];
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
            const normalizeResponse = (payload: any): DebateCategory[] => {
                if (Array.isArray(payload)) return payload;
                return payload?.results || [];
            };

            try {
                setLoading(true);
                const response = await axios.get(`https://api.askharekrishna.com/api/v1/debate/articles/?language=${locale}`);
                let data = normalizeResponse(response.data);

                // Fallback to English if a locale has no debate content yet.
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

    const topicGroups: TopicGroup[] = useMemo(() => {
        const map = new Map<string, Set<string>>();

        categories.forEach((cat) => {
            (cat.articleList || []).forEach((article) => {
                const topic = (article.mainTopic || article.topic || cat.name || '').trim();
                const subTopic = (article.subTopic || '').trim();
                if (!topic || !subTopic) {
                    return;
                }

                if (!map.has(topic)) {
                    map.set(topic, new Set<string>());
                }
                map.get(topic)?.add(subTopic);
            });
        });

        return Array.from(map.entries())
            .map(([mainTopic, subTopicsSet]) => ({
                mainTopic,
                subTopics: Array.from(subTopicsSet.values()).sort((a, b) => a.localeCompare(b)),
            }))
            .sort((a, b) => a.mainTopic.localeCompare(b.mainTopic));
    }, [categories]);

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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                             Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="h-48 bg-white dark:bg-[#2a2418] rounded-2xl border border-gray-100 dark:border-neutral-800 animate-pulse"></div>
                            ))
                        ) : topicGroups.length === 0 ? (
                            <div className="col-span-full rounded-2xl border border-dashed border-[#e7dfcf] dark:border-neutral-800 bg-white dark:bg-[#2a2418] p-10 text-center">
                                <h3 className="text-xl font-bold text-text-main dark:text-white">
                                    {locale === 'ta' ? 'விவாதங்கள் விரைவில்' : 'Debates Coming Soon'}
                                </h3>
                                <p className="mt-2 text-text-muted dark:text-gray-400">
                                    {locale === 'ta' ? 'விவாத பட்டியல் விரைவில் இங்கே தெரியும்.' : 'Debate topics will appear here shortly.'}
                                </p>
                            </div>
                        ) : (
                            topicGroups.map((group) => (
                                <div
                                    key={group.mainTopic}
                                    className="rounded-2xl bg-white dark:bg-[#2a2418] border border-[#e7dfcf] dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                                >
                                    <div className="w-full flex items-center gap-4 p-6 text-left">
                                        <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                                            <Gavel size={28} />
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="text-lg font-bold text-text-main dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                                                {group.mainTopic}
                                            </h3>
                                            <p className="text-xs text-text-muted dark:text-gray-400 mt-1">
                                                {group.subTopics.length} {locale === 'ta' ? 'உட்தலைப்புகள்' : 'Subtopics'}
                                            </p>
                                        </div>
                                        <ChevronDown
                                            size={18}
                                            className="text-text-muted transition-transform rotate-180"
                                        />
                                    </div>

                                    <div className="px-6 pb-6 border-t border-[#f3efe7] dark:border-neutral-800">
                                        <ul className="mt-4 space-y-2 max-h-64 overflow-y-auto pr-1">
                                            {group.subTopics.map((subTopic) => (
                                                <li key={`${group.mainTopic}-${subTopic}`}>
                                                    <Link
                                                        href={`/debate?mainTopic=${encodeURIComponent(group.mainTopic)}&query=${encodeURIComponent(subTopic)}`}
                                                        className="flex items-center justify-between gap-3 text-sm text-text-main dark:text-gray-200 hover:text-primary py-1.5"
                                                    >
                                                        <span className="line-clamp-1">{subTopic}</span>
                                                        <ArrowRight size={14} className="shrink-0" />
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="px-6 pb-5">
                                        <Link href={`/debate?mainTopic=${encodeURIComponent(group.mainTopic)}`} className="inline-flex items-center text-sm font-bold text-primary hover:text-primary-dark transition-colors">
                                            <span>{locale === 'ta' ? 'அனைத்து கட்டுரைகளைக் காண்க' : 'View All in Topic'}</span>
                                            <ArrowRight size={14} className="ml-2" />
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
