'use client';

import React from 'react';
import { useLanguage } from '../providers/LanguageContext';

export function LanguageSwitcher() {
    const { locale } = useLanguage();
    const [isNavigating, setIsNavigating] = React.useState(false);

    const toggleLanguage = () => {
        if (isNavigating) return;
        setIsNavigating(true);

        const nextLocale = locale === 'en' ? 'ta' : 'en';
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
                if (['tamil', 'ta', 'english', 'en'].includes(parts[0])) {
                    baseDomain = parts.slice(1).join('.');
                }
            }
        }

        const newHostname = nextLocale === 'ta' ? `tamil.${baseDomain}` : baseDomain;

        // Redirect to home page if not already there, to avoid missing translations/articles
        const isHomePage = window.location.pathname === '/';
        const destinationPath = '/';
        const destinationSearch = isHomePage ? window.location.search : '';

        const newUrl = `${protocol}//${newHostname}${port ? `:${port}` : ''}${destinationPath}${destinationSearch}`;

        window.location.href = newUrl;
    };

    return (
        <button
            onClick={toggleLanguage}
            disabled={isNavigating}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark text-xs font-bold transition-colors ${
                isNavigating 
                ? 'opacity-50 cursor-not-allowed bg-surface-light dark:bg-surface-dark' 
                : 'hover:bg-surface-light dark:hover:bg-surface-dark'
            }`}
        >
            <span className={`material-symbols-outlined text-sm ${isNavigating ? 'animate-spin' : ''}`}>
                {isNavigating ? 'progress_activity' : 'language'}
            </span>
            {locale === 'en' ? 'தமிழ்' : 'English'}
        </button>
    );
}
