"use client";

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
    ArrowRight, 
    Loader2, 
    ScrollText,
    Calendar,
    Share2,
    X,
    Gavel,
    Search
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLanguage } from '../providers/LanguageContext';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface DebateArticle {
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
    categoryImage?: string;
    categoryName?: string;
}

interface DebateCategory {
    name: string;
    description: string;
    image: string | null;
    articleList: DebateArticle[];
}

const DebateSection = ({ isHomePage = false }: { isHomePage?: boolean }) => {
    const { locale, dictionary } = useLanguage();
    const searchParams = useSearchParams();
    const initialMainTopic = searchParams.get('mainTopic') || searchParams.get('category') || 'All';
    const initialQuery = searchParams.get('query') || '';

    const [categories, setCategories] = useState<DebateCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedArticle, setSelectedArticle] = useState<DebateArticle | null>(null);
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [activeMainTopic, setActiveMainTopic] = useState<string>(initialMainTopic);

    const getMainTopic = (article: DebateArticle) => (article.mainTopic || article.topic || '').trim();

    useEffect(() => {
        const fetchDebates = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`https://api.askharekrishna.com/api/v1/debate/articles/?language=${locale}`);
                const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
                setCategories(data);
                
                // If initialMainTopic was set from URL, make sure it's valid, otherwise default to 'All'
                if (initialMainTopic !== 'All') {
                    const mainTopics = new Set<string>();
                    data.forEach((cat: DebateCategory) => {
                        (cat.articleList || []).forEach((article) => {
                            const topic = getMainTopic(article) || cat.name;
                            if (topic) {
                                mainTopics.add(topic);
                            }
                        });
                    });

                    if (!mainTopics.has(initialMainTopic)) {
                        setActiveMainTopic('All');
                    }
                }
                
                setError(null);
            } catch (err) {
                console.error('Error fetching debates:', err);
                setError('Failed to load Debates.');
            } finally {
                setLoading(false);
            }
        };

        fetchDebates();
    }, [locale, initialMainTopic]);

    const handleWhatsAppShare = (article: DebateArticle) => {
        const message = `Check out this Debate article: *${article.subTopic}*\n\nRead here: ${window.location.href}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    // Flatten and de-duplicate articles by slug
    const allArticles = useMemo(() => {
        const flat = categories.flatMap(cat => 
            cat.articleList.map(article => ({
                ...article,
                categoryImage: cat.image,
                categoryName: cat.name
            }))
        );
        
        // De-duplicate by slug
        const unique = new Map();
        flat.forEach(article => {
            if (!unique.has(article.slug)) {
                unique.set(article.slug, article);
            }
        });
        return Array.from(unique.values());
    }, [categories]);
    
    const filteredArticles = allArticles.filter(article => {
        const matchesSearch = article.subTopic.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             article.article.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMainTopic = activeMainTopic === 'All' || getMainTopic(article) === activeMainTopic;
        return matchesSearch && matchesMainTopic;
    });

    const displayArticles = isHomePage ? filteredArticles.slice(0, 8) : filteredArticles;
    const availableMainTopics = useMemo(() => {
        const topicSet = new Set<string>();
        allArticles.forEach((article) => {
            const topic = getMainTopic(article);
            if (topic) {
                topicSet.add(topic);
            }
        });
        return ['All', ...Array.from(topicSet.values()).sort((a, b) => a.localeCompare(b))];
    }, [allArticles]);

    const SkeletonCard = () => (
        <div className="flex flex-col bg-white dark:bg-[#2a2418] rounded-2xl border border-[#f3efe7] dark:border-neutral-800 overflow-hidden animate-pulse">
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
                    {locale === 'ta' ? 'விவாதங்களை ஏற்றுகிறது...' : 'Loading Debates...'}
                </p>
            </div>
        );
    }

    return (
        <section className={`py-20 bg-gradient-to-b from-[#fdfbf7] to-background-light dark:from-[#2a2418] dark:to-background-dark ${isHomePage ? 'border-y' : ''} border-[#f3efe7] dark:border-neutral-800/50`}>
            <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className={isHomePage ? 'text-left max-w-2xl' : 'text-center w-full max-w-3xl mx-auto'}>
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

                {!isHomePage && (
                    <div className="flex flex-col md:flex-row gap-6 mb-12 items-center">
                        <div className="relative w-full md:max-w-md group">
                            <input
                                type="text"
                                placeholder={locale === 'ta' ? 'தேடுக...' : 'Search debates...'}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#2a2418] border border-[#f3efe7] dark:border-neutral-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm group-hover:shadow-md"
                            />
                            <Search 
                                className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-text-muted group-focus-within:text-primary transition-colors"
                            />
                        </div>

                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full no-scrollbar">
                            {availableMainTopics.map((topic) => (
                                <button
                                    key={topic}
                                    onClick={() => setActiveMainTopic(topic)}
                                    className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
                                        activeMainTopic === topic
                                            ? 'bg-text-main dark:bg-white text-white dark:text-black border-transparent shadow-md'
                                            : 'bg-white dark:bg-[#2a2418] text-text-muted dark:text-gray-400 border-[#f3efe7] dark:border-neutral-800 hover:border-primary hover:text-primary'
                                    }`}
                                >
                                    {topic}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {loading ? (
                        Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                    ) : displayArticles.length > 0 ? (
                        displayArticles.map((article, index) => (
                            <div 
                                key={`${article.slug}-${getMainTopic(article)}-${index}`}
                                className="group flex flex-col bg-white dark:bg-[#2a2418] rounded-2xl border border-[#f3efe7] dark:border-neutral-800 hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                                onClick={() => setSelectedArticle(article)}
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
                                            <Gavel size={20} />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center gap-2 mb-3">
                                         <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded uppercase tracking-wider">
                                             {getMainTopic(article)}
                                         </span>
                                     </div>
                                     <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                         {article.subTopic}
                                     </h3>

                                    <div className="mt-auto pt-5 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between">
                                        <span className="text-sm font-bold text-primary flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                                            {locale === 'ta' ? 'கட்டுரையை வாசிக்க' : 'Read Article'} <ArrowRight size={16} />
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <button 
                                                onClick={(e) => {
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
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <div className="size-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Gavel size={32} className="text-text-muted" />
                            </div>
                            <h3 className="text-xl font-bold text-text-main dark:text-white mb-2">
                                {locale === 'ta' ? 'விவாதங்கள் எதுவும் இல்லை' : 'No Debates Found'}
                            </h3>
                            <p className="text-text-muted dark:text-gray-400">
                                {locale === 'ta' ? 'உங்கள் தேடலை மாற்ற முயற்சிக்கவும்.' : 'Try adjusting your search or category filter.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {selectedArticle && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedArticle(null)}>
                    <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#1a160f] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-neutral-800">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                    <Gavel size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-text-main dark:text-white line-clamp-1">{selectedArticle.subTopic}</h4>
                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{getMainTopic(selectedArticle)}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedArticle(null)}
                                className="size-10 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto p-6 md:p-10 custom-scrollbar">
                            <div className="relative h-64 md:h-96 w-full rounded-2xl overflow-hidden mb-10 shadow-lg">
                                <img 
                                    src={selectedArticle.articleImage || (selectedArticle as any).categoryImage || 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=800'} 
                                    alt={selectedArticle.subTopic}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            </div>

                            <div className="prose prose-stone dark:prose-invert max-w-none 
                                prose-headings:font-black prose-headings:tracking-tight
                                prose-h1:text-4xl prose-h1:mb-8
                                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                                prose-p:text-lg prose-p:leading-relaxed prose-p:text-text-main dark:prose-p:text-gray-300
                                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic
                                prose-strong:text-primary prose-strong:font-bold">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {selectedArticle.article}
                                </ReactMarkdown>
                            </div>
                            
                            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-neutral-800 text-center">
                                <p className="text-sm font-bold text-text-muted mb-6 uppercase tracking-[0.3em]">
                                     {locale === 'ta' ? 'இந்த விவாதத்தைப் பகிரவும்' : 'Share this Debate'}
                                 </p>
                                 <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                     <button 
                                         onClick={() => handleWhatsAppShare(selectedArticle)}
                                         className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-2xl font-black transition-all shadow-xl hover:shadow-[#25D366]/20 active:scale-95 group"
                                     >
                                         <svg className="size-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                                             <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                         </svg>
                                         WhatsApp
                                     </button>
                                     <button 
                                         onClick={() => {
                                             navigator.clipboard.writeText(window.location.href);
                                             alert(locale === 'ta' ? 'இணைப்பு நகலெடுக்கப்பட்டது!' : 'Link copied to clipboard!');
                                         }}
                                         className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-text-main dark:text-white rounded-2xl font-black transition-all active:scale-95 group"
                                     >
                                         <Share2 size={20} className="group-hover:rotate-12 transition-transform" />
                                         {locale === 'ta' ? 'இணைப்பை நகலெடு' : 'Copy Link'}
                                     </button>
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default DebateSection;
