"use client";

import React, { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { AudioList } from '@/components/audio/AudioList';
import { AudioPlayer, type AudioTrack } from '@/components/audio/AudioPlayer';
import { getTopicByListId, type AudioItem } from '@/lib/bhagavad-gita-data';
import { fetchAudiosByListId, formatDuration, type AudioItemAPI } from '@/lib/api';

interface PageProps {
    params: Promise<{
        audioListId: string;
    }>;
}

// Convert API AudioItem to local AudioItem format
function convertAPIToAudioItem(apiItem: AudioItemAPI): AudioItem {
    return {
        id: apiItem.id,
        audioListId: apiItem.audioListId,
        title: apiItem.title,
        description: apiItem.description,
        language: apiItem.language,
        duration: formatDuration(apiItem.duration), // Convert "10.15" to "10:15"
        audioUrl: apiItem.audioUrl,
        isPlaying: apiItem.isPlaying
    };
}

// Convert AudioItem to AudioTrack format
function convertToAudioTrack(item: AudioItem, topic: any): AudioTrack {
    return {
        id: item.id,
        title: item.title,
        description: item.description,
        duration: item.duration,
        audioUrl: item.audioUrl,
        coverImage: topic.image,
        artist: 'Hare Krishna',
        chapter: item.id,
        category: topic.title
    };
}

export default function AudioListPage({ params }: PageProps) {
    // Unwrap the params Promise using React.use()
    const { audioListId } = use(params); // No need to parseInt, it's already a string
    const topic = getTopicByListId(audioListId);

    const [audioItems, setAudioItems] = useState<AudioItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentPlayingId, setCurrentPlayingId] = useState<number | undefined>();
    const [showPlayer, setShowPlayer] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);

    // Fetch audio items from API
    useEffect(() => {
        async function loadAudios() {
            try {
                setIsLoading(true);
                setError(null);
                const apiAudios = await fetchAudiosByListId(audioListId);
                const convertedAudios = apiAudios.map(convertAPIToAudioItem);
                setAudioItems(convertedAudios);
            } catch (err) {
                console.error('Failed to load audios:', err);
                setError('Failed to load audio items. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        }

        loadAudios();
    }, [audioListId]);

    // Handle case where topic doesn't exist
    if (!topic) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-text-main dark:text-white mb-4">Topic Not Found</h1>
                    <p className="text-text-muted mb-6">The topic you're looking for doesn't exist.</p>
                    <Link href="/bhagavad-gita" className="text-primary hover:text-primary-dark font-bold">
                        ← Back to Bhagavad Gita
                    </Link>
                </div>
            </div>
        );
    }

    // Handle loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-text-muted">Loading audio items...</p>
                </div>
            </div>
        );
    }

    // Handle error state
    if (error) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-text-main dark:text-white mb-4">Error</h1>
                    <p className="text-text-muted mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-primary hover:text-primary-dark font-bold"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Convert all audio items to tracks for the player
    const playlist: AudioTrack[] = audioItems.map(item => convertToAudioTrack(item, topic));

    const handleItemClick = (item: AudioItem) => {
        console.log('Playing:', item.title);
        const track = convertToAudioTrack(item, topic);
        setCurrentTrack(track);
        setCurrentPlayingId(item.id);
        setShowPlayer(true);
        setIsPlaying(true);
    };

    const handleTrackChange = (track: AudioTrack) => {
        setCurrentTrack(track);
        setCurrentPlayingId(track.id);
        setIsPlaying(true);
    };

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleBack = () => {
        setShowPlayer(false);
        setIsPlaying(false);
    };

    // If player is active, show the AudioPlayer component
    if (showPlayer && currentTrack) {
        return (
            <AudioPlayer
                currentTrack={currentTrack}
                playlist={playlist}
                onTrackChange={handleTrackChange}
                onPlayPause={handlePlayPause}
                isPlaying={isPlaying}
                title="Bhagavad Gita"
                backHref="/bhagavad-gita"
                onBack={handleBack}
                playlistTitle="Chapters"
                playlistTabs={[
                    { id: 'upnext', label: 'Up Next' },
                    { id: 'chapters', label: 'All Chapters' }
                ]}
            />
        );
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-main dark:text-white font-display">
            {/* Header/Navbar */}
            <header className="sticky top-0 z-50 w-full border-b border-[#f3efe7] bg-background-light/95 backdrop-blur-sm dark:bg-background-dark/95 dark:border-white/10">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-2 text-text-main dark:text-white">
                        <div className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                            <span className="material-symbols-outlined icon-fill">spa</span>
                        </div>
                        <h1 className="text-lg font-bold leading-tight tracking-tight">Hare Krishna Audio</h1>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link className="text-sm font-medium text-text-main hover:text-primary transition-colors dark:text-gray-200" href="/">Home</Link>
                        <Link className="text-sm font-medium text-primary hover:text-primary-dark transition-colors dark:text-primary" href="/bhagavad-gita">Bhagavad Gita</Link>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-text-muted mb-6">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    <Link href="/bhagavad-gita" className="hover:text-primary transition-colors">Bhagavad Gita</Link>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    <span className="text-text-main dark:text-white font-semibold">{topic.title}</span>
                </div>

                {/* Page Header */}
                <div className="flex flex-col lg:flex-row gap-8 lg:items-end justify-between mb-10">
                    <div className="flex flex-col gap-4 max-w-2xl">
                        <div className="flex items-start gap-6">
                            {/* Topic Cover Image */}
                            <div
                                className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-xl bg-cover bg-center shadow-md"
                                style={{ backgroundImage: `url('${topic.image}')` }}
                            />
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-primary">Audio Collection</span>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-text-main dark:text-white leading-tight">
                                    {topic.title}
                                </h1>
                                <p className="text-text-muted dark:text-gray-400 text-base sm:text-lg leading-relaxed max-w-xl">
                                    {topic.description}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => audioItems.length > 0 && handleItemClick(audioItems[0])}
                            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95"
                        >
                            <span className="material-symbols-outlined icon-filled">play_arrow</span>
                            Play All
                        </button>
                        <button className="flex items-center justify-center size-12 rounded-full border border-[#e7dfcf] dark:border-gray-700 bg-white dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-700 text-text-main dark:text-white transition-colors">
                            <span className="material-symbols-outlined">favorite</span>
                        </button>
                        <button className="flex items-center justify-center size-12 rounded-full border border-[#e7dfcf] dark:border-gray-700 bg-white dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-700 text-text-main dark:text-white transition-colors">
                            <span className="material-symbols-outlined">share</span>
                        </button>
                    </div>
                </div>

                {/* Audio List */}
                {audioItems.length > 0 ? (
                    <AudioList
                        items={audioItems}
                        currentPlayingId={currentPlayingId}
                        onItemClick={handleItemClick}
                    />
                ) : (
                    <div className="text-center py-12">
                        <p className="text-text-muted text-lg">No audio items available for this topic yet.</p>
                        <Link href="/bhagavad-gita" className="text-primary hover:text-primary-dark font-bold mt-4 inline-block">
                            ← Browse other topics
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}
