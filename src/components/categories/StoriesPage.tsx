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
    Share2
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

    const handleWhatsAppShare = () => {
        if (!selectedStory) return;
        const currentUrl = window.location.href;
        const message = `Check out this devotional story: *${selectedStory.subTopic}*\n\nRead here:\n${currentUrl}`;
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
