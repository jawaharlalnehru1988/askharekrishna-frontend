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

// Audio API Types
// API Endpoints:
// - List/Create: https://api.askharekrishna.com/api/v1/audio-bg/
// - Detail/Update/Delete: https://api.askharekrishna.com/api/v1/audio-bg/{id}/
// - Seed: https://api.askharekrishna.com/audio-bg
export interface AudioItemAPI {
    id: number;
    audioListId: string;
    title: string;
    description: string;
    language: string;
    duration: string;
    audioUrl: string;
    isPlaying: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * Fetch all audios from the API via Next.js API route
 */
export async function fetchAudios(): Promise<AudioItemAPI[]> {
    try {
        const response = await fetch('/api/audios', {
            cache: 'no-store', // Always fetch fresh data
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch audios: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching audios:', error);
        throw error;
    }
}

/**
 * Fetch audios filtered by audioListId via Next.js API route
 */
export async function fetchAudiosByListId(audioListId: string): Promise<AudioItemAPI[]> {
    try {
        const response = await fetch(`/api/audios?audioListId=${audioListId}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch audios: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching audios for list ${audioListId}:`, error);
        throw error;
    }
}

/**
 * Fetch a single audio by ID (for detail/update/delete operations)
 * Note: This would require creating a separate API route for individual audio items
 */
export async function fetchAudioById(id: number): Promise<AudioItemAPI> {
    try {
        const response = await fetch(`/api/audios/${id}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch audio: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching audio ${id}:`, error);
        throw error;
    }
}

/**
 * Convert API duration format (MM.SS) to MM:SS format
 */
export function formatDuration(duration: string): string {
    // API returns duration as "10.15" (MM.SS format)
    // Convert to "10:15" (MM:SS format)
    return duration.replace('.', ':');
}
