"use client";

import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";

const PURANAS = [
    {
        id: "srimad-bhagavatam",
        title: "Srimad Bhagavatam",
        verses: "18,000 Verses",
        category: "Maha Purana",
        categoryColor: "text-primary bg-primary/10 ring-primary/20",
        description: "The pristine glory of the Lord. The amala purana, spotless and pure.",
        duration: "12h 45m",
        imageColor: "bg-[#fff8e6] dark:bg-[#2e2616]",
        icon: "menu_book",
        iconColor: "text-primary/40",
    },
    {
        id: "garuda-puranam",
        title: "Garuda Puranam",
        verses: "19,000 Verses",
        category: "Vaishnava",
        categoryColor: "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 ring-blue-700/10 dark:ring-blue-300/20",
        description: "Conversations between Lord Vishnu and Garuda on the afterlife.",
        duration: "12h 45m",
        imageColor: "bg-[#eefcfc] dark:bg-[#162929]",
        icon: "flight",
        iconColor: "text-[#5c9ea0]/40",
    },
    {
        id: "vishnu-puranam",
        title: "Vishnu Puranam",
        verses: "23,000 Verses",
        category: "Sattvic",
        categoryColor: "text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 ring-purple-700/10 dark:ring-purple-300/20",
        description: "Detailed accounts of the ten avatars of Lord Vishnu.",
        duration: "18h 20m",
        imageColor: "bg-[#fceeff] dark:bg-[#2d162e]",
        icon: "spa",
        iconColor: "text-[#a05c9e]/40",
    },
    {
        id: "padma-puranam",
        title: "Padma Puranam",
        verses: "55,000 Verses",
        category: "Ancient",
        categoryColor: "text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30 ring-red-700/10 dark:ring-red-300/20",
        description: "The second largest Purana, detailing cosmology and devotion.",
        duration: "24h 10m",
        imageColor: "bg-[#fff2f2] dark:bg-[#2e1a1a]",
        icon: "local_florist",
        iconColor: "text-[#a05c5c]/40",
    },
    {
        id: "brahma-vaivarta",
        title: "Brahma Vaivarta",
        verses: null,
        category: "Creation",
        categoryColor: "text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-900/30 ring-sky-700/10 dark:ring-sky-300/20",
        description: "Describes the creation of the universe and Krishna's pastimes.",
        duration: "16h 35m",
        imageColor: "bg-[#f0f9ff] dark:bg-[#1a262e]",
        icon: "water_drop",
        iconColor: "text-[#5c8ca0]/40",
    },
    {
        id: "bhavishya-puranam",
        title: "Bhavishya Puranam",
        verses: null,
        category: "Prophecy",
        categoryColor: "text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/30 ring-yellow-700/10 dark:ring-yellow-300/20",
        description: "Contains prophecies regarding the future of the world.",
        duration: "9h 15m",
        imageColor: "bg-[#fffdf0] dark:bg-[#2e2b1a]",
        icon: "visibility",
        iconColor: "text-[#a0955c]/40",
    },

];

