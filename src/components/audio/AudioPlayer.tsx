
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, Volume2, RotateCcw, Repeat, SkipBack, SkipForward } from 'lucide-react';

import { Resource } from './types';

export interface AudioTrack {
    id: number;
    title: string;
    description: string;
    duration: string;
    audioUrl: string;
    coverImage: string;
    artist: string;
    chapter: number;
    category: string;
}

export interface AudioPlayerProps {
    // Basic Mode (StoriesPage)
    url?: string;
    title?: string;
    onEnded?: () => void;
    onNext?: () => void;
    onPrevious?: () => void;
    resource?: Resource;
    playing?: boolean;
    setPlaying?: (playing: boolean) => void;

    // Advanced Mode (Bhagavad Gita)
    currentTrack?: AudioTrack;
    playlist?: AudioTrack[];
    onTrackChange?: (track: AudioTrack) => void;
    onPlayPause?: () => void;
    isPlaying?: boolean;
    backHref?: string;
    onBack?: () => void;
    playlistTitle?: string;
    playlistTabs?: { id: string; label: string }[];
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
    url,
    title,
    onEnded,
    onNext,
    onPrevious,
    resource,
    playing: simplePlaying,
    setPlaying: setSimplePlaying,
    currentTrack,
    playlist,
    onTrackChange,
    onPlayPause,
    isPlaying: advancedPlaying,
    onBack
}) => {
    // Unified state handling
    const isAdvancedMode = !!currentTrack;
    const playing = isAdvancedMode ? !!advancedPlaying : !!simplePlaying;
    const setPlaying = (p: boolean) => {
        if (isAdvancedMode) {
            if (onPlayPause) onPlayPause();
        } else {
            if (setSimplePlaying) setSimplePlaying(p);
        }
    };

    const ensureAbsoluteUrl = (path: string | null | undefined) => {
        if (!path) return "";
        if (path.startsWith('http')) return path;
        const apiBase = "https://api.askharekrishna.com";
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${apiBase}${cleanPath}`;
    };

    const activeUrl = currentTrack?.audioUrl || url || "";
    const activeTitle = currentTrack?.title || title || resource?.title || "Devotional Audio";
    const activeImage = ensureAbsoluteUrl(currentTrack?.coverImage || resource?.imagePath);

    const [isRepeat, setIsRepeat] = useState(false);
    const [duration, setDuration] = useState(0);
    const [played, setPlayed] = useState(0);
    const [seeking, setSeeking] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [loading, setLoading] = useState(true);

    const audioRef = useRef<HTMLAudioElement>(null);

    // Position Restoration
    useEffect(() => {
        if (!activeUrl || !audioRef.current) return;

        const savedTime = localStorage.getItem(`audio_pos_${activeUrl}`);
        if (savedTime) {
            const time = parseFloat(savedTime);
            const audio = audioRef.current;
            if (audio && (isNaN(audio.duration) || time < audio.duration - 5)) {
                audio.currentTime = time;
            } else if (audio && !isNaN(audio.duration)) {
                audio.currentTime = 0;
            } else {
                audio.currentTime = time;
            }
        }
    }, [activeUrl]);

    useEffect(() => {
        setLoading(true);
        setPlayed(0);
        setPlaying(true);
    }, [activeUrl]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Playback state persistence
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
                    console.warn("Playback blocked:", err);
                    setPlaying(false);
                });
            }
        } else {
            audio.pause();
        }
    }, [playing, activeUrl]);

    // Media Session API Support
    useEffect(() => {
        if (!('mediaSession' in navigator)) return;

        navigator.mediaSession.metadata = new MediaMetadata({
            title: activeTitle,
            artist: currentTrack?.artist || resource?.authorName || 'Sri Krishna Kirtan',
            album: currentTrack?.category || resource?.category || 'Devotional Stories',
            artwork: [
                { src: activeImage || 'https://raw.githubusercontent.com/jawaharlalnehru1988/krishna-kirtan/main/public/logo512.png', sizes: '512x512', type: 'image/png' },
            ]
        });

        navigator.mediaSession.setActionHandler('play', () => setPlaying(true));
        navigator.mediaSession.setActionHandler('pause', () => setPlaying(false));
        navigator.mediaSession.setActionHandler('previoustrack', () => onPrevious?.());
        navigator.mediaSession.setActionHandler('nexttrack', () => onNext?.() || onEnded?.());

        return () => {
            navigator.mediaSession.setActionHandler('play', null);
            navigator.mediaSession.setActionHandler('pause', null);
            navigator.mediaSession.setActionHandler('previoustrack', null);
            navigator.mediaSession.setActionHandler('nexttrack', null);
        };
    }, [activeUrl, activeTitle, activeImage, onEnded, onNext, onPrevious]);

    const handlePlayPause = () => setPlaying(!playing);

    const onTimeUpdate = () => {
        if (!seeking && audioRef.current) {
            const current = audioRef.current.currentTime;
            const total = audioRef.current.duration;
            if (total > 0) {
                setPlayed(current / total);
                if (Math.floor(current) % 5 === 0) {
                    localStorage.setItem(`audio_pos_${activeUrl}`, current.toString());
                }
            }
        }
    };

    const onLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
            setLoading(false);
        }
    };

    const handleSeekMouseDown = () => setSeeking(true);
    const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => setPlayed(parseFloat(e.target.value));
    const handleSeekMouseUp = (e: any) => {
        setSeeking(false);
        const value = parseFloat(e.target.value);
        if (audioRef.current && !isNaN(value)) {
            audioRef.current.currentTime = value * audioRef.current.duration;
            setPlayed(value);
        }
    };

    const handleAudioEnded = () => {
        localStorage.removeItem(`audio_pos_${activeUrl}`);
        if (isRepeat && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        } else if (onNext) {
            onNext();
        } else {
            setPlaying(false);
            if (onEnded) onEnded();
        }
    };

    const formatTime = (seconds: number) => {
        if (typeof seconds !== 'number' || isNaN(seconds)) return '0:00';
        const mm = Math.floor(seconds / 60);
        const ss = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${mm}:${ss}`;
    };

    const handleDownload = async () => {
        try {
            const response = await fetch(activeUrl);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `${activeTitle}.m4a`;
            link.click();
        } catch (error) {
            window.open(activeUrl, '_blank');
        }
    };

    return (
        <div className="w-full bg-stone-800/10 dark:bg-stone-900/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 dark:border-stone-800/50 shadow-2xl relative overflow-hidden transition-all duration-500">
            {/* Dynamic Background Image */}
            {activeImage && (
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center scale-110 blur-[2px] opacity-80 transition-all duration-1000"
                        style={{ backgroundImage: `url('${activeImage}')` }}
                    />
                    <div className="absolute inset-0 bg-stone-900/20" />
                </div>
            )}

            {loading && (
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-shimmer"></div>
            )}

            <audio
                ref={audioRef}
                src={activeUrl}
                onTimeUpdate={onTimeUpdate}
                onLoadedMetadata={onLoadedMetadata}
                onEnded={handleAudioEnded}
                onError={() => setLoading(false)}
                onWaiting={() => setLoading(true)}
                onPlaying={() => setLoading(false)}
                preload="auto"
            />

            <div className="flex flex-col gap-6 relative z-10">
                {/* Header for Advanced Mode */}
                {isAdvancedMode && (
                    <div className="flex items-center justify-between mb-2">
                        <button onClick={onBack} className="text-stone-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold">
                            <SkipBack size={16} /> Back
                        </button>
                        <h3 className="text-white font-black tracking-tight text-center flex-grow px-4 truncate">
                            {activeTitle}
                        </h3>
                        <div className="w-10" /> {/* Spacer */}
                    </div>
                )}

                {/* Progress Bar Section */}
                <div className="space-y-2">
                    <div className="relative h-2 w-full bg-white/10 rounded-full cursor-pointer group">
                        <input
                            type="range"
                            min={0}
                            max={0.999999}
                            step="any"
                            value={played || 0}
                            onMouseDown={handleSeekMouseDown}
                            onChange={handleSeekChange}
                            onMouseUp={handleSeekMouseUp}
                            onTouchEnd={handleSeekMouseUp}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
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
                    <div className="flex items-center gap-4 sm:gap-8">
                        <button
                            onClick={() => { if (audioRef.current) audioRef.current.currentTime = 0; setPlayed(0); }}
                            className="p-2 text-stone-400 hover:text-white transition-colors"
                        >
                            <RotateCcw size={20} />
                        </button>

                        <button
                            onClick={onPrevious}
                            disabled={!onPrevious}
                            className="p-2 text-stone-400 hover:text-white transition-colors disabled:opacity-20"
                        >
                            <SkipBack size={24} fill="currentColor" />
                        </button>

                        <button
                            onClick={handlePlayPause}
                            className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-600 hover:bg-orange-500 text-white rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl shadow-orange-900/40"
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
                        >
                            <SkipForward size={24} fill="currentColor" />
                        </button>

                        <button
                            onClick={() => setIsRepeat(!isRepeat)}
                            className={`p-2 transition-colors ${isRepeat ? 'text-orange-500' : 'text-stone-400 hover:text-white'}`}
                        >
                            <Repeat size={20} />
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-8 w-full border-t border-white/5 pt-4">
                        <div className="flex items-center gap-3 group">
                            <Volume2 size={18} className="text-stone-400" />
                            <div className="w-24 sm:w-32 h-1.5 bg-white/10 rounded-full relative">
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
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-xl" />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all border border-white/10 active:scale-95"
                        >
                            <Download size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;
