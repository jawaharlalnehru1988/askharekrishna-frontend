'use client';

import { useEffect } from 'react';

interface FestivalArticleUrlSyncProps {
    articleNumber: number;
    locale: string;
}

/**
 * Ensures that when a festival article is opened (even via a slug or without lang parameter),
 * the browser address bar is synchronized to use the canonical article number / ID
 * (/festival-insights/{id}?lang=...), guaranteeing that copy-pasting or sharing from the browser
 * uses the article number instead of the slug.
 */
export function FestivalArticleUrlSync({ articleNumber, locale }: FestivalArticleUrlSyncProps) {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const url = new URL(window.location.href);
            const targetPath = `/festival-insights/${articleNumber}`;
            let hasChanged = false;

            if (url.pathname !== targetPath) {
                url.pathname = targetPath;
                hasChanged = true;
            }

            if (!url.searchParams.has('lang')) {
                url.searchParams.set('lang', locale || 'en');
                hasChanged = true;
            }

            if (hasChanged) {
                window.history.replaceState(null, '', url.pathname + url.search);
            }
        } catch {
            // Ignore URL parsing errors
        }
    }, [articleNumber, locale]);

    return null;
}
