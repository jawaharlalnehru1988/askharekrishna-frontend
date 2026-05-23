"use client";

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
    ArrowRight,
    Loader2,
    ScrollText,
    Calendar,
    Share2,
    X
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLanguage } from '../providers/LanguageContext';

import Link from 'next/link';

interface PoojaVidhiArticle {
    id: number;
    mainTopic: string;
    subTopic: string;
    article: string;
    slug: string;
    order: number;
    language: string;
    audioPath: string | null;
    articleImage: string;
    created_at: string;
    updated_at: string;
    categoryImage?: string;
    categoryName?: string;
    questions?: { id: number }[];
}

interface PoojaVidhiCategory {
    name: string;
    description: string;
    image: string | null;
    articleList: PoojaVidhiArticle[];
}

const PoojaVidhisSection = ({ isHomePage = true }: { isHomePage?: boolean }) => {
    const { locale, dictionary } = useLanguage();
    const { poojaVidhis: p } = dictionary;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.askharekrishna.com/api';
    const [categories, setCategories] = useState<PoojaVidhiCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('All');

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${apiBaseUrl}/v1/pooja_vidhis/articles/?language=${locale}`);
                const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
                setCategories(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching pooja vidhis:', err);
                setError('Failed to load Pooja Vidhis.');
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [locale, apiBaseUrl]);

    const handleWhatsAppShare = (article: PoojaVidhiArticle) => {
        const articleUrl = `${window.location.origin}/pooja-vidhis/${article.id}`;
        const message = `Check out this Pooja Vidhi article: *${article.subTopic}*\n\nRead here: ${articleUrl}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    // Flatten and de-duplicate articles by id
    const allArticles = useMemo(() => {
        const flat = categories.flatMap(cat =>
            cat.articleList.map(article => ({
                ...article,
                categoryImage: cat.image,
                categoryName: cat.name
            }))
        );

        // De-duplicate by id
        const unique = new Map();
        flat.forEach(article => {
            if (!unique.has(article.id)) {
                unique.set(article.id, article);
            }
        });
        return Array.from(unique.values());
    }, [categories]);

    const filteredArticles = allArticles.filter(article => {
        const matchesSearch = article.subTopic.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.article.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' || article.mainTopic === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const displayArticles = isHomePage ? filteredArticles.slice(0, 8) : filteredArticles;
    const availableCategories = ['All', ...categories.map(cat => cat.name)];

    const SkeletonCard = () => (
        <div className="flex flex-col bg-white dark:bg-[#2a2418] rounded-2xl border border-[#f3efe7] dark:border-neutral-800 overflow-hidden animate-pulse shrink-0 w-[85vw] md:w-auto snap-center">
            <div className="h-56 w-full bg-gray-200 dark:bg-neutral-800" />
            <div className="p-6">
                <div className="h-4 w-24 bg-gray-100 dark:bg-neutral-800 rounded mb-3" />
                <div className="h-6 w-full bg-gray-100 dark:bg-neutral-800 rounded mb-2" />
                <div className="h-6 w-2/3 bg-gray-100 dark:bg-neutral-800 rounded mb-4" />
                <div className="pt-5 border-t border-gray-100 dark:border-neutral-800 flex justify-between">
                    <div className="h-4 w-20 bg-gray-100 dark:bg-neutral-800 rounded" />
                    <div className="h-8 w-8 bg-gray-100 dark:bg-neutral-800 rounded-full" />
                </div>
            </div>
        </div>
    );

    if (loading && categories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-background-light dark:bg-background-dark">
                <Loader2 size={40} className="text-primary animate-spin mb-4" />
                <p className="text-text-muted animate-pulse font-medium">
                    {locale === 'ta' ? 'பூஜை முறைகளை ஏற்றுகிறது...' : 'Loading Pooja Vidhis...'}
                </p>
            </div>
        );
    }

    if (error || (categories.length === 0 && !loading)) {
        return null;
    }

    return (
        <section className={`py-20 bg-gradient-to-b from-[#fdfbf7] to-background-light dark:from-[#2a2418] dark:to-background-dark ${isHomePage ? 'border-y' : ''} border-[#f3efe7] dark:border-neutral-800/50`}>
            <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className={isHomePage ? 'text-left max-w-2xl' : 'text-center w-full max-w-3xl mx-auto'}>
                        <span className="inline-block mb-3 text-primary font-bold uppercase tracking-[0.2em] text-xs">
                            {p?.badge || (locale === 'ta' ? 'தினசரி வழிபாடுகள்' : 'Daily Rituals')}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-text-main dark:text-white leading-tight">
                            {p?.title || (locale === 'ta' ? 'பூஜை விதிமுறைகள் மற்றும் ஆசாரமுறைகள்' : 'Pooja Vidhis & Procedures')}
                        </h2>
                        <p className="text-lg text-text-muted dark:text-gray-400 leading-relaxed">
                            {p?.description || (locale === 'ta' ? 'தினசரி பக்தி செயல்பாடுகளைச் செய்வதற்கான முறையான வழிகளை ஆராயுங்கள்.' : 'Explore the systematic ways to perform daily devotional activities.')}
                        </p>
                    </div>
                    {isHomePage && allArticles.length > 8 && (
                        <div className="shrink-0">
                            <Link
                                href="/pooja-vidhis"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 hover:bg-primary text-primary hover:text-black font-bold rounded-xl transition-all border border-primary/20 hover:border-transparent active:scale-95 whitespace-nowrap"
                            >
                                {p?.viewAll || (locale === 'ta' ? 'அனைத்தையும் காண்க' : 'View All')}
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    )}
                </div>

                {!isHomePage && (
                    <div className="flex flex-col md:flex-row gap-6 mb-12 items-center">
                        <div className="relative w-full md:max-w-md group">
                            <input
                                type="text"
                                placeholder={locale === 'ta' ? 'தேடுக...' : 'Search vidhis...'}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#2a2418] border border-[#f3efe7] dark:border-neutral-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm group-hover:shadow-md"
                            />
                            <svg
                                className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-text-muted group-focus-within:text-primary transition-colors"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full no-scrollbar">
                            {availableCategories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${activeCategory === cat
                                            ? 'bg-text-main dark:bg-white text-white dark:text-black border-transparent shadow-md'
                                            : 'bg-white dark:bg-[#2a2418] text-text-muted dark:text-gray-400 border-[#f3efe7] dark:border-neutral-800 hover:border-primary hover:text-primary'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 overflow-x-auto md:overflow-x-visible pb-8 md:pb-0 snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                    {loading ? (
                        Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                    ) : displayArticles.length > 0 ? (
                        displayArticles.map((article, index) => (
                            <Link
                                href={`/pooja-vidhis/${article.id}`}
                                key={`${article.id}-${article.mainTopic}-${index}`}
                                className="group flex flex-col bg-white dark:bg-[#2a2418] rounded-2xl border border-[#f3efe7] dark:border-neutral-800 hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer shrink-0 w-[85vw] md:w-auto snap-center"
                            >
                                <div className="relative h-56 w-full overflow-hidden">
                                    <img
                                        src={article.articleImage || article.categoryImage || 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=800'}
                                        alt={article.subTopic}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                    <div className="absolute bottom-4 left-4">
                                        <div className="bg-primary/90 p-2 rounded-lg text-white backdrop-blur-sm shadow-lg">
                                            <ScrollText size={20} />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">

                                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                        {article.subTopic}
                                    </h3>

                                    {article.questions?.length ? (
                                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                                            {locale === 'ta' ? `${article.questions.length} வினாக்கள்` : `${article.questions.length} MCQs`}
                                        </div>
                                    ) : null}

                                    <div className="mt-auto pt-5 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between">
                                        <span className="text-sm font-bold text-primary flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                                            {locale === 'ta' ? 'படியுங்கள்' : 'Read'} <ArrowRight size={16} />
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleWhatsAppShare(article);
                                                }}
                                                className="p-2 text-text-muted hover:text-[#25D366] hover:bg-[#25D366]/10 rounded-full transition-all"
                                                title="Share on WhatsApp"
                                            >
                                                <Share2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <div className="size-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ScrollText size={32} className="text-text-muted" />
                            </div>
                            <h3 className="text-xl font-bold text-text-main dark:text-white mb-2">
                                {locale === 'ta' ? 'முடிவுகள் எதுவும் இல்லை' : 'No Vidhis Found'}
                            </h3>
                            <p className="text-text-muted dark:text-gray-400">
                                {locale === 'ta' ? 'உங்கள் தேடலை மாற்ற முயற்சிக்கவும்.' : 'Try adjusting your search or category filter.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>


        </section>
    );
};

export default PoojaVidhisSection;
