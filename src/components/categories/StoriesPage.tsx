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
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { useSearchParams } from 'next/navigation';
import AudioPlayer from '../audio/AudioPlayer';


interface Story {
    id: number;
    storyCategoryName: string;
    storyCategoryDescription: string;
    storyCategoryImage?: string;
    mainTopicName: string;
    mainTopicDescription: string;
    mainTopicImage?: string;
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

const DevotionalStories = ({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>> }) => {
    const { stories: s } = dictionary;
    const { locale } = useLanguage();
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category');
    const topicParam = searchParams.get('topic');
    const storyIdParam = searchParams.get('story');

    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('categories');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);


    useEffect(() => {
        const fetchStories = async () => {
            try {
                setLoading(true);

                // New: Optimized path for Direct ID links (Deep Linking)
                const isNumericId = storyIdParam && /^\d+$/.test(storyIdParam);
                if (isNumericId && !categoryParam && !topicParam) {
                    try {
                        const idResponse = await axios.get(`https://api.askharekrishna.com/api/v1/stories/id/${storyIdParam}/`);
                        const story = idResponse.data;
                        if (story) {
                            // Immediately set the story so it shows up quickly
                            setStories([story]);
                            
                            // Background task: Fetch the rest of the topic to enable navigation (Next/Prev)
                            let listUrl = `https://api.askharekrishna.com/api/v1/stories/articles/?language=${locale === 'en' ? 'en' : 'ta'}&page_size=500`;
                            listUrl += `&storyCategoryName=${encodeURIComponent(story.storyCategoryName)}`;
                            listUrl += `&mainTopicName=${encodeURIComponent(story.mainTopicName)}`;
                            
                            const listResponse = await axios.get(listUrl);
                            const listData = Array.isArray(listResponse.data) ? listResponse.data : (listResponse.data.results || []);
                            setStories(listData);
                            setLoading(false);
                            setError(null);
                            return;
                        }
                    } catch (idErr) {
                        console.error('Error fetching by ID:', idErr);
                        // Fall through to default fetch if ID fetch fails
                    }
                }
                
                let url = `https://api.askharekrishna.com/api/v1/stories/articles/?language=${locale === 'en' ? 'en' : 'ta'}&page_size=500`;
                
                // Add filters if params exist
                if (categoryParam) {
                    url += `&storyCategoryName=${encodeURIComponent(categoryParam)}`;
                }
                if (topicParam) {
                    url += `&mainTopicName=${encodeURIComponent(topicParam)}`;
                }

                const response = await axios.get(url);
                const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
                setStories(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching stories:', err);
                setError('Failed to load stories components.');
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, [locale, categoryParam, topicParam, storyIdParam]); // Added storyIdParam as dependency


    useEffect(() => {
        if (!loading) {
            // Deep link support: If story is provided, try to find it and its hierarchy first
            if (storyIdParam) {
                const story = stories.find(s => 
                    s.slug === storyIdParam || 
                    s.id.toString() === storyIdParam ||
                    s.subTopic === storyIdParam
                );
                if (story) {
                    setSelectedStory(story);
                    setSelectedCategory(story.storyCategoryName);
                    setSelectedTopic(story.mainTopicName);
                    setViewMode('article');
                    return;
                }
            }

            // Standard hierarchy-based navigation
            if (categoryParam) {
                setSelectedCategory(categoryParam);
                if (topicParam) {
                    setSelectedTopic(topicParam);
                    setViewMode('articles'); // Default to list if story above didn't match
                    const story = stories.find(s => 
                        s.slug === storyIdParam || 
                        s.id.toString() === storyIdParam ||
                        s.subTopic === storyIdParam
                    );
                    if (story) {
                        setSelectedStory(story);
                        setViewMode('article');
                    }
                } else {
                    setViewMode('topics');
                    setSelectedTopic(null);
                    setSelectedStory(null);
                }
            } else {
                setViewMode('categories');
                setSelectedCategory(null);
                setSelectedTopic(null);
                setSelectedStory(null);
            }
        }
    }, [categoryParam, topicParam, storyIdParam, loading, stories]);


    const categories = useMemo(() => {
        const uniqueCategories = Array.from(new Set(stories.map(story => story.storyCategoryName).filter(Boolean)));
        return uniqueCategories.map(name => {
            const firstStory = stories.find(s => s.storyCategoryName === name);
            return {
                name,
                count: stories.filter(story => story.storyCategoryName === name).length,
                image: firstStory?.storyCategoryImage || firstStory?.mainTopicImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuDhY_NhYKWePf34oB7wsKgQDF5IjaU3WgdzzbrjTS3ns1F6W8yWb0hQZCj98d_vYe02FNG6CA5T-LktpHeVuKwjEpHPEZtpocboX-DLIeS3_BqL3PbkrKqU2FSdrslrYXtD9NjwtQTHnutwd5klsS35nQ4WPe5Z9BZ4yDSAAv2c_YB2YXWEBOAqrn-Z5dn9drBhxOA1MgWtI52f9jLA8n8rSZQgSNl5ZHggjBUZF3j460L_EJMsB4p7OMLRdwxdFmlPYg99hEdZ9BbX"
            };
        });
    }, [stories]);

    const topics = useMemo(() => {
        if (!selectedCategory) return [];
        const uniqueTopics = Array.from(new Set(stories.filter(s => s.storyCategoryName === selectedCategory).map(s => s.mainTopicName).filter(Boolean)));
        return uniqueTopics.map(name => {
            const firstStory = stories.find(s => s.mainTopicName === name);
            return {
                name,
                count: stories.filter(story => story.mainTopicName === name).length,
                image: firstStory?.mainTopicImage || firstStory?.storyCategoryImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuDT45XlV17fLImZ5J2UfLxvD9yWclvE9Z_j_S2pG4r0TNR_B5h8_VpW9Gz6Xg7mR4J3p_S8V0U2T1-L6J7uV2pG4r0TNR_B5h8_VpW9Gz6Xg7mR4J3p_S8V0U2"
            };
        });
    }, [stories, selectedCategory]);

    const articles = useMemo(() => {
        if (!selectedTopic) return [];
        return stories.filter(story => story.mainTopicName === selectedTopic);
    }, [stories, selectedTopic]);

    const handleCategoryClick = (categoryName: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('category', categoryName);
        params.delete('topic');
        params.delete('story');
        window.history.pushState(null, '', `?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleTopicClick = (topicName: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('topic', topicName);
        params.delete('story');
        window.history.pushState(null, '', `?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubtopicClick = (story: Story) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('story', story.slug || story.id.toString());
        window.history.pushState(null, '', `?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleNextStory = () => {
        if (!selectedStory || articles.length <= 1) return;
        const currentIndex = articles.findIndex(a => a.id === selectedStory.id);
        if (currentIndex === -1) return;
        const nextIndex = (currentIndex + 1) % articles.length;
        handleSubtopicClick(articles[nextIndex]);
    };

    const handlePreviousStory = () => {
        if (!selectedStory || articles.length <= 1) return;
        const currentIndex = articles.findIndex(a => a.id === selectedStory.id);
        if (currentIndex === -1) return;
        const prevIndex = (currentIndex - 1 + articles.length) % articles.length;
        handleSubtopicClick(articles[prevIndex]);
    };


    const handleBack = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (viewMode === 'article') {
            params.delete('story');
        } else if (viewMode === 'articles') {
            params.delete('topic');
        } else if (viewMode === 'topics') {
            params.delete('category');
        }
        window.history.pushState(null, '', `?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleWhatsAppShare = () => {
        if (!selectedStory) return;
        const currentUrl = new URL(window.location.href);
        // Use numeric ID for the shortest possible URL
        const shareUrl = `${currentUrl.origin}${currentUrl.pathname}?story=${selectedStory.id}`;
        const message = `Check out this devotional story: *${selectedStory.subTopic}*\n\nRead here:\n${shareUrl}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };



    if (loading) {
        return (
            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-200">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center min-h-[60vh]">
                    <Loader2 size={48} className="text-primary animate-spin mb-4" />
                    <p className="text-text-muted animate-pulse">Loading Divine Stories...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-200">
                <Navbar />
                <div className="flex-grow flex items-center justify-center min-h-[60vh] text-red-500 font-bold">
                    <p>{error}</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-200">
            <Navbar />
            
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="pt-12 pb-8 md:pt-16 md:pb-12 bg-gradient-to-b from-[#fdfbf7] to-background-light dark:from-[#2a2418] dark:to-background-dark border-b border-[#f3efe7] dark:border-neutral-800/50">
                    <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                        <div className="text-center">
                            <span className="inline-block mb-3 text-primary font-bold uppercase tracking-widest text-xs">
                                {s.hero.pastimes}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                                {viewMode === 'categories' ? s.hero.title : 
                                 viewMode === 'topics' ? selectedCategory : 
                                 viewMode === 'articles' ? selectedTopic :
                                 selectedStory?.subTopic}
                            </h1>
                            <p className="max-w-2xl mx-auto text-lg text-text-muted dark:text-gray-300">
                                {viewMode === 'categories' ? s.hero.description : 
                                 viewMode === 'topics' ? `${topics.length} topics available` :
                                 viewMode === 'articles' ? `${articles.length} stories available` :
                                 selectedStory?.mainTopicName}
                            </p>
                        </div>

                        {/* Navigation / Breadcrumbs */}
                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <Link
                                href="/"
                                className="flex items-center text-sm font-bold text-text-muted hover:text-primary transition-colors"
                            >
                                <Home size={18} className="mr-1.5" />
                                Home
                            </Link>

                            <div className="size-1 rounded-full bg-border-light dark:bg-border-dark" />
                            <Link
                                href="/stories"
                                className={`text-sm font-bold transition-colors ${viewMode === 'categories' ? 'text-primary' : 'text-text-muted hover:text-primary'}`}
                            >
                                Stories
                            </Link>

                            {selectedCategory && (
                                <>
                                    <div className="size-1 rounded-full bg-border-light dark:bg-border-dark" />
                                    <Link
                                        href={`/stories?category=${encodeURIComponent(selectedCategory)}`}
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
                                        href={`/stories?category=${encodeURIComponent(selectedCategory!)}&topic=${encodeURIComponent(selectedTopic)}`}
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
                        {/* Phase 1: Categories View */}
                        {viewMode === 'categories' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {categories.map((category, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleCategoryClick(category.name)}
                                        className="group flex flex-col text-left h-full bg-white dark:bg-[#2a2418] rounded-2xl border border-[#f3efe7] dark:border-neutral-800 hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                                    >
                                        <div className="relative h-56 w-full overflow-hidden">
                                            <div
                                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                                style={{ backgroundImage: `url('${category.image}')` }}
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
                                                {category.name}
                                            </h3>
                                            <p className="text-text-muted dark:text-gray-400 text-sm leading-relaxed flex-grow line-clamp-2">
                                                {stories.find(s => s.storyCategoryName === category.name)?.storyCategoryDescription || `${category.count} stories to explore`}
                                            </p>
                                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800 flex items-center text-sm font-bold text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                View Topics <ArrowRight size={16} className="ml-1" />
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Phase 2: Topics View */}
                        {viewMode === 'topics' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {topics.map((topic, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleTopicClick(topic.name)}
                                        className="group flex flex-col text-left h-full bg-white dark:bg-[#2a2418] rounded-2xl border border-border-light dark:border-neutral-800 hover:border-primary/40 transition-all hover:shadow-lg overflow-hidden"
                                    >
                                        <div className="relative h-48 w-full overflow-hidden">
                                            <div
                                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                                style={{ backgroundImage: `url('${topic.image}')` }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            <div className="absolute bottom-4 left-4">
                                                <div className="bg-primary/90 p-2 rounded-lg text-text-main backdrop-blur-sm">
                                                    <LayoutGrid size={24} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6 flex flex-col flex-grow">
                                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                                {topic.name}
                                            </h3>
                                            <p className="text-text-muted dark:text-gray-400 text-sm leading-relaxed flex-grow line-clamp-2">
                                                {stories.find(s => s.mainTopicName === topic.name)?.mainTopicDescription || `${topic.count} stories available in this topic`}
                                            </p>
                                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800 flex items-center text-sm font-bold text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                Explore Collective <ArrowRight size={16} className="ml-1" />
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
                                        <TableIcon size={20} className="text-primary" />
                                        <h3 className="font-bold text-lg">Article List</h3>
                                    </div>
                                    <span className="text-xs font-bold text-text-muted bg-gray-100 dark:bg-neutral-800 px-3 py-1 rounded-full uppercase tracking-wider">
                                        {articles.length} Stories
                                    </span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-black/10">
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-text-muted">#</th>
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-text-muted">Title</th>
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-text-muted hidden md:table-cell">Category</th>
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-text-muted text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 dark:divide-neutral-800/50">
                                            {articles.map((story, index) => (
                                                <tr 
                                                    key={story.id}
                                                    onClick={() => handleSubtopicClick(story)}
                                                    className="group hover:bg-primary/5 cursor-pointer transition-colors"
                                                >
                                                    <td className="px-6 py-5 text-sm font-bold text-text-muted">
                                                        {index + 1}
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
                                                            {story.mainTopicName}
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
                            </div>
                        )}

                        {/* Phase 4: Article View */}
                        {viewMode === 'article' && selectedStory && (
                            <article className="max-w-4xl mx-auto">
                                <div className="bg-white dark:bg-[#2a2418] rounded-3xl border border-border-light dark:border-neutral-800 shadow-xl overflow-hidden relative">
                                    {/* Article Action Bar */}
                                    <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-black/10">
                                        <div className="flex items-center gap-2">
                                            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                                <ScrollText size={18} />
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-wider opacity-60">Pastime Story</span>
                                        </div>
                                        <button 
                                            onClick={handleWhatsAppShare}
                                            className="flex items-center gap-2 px-4 py-1.5 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full text-xs font-bold transition-all shadow-md active:scale-95"
                                        >
                                            <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                            Share
                                        </button>
                                    </div>
                                    <div className="p-8 md:p-12">
                                        {selectedStory.audioPath && (
                                            <div className="mb-12">
                                                <AudioPlayer
                                                    url={selectedStory.audioPath}
                                                    title={selectedStory.subTopic}
                                                    playing={isPlaying}
                                                    setPlaying={setIsPlaying}
                                                    onNext={handleNextStory}
                                                    onPrevious={handlePreviousStory}
                                                    resource={{
                                                        id: selectedStory.id,
                                                        category: selectedStory.storyCategoryName,
                                                        audioPath: selectedStory.audioPath,
                                                        imagePath: selectedStory.mainTopicImage || selectedStory.storyCategoryImage || null,
                                                        videoPath: null,
                                                        translations: [],
                                                        title: selectedStory.subTopic,
                                                        authorName: "Sri Krishna Kirtan",
                                                        description: selectedStory.mainTopicDescription,
                                                        tamilLyrics: "",
                                                        englishLyrics: "",
                                                        order: selectedStory.order,
                                                        created_at: selectedStory.created_at,
                                                        updated_at: selectedStory.updated_at
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <div className="prose prose-stone dark:prose-invert max-w-none 
                                            prose-headings:font-black prose-headings:tracking-tight
                                            prose-h1:text-4xl md:prose-h1:text-5xl prose-h1:mb-8
                                            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                                            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                                            prose-p:text-lg prose-p:leading-relaxed prose-p:text-text-main dark:prose-p:text-gray-300
                                            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic
                                            prose-li:text-lg prose-li:text-text-main dark:prose-li:text-gray-300
                                            prose-strong:text-primary prose-strong:font-bold">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {selectedStory.article}
                                            </ReactMarkdown>
                                        </div>
                                    </div>

                                    {/* Bottom Share Section */}
                                    <div className="p-8 border-t border-gray-100 dark:border-neutral-800 bg-gray-50/30 dark:bg-black/5 text-center">
                                        <p className="text-sm font-bold text-text-muted mb-4 uppercase tracking-[0.2em]">End of Pastime</p>
                                        <div className="flex flex-col items-center gap-4">
                                            <h4 className="text-xl font-bold">Share this transcendental message</h4>
                                            <button 
                                                onClick={handleWhatsAppShare}
                                                className="flex items-center gap-3 px-10 py-4 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-2xl font-black transition-all shadow-xl hover:shadow-[#25D366]/20 active:scale-95 group"
                                            >
                                                <svg className="size-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                </svg>
                                                Share on WhatsApp
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Navigation at bottom */}
                                <div className="mt-12 flex flex-wrap justify-center gap-4">
                                    <Link
                                        href="/"
                                        className="px-8 py-4 bg-background-light dark:bg-[#332d21] border border-border-light dark:border-neutral-800 rounded-2xl font-bold flex items-center gap-2 hover:bg-white dark:hover:bg-[#3e3729] transition-all shadow-sm"
                                    >
                                        <Home size={20} />
                                        Back to Home
                                    </Link>
                                    <button
                                        onClick={handleBack}
                                        className="px-8 py-4 bg-primary text-black rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-all shadow-sm"
                                    >
                                        <ChevronLeft size={20} />
                                        Back to {selectedCategory}
                                    </button>
                                </div>
                            </article>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default DevotionalStories;
