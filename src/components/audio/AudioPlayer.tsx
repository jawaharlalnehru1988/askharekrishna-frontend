
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, Volume2, RotateCcw, Repeat, SkipBack, SkipForward } from 'lucide-react';

import { Resource } from './types';

interface AudioPlayerProps {
    url: string;
    title?: string;
    onEnded?: () => void;
    onNext?: () => void;
    onPrevious?: () => void;
    resource?: Resource;
    playing: boolean;
    setPlaying: (playing: boolean) => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ url, title, onEnded, onNext, onPrevious, resource, playing, setPlaying }) => {
    const [isRepeat, setIsRepeat] = useState(false);
    const [duration, setDuration] = useState(0);
    const [played, setPlayed] = useState(0);
    const [seeking, setSeeking] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [loading, setLoading] = useState(true);

    const audioRef = useRef<HTMLAudioElement>(null);

    // Position Restoration
    useEffect(() => {
        if (!url || !audioRef.current) return;

        const savedTime = localStorage.getItem(`audio_pos_${url}`);
        if (savedTime) {
            const time = parseFloat(savedTime);
            // Only restore if not at the very end (within 5 seconds) to prevent immediate skipping
            const audio = audioRef.current;
            if (audio && (isNaN(audio.duration) || time < audio.duration - 5)) {
                audio.currentTime = time;
            } else if (audio && !isNaN(audio.duration)) {
                audio.currentTime = 0;
            } else {
                // If duration unknown yet, we'll check again in loadedmetadata
                audio.currentTime = time;
            }
        }
    }, [url]);

    useEffect(() => {
        setLoading(true);
        setPlayed(0);
        setPlaying(true);
    }, [url]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Playback state persistence across refreshes
    useEffect(() => {
        sessionStorage.setItem('kirtan_isPlaying', playing.toString());
    }, [playing]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (playing) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(err => {
                    console.warn("Playback resume failed (likely autoplay policy):", err);
                    setPlaying(false); // Reset to show play button if blocked
                });
            }
        } else {
            audio.pause();
        }
    }, [playing, url]);

    // Media Session API Support
    useEffect(() => {
        if (!('mediaSession' in navigator)) return;

        navigator.mediaSession.metadata = new MediaMetadata({
            title: title || resource?.title || 'Sri Krishna Kirtan',
            artist: resource?.authorName || 'Sri Krishna Kirtan',
            album: resource?.category || 'Kirtan Academy',
            artwork: [
                { src: resource?.imagePath || 'https://raw.githubusercontent.com/jawaharlalnehru1988/krishna-kirtan/main/public/logo192.png', sizes: '96x96', type: 'image/png' },
                { src: resource?.imagePath || 'https://raw.githubusercontent.com/jawaharlalnehru1988/krishna-kirtan/main/public/logo512.png', sizes: '128x128', type: 'image/png' },
                { src: resource?.imagePath || 'https://raw.githubusercontent.com/jawaharlalnehru1988/krishna-kirtan/main/public/logo512.png', sizes: '192x192', type: 'image/png' },
                { src: resource?.imagePath || 'https://raw.githubusercontent.com/jawaharlalnehru1988/krishna-kirtan/main/public/logo512.png', sizes: '256x256', type: 'image/png' },
                { src: resource?.imagePath || 'https://raw.githubusercontent.com/jawaharlalnehru1988/krishna-kirtan/main/public/logo512.png', sizes: '384x384', type: 'image/png' },
                { src: resource?.imagePath || 'https://raw.githubusercontent.com/jawaharlalnehru1988/krishna-kirtan/main/public/logo512.png', sizes: '512x512', type: 'image/png' },
            ]
        });

        navigator.mediaSession.setActionHandler('play', () => setPlaying(true));
        navigator.mediaSession.setActionHandler('pause', () => setPlaying(false));
        navigator.mediaSession.setActionHandler('seekbackward', () => {
            if (audioRef.current) audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
        });
        navigator.mediaSession.setActionHandler('seekforward', () => {
            if (audioRef.current) audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, audioRef.current.duration);
        });
        navigator.mediaSession.setActionHandler('previoustrack', () => {
            if (onPrevious) {
                onPrevious();
            } else if (audioRef.current) {
                audioRef.current.currentTime = 0;
            }
        });
        navigator.mediaSession.setActionHandler('nexttrack', () => {
            if (onNext) {
                onNext();
            } else if (onEnded) {
                onEnded();
            }
        });

        return () => {
            navigator.mediaSession.setActionHandler('play', null);
            navigator.mediaSession.setActionHandler('pause', null);
            navigator.mediaSession.setActionHandler('seekbackward', null);
            navigator.mediaSession.setActionHandler('seekforward', null);
            navigator.mediaSession.setActionHandler('previoustrack', null);
            navigator.mediaSession.setActionHandler('nexttrack', null);
        };
    }, [url, title, resource, onEnded, onNext, onPrevious]);

    // Update playback state for Media Session
    useEffect(() => {
        if (!('mediaSession' in navigator)) return;
        navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
    }, [playing]);

    const handlePlayPause = () => setPlaying(!playing);

    const onTimeUpdate = () => {
        if (!seeking && audioRef.current) {
            const current = audioRef.current.currentTime;
            const total = audioRef.current.duration;
            if (total > 0) {
                setPlayed(current / total);

                // Persist position every ~5 seconds to avoid excessive writes
                if (Math.floor(current) % 5 === 0) {
                    localStorage.setItem(`audio_pos_${url}`, current.toString());
                }
            }
        }
    };

    const onLoadedMetadata = () => {
        if (audioRef.current) {
            const total = audioRef.current.duration;
            setDuration(total);
            setLoading(false);

            // Double check if we were restored to the very end
            const savedTime = localStorage.getItem(`audio_pos_${url}`);
            if (savedTime) {
                const time = parseFloat(savedTime);
                if (time >= total - 2) {
                    audioRef.current.currentTime = 0;
                    setPlayed(0);
                    localStorage.removeItem(`audio_pos_${url}`);
                }
            }
        }
    };

    const handleSeekMouseDown = () => {
        setSeeking(true);
    };

    const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlayed(parseFloat(e.target.value));
    };

    const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
        setSeeking(false);
        const value = parseFloat((e.target as HTMLInputElement).value);
        if (audioRef.current && !isNaN(value)) {
            const time = value * audioRef.current.duration;
            audioRef.current.currentTime = time;
            setPlayed(value);
        }
    };

    const handleAudioEnded = () => {
        // Clear saved position so next time it starts from beginning
        localStorage.removeItem(`audio_pos_${url}`);

        if (isRepeat && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(err => console.warn("Repeat playback failed:", err));
        } else if (onNext) {
            // Guard: stop autoplaying if we are skipping too many lessons instantly
            // (handled partially by clearing localStorage, but this is an extra layer)
            onNext();
        } else {
            setPlaying(false);
            if (onEnded) onEnded();
        }
    };

    const handleAudioError = (e: any) => {
        console.error("Audio playback error:", e);
        setLoading(false);
        setPlaying(false);
        // Do NOT call onNext here to prevent infinite error-skip loops
    };

    const handleRepeatToggle = () => setIsRepeat(!isRepeat);

    const formatTime = (seconds: number) => {
        if (typeof seconds !== 'number' || isNaN(seconds)) return '0:00';

        const date = new Date(seconds * 1000);
        const hh = date.getUTCHours();
        const mm = date.getUTCMinutes();
        const ss = date.getUTCSeconds().toString().padStart(2, '0');
        if (hh) {
            return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
        }
        return `${mm}:${ss}`;
    };

    const handleDownload = async () => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = title ? `${title}.m4a` : 'kirtan-lesson.m4a';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Download failed:', error);
            window.open(url, '_blank');
        }
    };

    return (
        <div className="w-full bg-stone-800/50 dark:bg-stone-900/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 dark:border-stone-800/50 shadow-2xl relative overflow-hidden transition-colors duration-300">
            {loading && (
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-shimmer"></div>
            )}

            <audio
                ref={audioRef}
                src={url}
                onTimeUpdate={onTimeUpdate}
                onLoadedMetadata={onLoadedMetadata}
                onEnded={handleAudioEnded}
                onError={handleAudioError}
                onWaiting={() => setLoading(true)}
                onPlaying={() => setLoading(false)}
                preload="auto"
            />

            <div className="flex flex-col gap-6">
                {/* Progress Bar Section */}
                <div className="space-y-2">
                    <div className="relative h-2 w-full bg-stone-700 rounded-full cursor-pointer group">
                        <input
                            type="range"
                            min={0}
                            max={0.999999}
                            step="any"
                            value={played || 0}
                            onMouseDown={handleSeekMouseDown}
                            onChange={handleSeekChange}
                            onMouseUp={handleSeekMouseUp}
                            onTouchStart={handleSeekMouseDown}
                            onTouchEnd={(e) => handleSeekMouseUp(e as any)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div
                            className="absolute top-0 left-0 h-full bg-orange-500 rounded-full transition-all duration-100 ease-out"
                            style={{ width: `${(played || 0) * 100}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform"></div>
                        </div>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-stone-400 uppercase tracking-widest">
                        <span>{formatTime(duration * (played || 0))}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Controls Section */}
                <div className="flex flex-col items-center gap-6">
                    {/* Primary Playback Controls */}
                    <div className="flex items-center gap-4 sm:gap-8">
                        <button
                            onClick={() => { if (audioRef.current) audioRef.current.currentTime = 0; setPlayed(0); }}
                            className="p-2 text-stone-400 hover:text-white transition-colors"
                            title="Restart"
                        >
                            <RotateCcw size={20} />
                        </button>

                        <button
                            onClick={onPrevious}
                            disabled={!onPrevious}
                            className="p-2 text-stone-400 hover:text-white transition-colors disabled:opacity-20"
                            title="Previous Lesson"
                        >
                            <SkipBack size={24} fill="currentColor" />
                        </button>

                        <button
                            onClick={handlePlayPause}
                            className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-600 hover:bg-orange-500 text-white rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl shadow-orange-900/40 disabled:opacity-50"
                            disabled={loading && played === 0}
                        >
                            {loading && played === 0 ? (
                                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : playing ? (
                                <Pause fill="white" size={32} />
                            ) : (
                                <Play fill="white" className="ml-1" size={32} />
                            )}
                        </button>

                        <button
                            onClick={onNext}
                            disabled={!onNext}
                            className="p-2 text-stone-400 hover:text-white transition-colors disabled:opacity-20"
                            title="Next Lesson"
                        >
                            <SkipForward size={24} fill="currentColor" />
                        </button>

                        <button
                            onClick={handleRepeatToggle}
                            className={`p-2 transition-colors ${isRepeat ? 'text-orange-500' : 'text-stone-400 hover:text-white'}`}
                            title={isRepeat ? "Disable Repeat" : "Enable Repeat"}
                        >
                            <Repeat size={20} className={isRepeat ? 'drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]' : ''} />
                        </button>
                    </div>

                    {/* Volume and Utilities Row */}
                    <div className="flex flex-wrap items-center justify-center gap-8 w-full border-t border-white/5 pt-4">
                        <div className="flex items-center gap-3 group">
                            <Volume2 size={18} className="text-stone-400" />
                            <div className="w-24 sm:w-32 h-1.5 bg-stone-700 rounded-full relative">
                                <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step="any"
                                    value={volume}
                                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div
                                    className="absolute top-0 left-0 h-full bg-orange-500/60 rounded-full"
                                    style={{ width: `${volume * 100}%` }}
                                >
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-xl border-2 border-orange-500 transform translate-x-1/2 active:scale-125 transition-transform"></div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all border border-white/10 group active:scale-95"
                        >
                            <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;
