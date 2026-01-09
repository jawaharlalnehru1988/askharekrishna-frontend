"use client";

import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

const TEACHINGS = [
    {
        title: "Bhagavatam Lectures",
        description: "Daily classes on the Srimad Bhagavatam given around the world.",
        count: "250+ Tracks",
        icon: "menu_book",
        colorClass: "bg-green-500",
        href: "#"
    },
    {
        title: "Morning Walks",
        description: "Informal philosophical discussions during early morning walks.",
        count: "45 Recordings",
        icon: "sunny",
        colorClass: "bg-primary",
        href: "#"
    },
    {
        title: "Conversations",
        description: "Room conversations with disciples, guests, and scholars.",
        count: "120 Dialogues",
        icon: "forum",
        colorClass: "bg-primary",
        href: "#"
    },
    {
        title: "Bhajans & Kirtans",
        description: "Devotional songs and ecstatic chanting recorded live.",
        count: "80 Tracks",
        icon: "music_note",
        colorClass: "bg-primary",
        href: "#"
    },
    {
        title: "Arrival Addresses",
        description: "Speeches given upon arriving at various airports and temples.",
        count: "15 Tracks",
        icon: "flight_land",
        colorClass: "bg-primary",
        href: "#"
    },
    {
        title: "Letters",
        description: "Readings of correspondence offering personal guidance.",
        count: "500+ Readings",
        icon: "mail",
        colorClass: "bg-green-500",
        href: "#"
    },
    {
        title: "Philosophy",
        description: "Deep dives into Vedic philosophy and metaphysics.",
        count: "60 Discussions",
        icon: "lightbulb",
        colorClass: "bg-primary",
        href: "#"
    },
    {
        title: "Festival Lectures",
        description: "Special classes given during major Vaishnava festivals.",
        count: "30 Tracks",
        icon: "festival",
        colorClass: "bg-primary",
        href: "#"
    }
];

export default function PrabhupadaPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-text-main dark:text-[#e8e6e3] font-display transition-colors duration-300">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-4">
                    <div className="flex items-center justify-between gap-6">
                        {/* Logo & Brand */}
                        <div className="flex items-center gap-4 text-text-main dark:text-white">
                            <div className="text-primary">
                                <span className="material-symbols-outlined text-4xl">temple_hindu</span>
                            </div>
                            <h2 className="text-xl font-bold leading-tight tracking-tight hidden sm:block">Hare Krishna Audio</h2>
                        </div>
                        {/* Desktop Nav Links */}
                        <nav className="hidden lg:flex items-center gap-8">
                            <Link className="text-text-main dark:text-gray-200 text-sm font-semibold hover:text-primary transition-colors" href="/">Home</Link>
                            <Link className="text-primary text-sm font-bold border-b-2 border-primary pb-1" href="#">Audio Books</Link>
                            <Link className="text-text-main dark:text-gray-200 text-sm font-semibold hover:text-primary transition-colors" href="#">Lectures</Link>
                            <Link className="text-text-main dark:text-gray-200 text-sm font-semibold hover:text-primary transition-colors" href="#">Music</Link>
                            <Link className="text-text-main dark:text-gray-200 text-sm font-semibold hover:text-primary transition-colors" href="#">Donate</Link>
                        </nav>
                        {/* Search & Profile */}
                        <div className="flex items-center gap-4 flex-1 lg:flex-none justify-end">
                            <div className="relative hidden sm:block w-full max-w-xs group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-subtle dark:text-gray-400 group-focus-within:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-xl">search</span>
                                </div>
                                <input
                                    className="block w-full pl-10 pr-3 py-2.5 border-none rounded-xl leading-5 bg-surface-light dark:bg-surface-dark text-text-main dark:text-white placeholder-text-subtle dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow sm:text-sm shadow-sm"
                                    placeholder="Search lectures, books..."
                                    type="search"
                                />
                            </div>
                            <button className="bg-surface-light dark:bg-surface-dark p-1 rounded-full border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow">
                                <div
                                    className="w-9 h-9 rounded-full bg-cover bg-center"
                                    data-alt="User profile avatar"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAowP0J7aB4aKtpkcIQVmBOuZ9tR0nJ8FXnfG6WppwSyegI9Z3wx9Tuk6xVK6u9GjgKYhz5-0IMMu5Urdu2TJOASq0NLIr0Dw_QWEdyyO-vaRF762NeyuNVlgxdepcU92SkmRYAoLjjlekK9Y0it7p20rrd8SersuGZYNpH8k5Iy8YK3kNJ07DDRmbAEWY0ef5oXbDi-NQ2rIBE0Vl_vQnI1l8WAXblyerTrrl4Rk3LeNqwJrpKIffEZwrAGhVQMmRwN7Lrs97_689p")' }}
                                ></div>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 lg:px-10 py-8">
                {/* Breadcrumbs */}
                <nav aria-label="Breadcrumb" className="flex items-center text-sm font-medium text-text-subtle mb-8">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <span className="material-symbols-outlined text-base mx-2">chevron_right</span>
                    <Link href="/audio" className="hover:text-primary transition-colors">Audio</Link>
                    <span className="material-symbols-outlined text-base mx-2">chevron_right</span>
                    <span className="text-text-main dark:text-white font-semibold">Prabhupada Teachings</span>
                </nav>

                {/* Page Header / Hero */}
                <div className="mb-12 relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 to-transparent dark:from-primary/20 p-8 sm:p-12">
                    <div className="relative z-10 max-w-2xl">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-text-main dark:text-white tracking-tight mb-4">
                            Prabhupada Teachings
                        </h1>
                        <p className="text-lg text-text-subtle dark:text-gray-300 max-w-xl leading-relaxed">
                            Dive into the timeless wisdom from the founder-acharya. Explore lectures, conversations, and
                            personal instructions that have transformed millions of lives.
                        </p>
                        <div className="mt-8 flex gap-4">
                            <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-yellow-600 transition-colors shadow-lg shadow-primary/30">
                                <span className="material-symbols-outlined mr-2">play_circle</span>
                                Start Listening
                            </button>
                            <button className="inline-flex items-center justify-center px-6 py-3 border border-border-light dark:border-border-dark text-base font-medium rounded-lg text-text-main dark:text-white bg-surface-light dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-surface-dark/80 transition-colors shadow-sm">
                                <span className="material-symbols-outlined mr-2">favorite</span>
                                Save to Library
                            </button>
                        </div>
                    </div>
                    {/* Decorative Background Element */}
                    <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none hidden md:block">
                        <span className="material-symbols-outlined text-[300px] text-primary absolute -right-16 -top-16 rotate-12">
                            leaf_spark
                        </span>
                    </div>
                </div>

                {/* Subcategory Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {TEACHINGS.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className="group relative flex flex-col bg-surface-light dark:bg-surface-dark rounded-xl p-6 border border-border-light dark:border-border-dark shadow-soft hover:shadow-hover hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                            </div>
                            <h3 className="text-xl font-bold text-text-main dark:text-white mb-2 group-hover:text-primary transition-colors">
                                {item.title}
                            </h3>
                            <p className="text-text-subtle dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                {item.description}
                            </p>
                            <div className="mt-auto flex items-center text-xs font-semibold text-text-subtle dark:text-gray-500 uppercase tracking-wider">
                                <span className={`w-2 h-2 rounded-full ${item.colorClass} mr-2`}></span>
                                {item.count}
                            </div>
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
