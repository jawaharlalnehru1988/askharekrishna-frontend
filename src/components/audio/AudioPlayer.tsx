"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export interface AudioTrack {
    id: number;
    title: string;
    description?: string;
    duration: string;
    audioUrl: string;
    coverImage?: string;
    artist?: string;
    chapter?: number;
    isCompleted?: boolean;
    category?: string;
}

interface AudioPlayerProps {
    currentTrack: AudioTrack;
    playlist: AudioTrack[];
    onTrackChange?: (track: AudioTrack) => void;
    onPlayPause?: () => void;
    isPlaying?: boolean;
    // New props for reusability
    title?: string;
    backHref?: string;
    showNav?: boolean;
    onBack?: () => void;
    playlistTitle?: string;
    playlistTabs?: { id: string; label: string }[];
    activeTab?: string;
    onTabChange?: (tabId: string) => void;
}

export function AudioPlayer({
    currentTrack,
    playlist,
    onTrackChange,
    onPlayPause,
    isPlaying = false,
    title = "Devotional Audio",
    backHref = "/",
    showNav = true,
    onBack,
    playlistTitle = "Up Next",
    playlistTabs = [
        { id: 'upnext', label: 'Up Next' },
        { id: 'chapters', label: 'Chapters' },
        { id: 'related', label: 'Related' }
    ],
    activeTab: externalActiveTab,
    onTabChange
}: AudioPlayerProps) {
    const [internalActiveTab, setInternalActiveTab] = useState<'upnext' | 'chapters' | 'related'>('upnext');
    const activeTab = externalActiveTab || internalActiveTab;

    const [volume, setVolume] = useState(60);
    const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
    const [currentTime, setCurrentTime] = useState('12:45');
    const [progress, setProgress] = useState(35);

    const handleTabChange = (tabId: any) => {
        if (onTabChange) {
            onTabChange(tabId);
        } else {
            setInternalActiveTab(tabId);
        }
    };

    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);

    const handlePrevious = () => {
        if (currentIndex > 0 && onTrackChange) {
            onTrackChange(playlist[currentIndex - 1]);
        }
    };

    const handleNext = () => {
        if (currentIndex < playlist.length - 1 && onTrackChange) {
            onTrackChange(playlist[currentIndex + 1]);
        }
    };

    const toggleSpeed = () => {
        const speeds = [1.0, 1.25, 1.5, 1.75, 2.0];
        const currentSpeedIndex = speeds.indexOf(playbackSpeed);
        const nextSpeed = speeds[(currentSpeedIndex + 1) % speeds.length];
        setPlaybackSpeed(nextSpeed);
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark font-display transition-colors duration-300">
            {/* Top Navigation */}
            {showNav && (
                <nav className="w-full border-b border-[#f3efe7] dark:border-[#3a3222] bg-white/80 dark:bg-card-dark/80 backdrop-blur-md sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Left: Back & Branding */}
                            <div className="flex items-center gap-4">
                                {onBack ? (
                                    <button onClick={onBack} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                                        <span className="material-symbols-outlined text-2xl">arrow_back</span>
                                    </button>
                                ) : (
                                    <Link href={backHref} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                                        <span className="material-symbols-outlined text-2xl">arrow_back</span>
                                    </Link>
                                )}
                                <div className="hidden sm:flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-2xl">temple_hindu</span>
                                    <h1 className="text-lg font-bold tracking-tight">{title}</h1>
                                </div>
                            </div>
                            {/* Center: Status */}
                            <div className="hidden md:block">
                                <span className="text-xs font-medium uppercase tracking-widest text-text-muted-light dark:text-text-muted-dark">
                                    Now Playing
                                </span>
                            </div>
                            {/* Right: Actions */}
                            <div className="flex items-center gap-2">
                                <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-text-muted-light dark:text-text-muted-dark hover:text-primary">
                                    <span className="material-symbols-outlined">search</span>
                                </button>
                                <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-text-muted-light dark:text-text-muted-dark hover:text-primary">
                                    <span className="material-symbols-outlined">settings</span>
                                </button>
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs shadow-sm ml-2">
                                    AD
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            )}

            {/* Main Content Area */}
            <main className="flex-grow flex flex-col items-center justify-start py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full gap-8 lg:gap-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full h-full">
                    {/* Left Column: Player */}
                    <div className="lg:col-span-7 flex flex-col justify-center">
                        <div className="sticky top-24 space-y-8">
                            {/* Album Art & Header Info */}
                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className="relative group w-full max-w-[320px] sm:max-w-[400px] aspect-square shadow-xl shadow-primary/10 rounded-2xl overflow-hidden bg-card-light dark:bg-card-dark border border-[#f3efe7] dark:border-[#3a3222]">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                        style={{ backgroundImage: `url('${currentTrack.coverImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaBIAbqYA15NoImCCnjyiZJQFyl8vLS0z0_WV_b4IxO3GYxm7cGFMZiK8UqwljYA7dNat72vwV6_m8LF5jY_5uOX1vQr7k5LkfYoNjbGvtwyYjsvbS2eWS-tDn7g_SIUqi_2lc0hq863M3zwVXsVTlyLejkJBz23JFbWSlguY1M27MffC4siqjqI9_ofGH5XgvJqi8q7iDYE8DSmgmpAfapR-YqaAq7DN6EbkH977TYXUOpdnHpLkc5oRfyBVdHu-b3iZKbxYIkNZi'}')` }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                </div>
                                <div className="space-y-2 max-w-lg">
                                    <h1 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight text-text-main-light dark:text-text-main-dark">
                                        {currentTrack.title}
                                    </h1>
                                    <h2 className="text-lg text-text-muted-light dark:text-text-muted-dark font-medium">
                                        {currentTrack.artist || 'Hare Krishna'}
                                    </h2>
                                </div>
                            </div>

                            {/* Main Player Controls Card */}
                            <div className="bg-card-light dark:bg-card-dark rounded-3xl p-6 sm:p-8 shadow-sm border border-[#f3efe7] dark:border-[#3a3222] w-full">
                                {/* Progress Bar Section */}
                                <div className="flex flex-col gap-2 mb-8 group/progress">
                                    <div className="flex justify-between items-end text-xs font-medium text-text-muted-light dark:text-text-muted-dark mb-1">
                                        <span>{currentTime}</span>
                                        <span>{currentTrack.duration}</span>
                                    </div>
                                    {/* Visual Progress Bar */}
                                    <div className="relative h-2 bg-[#e7dfcf] dark:bg-[#4a4030] rounded-full cursor-pointer overflow-hidden">
                                        <div className="absolute top-0 left-0 h-full bg-primary rounded-full" style={{ width: `${progress}%` }}></div>
                                        <div className="absolute top-0 left-0 h-full bg-white/20 opacity-0 group-hover/progress:opacity-100 transition-opacity" style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>

                                {/* Main Buttons */}
                                <div className="flex items-center justify-between gap-4 sm:gap-8 mb-8 max-w-md mx-auto">
                                    {/* Shuffle */}
                                    <button className="text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors p-2 hidden sm:block">
                                        <span className="material-symbols-outlined text-2xl">shuffle</span>
                                    </button>
                                    {/* Skip Back 10s */}
                                    <button aria-label="Rewind 10 seconds" className="text-text-main-light dark:text-text-main-dark hover:text-primary transition-colors p-2">
                                        <span className="material-symbols-outlined text-3xl">replay_10</span>
                                    </button>
                                    {/* Previous Chapter */}
                                    <button onClick={handlePrevious} disabled={currentIndex === 0} className="text-text-main-light dark:text-text-main-dark hover:text-primary transition-colors p-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                        <span className="material-symbols-outlined text-4xl">skip_previous</span>
                                    </button>
                                    {/* Play/Pause (Hero Button) */}
                                    <button onClick={onPlayPause} className="bg-primary hover:bg-primary-hover text-white rounded-full p-4 sm:p-5 shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-4xl sm:text-5xl fill-current">
                                            {isPlaying ? 'pause' : 'play_arrow'}
                                        </span>
                                    </button>
                                    {/* Next Chapter */}
                                    <button onClick={handleNext} disabled={currentIndex === playlist.length - 1} className="text-text-main-light dark:text-text-main-dark hover:text-primary transition-colors p-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                        <span className="material-symbols-outlined text-4xl">skip_next</span>
                                    </button>
                                    {/* Skip Forward 30s */}
                                    <button aria-label="Fast forward 30 seconds" className="text-text-main-light dark:text-text-main-dark hover:text-primary transition-colors p-2">
                                        <span className="material-symbols-outlined text-3xl">forward_30</span>
                                    </button>
                                    {/* Repeat */}
                                    <button className="text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors p-2 hidden sm:block">
                                        <span className="material-symbols-outlined text-2xl">repeat</span>
                                    </button>
                                </div>

                                {/* Secondary Controls (Volume, Speed, Like) */}
                                <div className="flex items-center justify-between border-t border-[#f3efe7] dark:border-[#3a3222] pt-6">
                                    {/* Volume */}
                                    <div className="flex items-center gap-3 w-1/3 group/volume">
                                        <button className="text-text-muted-light dark:text-text-muted-dark group-hover/volume:text-primary transition-colors">
                                            <span className="material-symbols-outlined">volume_up</span>
                                        </button>
                                        <div className="h-1 bg-[#e7dfcf] dark:bg-[#4a4030] rounded-full flex-1 cursor-pointer relative">
                                            <div className="absolute h-full bg-text-muted-light dark:bg-text-muted-dark group-hover/volume:bg-primary transition-colors rounded-full" style={{ width: `${volume}%` }}></div>
                                        </div>
                                    </div>
                                    {/* Speed Toggle */}
                                    <button onClick={toggleSpeed} className="px-3 py-1.5 rounded-lg border border-[#e7dfcf] dark:border-[#4a4030] text-sm font-medium text-text-main-light dark:text-text-main-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors flex items-center gap-1">
                                        <span>{playbackSpeed}x</span>
                                    </button>
                                    {/* Actions */}
                                    <div className="flex items-center gap-4">
                                        <button className="text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors flex flex-col items-center gap-1" title="Add to Favorites">
                                            <span className="material-symbols-outlined">favorite</span>
                                        </button>
                                        <button className="text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors flex flex-col items-center gap-1 sm:hidden">
                                            <span className="material-symbols-outlined">queue_music</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Playlist / Up Next */}
                    <div className="lg:col-span-5 flex flex-col h-full overflow-hidden mt-8 lg:mt-0">
                        <div className="bg-card-light dark:bg-card-dark rounded-3xl shadow-sm border border-[#f3efe7] dark:border-[#3a3222] flex flex-col h-full max-h-[800px]">
                            {/* Playlist Header */}
                            <div className="p-6 border-b border-[#f3efe7] dark:border-[#3a3222] flex items-center justify-between bg-background-light/50 dark:bg-background-dark/30 rounded-t-3xl">
                                <div className="flex gap-6 overflow-x-auto no-scrollbar">
                                    {playlistTabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => handleTabChange(tab.id)}
                                            className={`text-sm font-bold pb-4 -mb-[25px] transition-colors whitespace-nowrap ${activeTab === tab.id
                                                    ? 'text-primary border-b-2 border-primary'
                                                    : 'text-text-muted-light dark:text-text-muted-dark hover:text-text-main-light dark:hover:text-text-main-dark'
                                                }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Scrollable List */}
                            <div className="overflow-y-auto flex-1 p-2 space-y-1">
                                {playlist.map((track, index) => {
                                    const isCurrentTrack = track.id === currentTrack.id;
                                    const isPastTrack = index < currentIndex;

                                    return (
                                        <div
                                            key={track.id}
                                            onClick={() => onTrackChange?.(track)}
                                            className={`group flex items-center gap-4 p-3 rounded-xl transition-colors cursor-pointer ${isCurrentTrack
                                                    ? 'bg-primary/10 dark:bg-primary/5 border border-primary/20'
                                                    : isPastTrack
                                                        ? 'opacity-60 hover:opacity-100 hover:bg-background-light dark:hover:bg-background-dark/50'
                                                        : 'hover:bg-background-light dark:hover:bg-background-dark/50'
                                                }`}
                                        >
                                            <div className={`size-10 rounded-lg flex items-center justify-center ${isCurrentTrack
                                                    ? 'bg-primary text-white shadow-md'
                                                    : 'bg-[#e7dfcf] dark:bg-[#3a3222] text-text-muted-light group-hover:text-text-main-light dark:group-hover:text-text-main-dark'
                                                }`}>
                                                {isCurrentTrack ? (
                                                    <div className="flex items-end gap-[2px] h-4">
                                                        <span className="w-1 bg-white h-2 rounded-full animate-pulse"></span>
                                                        <span className="w-1 bg-white h-4 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></span>
                                                        <span className="w-1 bg-white h-3 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs font-bold">{String(track.chapter || index + 1).padStart(2, '0')}</span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className={`text-sm font-medium truncate ${isCurrentTrack ? 'font-bold text-primary' : 'text-text-main-light dark:text-text-main-dark'
                                                    }`}>
                                                    {track.title}
                                                </h4>
                                                <p className="text-xs text-text-muted-light dark:text-text-muted-dark capitalize">
                                                    {track.category || currentTrack.category || 'Audio'} • {isCurrentTrack ? 'Playing' : track.duration}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {track.isCompleted && !isCurrentTrack && (
                                                    <span className="material-symbols-outlined text-green-600 text-lg" title="Completed">check_circle</span>
                                                )}
                                                {isCurrentTrack && (
                                                    <span className="text-xs font-mono text-primary font-medium">{currentTime}</span>
                                                )}
                                                {!isCurrentTrack && !isPastTrack && (
                                                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                                                        <span className="material-symbols-outlined text-lg text-text-muted-light">play_arrow</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
