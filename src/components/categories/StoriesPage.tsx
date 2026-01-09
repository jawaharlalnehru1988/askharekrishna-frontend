"use client";

import React, { useState } from 'react';
import Head from 'next/head';
import {
    Menu,
    Search,
    ChevronDown,
    BookOpen,
    ArrowRight,
    Church
} from 'lucide-react';

const DevotionalStories = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const stories = [
        {
            title: "Stories from Bhagavatam",
            description: "The spotlessly pure Purana, describing the glorious pastimes and avatars of the Supreme Lord.",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhY_NhYKWePf34oB7wsKgQDF5IjaU3WgdzzbrjTS3ns1F6W8yWb0hQZCj98d_vYe02FNG6CA5T-LktpHeVuKwjEpHPEZtpocboX-DLIeS3_BqL3PbkrKqU2FSdrslrYXtD9NjwtQTHnutwd5klsS35nQ4WPe5Z9BZ4yDSAAv2c_YB2YXWEBOAqrn-Z5dn9drBhxOA1MgWtI52f9jLA8n8rSZQgSNl5ZHggjBUZF3j460L_EJMsB4p7OMLRdwxdFmlPYg99hEdZ9BbX",
        },
        {
            title: "Stories from Ramayanam",
            description: "The spotlessly pure Purana, describing the glorious pastimes and avatars of the Supreme Lord.",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhY_NhYKWePf34oB7wsKgQDF5IjaU3WgdzzbrjTS3ns1F6W8yWb0hQZCj98d_vYe02FNG6CA5T-LktpHeVuKwjEpHPEZtpocboX-DLIeS3_BqL3PbkrKqU2FSdrslrYXtD9NjwtQTHnutwd5klsS35nQ4WPe5Z9BZ4yDSAAv2c_YB2YXWEBOAqrn-Z5dn9drBhxOA1MgWtI52f9jLA8n8rSZQgSNl5ZHggjBUZF3j460L_EJMsB4p7OMLRdwxdFmlPYg99hEdZ9BbX",
        },
        {
            title: "Stories from Mahabharatam",
            description: "The spotlessly pure Purana, describing the glorious pastimes and avatars of the Supreme Lord.",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhY_NhYKWePf34oB7wsKgQDF5IjaU3WgdzzbrjTS3ns1F6W8yWb0hQZCj98d_vYe02FNG6CA5T-LktpHeVuKwjEpHPEZtpocboX-DLIeS3_BqL3PbkrKqU2FSdrslrYXtD9NjwtQTHnutwd5klsS35nQ4WPe5Z9BZ4yDSAAv2c_YB2YXWEBOAqrn-Z5dn9drBhxOA1MgWtI52f9jLA8n8rSZQgSNl5ZHggjBUZF3j460L_EJMsB4p7OMLRdwxdFmlPYg99hEdZ9BbX",
        },
        {
            title: "Stories from Puranas",
            description: "The spotlessly pure Purana, describing the glorious pastimes and avatars of the Supreme Lord.",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhY_NhYKWePf34oB7wsKgQDF5IjaU3WgdzzbrjTS3ns1F6W8yWb0hQZCj98d_vYe02FNG6CA5T-LktpHeVuKwjEpHPEZtpocboX-DLIeS3_BqL3PbkrKqU2FSdrslrYXtD9NjwtQTHnutwd5klsS35nQ4WPe5Z9BZ4yDSAAv2c_YB2YXWEBOAqrn-Z5dn9drBhxOA1MgWtI52f9jLA8n8rSZQgSNl5ZHggjBUZF3j460L_EJMsB4p7OMLRdwxdFmlPYg99hEdZ9BbX",
        },
        {
            title: "Stories from Prabhupada",
            description: "The spotlessly pure Purana, describing the glorious pastimes and avatars of the Supreme Lord.",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhY_NhYKWePf34oB7wsKgQDF5IjaU3WgdzzbrjTS3ns1F6W8yWb0hQZCj98d_vYe02FNG6CA5T-LktpHeVuKwjEpHPEZtpocboX-DLIeS3_BqL3PbkrKqU2FSdrslrYXtD9NjwtQTHnutwd5klsS35nQ4WPe5Z9BZ4yDSAAv2c_YB2YXWEBOAqrn-Z5dn9drBhxOA1MgWtI52f9jLA8n8rSZQgSNl5ZHggjBUZF3j460L_EJMsB4p7OMLRdwxdFmlPYg99hEdZ9BbX",
        },
        {
            title: "Stories from Bhagavad Gita",
            description: "The spotlessly pure Purana, describing the glorious pastimes and avatars of the Supreme Lord.",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhY_NhYKWePf34oB7wsKgQDF5IjaU3WgdzzbrjTS3ns1F6W8yWb0hQZCj98d_vYe02FNG6CA5T-LktpHeVuKwjEpHPEZtpocboX-DLIeS3_BqL3PbkrKqU2FSdrslrYXtD9NjwtQTHnutwd5klsS35nQ4WPe5Z9BZ4yDSAAv2c_YB2YXWEBOAqrn-Z5dn9drBhxOA1MgWtI52f9jLA8n8rSZQgSNl5ZHggjBUZF3j460L_EJMsB4p7OMLRdwxdFmlPYg99hEdZ9BbX",
        },

    ];

    return (
        <div className="font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-200 min-h-screen">
            <header className="sticky top-0 z-50 w-full bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-[#f3efe7] dark:border-neutral-800">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div className="flex items-center gap-3 cursor-pointer group">
                            <div className="text-primary transition-transform group-hover:scale-110">
                                <Church size={32} />
                            </div>
                            <h1 className="text-xl font-bold leading-tight tracking-tight">askharekrishna.com</h1>
                        </div>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
                            <div className="relative group h-20 flex items-center">
                                <button className="text-sm font-bold hover:text-primary transition-colors flex items-center gap-1">
                                    Ramayanam <ChevronDown size={16} />
                                </button>
                                {/* Mega Menu */}
                                <div className="absolute top-full left-0 w-48 bg-white dark:bg-[#2a2418] shadow-xl rounded-b-xl border border-neutral-100 dark:border-neutral-800 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-200">
                                    {["Bala Kanda", "Ayodhya Kanda", "Aranya Kanda"].map((item) => (
                                        <a key={item} href="#" className="block px-4 py-2 text-sm hover:bg-background-light dark:hover:bg-neutral-800 rounded-lg">
                                            {item}
                                        </a>
                                    ))}
                                </div>
                            </div>
                            {["Mahabharatam", "Puranams", "Prabhupada", "Bhagavad Gita", "Kirtans"].map((item) => (
                                <a key={item} href="#" className="text-sm font-bold hover:text-primary transition-colors">
                                    {item}
                                </a>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <button className="hidden md:flex p-2 hover:text-primary">
                                <Search size={20} />
                            </button>
                            <button className="h-10 px-6 bg-primary hover:bg-yellow-500 text-[#1b170d] text-sm font-bold rounded-lg transition-colors shadow-sm">
                                Log In
                            </button>
                            <button className="lg:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                <Menu size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="pt-12 pb-8 md:pt-16 md:pb-12 bg-gradient-to-b from-[#fdfbf7] to-background-light dark:from-[#2a2418] dark:to-background-dark border-b border-[#f3efe7] dark:border-neutral-800/50">
                    <div className="max-w-[1280px] mx-auto px-4 md:px-8 text-center">
                        <span className="inline-block mb-3 text-primary font-bold uppercase tracking-widest text-xs">
                            Transcendental Pastimes
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                            Devotional Stories
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg text-text-muted dark:text-gray-300">
                            Immerse yourself in the timeless narrations of the Supreme Lord and His devotees. Each story is a step towards spiritual awakening.
                        </p>
                    </div>
                </section>

                {/* Stories Grid */}
                <section className="py-12 md:py-16">
                    <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {stories.map((story, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="group flex flex-col h-full bg-white dark:bg-[#2a2418] rounded-2xl border border-[#f3efe7] dark:border-neutral-800 hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                                >
                                    <div className="relative h-56 w-full overflow-hidden">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                            style={{ backgroundImage: `url('${story.image}')` }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                        <div className="absolute bottom-4 left-4">
                                            <div className="bg-primary/90 p-2 rounded-lg text-text-main backdrop-blur-sm">
                                                <BookOpen size={24} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                            {story.title}
                                        </h3>
                                        <p className="text-text-muted dark:text-gray-400 text-sm leading-relaxed flex-grow">
                                            {story.description}
                                        </p>
                                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800 flex items-center text-sm font-bold text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                            Listen Now <ArrowRight size={16} className="ml-1" />
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default DevotionalStories;
