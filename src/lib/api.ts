import { Locale } from './dictionaries';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function fetchWithLanguage(endpoint: string, locale: Locale, options: RequestInit = {}) {
    const headers = new Headers(options.headers);
    headers.set('X-Language', locale);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
}
