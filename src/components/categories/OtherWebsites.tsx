import Link from 'next/link';
import React from 'react';

const websites = [
    {
        name: 'E Books Library',
        url: 'https://ebooks.askharekrishna.com',
        description: 'A comprehensive collection of books on Krishna Consciousness, philosophy, and spiritual wisdom.',
        icon: 'book',
        color: 'bg-saffron/10 text-saffron',
        tag: 'Books'
    },
    {
        name: 'Kirtan Connect',
        url: 'https://kirtan.askharekrishna.com',
        description: 'Immerse yourself in transcendental sound vibrations with an extensive collection of holy names and kirtans.',
        icon: 'music_note',
        color: 'bg-primary/10 text-primary',
        tag: 'Audio'
    },
    {
        name: 'Image Gallery',
        url: 'https://images.askharekrishna.com',
        description: 'Explore a vast collection of high-quality images depicting the pastimes of Lord Krishna and His devotees.',
        icon: 'image',
        color: 'bg-gold/10 text-gold',
        tag: 'Image'
    }
];

export default function OtherWebsites() {
    return (
        <section className="py-24 bg-white dark:bg-slate-900 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-gold mb-4 block">Our Digital Network</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                        Connect with our <span className="text-saffron italic font-display">Spiritual Ecosystem</span>
                    </h2>
                    <div className="h-1.5 w-24 bg-gold mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {websites.map((site) => (
                        <a
                            key={site.name}
                            href={site.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative bg-background-light dark:bg-slate-800 p-8 rounded-[2rem] border border-gold/10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col"
                        >
                            {/* Decorative Background Icon */}
                            <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
                                <span className="material-symbols-outlined text-[12rem]">{site.icon}</span>
                            </div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-14 h-14 rounded-2xl ${site.color} flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                                        <span className="material-symbols-outlined text-3xl">{site.icon}</span>
                                    </div>
                                    <span className="bg-slate-900/5 dark:bg-white/5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                        {site.tag}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-primary transition-colors">
                                    {site.name}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8 flex-grow">
                                    {site.description}
                                </p>

                                <div className="flex items-center gap-2 text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                                    Visit Website
                                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
