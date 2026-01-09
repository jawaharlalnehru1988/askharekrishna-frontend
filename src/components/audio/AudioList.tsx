"use client";

import React, { useState } from 'react';

export interface AudioItem {
    id: number;
    title: string;
    description: string;
    language: string;
    duration: string;
    audioUrl: string;
    audioListId: number;
    isPlaying?: boolean;
}

interface AudioListProps {
    items: AudioItem[];
    showLanguageFilter?: boolean;
    showSortOptions?: boolean;
    onItemClick?: (item: AudioItem) => void;
    currentPlayingId?: number;
}

export function AudioList({
    items,
    showLanguageFilter = true,
    showSortOptions = true,
    onItemClick,
    currentPlayingId
}: AudioListProps) {
    const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
    const [sortBy, setSortBy] = useState<string>('chapter');

    // Extract unique languages from items
    const languages = ['All', ...Array.from(new Set(items.map(item => item.language)))];

    // Filter items based on selected language
    const filteredItems = selectedLanguage === 'All'
        ? items
        : items.filter(item => item.language === selectedLanguage);

    return (
        <div className="w-full">
            {/* Filters & Controls */}
            {(showLanguageFilter || showSortOptions) && (
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6 sticky top-16 z-30 bg-background-light/95 dark:bg-background-dark/95 py-4 backdrop-blur-sm -mx-4 px-4 sm:mx-0 sm:px-0">
                    {/* Language Chips */}
                    {showLanguageFilter && languages.length > 1 && (
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto no-scrollbar">
                            {languages.map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => setSelectedLanguage(lang)}
                                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedLanguage === lang
                                        ? 'bg-text-main text-white'
                                        : 'bg-white dark:bg-surface-dark border border-[#e7dfcf] dark:border-gray-700 text-text-main dark:text-gray-300 hover:border-primary hover:text-primary'
                                        }`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Sort/Filter */}
                    {showSortOptions && (
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative flex-grow sm:flex-grow-0 group">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none bg-white dark:bg-surface-dark border border-[#e7dfcf] dark:border-gray-700 rounded-lg pl-4 pr-10 py-2 text-sm text-text-main dark:text-white focus:outline-none focus:ring-1 focus:ring-primary w-full cursor-pointer hover:border-gray-400 transition-colors"
                                >
                                    <option value="chapter">Sort by: Chapter</option>
                                    <option value="duration">Sort by: Duration</option>
                                    <option value="newest">Sort by: Newest</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none text-[20px]">
                                    sort
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Content Area: Audio List */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-soft dark:shadow-none dark:border dark:border-gray-800 overflow-hidden">
                {/* List Header (Desktop) */}
                <div className="hidden md:grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-6 py-4 border-b border-[#f3efe7] dark:border-gray-700 text-xs font-bold uppercase tracking-wider text-text-muted">
                    <div className="w-8 text-center">#</div>
                    <div>Title</div>
                    <div className="w-32">Language</div>
                    <div className="w-24 text-right">Duration</div>
                    <div className="w-12"></div>
                </div>

                {/* List Items */}
                <div className="divide-y divide-[#f3efe7] dark:divide-gray-800">
                    {filteredItems.map((item) => {
                        const isPlaying = currentPlayingId === item.id;

                        return (
                            <div
                                key={item.id}
                                onClick={() => onItemClick?.(item)}
                                className={`group flex md:grid md:grid-cols-[auto_1fr_auto_auto_auto] gap-4 p-4 md:px-6 md:py-4 items-center hover:bg-[#faf9f6] dark:hover:bg-gray-800/50 transition-colors cursor-pointer ${isPlaying ? 'bg-primary/5 dark:bg-primary/10' : ''
                                    }`}
                            >
                                {/* Play Icon / Number */}
                                <div className="w-8 shrink-0 flex justify-center items-center">
                                    {isPlaying ? (
                                        <span className="material-symbols-outlined text-primary icon-filled animate-pulse">
                                            equalizer
                                        </span>
                                    ) : (
                                        <>
                                            <span className="text-text-muted font-medium text-sm group-hover:hidden">
                                                {String(item.id).padStart(2, '0')}
                                            </span>
                                            <span className="material-symbols-outlined icon-filled text-primary hidden group-hover:block">
                                                play_arrow
                                            </span>
                                        </>
                                    )}
                                </div>

                                {/* Title & Meta */}
                                <div className="flex-grow min-w-0 flex flex-col justify-center">
                                    <p className={`font-bold text-base truncate ${isPlaying
                                        ? 'text-primary'
                                        : 'text-text-main dark:text-gray-200 group-hover:text-primary'
                                        } transition-colors`}>
                                        {item.title}
                                    </p>
                                    <p className="text-xs text-text-muted md:hidden mt-1">
                                        {item.duration} • {item.language}
                                    </p>
                                    <p className="text-sm text-text-muted hidden md:block truncate">
                                        {item.description}
                                    </p>
                                </div>

                                {/* Language (Desktop) */}
                                <div className="hidden md:flex w-32 items-center">
                                    <span className="px-2.5 py-0.5 rounded-full bg-background-light dark:bg-gray-700 border border-[#e7dfcf] dark:border-gray-600 text-xs font-medium text-text-muted dark:text-gray-300">
                                        {item.language}
                                    </span>
                                </div>

                                {/* Duration (Desktop) */}
                                <div className="hidden md:block w-24 text-right text-sm text-text-muted font-medium font-mono">
                                    {item.duration}
                                </div>

                                {/* Actions */}
                                <div className="w-12 flex justify-end">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Handle more options
                                        }}
                                        className={`text-text-muted hover:text-text-main dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${isPlaying ? '' : 'opacity-0 group-hover:opacity-100'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined">more_vert</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Load More */}
                <div className="p-4 border-t border-[#f3efe7] dark:border-gray-700 flex justify-center">
                    <button className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors flex items-center gap-1">
                        Load more chapters
                        <span className="material-symbols-outlined text-[18px]">expand_more</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
