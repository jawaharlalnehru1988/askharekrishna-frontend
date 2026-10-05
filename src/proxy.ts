import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const VALID_LOCALES = ['ta', 'en', 'hi', 'kn', 'te', 'ml'] as const;
type ValidLocale = typeof VALID_LOCALES[number];

const SUBDOMAIN_MAP: Record<string, ValidLocale> = {
    tamil: 'ta',
    ta: 'ta',
    hindi: 'hi',
    hi: 'hi',
    kannada: 'kn',
    kn: 'kn',
    telugu: 'te',
    te: 'te',
    malayalam: 'ml',
    ml: 'ml',
    english: 'en',
    en: 'en',
};

export function proxy(request: NextRequest) {
    const url = request.nextUrl;
    const hostHeader = request.headers.get('host') || '';
    const forwardedHost = request.headers.get('x-forwarded-host') || '';

    // Use the most reliable host source
    const host = (forwardedHost || hostHeader || url.hostname).toLowerCase();

    // Check if host starts with a language subdomain (e.g. tamil.askharekrishna.com)
    let subLocale: ValidLocale | null = null;
    const hostParts = host.split('.');
    if (hostParts.length > 2) {
        const prefix = hostParts[0];
        if (prefix in SUBDOMAIN_MAP) {
            subLocale = SUBDOMAIN_MAP[prefix];
        }
    }

    // 1. Subdomain Consolidation: 301 Permanent Redirect to main domain with ?lang=...
    // e.g. tamil.askharekrishna.com/vaishnava-calendar/696 -> askharekrishna.com/vaishnava-calendar/696?lang=ta
    if (subLocale && host.includes('askharekrishna.com')) {
        const redirectUrl = url.clone();
        redirectUrl.protocol = 'https:';
        redirectUrl.host = 'askharekrishna.com';
        redirectUrl.port = '';
        redirectUrl.searchParams.set('lang', subLocale);

        const redirectResponse = NextResponse.redirect(redirectUrl, { status: 301 });
        redirectResponse.cookies.set('askharekrishna-locale', subLocale, {
            path: '/',
            maxAge: 31536000,
            sameSite: 'lax',
        });
        return redirectResponse;
    }

    // 2. Locale Resolution on askharekrishna.com
    let locale: ValidLocale = 'en';

    const queryLang = (url.searchParams.get('lang') || url.searchParams.get('language') || '').toLowerCase();
    const cookieLang = (request.cookies.get('askharekrishna-locale')?.value || '').toLowerCase();

    const isArticlePath = /^\/(vaishnava-calendar|stories|pooja-vidhis|debate)\/[^/]+/.test(url.pathname);

    if (VALID_LOCALES.includes(queryLang as ValidLocale)) {
        locale = queryLang as ValidLocale;
    } else if (subLocale) {
        // Fallback for local testing if requested on a subdomain
        locale = subLocale;
    } else if (!isArticlePath && VALID_LOCALES.includes(cookieLang as ValidLocale)) {
        // For general pages, fall back to cookie preference.
        // For article pages: if it doesn't have a language query param, that is English.
        locale = cookieLang as ValidLocale;
    }

    // Pass locale downstream to Server Components via request header
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-locale', locale);

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    // Also set it in the response header for client visibility
    response.headers.set('x-locale', locale);

    // Persist language choice in cookie if it changed
    if (cookieLang !== locale) {
        response.cookies.set('askharekrishna-locale', locale, {
            path: '/',
            maxAge: 31536000,
            sameSite: 'lax',
        });
    }

    return response;
}

// Only run middleware on pages, not APIs or static files
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
