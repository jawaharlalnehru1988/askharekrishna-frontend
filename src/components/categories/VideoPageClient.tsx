"use client";

import React, { useState, useEffect } from 'react';
import { Play, Loader2, X, Film, Video as VideoIcon } from 'lucide-react';
import axios from 'axios';
import { getDictionary } from "@/lib/dictionaries";
import { useLanguage } from '../providers/LanguageContext';

interface Video {
    id: number;
    video_file: string;
    language: string;
    language_display: string;
    chapter_number: number;
    sloka_number: string;      // e.g. '17-18', '1-2-3', '5'
    sloka_start: number;       // first sloka in range, used for ordering
    book_name: string;
    book_name_display: string;
    created_at: string;
    updated_at: string;
}

export default function VideoPageClient({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>> }) {
    const { locale } = useLanguage();
    
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Pagination state
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    // Filtering state
    const [selectedChapter, setSelectedChapter] = useState<number | 'all'>('all');
    
    // Active playing video for the modal lightbox player
    const [activeVideo, setActiveVideo] = useState<Video | null>(null);

    // Push a history entry when modal opens so the back button closes it
    const openVideo = (video: Video) => {
        setActiveVideo(video);
        window.history.pushState({ videoModal: true }, '');
    };

    // Close modal and pop the history entry we pushed
    const closeVideo = () => {
        setActiveVideo(null);
        // Only go back if our modal state is in history
        if (window.history.state?.videoModal) {
            window.history.back();
        }
    };

    // Intercept browser back button to close modal instead of leaving page
    useEffect(() => {
        const handlePopState = (e: PopStateEvent) => {
            if (activeVideo) {
                setActiveVideo(null);
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [activeVideo]);

    // List of chapters for the dropdown filter (1 to 18)
    const chapters = Array.from({ length: 18 }, (_, i) => i + 1);

    const fetchVideos = async (pageNumber: number, chapter: number | 'all', append: boolean = false) => {
        try {
            if (append) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }
            
            let url = `https://api.askharekrishna.com/api/v1/videos/?language=tamil&page=${pageNumber}&ordering=chapter_number,sloka_start`;
            if (chapter !== 'all') {
                url += `&chapter_number=${chapter}`;
            }

            const response = await axios.get(url);
            const data = response.data;
            
            // Django REST Framework response is paginated
            const results = data.results || [];
            
            if (append) {
                setVideos(prev => [...prev, ...results]);
            } else {
                setVideos(results);
            }

            setTotalCount(data.count || 0);
            setHasMore(!!data.next);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching videos:', err);
            setError(locale === 'ta' ? 'வீடியோக்களை ஏற்றுவதில் தோல்வி ஏற்பட்டது.' : 'Failed to load videos.');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Reload when chapter or page changes
    useEffect(() => {
        setPage(1);
        fetchVideos(1, selectedChapter, false);
    }, [selectedChapter]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchVideos(nextPage, selectedChapter, true);
    };

    return (
        <main className="flex-grow py-12 bg-background-light dark:bg-background-dark min-h-[70vh]">
            <div className="max-w-[1280px] mx-auto px-4 md:px-8 space-y-8">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#f3efe7] dark:border-neutral-800">
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-text-main dark:text-white flex items-center gap-3">
                            <VideoIcon className="text-primary size-8" />
                            {locale === 'ta' ? 'பகவத் கீதை வீடியோக்கள்' : 'Bhagavad Gita Videos'}
                        </h1>
                        <p className="text-sm text-text-muted dark:text-neutral-400 max-w-xl">
                            {locale === 'ta' 
                              ? 'பகவத் கீதை ஸ்லோகங்களின் தமிழ் விளக்கக் குறும்படக் காட்சியகம். ஸ்லோகங்களின் தத்துவங்களை ஆடியோ மற்றும் காட்சி வடிவில் கற்கலாம்.'
                              : 'Tamil explanation short videos of Srimad Bhagavad Gita verses. Learn the core wisdom visually.'
                            }
                        </p>
                    </div>

                    {/* Filter Control */}
                    <div className="flex items-center gap-3 shrink-0">
                        <label className="text-sm font-bold text-text-main dark:text-gray-300">
                            {locale === 'ta' ? 'அத்தியாயம்:' : 'Chapter:'}
                        </label>
                        <select
                            value={selectedChapter}
                            onChange={(e) => setSelectedChapter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                            className="bg-white dark:bg-[#1a150c] text-sm font-bold border border-[#f3efe7] dark:border-neutral-800 rounded-xl px-4 py-2.5 outline-none text-text-main dark:text-white focus:border-primary/40 transition-colors shadow-sm cursor-pointer"
                        >
                            <option value="all">{locale === 'ta' ? 'அனைத்து அத்தியாயங்கள்' : 'All Chapters'}</option>
                            {chapters.map((ch) => (
                                <option key={ch} value={ch}>
                                    {locale === 'ta' ? `அத்தியாயம் ${ch}` : `Chapter ${ch}`}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Content Grid */}
                {loading && page === 1 ? (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-3">
                        <Loader2 className="animate-spin text-primary size-10" />
                        <p className="text-xs text-text-muted dark:text-neutral-400">
                            {locale === 'ta' ? 'வீடியோக்கள் ஏற்றப்படுகின்றன...' : 'Loading videos...'}
                        </p>
                    </div>
                ) : error ? (
                    <div className="text-center py-16 bg-white dark:bg-[#16120a] rounded-2xl border border-red-100 dark:border-red-950/20 max-w-md mx-auto shadow-sm">
                        <p className="text-sm font-bold text-red-500 mb-4">{error}</p>
                        <button
                            onClick={() => fetchVideos(page, selectedChapter, false)}
                            className="bg-primary hover:bg-primary/95 text-black font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95"
                        >
                            {locale === 'ta' ? 'மீண்டும் முயற்சிக்கவும்' : 'Retry'}
                        </button>
                    </div>
                ) : videos.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-[#16120a] border border-[#f3efe7] dark:border-neutral-800 rounded-3xl max-w-md mx-auto shadow-sm">
                        <Film className="size-16 mx-auto mb-4 text-text-muted/40" />
                        <p className="text-sm font-bold text-text-muted dark:text-neutral-400">
                            {locale === 'ta' ? 'வீடியோக்கள் ஏதும் காணப்படவில்லை.' : 'No videos found.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Video Card Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {videos.map((video) => {
                                // Generate a deterministic beautiful gradient for placeholder
                                const gradients = [
                                    'from-amber-500 to-orange-600',
                                    'from-orange-500 to-rose-600',
                                    'from-rose-500 to-red-600',
                                    'from-amber-600 to-yellow-500',
                                    'from-orange-600 to-yellow-600',
                                    'from-rose-600 to-amber-600'
                                ];
                                const gradIndex = (video.chapter_number + video.sloka_start) % gradients.length;
                                const gradient = gradients[gradIndex];

                                return (
                                    <div
                                        key={video.id}
                                        onClick={() => openVideo(video)}
                                        className="group relative flex flex-col overflow-hidden bg-white dark:bg-[#16120a] border border-[#f3efe7] dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer active:scale-[0.98] select-none"
                                    >
                                        {/* Card Visual Placeholder (On-demand loading thumbnail) */}
                                        <div className="relative aspect-[16/9] w-full overflow-hidden shrink-0 bg-neutral-100 dark:bg-neutral-900">
                                            {/* Design Gradient Background simulating a high-quality thumbnail */}
                                            <div className={`absolute inset-0 bg-gradient-to-tr ${gradient} opacity-85 dark:opacity-75 flex flex-col justify-between p-4`}>
                                                {/* Visual Badge overlay */}
                                                <div className="self-end px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-white bg-black/35 backdrop-blur-md rounded-full shadow-sm">
                                                    BG {video.chapter_number}.{video.sloka_number}
                                                </div>

                                                <div className="text-white text-center font-bold text-lg drop-shadow-md flex flex-col items-center justify-center flex-grow pt-3">
                                                    <span className="text-xs uppercase tracking-widest opacity-80 mb-1">
                                                        {locale === 'ta' ? 'ஸ்லோகம்' : 'Verse'}
                                                    </span>
                                                    <span className="text-3xl font-black">
                                                        {video.chapter_number}.{video.sloka_number}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Glassmorphic Play Button overlay */}
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/25 transition-colors duration-300">
                                                <div className="size-12 rounded-full bg-white/35 dark:bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                    <Play className="fill-white size-5 translate-x-0.5" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Text Info */}
                                        <div className="p-4 flex-grow flex flex-col justify-between space-y-2">
                                            <div>
                                                <h3 className="text-sm font-black text-text-main dark:text-white leading-tight">
                                                    {locale === 'ta' 
                                                      ? `அத்தியாயம் ${video.chapter_number}, ஸ்லோகம் ${video.sloka_number}`
                                                      : `Chapter ${video.chapter_number}, Sloka ${video.sloka_number}`
                                                    }
                                                </h3>
                                                <p className="text-xs text-text-muted dark:text-neutral-400 mt-1 uppercase tracking-wider font-semibold">
                                                    {video.book_name_display}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Load More Button */}
                        {hasMore && (
                            <div className="flex justify-center pt-4">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                    className="min-w-[160px] bg-white dark:bg-[#1a150c] border border-primary/20 text-text-main dark:text-white hover:text-primary hover:border-primary/50 font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loadingMore ? (
                                        <>
                                            <Loader2 className="animate-spin size-4" />
                                            <span>{locale === 'ta' ? 'ஏற்றப்படுகிறது...' : 'Loading...'}</span>
                                        </>
                                    ) : (
                                        <span>{locale === 'ta' ? 'மேலும் பார்க்க' : 'Load More'}</span>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Custom Fullscreen Lightbox Modal Video Player */}
            {activeVideo && (
                <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
                    
                    {/* Close Button overlay */}
                    <button
                        onClick={() => closeVideo()}
                        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors shadow-lg z-[100010]"
                        aria-label="Close Player"
                    >
                        <X className="size-6" />
                    </button>

                    {/* Lightbox Main Container */}
                    <div className="w-full max-w-4xl px-4 flex flex-col gap-4 animate-in zoom-in-95 duration-200">
                        {/* Video Element (Strictly loaded on-demand ONLY when modal is active) */}
                        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10">
                            <video
                                src={activeVideo.video_file}
                                controls
                                autoPlay
                                className="h-full w-full object-contain"
                            />
                        </div>

                        {/* Video Meta Info */}
                        <div className="text-white space-y-1 px-2">
                            <h2 className="text-lg md:text-xl font-black">
                                {locale === 'ta'
                                  ? `அத்தியாயம் ${activeVideo.chapter_number}, ஸ்லோகம் ${activeVideo.sloka_number}`
                                  : `Chapter ${activeVideo.chapter_number}, Sloka ${activeVideo.sloka_number}`
                                }
                            </h2>
                            <p className="text-xs text-neutral-400 uppercase tracking-widest font-semibold">
                                {activeVideo.book_name_display} | {activeVideo.language_display}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
