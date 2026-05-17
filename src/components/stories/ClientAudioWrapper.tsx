"use client";

import React, { useState } from 'react';
import AudioPlayer from '@/components/audio/AudioPlayer';
import { useRouter } from 'next/navigation';

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

    const handleNextStory = () => {
        if (nextStoryId) {
            router.push(`/stories/${nextStoryId}`);
        }
    };

    const handlePreviousStory = () => {
        if (prevStoryId) {
            router.push(`/stories/${prevStoryId}`);
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
                imagePath: matchedStory.imagePath || matchedStory.articleImage || null,
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
