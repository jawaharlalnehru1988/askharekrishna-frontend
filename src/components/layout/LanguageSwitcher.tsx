'use client';

import React from 'react';
import { useLanguage } from '../providers/LanguageContext';
import { Locale } from '@/lib/dictionaries';

export function LanguageSwitcher() {
    const { locale } = useLanguage();
    const [isNavigating, setIsNavigating] = React.useState(false);

    const switchLanguage = (nextLocale: Locale) => {
        if (isNavigating) return;
        if (nextLocale === locale) return;
        setIsNavigating(true);

        // 1. Set cookie for persistent language selection across sessions
        document.cookie = `askharekrishna-locale=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;

        // 2. Build target URL preserving current pathname and existing params
        const url = new URL(window.location.href);

        // If currently on a language subdomain (e.g. tamil.askharekrishna.com), consolidate to askharekrishna.com
        if (url.hostname.includes('askharekrishna.com')) {
            url.hostname = 'askharekrishna.com';
        }

        // Update the ?lang query parameter to reload with the new language
        url.searchParams.set('lang', nextLocale);

        window.location.href = url.toString();
    };

    return (
        <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark text-xs font-bold transition-colors ${
                isNavigating 
                ? 'opacity-50 cursor-not-allowed bg-surface-light dark:bg-surface-dark' 
                : 'hover:bg-surface-light dark:hover:bg-surface-dark'
            }`}
        >
            <span className={`material-symbols-outlined text-sm ${isNavigating ? 'animate-spin' : ''}`}>
                {isNavigating ? 'progress_activity' : 'language'}
            </span>
            <select
                value={locale}
                disabled={isNavigating}
                onChange={(e) => switchLanguage(e.target.value as Locale)}
                className="bg-transparent text-xs font-bold outline-none cursor-pointer text-text-main dark:text-text-main"
                aria-label="Select language"
            >
                <option value="en" className="text-black bg-white">English</option>
                <option value="ta" className="text-black bg-white">தமிழ்</option>
                <option value="hi" className="text-black bg-white">हिन्दी</option>
                <option value="kn" className="text-black bg-white">ಕನ್ನಡ</option>
                <option value="te" className="text-black bg-white">తెలుగు</option>
                <option value="ml" className="text-black bg-white">മലയാളം</option>
            </select>
        </div>
    );
}