export default function PuranamsPage() {
    // We can add state for the audio player later, for now we render the UI as static-ish like the reference
    return (
        <div className="flex flex-col min-h-screen">
            {/* Main Content */}
            <main className="flex-1 w-full px-4 py-8 md:px-10 lg:px-20">
                <div className="mx-auto max-w-[1280px]">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 pb-6 text-sm">
                        <Link href="/" className="text-text-sub-light dark:text-text-sub-dark hover:underline">
                            Home
                        </Link>
                        <span className="text-text-sub-light dark:text-text-sub-dark">/</span>
                        <span className="font-medium text-primary">Puranams</span>
                    </div>

                    {/* Page Heading */}
                    <div className="mb-10">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-text-main-light dark:text-text-main-dark mb-3">
                            Sacred Puranams
                        </h1>
                        <p className="text-lg text-text-sub-light dark:text-text-sub-dark max-w-2xl">
                            Timeless wisdom for the modern soul. Dive into the ancient histories of the universe and reconnect with the divine.
                        </p>
                    </div>

                    {/* Controls: Search & Chips */}
                    <div className="flex flex-col lg:flex-row gap-6 mb-10 items-start lg:items-center justify-between">
                        {/* Search Bar */}
                        <div className="w-full lg:max-w-md">
                            <label className="relative flex w-full items-center">
                                <span className="absolute left-4 text-text-sub-light dark:text-text-sub-dark material-symbols-outlined">
                                    search
                                </span>
                                <input
                                    className="w-full rounded-xl border-none bg-surface-light dark:bg-surface-dark py-3 pl-12 pr-4 text-text-main-light dark:text-text-main-dark shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-[#3a3020] placeholder:text-text-sub-light dark:placeholder:text-[#6b5d40] focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                    placeholder="Search for a Purana (e.g., Srimad Bhagavatam)..."
                                    type="text"
                                />
                            </label>
                        </div>

                        {/* Filter Chips */}
                        <div className="flex flex-wrap gap-2">
                            <button className="rounded-xl bg-primary text-white px-5 py-2 text-sm font-medium shadow-sm hover:opacity-90 transition-opacity">
                                All
                            </button>
                            <button className="rounded-xl bg-surface-light dark:bg-surface-dark text-text-main-light dark:text-text-main-dark ring-1 ring-inset ring-gray-200 dark:ring-[#3a3020] px-5 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#352b1b] transition-colors">
                                Popular
                            </button>
                            <button className="rounded-xl bg-surface-light dark:bg-surface-dark text-text-main-light dark:text-text-main-dark ring-1 ring-inset ring-gray-200 dark:ring-[#3a3020] px-5 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#352b1b] transition-colors">
                                Recent
                            </button>
                            <button className="rounded-xl bg-surface-light dark:bg-surface-dark text-text-main-light dark:text-text-main-dark ring-1 ring-inset ring-gray-200 dark:ring-[#3a3020] px-5 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#352b1b] transition-colors">
                                Favorites
                            </button>
                        </div>
                    </div>

                    {/* Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {PURANAS.map((purana) => (
                            <div
                                key={purana.id}
                                className="group relative flex flex-col overflow-hidden rounded-xl bg-surface-light dark:bg-surface-dark shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-primary/20 cursor-pointer"
                            >
                                <div className={`relative h-48 w-full overflow-hidden ${purana.imageColor}`}>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:scale-105 transition-transform duration-500">
                                        <span className={`material-symbols-outlined text-[120px] ${purana.iconColor}`}>
                                            {purana.icon}
                                        </span>
                                    </div>
                                    <div className="absolute top-3 right-3 rounded-full bg-white/90 dark:bg-black/40 p-1.5 backdrop-blur-sm shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-primary text-xl">favorite</span>
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col p-5">
                                    <div className="mb-2 flex items-center gap-2">
                                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${purana.categoryColor}`}>
                                            {purana.category}
                                        </span>
                                        {purana.verses && (
                                            <span className="text-xs text-text-sub-light dark:text-text-sub-dark">
                                                • {purana.verses}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="mb-1 text-xl font-bold text-text-main-light dark:text-text-main-dark">
                                        {purana.title}
                                    </h3>
                                    <p className="mb-6 line-clamp-2 text-sm text-text-sub-light dark:text-text-sub-dark">
                                        {purana.description}
                                    </p>
                                    <div className="mt-auto flex items-center justify-between">
                                        {purana.id === 'srimad-bhagavatam' ? (
                                            /* Example of specific card usage for Srimad Bhagavatam with avatars */
                                            <>
                                                <div className="flex -space-x-2 overflow-hidden">
                                                    <div
                                                        className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-surface-dark bg-gray-200 bg-cover bg-center"
                                                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD9DJbm2z-XVyXoNj7O0B5X-ogfPzfB1uc5Fad7WmIgV8zp1w1ljqi9MjfbgX9XbvDLzJ3cc51o4Zeh46rTHyRgJG26iZonEKFeGyNcrZyAAyixVhCn4gXNrfiRyh59YdFjRZoShr2Hy0_niweutmi0SnV95hvKBlkpQM99jt-f14z14p5gwlgO5uaebx-7m7Ahox53nX4Km1e0FtDhU4TW8b0ERAbTySsCIQJDvb7cnS3nxqdOXR-b7NE5KlwHDEMnxQZTV4tkN5L2")' }}
                                                    />
                                                    <div
                                                        className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-surface-dark bg-gray-300 bg-cover bg-center"
                                                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBXwbZs_C3sUMmY6SIhXsKnkBzHjUMTrnIs11UDpIWx0DsMoKkq5QcmWROBZq9svgcRNzPH_Rn8HF0QtFiFSxMsYdI3744gQB-J2Lvhd54PmMwzF5uGRQ_AZiIwuG6G93PEzWG5hEIASnfj9BTdaEiKpvsN-A0zTD_P0-Z9HYv2qttc6Sr3Vef3-29bfKsN7Ags8K8V9NhGBUYxV25CXQa0ZWR5slVIP_5xOlP383NVQzWhlhe95tpKu49T1Gg_f4nVqpBbYze5yu3J")' }}
                                                    />
                                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 ring-2 ring-white dark:bg-[#3a3020] dark:ring-surface-dark">
                                                        <span className="text-[10px] font-medium text-gray-500">+1k</span>
                                                    </div>
                                                </div>
                                                <button className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-primary/90 transition-colors">
                                                    <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                                                    Listen
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-xs font-medium text-text-sub-light dark:text-text-sub-dark">
                                                    {purana.duration}
                                                </span>
                                                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
                                                    <span className="material-symbols-outlined">play_arrow</span>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination/Load More */}
                    <div className="mt-16 flex justify-center">
                        <button className="flex items-center gap-2 rounded-xl border border-[#e5e0d5] dark:border-[#3a3020] bg-surface-light dark:bg-surface-dark px-6 py-3 text-sm font-medium text-text-main-light dark:text-text-main-dark hover:bg-gray-50 dark:hover:bg-[#352b1b] transition-colors shadow-sm">
                            Load More Puranams
                            <span className="material-symbols-outlined text-sm">expand_more</span>
                        </button>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Sticky Audio Player Footer */}
            <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#f3efe7] dark:border-[#3a3020] bg-surface-light dark:bg-surface-dark shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-4 lg:px-10">
                    {/* Track Info */}
                    <div className="flex items-center gap-4 w-1/4">
                        <div
                            className="h-12 w-12 rounded-lg bg-gray-200 bg-cover bg-center shadow-inner"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC1OewrWbQM5pFoyqgoa77vQVY52PuFPJDbZ9P1sL5bW5HJG8XSE2pgw0r9atpumCmRVKzyEUETnqzrMyvGgiNR3QPDzn4hYTd7w3uCCsh2ECnDxMfLw82Jq51kK7wLs2N78r1MXmu93VyxYBXVtfAyria8GIG5Aeq-qGpa8cfg6LdO5jcWowi5EUtNmWNQnL-LAyoChMJpBGWrC5Ispw0E-lByiL_E5T1LITFM673QeuscytBOVp2tewHfSVesYgRkNjFZQNuCpSvP")' }}
                        />
                        <div className="hidden sm:block">
                            <p className="text-sm font-semibold text-text-main-light dark:text-text-main-dark truncate">
                                Canto 1, Chapter 1
                            </p>
                            <p className="text-xs text-text-sub-light dark:text-text-sub-dark truncate">
                                Srimad Bhagavatam
                            </p>
                        </div>
                    </div>

                    {/* Player Controls */}
                    <div className="flex flex-col items-center justify-center gap-1 w-2/4">
                        <div className="flex items-center gap-6">
                            <button className="text-text-sub-light dark:text-text-sub-dark hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">shuffle</span>
                            </button>
                            <button className="text-text-main-light dark:text-text-main-dark hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-3xl">skip_previous</span>
                            </button>
                            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-md hover:scale-105 transition-transform">
                                <span className="material-symbols-outlined filled">play_arrow</span>
                            </button>
                            <button className="text-text-main-light dark:text-text-main-dark hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-3xl">skip_next</span>
                            </button>
                            <button className="text-text-sub-light dark:text-text-sub-dark hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">repeat</span>
                            </button>
                        </div>
                        {/* Progress Bar */}
                        <div className="flex w-full max-w-md items-center gap-3 text-xs text-text-sub-light dark:text-text-sub-dark">
                            <span>1:04</span>
                            <div className="relative h-1 w-full rounded-full bg-gray-200 dark:bg-[#3a3020]">
                                <div className="absolute h-full w-1/3 rounded-full bg-primary"></div>
                            </div>
                            <span>12:45</span>
                        </div>
                    </div>

                    {/* Volume / Options */}
                    <div className="flex items-center justify-end gap-4 w-1/4">
                        <button className="text-text-sub-light dark:text-text-sub-dark hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">playlist_play</span>
                        </button>
                        <div className="hidden md:flex items-center gap-2">
                            <span className="material-symbols-outlined text-text-sub-light dark:text-text-sub-dark text-lg">
                                volume_up
                            </span>
                            <div className="h-1 w-20 rounded-full bg-gray-200 dark:bg-[#3a3020]">
                                <div className="h-full w-2/3 rounded-full bg-primary"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Spacer for sticky player */}
            <div className="h-20"></div>
        </div>
    );
}
