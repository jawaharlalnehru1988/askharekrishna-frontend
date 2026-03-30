'use client';

import React from 'react';
import { useLanguage } from '../providers/LanguageContext';

export function LanguageSwitcher() {
    const { locale } = useLanguage();

    const toggleLanguage = () => {
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
        const newUrl = `${protocol}//${newHostname}${port ? `:${port}` : ''}${window.location.pathname}${window.location.search}`;

        window.location.href = newUrl;
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark text-xs font-bold hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
        >
            <span className="material-symbols-outlined text-sm">language</span>
            {locale === 'en' ? 'தமிழ்' : 'English'}
        </button>
    );
}
