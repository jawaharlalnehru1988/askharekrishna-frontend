import { NextResponse } from 'next/server';

const AUDIO_API_BASE_URL = 'https://api.askharekrishna.com/api/api/v1';

export async function GET(request: Request) {
    try {
        // Get the search params from the request URL
        const { searchParams } = new URL(request.url);
        const audioListId = searchParams.get('audioListId');

        // Fetch from the external API (updated endpoint)
        const apiUrl = `${AUDIO_API_BASE_URL}/audio-bg/`;
        const response = await fetch(apiUrl, {
            cache: 'no-store',
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `Failed to fetch audios: ${response.statusText}` },
                { status: response.status }
            );
        }

        let data = await response.json();

        // Filter by audioListId if provided
        if (audioListId) {
            data = data.filter((audio: any) => audio.audioListId === audioListId);
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in audios API route:', error);
        return NextResponse.json(
            { error: 'Failed to fetch audios' },
            { status: 500 }
        );
    }
}
