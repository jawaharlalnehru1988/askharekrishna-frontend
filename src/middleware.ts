import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const hostHeader = request.headers.get('host') || '';
    const forwardedHost = request.headers.get('x-forwarded-host') || '';

    // Use the most reliable host source
    const host = forwardedHost || hostHeader || url.hostname;

    // Default to english
    let locale = 'en';

    // Robust check for subdomains
    const lowerHost = host.toLowerCase();
    if (lowerHost.startsWith('tamil.') || lowerHost.startsWith('ta.')) {
        locale = 'ta';
    } else if (lowerHost.startsWith('english.') || lowerHost.startsWith('en.')) {
        locale = 'en';
    }

    // Set the locale in a header for the server components
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-locale', locale);

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    // Also set it in the response header for client-side visibility
    response.headers.set('x-locale', locale);

    return response;
}

// Only run middleware on pages, not APIs or static files
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
