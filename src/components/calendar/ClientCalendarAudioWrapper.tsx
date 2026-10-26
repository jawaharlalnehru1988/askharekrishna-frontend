"use client";

import React, { useMemo, useState } from 'react';
import AudioPlayer from '@/components/audio/AudioPlayer';

interface ClientCalendarAudioWrapperProps {
    id: number;
    title: string;
    audioUrl: string | null;
    imageUrl?: string | null;
}

function toAbsoluteAudioUrl(path: string | null): string | null {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) {
        if (path.includes('127.0.0.1') || path.includes('localhost')) {
            return path.replace(/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?/, 'https://api.askharekrishna.com');
        }
        return path;
    }
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `https://api.askharekrishna.com${cleanPath}`;
}

export default function ClientCalendarAudioWrapper({
    id,
    title,
    audioUrl,
    imageUrl,
}: ClientCalendarAudioWrapperProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const resolvedUrl = useMemo(() => toAbsoluteAudioUrl(audioUrl), [audioUrl]);

    if (!resolvedUrl) return null;

    return (
        <div className="w-full my-6">
            <AudioPlayer
                url={resolvedUrl}
                title={title}
                playing={isPlaying}
                setPlaying={setIsPlaying}
                resource={{
                    id,
                    category: 'Vaishnava Calendar',
                    audioPath: resolvedUrl,
                    imagePath: imageUrl || null,
                    videoPath: null,
                    translations: [],
                    title,
                    authorName: 'Sri Krishna Kirtan',
                    description: title,
                    tamilLyrics: '',
                    englishLyrics: '',
                    order: 0,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                }}
            />
        </div>
    );
}
