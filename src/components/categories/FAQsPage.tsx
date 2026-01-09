"use client";

import Link from "next/link";
import { useState } from "react";
import { Footer } from "@/components/layout/Footer";

const FAQ_CATEGORIES = [
    {
        title: "Questions from Atheists",
        description: "Logical inquiries about the existence of God, the soul, and the nature of reality from a skeptic's view.",
        articleCount: 12,
        icon: "psychology_alt",
        colorClass: "text-primary",
        bgClass: "bg-orange-50 dark:bg-orange-900/20",
        slug: "atheists",
        href: "/faqs/atheists"
    },
    {
        title: "Interfaith Questions",
        description: "Comparisons and commonalities between Krishna consciousness and other major world religions.",
        articleCount: 8,
        icon: "public",
        colorClass: "text-blue-600 dark:text-blue-400",
        bgClass: "bg-blue-50 dark:bg-blue-900/20",
        slug: "interfaith",
        href: "/faqs/interfaith"
    },
    {
        title: "Young Generations",
        description: "Modern dilemmas, student life, career balance, and spirituality for the youth of today.",
        articleCount: 15,
        icon: "school",
        colorClass: "text-green-600 dark:text-green-400",
        bgClass: "bg-green-50 dark:bg-green-900/20",
        slug: "young-generations",
        href: "/faqs/young-generations"
    },
    {
        title: "Following Devotees",
        description: "Advanced topics on sadhana, temple etiquette, scripture study, and deepening bhakti.",
        articleCount: 24,
        icon: "self_improvement",
        colorClass: "text-purple-600 dark:text-purple-400",
        bgClass: "bg-purple-50 dark:bg-purple-900/20",
        slug: "devotees",
        href: "/faqs/devotees"
    },
    {
        title: "Demigod Worship",
        description: "Clarifications on the position of demigods relative to the Supreme Lord Krishna.",
        articleCount: 6,
        icon: "temple_hindu",
        colorClass: "text-red-600 dark:text-red-400",
        bgClass: "bg-red-50 dark:bg-red-900/20",
        slug: "demigod-worship",
        href: "/faqs/demigod-worship"
    },
    {
        title: "App Support",
        description: "Help with subscriptions, audio playback, downloading content, and account settings.",
        articleCount: 10,
        icon: "settings_suggest",
        colorClass: "text-gray-600 dark:text-gray-300",
        bgClass: "bg-gray-100 dark:bg-gray-800",
        slug: "app-support",
        href: "/faqs/app-support"
    }
];

export default function FAQsPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-300 min-h-screen flex flex-col font-lexend">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-[#f3efe7] dark:border-white/10">
                <div className="px-6 md:px-10 py-3 mx-auto max-w-[1280px]">
                    <div className="flex items-center justify-between whitespace-nowrap">
                        <div className="flex items-center gap-4 text-text-main dark:text-white">
                            <div className="size-8 text-primary">
                                <span className="material-symbols-outlined text-3xl">local_library</span>
                            </div>
                            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Devotional Audio</h2>
                        </div>
                        {/* Desktop Nav */}
                        <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
                            <nav className="flex items-center gap-8">
                                <Link className="text-text-main dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors" href="/">Home</Link>
                                <Link className="text-text-main dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors" href="#">Audio Books</Link>
                                <Link className="text-text-main dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors" href="#">Library</Link>
                            </nav>
                            <div className="flex gap-3 items-center ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
                                <button className="relative size-10 rounded-full overflow-hidden bg-gray-100 dark:bg-surface-dark flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group">
                                    <span className="material-symbols-outlined text-gray-500 group-hover:text-primary">person</span>
                                </button>
                            </div>
                        </div>
                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button className="p-2 text-text-main dark:text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                <span className="material-symbols-outlined">menu</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex flex-col items-center w-full">
                {/* Hero Section */}
                <section className="w-full relative overflow-hidden bg-background-light dark:bg-background-dark">
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
                    </div>
                    <div className="layout-content-container max-w-[960px] mx-auto px-4 md:px-10 py-16 md:py-24 flex flex-col items-center text-center relative z-10">
                        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full border border-primary/20">
                            Help Center
                        </span>
                        <h1 className="text-text-main dark:text-white text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4">
                            How can we help you?
                        </h1>
                        <p className="text-text-muted dark:text-gray-400 text-lg md:text-xl font-normal leading-relaxed max-w-[600px] mb-10">
                            Find clarity and deepen your spiritual practice with answers to common inquiries from our community.
                        </p>
                        {/* Search Bar */}
                        <div className="w-full max-w-[560px] relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-text-muted">search</span>
                            </div>
                            <input
                                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-surface-dark border-2 border-[#e7dfcf] dark:border-gray-700 rounded-2xl text-text-main dark:text-white placeholder-text-muted focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm group-hover:shadow-md text-base"
                                placeholder="Search for questions, topics, or keywords..." type="text"
                            />
                            <div className="absolute inset-y-0 right-2 flex items-center">
                                <button className="bg-primary hover:bg-primary-dark text-text-main font-bold py-2 px-6 rounded-xl text-sm transition-colors shadow-sm">
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Categories Grid */}
                <section className="w-full bg-background-light dark:bg-background-dark pb-20">
                    <div className="max-w-[1080px] mx-auto px-4 md:px-10">
                        <div className="flex flex-col mb-8 px-2">
                            <h3 className="text-2xl font-bold text-text-main dark:text-white tracking-tight">Browse by Topic</h3>
                            <p className="text-text-muted dark:text-gray-400 mt-1">Select a category to explore related questions.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {FAQ_CATEGORIES.map((category, index) => (
                                <Link key={index} href={category.href} className="group relative flex flex-col p-8 bg-surface-light dark:bg-surface-dark border border-[#f3efe7] dark:border-gray-800 rounded-2xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1">
                                    <div className={`size-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${category.bgClass} ${category.colorClass}`}>
                                        <span className="material-symbols-outlined text-3xl">{category.icon}</span>
                                    </div>
                                    <h4 className="text-xl font-bold text-text-main dark:text-white mb-2 group-hover:text-primary transition-colors">
                                        {category.title}
                                    </h4>
                                    <p className="text-text-muted dark:text-gray-400 text-sm leading-relaxed mb-4 flex-grow">
                                        {category.description}
                                    </p>
                                    <div className="flex items-center text-sm font-semibold text-primary mt-auto">
                                        <span>View {category.articleCount} Articles</span>
                                        <span className="material-symbols-outlined ml-1 text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="w-full bg-surface-light dark:bg-surface-dark border-t border-[#f3efe7] dark:border-gray-800">
                    <div className="max-w-[960px] mx-auto px-4 md:px-10 py-16 md:py-24">
                        <div className="bg-primary/10 dark:bg-primary/5 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                            <div className="flex flex-col gap-3">
                                <h2 className="text-2xl md:text-3xl font-bold text-text-main dark:text-white">Still have questions?</h2>
                                <p className="text-text-muted dark:text-gray-400 max-w-md">
                                    Can't find the answer you're looking for? Our dedicated support team is here to help you on your spiritual journey.
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <button className="bg-primary hover:bg-primary-dark text-text-main text-base font-bold py-3 px-8 rounded-xl transition-all shadow-sm hover:shadow-md transform hover:scale-105">
                                    Contact Support
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
