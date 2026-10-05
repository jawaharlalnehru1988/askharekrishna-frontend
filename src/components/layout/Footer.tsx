'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, MessageCircle, Check } from 'lucide-react';
import { useLanguage } from '../providers/LanguageContext';

export function Footer() {
    const { dictionary, locale } = useLanguage();
    const { footer: f } = dictionary;
    const currentYear = new Date().getFullYear();
    const [copiedPhone, setCopiedPhone] = useState(false);

    const handlePhoneClick = (e: React.MouseEvent) => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText('+916382043976');
            setCopiedPhone(true);
            setTimeout(() => setCopiedPhone(false), 2500);
        }
    };

    const counselorDisplayName = locale === 'en' ? 'Narasimha Dasa' : (f?.counselorName || 'நரசிம்ம தாச');

    return (
        <footer className="w-full bg-white dark:bg-[#1a150c] border-t border-[#f3efe7] dark:border-neutral-800 py-12 transition-colors duration-200">
            <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                    {/* Left Column: Brand & Mission */}
                    <div className="flex flex-col gap-4 max-w-md">
                        <Link href="/" className="flex items-center gap-3 text-text-main dark:text-white group">
                            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-110 shadow-sm border border-primary/20">
                                <span className="material-symbols-outlined text-2xl">temple_hindu</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">askharekrishna.com</h2>
                                <p className="text-[11px] text-primary font-medium tracking-wide uppercase">Vedic Wisdom &amp; Transcendental Knowledge</p>
                            </div>
                        </Link>
                        <p className="text-text-muted dark:text-gray-400 text-sm leading-relaxed">
                            {f.about}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-text-muted dark:text-gray-500 pt-1">
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>Dedicated to the authentic Gaudiya Vaishnava teachings of Srila Prabhupada</span>
                        </div>
                    </div>

                    {/* Right Column: Narasimha Dasa Counselor Card */}
                    <div className="w-full lg:w-auto relative z-20">
                        <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-amber-100/40 dark:from-[#241c13] dark:via-[#1e170f] dark:to-[#17120a] p-5 sm:p-6 border border-amber-200/70 dark:border-amber-900/50 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                                {/* Devotee Photo */}
                                <div className="relative shrink-0">
                                    <div className="relative size-20 sm:size-24 rounded-2xl overflow-hidden border-2 border-primary/30 dark:border-primary/50 shadow-md group-hover:border-primary transition-colors">
                                        <Image
                                            src="/narasimha-dasa.jpg"
                                            alt={counselorDisplayName}
                                            fill
                                            unoptimized
                                            className="object-cover object-top"
                                            sizes="(max-width: 640px) 80px, 96px"
                                            priority
                                        />
                                    </div>
                                    <span className="absolute -bottom-1 -right-1 size-5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#1a150c] flex items-center justify-center shadow" title="Available for queries">
                                        <span className="size-2 bg-white rounded-full"></span>
                                    </span>
                                </div>

                                {/* Details & Contact Actions */}
                                <div className="flex flex-col text-center sm:text-left">
                                    <div className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                                        <span className="material-symbols-outlined text-sm">help</span>
                                        <span>{f?.queriesTitle || 'For Doubts & Queries'}</span>
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight flex items-center justify-center sm:justify-start gap-2">
                                        <span>{counselorDisplayName}</span>
                                    </h3>
                                    <p className="text-xs text-text-muted dark:text-gray-400 mt-1 mb-3.5 max-w-xs leading-relaxed">
                                        {f?.queriesSubtitle || 'For any spiritual guidance, philosophical inquiries, or doubts, feel free to contact:'}
                                    </p>

                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 relative z-10">
                                        <a
                                            href="tel:+916382043976"
                                            onClick={handlePhoneClick}
                                            title="Call +91 6382043976 (Click to copy)"
                                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white dark:bg-neutral-800 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white text-gray-800 dark:text-gray-200 text-xs font-semibold rounded-lg border border-amber-200/80 dark:border-neutral-700 shadow-sm transition-all duration-200 group/call cursor-pointer active:scale-95"
                                        >
                                            {copiedPhone ? (
                                                <>
                                                    <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{f?.copied || 'Copied!'}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Phone className="size-3.5 text-primary group-hover/call:text-white transition-colors" />
                                                    <span>+91 6382043976</span>
                                                </>
                                            )}
                                        </a>
                                        <a
                                            href="https://wa.me/916382043976?text=Hare%20Krishna%20Prabhu%2C%20I%20have%20a%20doubt%2Fquery%20regarding%20AskHareKrishna"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title="Chat on WhatsApp"
                                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#25D366]/15 hover:bg-[#25D366] text-[#128C7E] dark:text-[#25D366] hover:text-white dark:hover:text-white text-xs font-semibold rounded-lg border border-[#25D366]/30 shadow-sm transition-all duration-200 cursor-pointer active:scale-95"
                                        >
                                            <MessageCircle className="size-3.5 fill-current" />
                                            <span>{f?.whatsapp || 'WhatsApp'}</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-gray-100 dark:border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-muted dark:text-gray-500">
                    <p>{f.copyright.replace('{year}', currentYear.toString())}</p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-600 font-medium">
                        Hare Krishna Hare Krishna Krishna Krishna Hare Hare | Hare Rama Hare Rama Rama Rama Hare Hare
                    </p>
                </div>
            </div>
        </footer>
    );
}
