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

export default function ClientAudioWrapper({
    matchedStory,
    categoryName,
    nextStoryId,
    prevStoryId
}: ClientAudioWrapperProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const router = useRouter();
    const { locale } = useLanguage();

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

    return (
        <AudioPlayer
            url={matchedStory.audioPath}
            title={matchedStory.subTopic}
            playing={isPlaying}
            setPlaying={setIsPlaying}
            onNext={handleNextStory}
            onPrevious={handlePreviousStory}
            resource={{
                id: matchedStory.id,
                category: categoryName,
                audioPath: matchedStory.audioPath,
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
