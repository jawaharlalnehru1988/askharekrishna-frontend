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
    Home
} from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getDictionary } from "@/lib/dictionaries";
import { useLanguage } from '../providers/LanguageContext';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { useSearchParams } from 'next/navigation';

interface Story {
    id: number;
    mainTopic: string;
    subTopic: string;
    article: string;
    slug: string;
    order: number;
    language: string;
    audioPath: string | null;
    created_at: string;
    updated_at: string;
}

type ViewMode = 'categories' | 'subtopics' | 'article';

const DevotionalStories = ({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>> }) => {
    const { stories: s } = dictionary;
    const { locale } = useLanguage();
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category');
    const storyIdParam = searchParams.get('story');

    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('categories');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                setLoading(true);
                const response = await fetch(`https://api.askharekrishna.com/api/v1/stories/articles/?language=${locale === 'en' ? 'en' : 'ta'}`);
                if (!response.ok) throw new Error('Failed to fetch stories');
                const data = await response.json();
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
    }, [locale]);

    useEffect(() => {
        if (!loading && stories.length > 0) {
            if (categoryParam) {
                setSelectedCategory(categoryParam);
                if (storyIdParam) {
                    const story = stories.find(s => 
                        s.id.toString() === storyIdParam || 
                        s.slug === storyIdParam ||
                        s.subTopic === storyIdParam
                    );
                    if (story) {
                        setSelectedStory(story);
                        setViewMode('article');
                    } else {
                        setViewMode('subtopics');
                    }
                } else {
                    setViewMode('subtopics');
                }
            } else {
                // If on /stories without params, reset to categories
                setViewMode('categories');
                setSelectedCategory(null);
                setSelectedStory(null);
            }
        }
    }, [categoryParam, storyIdParam, loading, stories]);

    const categories = useMemo(() => {
        const uniqueCategories = Array.from(new Set(stories.map(story => story.mainTopic)));
        return uniqueCategories.map(name => ({
            name,
            count: stories.filter(story => story.mainTopic === name).length,
            // Generic nice image or placeholder
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhY_NhYKWePf34oB7wsKgQDF5IjaU3WgdzzbrjTS3ns1F6W8yWb0hQZCj98d_vYe02FNG6CA5T-LktpHeVuKwjEpHPEZtpocboX-DLIeS3_BqL3PbkrKqU2FSdrslrYXtD9NjwtQTHnutwd5klsS35nQ4WPe5Z9BZ4yDSAAv2c_YB2YXWEBOAqrn-Z5dn9drBhxOA1MgWtI52f9jLA8n8rSZQgSNl5ZHggjBUZF3j460L_EJMsB4p7OMLRdwxdFmlPYg99hEdZ9BbX"
        }));
    }, [stories]);

    const filteredSubtopics = useMemo(() => {
        if (!selectedCategory) return [];
        return stories.filter(story => story.mainTopic === selectedCategory);
    }, [stories, selectedCategory]);

    const handleCategoryClick = (categoryName: string) => {
        setSelectedCategory(categoryName);
        setViewMode('subtopics');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubtopicClick = (story: Story) => {
        setSelectedStory(story);
        setViewMode('article');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = () => {
        if (viewMode === 'article') {
            setViewMode('subtopics');
            setSelectedStory(null);
        } else if (viewMode === 'subtopics') {
            setViewMode('categories');
            setSelectedCategory(null);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                                {viewMode === 'categories' ? s.hero.title : selectedCategory}
                            </h1>
                            <p className="max-w-2xl mx-auto text-lg text-text-muted dark:text-gray-300">
                                {viewMode === 'categories' ? s.hero.description : selectedStory?.subTopic || `${filteredSubtopics.length} stories available`}
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

                            {viewMode !== 'categories' && (
                                <>
                                    <div className="size-1 rounded-full bg-border-light dark:bg-border-dark" />
                                    <button
                                        onClick={handleBack}
                                        className="group flex items-center text-sm font-bold text-primary hover:text-black dark:hover:text-white transition-colors"
                                    >
                                        <ChevronLeft className="mr-1 group-hover:-translate-x-1 transition-transform" />
                                        {viewMode === 'article' ? 'Back to List' : 'Back to Categories'}
                                    </button>
                                </>
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
                                            <p className="text-text-muted dark:text-gray-400 text-sm leading-relaxed flex-grow">
                                                {category.count} stories to explore
                                            </p>
                                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800 flex items-center text-sm font-bold text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                {s.listenNow} <ArrowRight size={16} className="ml-1" />
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Phase 2: Subtopics View */}
                        {viewMode === 'subtopics' && (
                            <div className="max-w-4xl mx-auto space-y-6">
                                {filteredSubtopics.map((story) => (
                                    <button
                                        key={story.id}
                                        onClick={() => handleSubtopicClick(story)}
                                        className="w-full group flex items-start gap-6 p-6 rounded-2xl bg-white dark:bg-[#2a2418] border border-border-light dark:border-neutral-800 hover:border-primary/40 transition-all hover:shadow-lg text-left"
                                    >
                                        <div className="hidden sm:flex size-14 rounded-xl bg-primary/10 text-primary items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                            <ScrollText size={28} />
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                                {story.subTopic}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-text-muted uppercase tracking-wider">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    {new Date(story.created_at).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <User size={14} />
                                                    Sri Krishna-Vani
                                                </span>
                                            </div>
                                            <div className="mt-4 flex items-center text-sm font-bold text-primary">
                                                Read Story <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Phase 3: Article View */}
                        {viewMode === 'article' && selectedStory && (
                            <article className="max-w-4xl mx-auto">
                                <div className="bg-white dark:bg-[#2a2418] rounded-3xl border border-border-light dark:border-neutral-800 shadow-xl overflow-hidden">
                                    <div className="p-8 md:p-12">
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
                                        
                                        {selectedStory.audioPath && (
                                            <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
                                                        <Clock size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-lg">Audio Available</h4>
                                                        <p className="text-sm text-text-muted">Listen to this divine story</p>
                                                    </div>
                                                </div>
                                                <button className="px-8 py-3 bg-primary hover:bg-primary-dark text-black font-black rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
                                                    Play Audio
                                                </button>
                                            </div>
                                        )}
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
