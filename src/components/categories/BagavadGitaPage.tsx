"use client";

import Link from "next/link";
import { useState } from "react";
import { TOPICS, type Topic, type AudioItem } from "@/lib/bhagavad-gita-data";

const defaultItems: AudioItem[] = [
    {
        id: 1,
        audioListId: 1,
        title: "Chapter 1: Observing the Armies",
        description: "The armies of the Pandavas and Kauravas assemble on the battlefield.",
        language: "English",
        duration: "45:00",
        audioUrl: "https://example.com/audio/1.mp3",
        isPlaying: true
    },
    {
        id: 2,
        title: "Chapter 2: Contents of the Gita Summarized",
        description: "Arjuna surrenders to Lord Krishna and asks for instruction.",
        language: "English",
        duration: "58:20",
        audioUrl: "https://example.com/audio/2.mp3",
        audioListId: 1
    },
    {
        id: 3,
        title: "Chapter 3: Karma Yoga",
        description: "The path of selfless service and action without attachment.",
        language: "Hindi",
        duration: "42:15",
        audioUrl: "https://example.com/audio/3.mp3",
        audioListId: 1
    },
    {
        id: 4,
        title: "Chapter 4: Transcendental Knowledge",
        description: "Approaching a spiritual master and receiving knowledge.",
        language: "Bengali",
        duration: "48:10",
        audioUrl: "https://example.com/audio/4.mp3",
        audioListId: 1
    },
    {
        id: 5,
        title: "Chapter 5: Karma-yoga Action in Krishna Consciousness",
        description: "Performing action without desiring the fruits.",
        language: "English",
        duration: "39:45",
        audioUrl: "https://example.com/audio/5.mp3",
        audioListId: 1
    }
];

export default function BagavadGitaPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-text-main font-display antialiased transition-colors duration-200">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 w-full border-b border-[#f3efe7] bg-background-light/95 backdrop-blur-sm dark:bg-background-dark/95 dark:border-white/10">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Logo & Brand */}
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2 text-text-main dark:text-white">
                            <div className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                                <span className="material-symbols-outlined icon-fill">spa</span>
                            </div>
                            <h1 className="text-lg font-bold leading-tight tracking-tight">Hare Krishna Audio</h1>
                        </Link>
                    </div>
                    {/* Desktop Nav Links */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link className="text-sm font-medium text-text-main hover:text-primary transition-colors dark:text-gray-200" href="/">Home</Link>
                        <Link className="text-sm font-medium text-primary hover:text-primary-dark transition-colors dark:text-primary" href="/bhagavad-gita">Bhagavad Gita</Link>
                        <Link className="text-sm font-medium text-text-main hover:text-primary transition-colors dark:text-gray-200" href="#">Lectures</Link>
                        <Link className="text-sm font-medium text-text-main hover:text-primary transition-colors dark:text-gray-200" href="#">Kirtan</Link>
                    </nav>
                    {/* Search & Actions */}
                    <div className="flex items-center gap-4">
                        {/* Search Bar (Desktop) */}
                        <div className="hidden sm:flex w-full max-w-xs items-center rounded-lg bg-accent-cream dark:bg-surface-dark px-3 py-2 transition-colors focus-within:ring-2 focus-within:ring-primary/50">
                            <span className="material-symbols-outlined text-text-muted">search</span>
                            <input
                                className="ml-2 w-full bg-transparent text-sm text-text-main placeholder-text-muted focus:outline-none dark:text-white border-none p-0 focus:ring-0"
                                placeholder="Search topics..." type="text"
                            />
                        </div>
                        {/* Donate Button */}
                        <button className="hidden sm:flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-bold text-text-main hover:bg-primary-dark transition-colors shadow-sm">
                            Donate
                        </button>
                        {/* Mobile Menu Icon */}
                        <button className="sm:hidden text-text-main dark:text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                    </div>
                </div>
            </header>

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
                                    Sacred Text
                                </span>
                                <h2 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                                    Srimad Bhagavad Gita
                                </h2>
                                <p className="text-lg font-medium text-gray-200">
                                    The Song of God. Immerse yourself in the transcendental knowledge spoken by Lord Krishna
                                    to Arjuna on the battlefield of Kurukshetra.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <button className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-bold text-text-main transition-transform hover:scale-105 hover:bg-primary-dark shadow-md">
                                    <span className="material-symbols-outlined icon-fill">play_arrow</span>
                                    Start Listening
                                </button>
                                <button className="flex items-center justify-center gap-2 rounded-lg bg-white/10 px-6 py-3 text-base font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20">
                                    <span className="material-symbols-outlined">info</span>
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Headline */}
                <section className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between border-b border-[#f3efe7] pb-4 dark:border-white/10">
                        <h3 className="text-2xl font-bold text-text-main dark:text-white">Browse Topics</h3>
                        <Link href="#" className="hidden sm:flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-dark">
                            View All
                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </Link>
                    </div>
                </section>

                {/* Topic Grid */}
                <section className="mx-auto mt-6 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {TOPICS.map((topic, index) => (
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
                                        <span>Listen Now</span>
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
                            <img alt="Chapter 2 Art" className="h-full w-full object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnOOrKiBad3c2GwyricGAjGPbJYBR_v7qvGrI4RITayWZqQa8ba0pLK84Q7ITmUqeo-EkW6fURCJr3yd2gBDH3W8myBKVfmNl3x9T6KOczYzerNNCrFr_rcBWchzJYYfGODuittQr0-kFS9dqGHTdorINuWqH3wsCcXfcY31UYYfddJ9GlgIBoWwAG6cb7HFhzlHb7o7vUeMo5QXzBhJeRbw0Qqg55ACudL2MPuDnayw-jt_9MPwNuEY2EIxL8DzRA5kzYnBaonkra" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="truncate text-sm font-bold text-text-main dark:text-white">Chapter 2: Contents of the Gita Summarized</p>
                            <p className="truncate text-xs text-text-muted">Bhagavad Gita As It Is</p>
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
