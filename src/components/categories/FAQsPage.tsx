"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { 
    HelpCircle, 
    MessageSquare, 
    ArrowRight, 
    ChevronLeft, 
    Home, 
    Search,
    BookOpen,
    LayoutGrid,
    Table as TableIcon,
    Play,
    Loader2,
    Calendar,
    Clock
} from "lucide-react";
import { getDictionary } from "@/lib/dictionaries";
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
const FAQ_CATEGORIES = [
    {
        title: "Questions from Atheists",
        description: "Logical inquiries about the existence of God, the soul, and the nature of reality from a skeptic's view.",
        articleCount: 12,
        icon: "psychology_alt",
        colorClass: "text-primary",
        bgClass: "bg-orange-50 dark:bg-orange-900/20",
        slug: "atheists",
        href: "/faqs/atheists"
    },
    {
        title: "Interfaith Questions",
        description: "Comparisons and commonalities between Krishna consciousness and other major world religions.",
        articleCount: 8,
        icon: "public",
        colorClass: "text-blue-600 dark:text-blue-400",
        bgClass: "bg-blue-50 dark:bg-blue-900/20",
        slug: "interfaith",
        href: "/faqs/interfaith"
    },
    {
        title: "Young Generations",
        description: "Modern dilemmas, student life, career balance, and spirituality for the youth of today.",
        articleCount: 15,
        icon: "school",
        colorClass: "text-green-600 dark:text-green-400",
        bgClass: "bg-green-50 dark:bg-green-900/20",
        slug: "young-generations",
        href: "/faqs/young-generations"
    },
    {
        title: "Following Devotees",
        description: "Advanced topics on sadhana, temple etiquette, scripture study, and deepening bhakti.",
        articleCount: 24,
        icon: "self_improvement",
        colorClass: "text-purple-600 dark:text-purple-400",
        bgClass: "bg-purple-50 dark:bg-purple-900/20",
        slug: "devotees",
        href: "/faqs/devotees"
    },
    {
        title: "Demigod Worship",
        description: "Clarifications on the position of demigods relative to the Supreme Lord Krishna.",
        articleCount: 6,
        icon: "temple_hindu",
        colorClass: "text-red-600 dark:text-red-400",
        bgClass: "bg-red-50 dark:bg-red-900/20",
        slug: "demigod-worship",
        href: "/faqs/demigod-worship"
    },
    {
        title: "App Support",
        description: "Help with subscriptions, audio playback, downloading content, and account settings.",
        articleCount: 10,
        icon: "settings_suggest",
        colorClass: "text-gray-600 dark:text-gray-300",
        bgClass: "bg-gray-100 dark:bg-gray-800",
        slug: "app-support",
        href: "/faqs/app-support"
    }
];

interface DebateArticle {
    id: number;
    debateCategoryName: string;
    debateCategoryDescription: string;
    mainTopicName: string;
    mainTopicDescription: string;
    subTopic: string;
    article: string;
    slug: string;
    order: number;
    language: string;
    audioPath: string | null;
    created_at: string;
    updated_at: string;
}

type ViewMode = 'categories' | 'topics' | 'articles' | 'article';

