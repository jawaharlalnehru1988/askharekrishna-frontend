"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
    BookOpen,
    ArrowRight,
    Loader2,
    ChevronLeft,
    ScrollText,
    Calendar,
    Clock,
    User,
    Home,
    Share2,
    LayoutGrid,
    Table as TableIcon,
    Play
} from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';
import { getDictionary } from "@/lib/dictionaries";
import { useLanguage } from '../providers/LanguageContext';
import { useRouter, useSearchParams } from 'next/navigation';

interface Story {
    id: number;
    mainTopic: number | string;
    subTopic: string;
    article: string;
    slug: string;
    order: number;
    language: string;
    audioPath: string | null;
    articleImage: string;
    imagePath?: string;
    created_at: string;
    updated_at: string;
}

interface StoryTopicGroup {
    name: string;
    description: string;
    image: string | null;
    articleList: Story[];
}

type ViewMode = 'topics' | 'articles';

const DevotionalStories = ({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>> }) => {
    const { stories: s, common, navbar } = dictionary;
    const { locale } = useLanguage();
    const searchParams = useSearchParams();
    const topicParam = searchParams.get('topic');

    const [topics, setTopics] = useState<StoryTopicGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('topics');
    const [selectedTopicName, setSelectedTopicName] = useState<string | null>(null);
    const [layoutMode, setLayoutMode] = useState<'list' | 'card'>('card');
    const router = useRouter();


    useEffect(() => {
        const fetchStories = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`https://api.askharekrishna.com/api/v1/stories/articles/?language=${locale === 'en' ? 'en' : 'ta'}`);
                const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
                setTopics(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching stories:', err);
                setError('Failed to load stories components.');
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, [locale]);


    useEffect(() => {
        if (!loading && topics.length > 0) {
            // Standard hierarchy-based navigation
            if (topicParam) {
                setSelectedTopicName(topicParam);
                setViewMode('articles');
            } else {
                setViewMode('topics');
                setSelectedTopicName(null);
            }
        }
    }, [topicParam, loading, topics]);

    const topicList = useMemo(() => {
        return topics.map(topic => ({
            name: topic.name,
            count: topic.articleList.length,
            image: topic.image || "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=800",
            description: topic.description
        }));
    }, [topics]);
    
    const ensureAbsoluteUrl = (path: string | null | undefined) => {
        if (!path) return "";
        if (path.startsWith('http')) return path;
        const apiBase = "https://api.askharekrishna.com";
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${apiBase}${cleanPath}`;
    };

    const articleList = useMemo(() => {
        if (!selectedTopicName) return [];
        const topic = topics.find(t => t.name === selectedTopicName);
        return topic ? topic.articleList : [];
    }, [topics, selectedTopicName]);

    const handleTopicClick = (topicName: string) => {
        const params = new URLSearchParams();
        params.set('topic', topicName);
        window.history.pushState(null, '', `?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubtopicClick = (story: Story) => {
        router.push(`/stories/${story.id}`);
    };

    const handleBack = () => {
        const params = new URLSearchParams();
        if (viewMode === 'articles') {
            // Going back to topics, empty params
        }
        window.history.pushState(null, '', `?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };



    if (loading) {
        return (
            <div className="flex-grow flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 size={48} className="text-primary animate-spin mb-4" />
                <p className="text-text-muted animate-pulse">Loading Divine Stories...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-grow flex items-center justify-center min-h-[60vh] text-red-500 font-bold">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <>
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="pt-12 pb-8 md:pt-16 md:pb-12 bg-gradient-to-b from-[#fdfbf7] to-background-light dark:from-[#2a2418] dark:to-background-dark border-b border-[#f3efe7] dark:border-neutral-800/50">
                    <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                        <div className="text-center">
                            <span className="inline-block mb-3 text-primary font-bold uppercase tracking-widest text-xs">
                                {s.hero.pastimes}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                                {viewMode === 'topics' ? s.hero.title : selectedTopicName}
                            </h1>
                            <p className="max-w-2xl mx-auto text-lg text-text-muted dark:text-gray-300">
                                {viewMode === 'topics' ? s.hero.description : `${articleList.length} ${navbar.stories}`}
                            </p>
                        </div>

                        {/* Navigation / Breadcrumbs */}
                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <Link
                                href="/"
                                className="flex items-center text-sm font-bold text-text-muted hover:text-primary transition-colors"
                            >
                                <Home size={18} className="mr-1.5" />
                                {common.home}
                            </Link>

                            <div className="size-1 rounded-full bg-border-light dark:bg-border-dark" />
                            <Link
                                href="/stories"
                                className={`text-sm font-bold transition-colors ${viewMode === 'topics' ? 'text-primary' : 'text-text-muted hover:text-primary'}`}
                            >
                                {navbar.stories}
                            </Link>

                            {selectedTopicName && (
                                <>
                                    <div className="size-1 rounded-full bg-border-light dark:bg-border-dark" />
                                    <Link
                                        href={`/stories?topic=${encodeURIComponent(selectedTopicName)}`}
                                        className={`text-sm font-bold transition-colors ${viewMode === 'articles' ? 'text-primary' : 'text-text-muted hover:text-primary'}`}
                                    >
                                        {selectedTopicName}
                                    </Link>
                                </>
                            )}

                            {viewMode === 'articles' && (
                                <div className="ml-auto">
                                    <button
                                        onClick={handleBack}
                                        className="group flex items-center text-sm font-bold text-primary hover:text-black dark:hover:text-white transition-colors"
                                    >
                                        <ChevronLeft className="mr-1 group-hover:-translate-x-1 transition-transform" />
                                        {common.back}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section className="py-12 md:py-16">
                    <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                        {/* Phase 1: Topics View */}
                        {viewMode === 'topics' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {topicList.map((topic, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleTopicClick(topic.name)}
                                        className="group flex flex-col text-left h-full bg-white dark:bg-[#2a2418] rounded-2xl border border-[#f3efe7] dark:border-neutral-800 hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                                    >
                                        <div className="relative h-56 w-full overflow-hidden">
                                            <div
                                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                                style={{ backgroundImage: `url('${topic.image}')` }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                            <div className="absolute bottom-4 left-4">
                                                <div className="bg-primary/90 p-2 rounded-lg text-text-main backdrop-blur-sm">
                                                    <BookOpen size={24} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6 flex flex-col flex-grow">
                                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                                {topic.name}
                                            </h3>
                                            <p className="text-text-muted dark:text-gray-400 text-sm leading-relaxed flex-grow line-clamp-2">
                                                {topic.description || `${topic.count} stories to explore`}
                                            </p>
                                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800 flex items-center text-sm font-bold text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                View Topics <ArrowRight size={16} className="ml-1" />
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}



                        {/* Phase 3: Articles Table View */}
                        {viewMode === 'articles' && (
                            <div className="bg-white dark:bg-[#2a2418] rounded-3xl border border-border-light dark:border-neutral-800 shadow-xl overflow-hidden">
                                <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {layoutMode === 'list' ? <TableIcon size={20} className="text-primary" /> : <LayoutGrid size={20} className="text-primary" />}
                                        <h3 className="font-bold text-lg">{common.articleList}</h3>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center bg-gray-100 dark:bg-neutral-800 p-1 rounded-xl">
                                            <button 
                                                onClick={() => setLayoutMode('list')}
                                                className={`p-1.5 rounded-lg transition-all ${layoutMode === 'list' ? 'bg-white dark:bg-neutral-700 shadow-sm text-primary' : 'text-text-muted hover:text-primary'}`}
                                                title="List View"
                                            >
                                                <TableIcon size={18} />
                                            </button>
                                            <button 
                                                onClick={() => setLayoutMode('card')}
                                                className={`p-1.5 rounded-lg transition-all ${layoutMode === 'card' ? 'bg-white dark:bg-neutral-700 shadow-sm text-primary' : 'text-text-muted hover:text-primary'}`}
                                                title="Card View"
                                            >
                                                <LayoutGrid size={18} />
                                            </button>
                                        </div>
                                        <span className="hidden sm:block text-xs font-bold text-text-muted bg-gray-100 dark:bg-neutral-800 px-3 py-1 rounded-full uppercase tracking-wider">
                                            {articleList.length} {navbar.stories}
                                        </span>
                                    </div>
                                </div>
                                {layoutMode === 'list' ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-black/10">
                                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-text-muted">#</th>
                                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-text-muted">Image</th>
                                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-text-muted">Title</th>
                                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-text-muted hidden md:table-cell">Category</th>
                                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-text-muted text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50 dark:divide-neutral-800/50">
                                                {articleList.map((story, index) => (
                                                    <tr 
                                                        key={`${story.id}-${index}`}
                                                        onClick={() => handleSubtopicClick(story)}
                                                        className="group hover:bg-primary/5 cursor-pointer transition-colors"
                                                    >
                                                        <td className="px-6 py-5 text-sm font-bold text-text-muted">
                                                            {index + 1}
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="size-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800 shadow-sm border border-black/5">
                                                                {(story.imagePath || story.articleImage) && (
                                                                    <img 
                                                                        src={ensureAbsoluteUrl(story.imagePath || story.articleImage)} 
                                                                        alt="" 
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="flex flex-col">
                                                                <span className="text-base font-bold text-text-main dark:text-white group-hover:text-primary transition-colors">
                                                                    {story.subTopic}
                                                                </span>
                                                                <div className="flex items-center gap-3 mt-1 md:hidden">
                                                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                                                                        <Calendar size={10} />
                                                                        {new Date(story.created_at).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 hidden md:table-cell">
                                                            <span className="inline-block px-2 py-1 rounded-md bg-gray-100 dark:bg-neutral-800 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                                                                {selectedTopicName}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5 text-right">
                                                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white rounded-xl text-xs font-bold transition-all transform active:scale-95">
                                                                <span>Read</span>
                                                                {story.audioPath && <Play size={12} fill="currentColor" />}
                                                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {articleList.map((story, index) => (
                                            <button
                                                key={`${story.id}-${index}`}
                                                onClick={() => handleSubtopicClick(story)}
                                                className="group flex flex-col text-left bg-gray-50/50 dark:bg-black/10 rounded-2xl border border-[#f3efe7] dark:border-neutral-800 hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                                            >
                                                <div className="relative h-48 w-full overflow-hidden">
                                                    <img 
                                                        src={ensureAbsoluteUrl(story.imagePath || story.articleImage) || "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=400"} 
                                                        alt={story.subTopic}
                                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                                </div>
                                                <div className="p-5 flex flex-col flex-grow">
                                                    <h4 className="text-base font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                                        {story.subTopic}
                                                    </h4>
                                                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-neutral-800/50 flex items-center justify-between">
                                                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                                                            <Calendar size={12} className="text-primary/60" />
                                                            {new Date(story.created_at).toLocaleDateString()}
                                                        </span>
                                                        <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                                                            <span className="text-[11px] font-bold text-primary group-hover:text-text-main dark:group-hover:text-white transition-colors">
                                                                {common.read}
                                                            </span>
                                                            <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                                                <ArrowRight size={16} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}


                    </div>
                </section>
            </main>
        </>
    );
};

export default DevotionalStories;
