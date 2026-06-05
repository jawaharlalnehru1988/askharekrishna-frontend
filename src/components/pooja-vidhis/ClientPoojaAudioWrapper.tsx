"use client";

import React, { useMemo, useState } from 'react';
import AudioPlayer from '@/components/audio/AudioPlayer';

interface PoojaAudioArticle {
    id: number;
    mainTopic: string;
    subTopic: string;
    audioPath: string | null;
    articleImage: string | null;
    created_at: string;
    updated_at: string;
    order: number;
}

interface ClientPoojaAudioWrapperProps {
    article: PoojaAudioArticle;
}

function toAbsoluteAudioUrl(path: string | null): string | null {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `https://api.askharekrishna.com${cleanPath}`;
}

export default function ClientPoojaAudioWrapper({ article }: ClientPoojaAudioWrapperProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioUrl = useMemo(() => toAbsoluteAudioUrl(article.audioPath), [article.audioPath]);

    if (!audioUrl) return null;

    return (
        <AudioPlayer
            url={audioUrl}
            title={article.subTopic}
            playing={isPlaying}
            setPlaying={setIsPlaying}
            resource={{
                id: article.id,
                category: article.mainTopic,
                audioPath: audioUrl,
                imagePath: article.articleImage,
                videoPath: null,
                translations: [],
                title: article.subTopic,
                authorName: 'Sri Krishna Kirtan',
                description: article.mainTopic,
                tamilLyrics: '',
                englishLyrics: '',
                order: article.order,
                created_at: article.created_at,
                updated_at: article.updated_at,
            }}
        />
    );
}