export default function FAQsPage({ 
    dictionary,
    locale 
}: { 
    dictionary: Awaited<ReturnType<typeof getDictionary>>,
    locale: string 
}) {
    const { common: c, faqs: f } = dictionary;
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category');
    const topicParam = searchParams.get('topic');
    const articleParam = searchParams.get('article');

    const [articles, setArticles] = useState<DebateArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>('categories');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [selectedArticle, setSelectedArticle] = useState<DebateArticle | null>(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                let url = `https://api.askharekrishna.com/api/v1/debate/articles/?language=${locale === 'en' ? 'en' : 'ta'}&page_size=500`;
                
                if (categoryParam) {
                    url += `&debateCategoryName=${encodeURIComponent(categoryParam)}`;
                }
                if (topicParam) {
                    url += `&mainTopicName=${encodeURIComponent(topicParam)}`;
                }

                const response = await axios.get(url);
                const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
                setArticles(data);
            } catch (err) {
                console.error('FAQ articles fetch failed:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, [locale, categoryParam, topicParam]);

    useEffect(() => {
        if (!loading) {
            if (categoryParam) {
                setSelectedCategory(categoryParam);
                if (topicParam) {
                    setSelectedTopic(topicParam);
                    if (articleParam) {
                        const art = articles.find(a => 
                            a.slug === articleParam || 
                            a.id.toString() === articleParam ||
                            a.subTopic === articleParam
                        );
                        if (art) {
                            setSelectedArticle(art);
                            setViewMode('article');
                        } else {
                            setViewMode('articles');
                        }
                    } else {
                        setViewMode('articles');
                        setSelectedArticle(null);
                    }
                } else {
                    setViewMode('topics');
                    setSelectedTopic(null);
                    setSelectedArticle(null);
                }
            } else {
                setViewMode('categories');
                setSelectedCategory(null);
                setSelectedTopic(null);
                setSelectedArticle(null);
            }
        }
    }, [categoryParam, topicParam, articleParam, loading, articles]);

    const categories = useMemo(() => {
        const unique = Array.from(new Set(articles.map(a => a.debateCategoryName).filter(Boolean)));
        return unique.map(name => ({
            name,
            count: articles.filter(a => a.debateCategoryName === name).length,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDT45XlV17fLImZ5J2UfLxvD9yWclvE9Z_j_S2pG4r0TNR_B5h8_VpW9Gz6Xg7mR4J3p_S8V0U2T1-L6J7uV2pG4r0TNR_B5h8_VpW9Gz6Xg7mR4J3p_S8V0U2"
        }));
    }, [articles]);

    const topics = useMemo(() => {
        if (!selectedCategory) return [];
        const unique = Array.from(new Set(articles.filter(a => a.debateCategoryName === selectedCategory).map(a => a.mainTopicName).filter(Boolean)));
        return unique.map(name => ({
            name,
            count: articles.filter(a => a.mainTopicName === name).length,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDT45XlV17fLImZ5J2UfLxvD9yWclvE9Z_j_S2pG4r0TNR_B5h8_VpW9Gz6Xg7mR4J3p_S8V0U2T1-L6J7uV2pG4r0TNR_B5h8_VpW9Gz6Xg7mR4J3p_S8V0U2"
        }));
    }, [articles, selectedCategory]);

    const filteredArticles = useMemo(() => {
        if (!selectedTopic) return [];
        return articles.filter(a => a.mainTopicName === selectedTopic);
    }, [articles, selectedTopic]);

    const handleCategoryClick = (name: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('category', name);
        params.delete('topic');
        params.delete('article');
        window.history.pushState(null, '', `?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleTopicClick = (name: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('topic', name);
        params.delete('article');
        window.history.pushState(null, '', `?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleArticleClick = (art: DebateArticle) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('article', art.slug || art.id.toString());
        window.history.pushState(null, '', `?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (viewMode === 'article') {
            params.delete('article');
        } else if (viewMode === 'articles') {
            params.delete('topic');
        } else if (viewMode === 'topics') {
            params.delete('category');
        }
        window.history.pushState(null, '', `?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const localizedCategories = [
        {
            ...FAQ_CATEGORIES[0],
            title: f.categories.atheists.title,
            description: f.categories.atheists.description
        },
        {
            ...FAQ_CATEGORIES[1],
            title: f.categories.interfaith.title,
            description: f.categories.interfaith.description
        },
        {
            ...FAQ_CATEGORIES[2],
            title: f.categories.youngGenerations.title,
            description: f.categories.youngGenerations.description
        },
        {
            ...FAQ_CATEGORIES[3],
            title: f.categories.devotees.title,
            description: f.categories.devotees.description
        },
        {
            ...FAQ_CATEGORIES[4],
            title: f.categories.demigodWorship.title,
            description: f.categories.demigodWorship.description
        },
        {
            ...FAQ_CATEGORIES[5],
            title: f.categories.appSupport.title,
            description: f.categories.appSupport.description
        }
    ];

    if (loading) {
        return (
            <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-300 min-h-screen flex flex-col font-lexend">
                <div className="flex-grow flex flex-col items-center justify-center min-h-[60vh]">
                    <Loader2 size={48} className="text-primary animate-spin mb-4" />
                    <p className="text-text-muted animate-pulse">Loading Divine Debates...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-300 min-h-screen flex flex-col font-lexend">
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="w-full relative overflow-hidden bg-gradient-to-b from-[#fdfbf7] to-background-light dark:from-[#2a2418] dark:to-background-dark border-b border-[#f3efe7] dark:border-neutral-800/50 pt-16 pb-12">
                    <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                            <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full border border-primary/20">
                                {f.helpCenter}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                                {viewMode === 'categories' ? f.title : 
                                 viewMode === 'topics' ? selectedCategory : 
                                 viewMode === 'articles' ? selectedTopic :
                                 selectedArticle?.subTopic}
                            </h1>
                            <p className="text-lg text-text-muted dark:text-gray-400 mb-8 leading-relaxed">
                                {viewMode === 'categories' ? f.description : 
                                 viewMode === 'topics' ? `${topics.length} topics to explore` :
                                 viewMode === 'articles' ? `${filteredArticles.length} articles available` :
                                 selectedArticle?.mainTopicName}
                            </p>
                        </div>

                        {/* Breadcrumbs */}
                        <div className="flex flex-wrap items-center gap-4 mt-8">
                            <Link href="/" className="flex items-center text-sm font-bold text-text-muted hover:text-primary transition-colors">
                                <Home size={18} className="mr-1.5" />
                                Home
                            </Link>

                            <div className="size-1 rounded-full bg-border-light dark:bg-border-dark" />
                            <Link
                                href="/faqs"
                                className={`text-sm font-bold transition-colors ${viewMode === 'categories' ? 'text-primary' : 'text-text-muted hover:text-primary'}`}
                            >
                                Debates
                            </Link>

                            {selectedCategory && (
                                <>
                                    <div className="size-1 rounded-full bg-border-light dark:bg-border-dark" />
                                    <Link
                                        href={`/faqs?category=${encodeURIComponent(selectedCategory)}`}
                                        className={`text-sm font-bold transition-colors ${viewMode === 'topics' ? 'text-primary' : 'text-text-muted hover:text-primary'}`}
                                    >
                                        {selectedCategory}
                                    </Link>
                                </>
                            )}

                            {selectedTopic && (
                                <>
                                    <div className="size-1 rounded-full bg-border-light dark:bg-border-dark" />
                                    <Link
                                        href={`/faqs?category=${encodeURIComponent(selectedCategory!)}&topic=${encodeURIComponent(selectedTopic)}`}
                                        className={`text-sm font-bold transition-colors ${viewMode === 'articles' ? 'text-primary' : 'text-text-muted hover:text-primary'}`}
                                    >
                                        {selectedTopic}
                                    </Link>
                                </>
                            )}

                            {viewMode !== 'categories' && (
                                <div className="ml-auto">
                                    <button
                                        onClick={handleBack}
                                        className="group flex items-center text-sm font-bold text-primary hover:text-black dark:hover:text-white transition-colors"
                                    >
                                        <ChevronLeft className="mr-1 group-hover:-translate-x-1 transition-transform" />
                                        Back
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section className="py-12 md:py-16">
                    <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                        {/* Categories View */}
                        {viewMode === 'categories' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {categories.map((cat, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleCategoryClick(cat.name)}
                                        className="group flex flex-col text-left bg-white dark:bg-[#2a2418] border border-border-light dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300"
                                    >
                                        <div className="relative h-48 w-full overflow-hidden">
                                            <div 
                                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                                style={{ backgroundImage: `url('${cat.image}')` }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            <div className="absolute bottom-4 left-4">
                                                <div className="bg-primary/95 p-2 rounded-xl text-text-main backdrop-blur-sm">
                                                    <MessageSquare size={24} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{cat.name}</h3>
                                            <p className="text-sm text-text-muted dark:text-gray-400 line-clamp-2 italic">
                                                {articles.find(a => a.debateCategoryName === cat.name)?.debateCategoryDescription || `${cat.count} topics available`}
                                            </p>
                                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800 flex items-center text-sm font-bold text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                                Explore Topics <ArrowRight size={16} className="ml-1" />
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Topics View */}
                        {viewMode === 'topics' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {topics.map((topic, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleTopicClick(topic.name)}
                                        className="group flex flex-col text-left bg-white dark:bg-[#2a2418] border border-border-light dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300"
                                    >
                                        <div className="relative h-44 w-full overflow-hidden">
                                            <div 
                                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                                style={{ backgroundImage: `url('${topic.image}')` }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                            <div className="absolute bottom-4 left-4">
                                                <div className="bg-primary/95 p-2 rounded-xl text-text-main backdrop-blur-sm">
                                                    <LayoutGrid size={24} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{topic.name}</h3>
                                            <p className="text-sm text-text-muted dark:text-gray-400 line-clamp-2 italic">
                                                {articles.find(a => a.mainTopicName === topic.name)?.mainTopicDescription || `${topic.count} articles in this topic`}
                                            </p>
                                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800 flex items-center text-sm font-bold text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                                View Articles <ArrowRight size={16} className="ml-1" />
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Articles Table View */}
                        {viewMode === 'articles' && (
                            <div className="bg-white dark:bg-[#2a2418] rounded-3xl border border-border-light dark:border-neutral-800 shadow-xl overflow-hidden">
                                <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex items-center justify-between bg-gray-50/50 dark:bg-black/10">
                                    <div className="flex items-center gap-2">
                                        <TableIcon size={20} className="text-primary" />
                                        <h3 className="font-bold text-lg">Debate Articles</h3>
                                    </div>
                                    <span className="text-xs font-bold text-text-muted bg-gray-100 dark:bg-neutral-800 px-3 py-1 rounded-full uppercase tracking-wider">
                                        {filteredArticles.length} items
                                    </span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-black/10">
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-text-muted">#</th>
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-text-muted">Title</th>
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-text-muted hidden md:table-cell">Theme</th>
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-text-muted text-right">Direct Link</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 dark:divide-neutral-800/50">
                                            {filteredArticles.map((art, index) => (
                                                <tr 
                                                    key={art.id}
                                                    onClick={() => handleArticleClick(art)}
                                                    className="group hover:bg-primary/5 cursor-pointer transition-colors"
                                                >
                                                    <td className="px-6 py-5 text-sm font-bold text-text-muted">{index + 1}</td>
                                                    <td className="px-6 py-5">
                                                        <span className="text-base font-bold text-text-main dark:text-white group-hover:text-primary transition-colors">
                                                            {art.subTopic}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 hidden md:table-cell">
                                                        <span className="inline-block px-2 py-1 rounded-md bg-gray-100 dark:bg-neutral-800 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                                                            {art.mainTopicName}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white rounded-xl text-xs font-bold transition-all transform active:scale-95">
                                                            <span>Explore</span>
                                                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Article Detail View */}
                        {viewMode === 'article' && selectedArticle && (
                            <article className="max-w-4xl mx-auto">
                                <div className="bg-white dark:bg-[#2a2418] rounded-3xl border border-border-light dark:border-neutral-800 shadow-xl overflow-hidden">
                                    <div className="p-8 md:p-12">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                                <HelpCircle size={24} />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold">{selectedArticle.subTopic}</h2>
                                                <p className="text-sm text-text-muted">In {selectedArticle.mainTopicName}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="prose prose-stone dark:prose-invert max-w-none 
                                            prose-headings:font-black prose-headings:tracking-tight
                                            prose-p:text-lg prose-p:leading-relaxed prose-p:text-text-main dark:prose-p:text-gray-300
                                            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic
                                            prose-strong:text-primary prose-strong:font-bold">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {selectedArticle.article}
                                            </ReactMarkdown>
                                        </div>

                                        {selectedArticle.audioPath && (
                                            <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
                                                        <Clock size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-lg">Audio Commentary</h4>
                                                        <p className="text-sm text-text-muted">Listen to the philosophical deep dive</p>
                                                    </div>
                                                </div>
                                                <button className="px-8 py-3 bg-primary hover:bg-primary-dark text-black font-black rounded-xl shadow-lg transition-all">
                                                    Play Now
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="p-8 border-t border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-black/5 text-center">
                                        <button
                                            onClick={handleBack}
                                            className="px-8 py-3 bg-background-light dark:bg-[#332d21] border border-border-light dark:border-neutral-800 rounded-xl font-bold inline-flex items-center gap-2 hover:bg-white dark:hover:bg-[#3e3729] transition-all"
                                        >
                                            <ChevronLeft size={20} />
                                            Back to {selectedTopic}
                                        </button>
                                    </div>
                                </div>
                            </article>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
