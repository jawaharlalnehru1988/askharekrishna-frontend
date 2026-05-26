'use client';

import React from 'react';
import { useLanguage } from '../providers/LanguageContext';
import { Locale } from '@/lib/dictionaries';

const LOCALE_TO_SUBDOMAIN: Record<Locale, string> = {
    en: '',
    ta: 'tamil',
    hi: 'hindi',
    kn: 'kannada',
    te: 'telugu',
    ml: 'malayalam',
};

export function LanguageSwitcher() {
    const { locale } = useLanguage();
    const [isNavigating, setIsNavigating] = React.useState(false);

    const switchLanguage = (nextLocale: Locale) => {
        if (isNavigating) return;
        if (nextLocale === locale) return;
        setIsNavigating(true);
        const hostname = window.location.hostname;
        const protocol = window.location.protocol;
        const port = window.location.port;

        // Strip 'www.' if present to avoid 'tamil.www' issues
        let cleanHostname = hostname;
        if (hostname.startsWith('www.')) {
            cleanHostname = hostname.substring(4);
        }

        let baseDomain = cleanHostname;

        // If we are on a subdomain (e.g., tamil.localhost or tamil.askharekrishna.com)
        // we want to extract the base domain
        if (cleanHostname.includes('.')) {
            const parts = cleanHostname.split('.');
            if (parts.length > 1) {
                // If the first part is a known locale prefix, remove it
                if (['tamil', 'ta', 'hindi', 'hi', 'kannada', 'kn', 'telugu', 'te', 'malayalam', 'ml', 'english', 'en'].includes(parts[0])) {
                    baseDomain = parts.slice(1).join('.');
                }
            }
        }

        const localeSubdomain = LOCALE_TO_SUBDOMAIN[nextLocale];
        const newHostname = localeSubdomain ? `${localeSubdomain}.${baseDomain}` : baseDomain;

        // Redirect to home page if not already there, to avoid missing translations/articles
        const isHomePage = window.location.pathname === '/';
        const destinationPath = '/';
        const destinationSearch = isHomePage ? window.location.search : '';

        const newUrl = `${protocol}//${newHostname}${port ? `:${port}` : ''}${destinationPath}${destinationSearch}`;

        window.location.href = newUrl;
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
