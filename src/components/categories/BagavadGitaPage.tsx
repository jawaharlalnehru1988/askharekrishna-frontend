"use client";

import Link from "next/link";
import { useState } from "react";
import { getDictionary } from "@/lib/dictionaries";
import { TOPICS, type Topic, type AudioItem } from "@/lib/bhagavad-gita-data";

export default function BagavadGitaPage({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>> }) {
    const { common: c, bhagavadGita: bg } = dictionary;

    const localizedTopics = TOPICS.map(topic => {
        const topicKey = topic.audioListId === 1 ? 'slokaRecitation' :
            topic.audioListId === 2 ? 'slokaWithMeaning' :
                topic.audioListId === 3 ? 'importantSlokas' :
                    topic.audioListId === 4 ? 'qAndA' :
                        topic.audioListId === 5 ? 'mahatmya' :
                            topic.audioListId === 6 ? 'summaries' : '';

        const t = bg.topics[topicKey as keyof typeof bg.topics];
        return {
            ...topic,
            title: t?.title || topic.title,
            description: t?.description || topic.description
        };
    });

    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-text-main font-display antialiased transition-colors duration-200">
            {/* Main Content */}
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="group relative overflow-hidden rounded-2xl bg-surface-dark shadow-lg">
                        {/* Background Image with Overlay */}
                        <div className="absolute inset-0 z-0">
                            <div className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAtawC1skJ5MnedAs_5kbZSoAmOEicBIDipAW_QuZuZSc5crmD2nTg1Z-D01ll_pwBMCbEIMhmldZ_C-0Olq0HFM1Wk4a89E1FZw0OoDwwFfSDk6E6rpD5MDJpLsTs1QSvwODwXFhrc1k8LroeRgPKFu-HCR9GE3ECiqpSvE2JminUrOP8lIRLxUeGfh0tsxQtWbOulLDbXkEidFIrDvfVhkiR7rjsr71sckBVIZfcflTet9xHLYytiUurje0pLmaffDleZ8q0BFWJ4")' }}
                            >
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
                        </div>
                        {/* Content */}
                        <div className="relative z-10 flex min-h-[400px] flex-col justify-center gap-6 px-8 py-12 sm:px-12 md:w-3/4 lg:w-1/2">
                            <div className="space-y-2">
                                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary">
                                    <span className="material-symbols-outlined text-sm icon-fill">auto_stories</span>
                                    {bg.hero.sacredText}
                                </span>
                                <h2 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                                    {bg.title}
                                </h2>
                                <p className="text-lg font-medium text-gray-200">
                                    {bg.description}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <button className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-bold text-text-main transition-transform hover:scale-105 hover:bg-primary-dark shadow-md">
                                    <span className="material-symbols-outlined icon-fill">play_arrow</span>
                                    {bg.hero.startListening}
                                </button>
                                <button className="flex items-center justify-center gap-2 rounded-lg bg-white/10 px-6 py-3 text-base font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20">
                                    <span className="material-symbols-outlined">info</span>
                                    {bg.hero.learnMore}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Headline */}
                <section className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between border-b border-[#f3efe7] pb-4 dark:border-white/10">
                        <h3 className="text-2xl font-bold text-text-main dark:text-white">{bg.browseTopics}</h3>
                        <Link href="#" className="hidden sm:flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-dark">
                            {bg.viewAll}
                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </Link>
                    </div>
                </section>

                {/* Topic Grid */}
                <section className="mx-auto mt-6 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {localizedTopics.map((topic, index) => (
                            <Link key={index} href={topic.href} className="group flex flex-col overflow-hidden rounded-xl bg-surface-light shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:bg-surface-dark border border-transparent hover:border-primary/30">
                                <div className="relative aspect-video w-full overflow-hidden bg-accent-cream">
                                    <div className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                        style={{ backgroundImage: `url("${topic.image}")` }}>
                                    </div>
                                    {/* Play Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                                        <div className="flex size-12 items-center justify-center rounded-full bg-primary text-text-main shadow-lg">
                                            <span className="material-symbols-outlined icon-fill">play_arrow</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col justify-between p-5">
                                    <div>
                                        <h4 className="text-lg font-bold text-text-main dark:text-white group-hover:text-primary transition-colors">
                                            {topic.title}
                                        </h4>
                                        <p className="mt-2 text-sm text-text-muted dark:text-gray-400 line-clamp-2">
                                            {topic.description}
                                        </p>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary">
                                        <span>{bg.listenNow}</span>
                                        <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>

            {/* Sticky Player (Active State) */}
            <div className="sticky bottom-0 z-40 w-full border-t border-accent-cream bg-surface-light px-4 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] dark:border-white/5 dark:bg-[#252016]">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                    {/* Track Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-accent-cream">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img alt={bg.player.albumArtAlt} className="h-full w-full object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnOOrKiBad3c2GwyricGAjGPbJYBR_v7qvGrI4RITayWZqQa8ba0pLK84Q7ITmUqeo-EkW6fURCJr3yd2gBDH3W8myBKVfmNl3x9T6KOczYzerNNCrFr_rcBWchzJYYfGODuittQr0-kFS9dqGHTdorINuWqH3wsCcXfcY31UYYfddJ9GlgIBoWwAG6cb7HFhzlHb7o7vUeMo5QXzBhJeRbw0Qqg55ACudL2MPuDnayw-jt_9MPwNuEY2EIxL8DzRA5kzYnBaonkra" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="truncate text-sm font-bold text-text-main dark:text-white">{bg.player.trackTitle}</p>
                            <p className="truncate text-xs text-text-muted">{bg.player.book}</p>
                        </div>
                    </div>
                    {/* Player Controls */}
                    <div className="hidden md:flex flex-col items-center gap-1 flex-1">
                        <div className="flex items-center gap-6">
                            <button className="text-text-muted hover:text-text-main dark:hover:text-white">
                                <span className="material-symbols-outlined">skip_previous</span>
                            </button>
                            <button className="flex size-10 items-center justify-center rounded-full bg-primary text-text-main shadow hover:scale-105 hover:bg-primary-dark transition-all">
                                <span className="material-symbols-outlined icon-fill">play_arrow</span>
                            </button>
                            <button className="text-text-muted hover:text-text-main dark:hover:text-white">
                                <span className="material-symbols-outlined">skip_next</span>
                            </button>
                        </div>
                        {/* Progress Bar */}
                        <div className="flex w-full max-w-xs items-center gap-2 text-[10px] text-text-muted font-medium">
                            <span>1:17</span>
                            <div className="h-1 flex-1 overflow-hidden rounded-full bg-accent-cream dark:bg-white/10">
                                <div className="h-full w-1/3 rounded-full bg-primary"></div>
                            </div>
                            <span>12:23</span>
                        </div>
                    </div>
                    {/* Volume / Options */}
                    <div className="hidden sm:flex items-center justify-end gap-3 flex-1">
                        <button className="text-text-muted hover:text-text-main dark:hover:text-white">
                            <span className="material-symbols-outlined text-xl">playlist_play</span>
                        </button>
                        <button className="text-text-muted hover:text-text-main dark:hover:text-white">
                            <span className="material-symbols-outlined text-xl">volume_up</span>
                        </button>
                        <button className="sm:hidden md:hidden lg:hidden text-text-main bg-primary p-2 rounded-full">
                            <span className="material-symbols-outlined icon-fill">play_arrow</span>
                        </button>
                    </div>
                    {/* Mobile Play Button (Visible only on mobile) */}
                    <button className="flex md:hidden size-10 items-center justify-center rounded-full bg-primary text-text-main shadow">
                        <span className="material-symbols-outlined icon-fill">play_arrow</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
