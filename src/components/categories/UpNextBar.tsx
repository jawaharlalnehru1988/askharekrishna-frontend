"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, X, ChevronRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../providers/LanguageContext';

interface UpNextArticle {
    id?: number;
    slug: string;
    subTopic: string;
}

interface UpNextBarProps {
    nextArticle: UpNextArticle | null;
}

const upNextLabels: Record<string, { label: string; readNow: string }> = {
    ta: { label: 'அடுத்த விவாதம்', readNow: 'படியுங்கள்' },
    en: { label: 'Up Next', readNow: 'Read Now' },
    hi: { label: 'अगला लेख', readNow: 'अभी पढ़ें' },
    te: { label: 'తరువాతి వ్యాసం', readNow: 'ఇప్పుడే చదవండి' },
    kn: { label: 'ಮುಂದಿನ ಲೇಖನ', readNow: 'ಈಗಲೇ ಓದಿ' },
    ml: { label: 'അടുത്ത ലേഖനം', readNow: 'ഇപ്പോൾ വായിക്കുക' },
    bn: { label: 'পরবর্তী নিবন্ধ', readNow: 'এখনই পড়ুন' },
};

export function UpNextBar({ nextArticle }: UpNextBarProps) {
    const { locale } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    const t = upNextLabels[locale] || upNextLabels.en;

    useEffect(() => {
        if (!nextArticle || isDismissed) {
            setIsVisible(false);
            return;
        }

        const handleScroll = () => {
            // Trigger when user has scrolled down > 1000px
            const scrollThreshold = 1000;
            if (window.scrollY > scrollThreshold) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [nextArticle, isDismissed]);

    if (!nextArticle || isDismissed || !isVisible) {
        return null;
    }

    return (
        <aside
            aria-label="Up next article recommendation"
            className="fixed bottom-6 right-4 sm:right-6 md:right-8 z-40 max-w-sm sm:max-w-md w-[calc(100%-2rem)] sm:w-auto animate-in fade-in slide-in-from-bottom-5 duration-300 no-print"
        >
            <div className="relative overflow-hidden rounded-2xl bg-white/95 dark:bg-[#201a12]/95 backdrop-blur-xl border border-primary/30 shadow-2xl p-4 sm:p-5 flex items-center gap-3.5 group">
                {/* Dismiss button */}
                <button
                    onClick={() => setIsDismissed(true)}
                    className="absolute top-2.5 right-2.5 size-6 rounded-full flex items-center justify-center text-text-muted hover:text-text-main dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                    aria-label="Dismiss recommendation"
                >
                    <X size={14} />
                </button>

                {/* Pulsing indicator icon */}
                <div className="size-10 sm:size-11 shrink-0 rounded-xl bg-primary/15 dark:bg-primary/20 text-primary flex items-center justify-center">
                    <Sparkles size={20} className="animate-pulse" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-4">
                    <span className="inline-block text-[10px] sm:text-xs font-black uppercase tracking-wider text-primary mb-0.5">
                        {t.label}
                    </span>
                    <Link
                        href={`/debate/${nextArticle.id || nextArticle.slug}?lang=${locale}`}
                        className="block text-xs sm:text-sm font-bold text-text-main dark:text-white line-clamp-1 hover:text-primary transition-colors"
                        title={nextArticle.subTopic}
                    >
                        {nextArticle.subTopic}
                    </Link>
                </div>

                {/* CTA Link */}
                <Link
                    href={`/debate/${nextArticle.id || nextArticle.slug}?lang=${locale}`}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
                >
                    <span>{t.readNow}</span>
                    <ArrowRight size={14} />
                </Link>
            </div>
        </aside>
    );
}
