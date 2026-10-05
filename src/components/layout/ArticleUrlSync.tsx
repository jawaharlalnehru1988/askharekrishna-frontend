"use client";

import { useEffect } from 'react';

interface ArticleUrlSyncProps {
    locale: string;
}

/**
 * Ensures that when an article is opened, the browser address bar always
 * includes the language query parameter (?lang=...), even for English.
 */
export function ArticleUrlSync({ locale }: ArticleUrlSyncProps) {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const url = new URL(window.location.href);
            if (!url.searchParams.has('lang')) {
                url.searchParams.set('lang', locale || 'en');
                window.history.replaceState(null, '', url.pathname + url.search);
            }
        } catch {
            // Ignore error if URL parsing fails
        }
    }, [locale]);

    return null;
}
