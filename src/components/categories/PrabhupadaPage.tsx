"use client";

import Link from "next/link";
import { getDictionary } from "@/lib/dictionaries";

export default function PrabhupadaPage({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>> }) {
    const { common: c, prabhupada: p } = dictionary;

    const TEACHINGS = [
        {
            title: p.teachings.bhagavatam.title,
            description: p.teachings.bhagavatam.description,
            count: p.teachings.bhagavatam.count,
            icon: "menu_book",
            colorClass: "bg-green-500",
            href: "#"
        },
        {
            title: p.teachings.morningWalks.title,
            description: p.teachings.morningWalks.description,
            count: p.teachings.morningWalks.count,
            icon: "sunny",
            colorClass: "bg-primary",
            href: "#"
        },
        {
            title: p.teachings.conversations.title,
            description: p.teachings.conversations.description,
            count: p.teachings.conversations.count,
            icon: "forum",
            colorClass: "bg-primary",
            href: "#"
        },
        {
            title: p.teachings.bhajans.title,
            description: p.teachings.bhajans.description,
            count: p.teachings.bhajans.count,
            icon: "music_note",
            colorClass: "bg-primary",
            href: "#"
        },
        {
            title: p.teachings.arrivalAddresses.title,
            description: p.teachings.arrivalAddresses.description,
            count: p.teachings.arrivalAddresses.count,
            icon: "flight_land",
            colorClass: "bg-primary",
            href: "#"
        },
        {
            title: p.teachings.letters.title,
            description: p.teachings.letters.description,
            count: p.teachings.letters.count,
            icon: "mail",
            colorClass: "bg-green-500",
            href: "#"
        },
        {
            title: p.teachings.philosophy.title,
            description: p.teachings.philosophy.description,
            count: p.teachings.philosophy.count,
            icon: "lightbulb",
            colorClass: "bg-primary",
            href: "#"
        },
        {
            title: p.teachings.festivalLectures.title,
            description: p.teachings.festivalLectures.description,
            count: p.teachings.festivalLectures.count,
            icon: "festival",
            colorClass: "bg-primary",
            href: "#"
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-text-main dark:text-[#e8e6e3] font-display transition-colors duration-300">
            <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 lg:px-10 py-8">
                {/* Breadcrumbs */}
                <nav aria-label="Breadcrumb" className="flex items-center text-sm font-medium text-text-subtle mb-8">
                    <Link href="/" className="hover:text-primary transition-colors">{c.home}</Link>
                    <span className="material-symbols-outlined text-base mx-2">chevron_right</span>
                    <Link href="#" className="hover:text-primary transition-colors">{p.breadcrumbAudio}</Link>
                    <span className="material-symbols-outlined text-base mx-2">chevron_right</span>
                    <span className="text-text-main dark:text-white font-semibold">{p.title}</span>
                </nav>

                {/* Page Header / Hero */}
                <div className="mb-12 relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 to-transparent dark:from-primary/20 p-8 sm:p-12">
                    <div className="relative z-10 max-w-2xl">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-text-main dark:text-white tracking-tight mb-4">
                            {p.title}
                        </h1>
                        <p className="text-lg text-text-subtle dark:text-gray-300 max-w-xl leading-relaxed">
                            {p.description}
                        </p>
                        <div className="mt-8 flex gap-4">
                            <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-yellow-600 transition-colors shadow-lg shadow-primary/30">
                                <span className="material-symbols-outlined mr-2">play_circle</span>
                                {p.hero.startListening}
                            </button>
                            <button className="inline-flex items-center justify-center px-6 py-3 border border-border-light dark:border-border-dark text-base font-medium rounded-lg text-text-main dark:text-white bg-surface-light dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-surface-dark/80 transition-colors shadow-sm">
                                <span className="material-symbols-outlined mr-2">favorite</span>
                                {p.hero.saveToLibrary}
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
        </div>
    );
}
