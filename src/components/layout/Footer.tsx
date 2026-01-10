'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../providers/LanguageContext';

export function Footer() {
    const { dictionary } = useLanguage();
    const { footer: f } = dictionary;
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-white dark:bg-[#1a150c] border-t border-[#f3efe7] dark:border-neutral-800 py-12">
            <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row justify-between gap-10">
                    <div className="flex flex-col gap-4 max-w-sm">
                        <Link href="/" className="flex items-center gap-3 text-text-main dark:text-white group">
                            <div className="size-8 text-primary transition-transform group-hover:scale-110">
                                <span className="material-symbols-outlined text-3xl">temple_hindu</span>
                            </div>
                            <h2 className="text-xl font-bold tracking-tight">askharekrishna.com</h2>
                        </Link>
                        <p className="text-text-muted dark:text-gray-400 text-sm leading-relaxed">
                            {f.about}
                        </p>
                    </div>
                    <div className="flex gap-16 flex-wrap">
                        <div className="flex flex-col gap-3">
                            <h4 className="font-bold text-text-main dark:text-white text-sm uppercase tracking-wider">{f.content}</h4>
                            <Link href="/bhagavad-gita" className="text-text-muted dark:text-gray-400 hover:text-primary text-sm transition-colors">{dictionary.navbar.bhagavadGita}</Link>
                            <Link href="/mahabharatam" className="text-text-muted dark:text-gray-400 hover:text-primary text-sm transition-colors">{dictionary.navbar.mahabharatam}</Link>
                            <Link href="/kirtans" className="text-text-muted dark:text-gray-400 hover:text-primary text-sm transition-colors">{dictionary.navbar.kirtans}</Link>
                            <Link href="/prabhupada" className="text-text-muted dark:text-gray-400 hover:text-primary text-sm transition-colors">{dictionary.navbar.prabhupada}</Link>
                        </div>
                        <div className="flex flex-col gap-3">
                            <h4 className="font-bold text-text-main dark:text-white text-sm uppercase tracking-wider">{f.support}</h4>
                            <Link href="/faqs" className="text-text-muted dark:text-gray-400 hover:text-primary text-sm transition-colors">{f.faq}</Link>
                            <Link href="#" className="text-text-muted dark:text-gray-400 hover:text-primary text-sm transition-colors">{f.contactUs}</Link>
                            <Link href="#" className="text-text-muted dark:text-gray-400 hover:text-primary text-sm transition-colors">{f.donate}</Link>
                            <Link href="#" className="text-text-muted dark:text-gray-400 hover:text-primary text-sm transition-colors">{f.privacyPolicy}</Link>
                        </div>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-gray-100 dark:border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-muted dark:text-gray-500">
                    <p>{f.copyright.replace('{year}', currentYear.toString())}</p>
                    <div className="flex gap-4">
                        <Link href="#" className="hover:text-primary transition-colors">Instagram</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Twitter</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Facebook</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
