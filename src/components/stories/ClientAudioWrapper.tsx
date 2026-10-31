"use client";

import React, { useState } from 'react';
import AudioPlayer from '@/components/audio/AudioPlayer';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/providers/LanguageContext';

interface ClientAudioWrapperProps {
    matchedStory: any;
    categoryName: string;
    nextStoryId?: number;
    prevStoryId?: number;
}

function toAbsoluteAudioUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const clean = path.startsWith('/') ? path : `/${path}`;
    const mediaPath = clean.startsWith('/media/') ? clean : `/media${clean}`;
    return `https://api.askharekrishna.com${mediaPath}`;
}

export default function ClientAudioWrapper({
    matchedStory,
    categoryName,
    nextStoryId,
    prevStoryId
}: ClientAudioWrapperProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const router = useRouter();
    const { locale } = useLanguage();

    const audioUrl = toAbsoluteAudioUrl(matchedStory.audioPath);

    const handleNextStory = () => {
        if (nextStoryId) {
            router.push(`/stories/${nextStoryId}?lang=${locale}`);
        }
    };

    const handlePreviousStory = () => {
        if (prevStoryId) {
            router.push(`/stories/${prevStoryId}?lang=${locale}`);
        }
    };

    if (!audioUrl) return null;

    return (
        <AudioPlayer
            url={audioUrl}
            title={matchedStory.subTopic}
            playing={isPlaying}
            setPlaying={setIsPlaying}
            onNext={handleNextStory}
            onPrevious={handlePreviousStory}
            resource={{
                id: matchedStory.id,
                category: categoryName,
                audioPath: audioUrl,
                imagePath: matchedStory.imageUrl || matchedStory.imagePath || matchedStory.articleImage || null,
                videoPath: null,
                translations: [],
                title: matchedStory.subTopic,
                authorName: "Sri Krishna Kirtan",
                description: matchedStory.mainTopic?.toString() || '',
                tamilLyrics: "",
                englishLyrics: "",
                order: matchedStory.order,
                created_at: matchedStory.created_at,
                updated_at: matchedStory.updated_at
            }}
        />
    );
}
