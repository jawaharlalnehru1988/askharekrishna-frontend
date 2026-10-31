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
    onPlayPause?: (playing: boolean) => void;
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
            if (p !== playing && onPlayPause) onPlayPause(p);
        } else {
            if (setSimplePlaying) setSimplePlaying(p);
        }
    };

    const ensureAbsoluteUrl = (path: string | null | undefined) => {
        if (!path) return "";
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        const apiBase = "https://api.askharekrishna.com";
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        const mediaPath = cleanPath.startsWith('/media/') ? cleanPath : `/media${cleanPath}`;
        return `${apiBase}${mediaPath}`;
    };

    const activeUrl = ensureAbsoluteUrl(currentTrack?.audioUrl || url || "");
    const activeTitle = currentTrack?.title || title || resource?.title || "Devotional Articles / Audio";
    const activeImage = ensureAbsoluteUrl(currentTrack?.coverImage || resource?.imagePath);

    const [isRepeat, setIsRepeat] = useState(false);
    const [duration, setDuration] = useState(0);
    const [played, setPlayed] = useState(0);
    const [seeking, setSeeking] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [isBuffering, setIsBuffering] = useState(false);

    const audioRef = useRef<HTMLAudioElement>(null);
    const pendingRestoreUrlRef = useRef<string>('');
    const stallTimerRef = useRef<NodeJS.Timeout | null>(null);
    const positionSaveThrottleRef = useRef<number>(0);

    // Reset progress and timers whenever the active audio URL changes
    useEffect(() => {
        const audio = audioRef.current;
        if (audio && !audio.paused) {
            audio.pause();
        }
        setIsBuffering(false);
        setPlayed(0);
        setDuration(0);
        pendingRestoreUrlRef.current = activeUrl;
        if (stallTimerRef.current) {
            clearTimeout(stallTimerRef.current);
            stallTimerRef.current = null;
        }
    }, [activeUrl]);

    // Volume control
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Cleanup stall timer on unmount
    useEffect(() => {
        return () => {
            if (stallTimerRef.current) {
                clearTimeout(stallTimerRef.current);
                stallTimerRef.current = null;
            }
        };
    }, []);

    // Synchronize prop-level play/pause (e.g. from parent or external controls)
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (playing) {
            if (audio.paused) {
                setIsBuffering(true);
                const p = audio.play();
                if (p !== undefined) {
                    p.then(() => setIsBuffering(false)).catch((err: any) => {
                        if (err?.name === 'AbortError') return;
                        console.warn("[AudioPlayer] Playback blocked:", err);
                        setIsBuffering(false);
                        setPlaying(false);
                    });
                }
            }
        } else {
            if (!audio.paused) {
                audio.pause();
            }
            setIsBuffering(false);
        }
    }, [playing]);

    // Media Session API Support (lockscreen / notification media controls)
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

        navigator.mediaSession.setActionHandler('play', () => handlePlayPause());
        navigator.mediaSession.setActionHandler('pause', () => {
            if (audioRef.current) audioRef.current.pause();
            setPlaying(false);
            setIsBuffering(false);
        });
        navigator.mediaSession.setActionHandler('previoustrack', () => onPrevious?.());
        navigator.mediaSession.setActionHandler('nexttrack', () => onNext?.() || onEnded?.());

        return () => {
            navigator.mediaSession.setActionHandler('play', null);
            navigator.mediaSession.setActionHandler('pause', null);
            navigator.mediaSession.setActionHandler('previoustrack', null);
            navigator.mediaSession.setActionHandler('nexttrack', null);
        };
    }, [activeUrl, activeTitle, activeImage, onEnded, onNext, onPrevious]);

    // Direct synchronous user interaction handler for mobile & desktop
    const handlePlayPause = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (playing) {
            audio.pause();
            setPlaying(false);
            setIsBuffering(false);
            if (stallTimerRef.current) {
                clearTimeout(stallTimerRef.current);
                stallTimerRef.current = null;
            }
        } else {
            setIsBuffering(true);
            setPlaying(true);

            // Restore saved position if available
            const savedTime = localStorage.getItem(`audio_pos_${activeUrl}`);
            if (savedTime && audio.currentTime === 0) {
                const t = parseFloat(savedTime);
                if (!isNaN(t) && t > 0) {
                    try {
                        audio.currentTime = t;
                    } catch (_) {}
                }
            }

            // Invoked synchronously in the direct user-gesture event context
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsBuffering(false);
                    })
                    .catch((err: any) => {
                        if (err?.name === 'AbortError') return;
                        console.warn("[AudioPlayer] Direct play error:", err);
                        setIsBuffering(false);
                        setPlaying(false);
                    });
            }
        }
    };

    const onTimeUpdate = () => {
        if (!seeking && audioRef.current) {
            const current = audioRef.current.currentTime;
            const total = audioRef.current.duration;
            if (isFinite(total) && total > 0) {
                setPlayed(current / total);
                // Save progress every 3 seconds
                const now = Date.now();
                if (now - positionSaveThrottleRef.current > 3000) {
                    positionSaveThrottleRef.current = now;
                    localStorage.setItem(`audio_pos_${activeUrl}`, current.toString());
                }
            }
        }
    };

    const onLoadedMetadata = () => {
        const audio = audioRef.current;
        if (!audio) return;
        const dur = audio.duration;
        if (isFinite(dur) && dur > 0) {
            setDuration(dur);
        }
        setIsBuffering(false);

        // Restore saved position safely
        const url = pendingRestoreUrlRef.current;
        if (url) {
            const savedTime = localStorage.getItem(`audio_pos_${url}`);
            if (savedTime) {
                const time = parseFloat(savedTime);
                if (!isNaN(time) && time > 0 && (!isFinite(dur) || dur <= 0 || time < dur - 5)) {
                    try {
                        audio.currentTime = time;
                        if (isFinite(dur) && dur > 0) {
                            setPlayed(time / dur);
                        }
                    } catch (e) {
                        console.warn("[AudioPlayer] Could not restore saved position:", e);
                    }
                }
            }
            pendingRestoreUrlRef.current = '';
        }
    };

    const onCanPlay = () => {
        const audio = audioRef.current;
        if (!audio) return;
        setIsBuffering(false);
        if (isFinite(audio.duration) && audio.duration > 0 && duration === 0) {
            setDuration(audio.duration);
        }
    };

    const onWaiting = () => {
        if (playing) {
            setIsBuffering(true);
        }
    };

    const onPlaying = () => {
        setIsBuffering(false);
        setPlaying(true);
        if (stallTimerRef.current) {
            clearTimeout(stallTimerRef.current);
            stallTimerRef.current = null;
        }
    };

    // Spotify-like automatic stall recovery
    const handleStalled = () => {
        if (!playing) return;
        setIsBuffering(true);
        if (stallTimerRef.current) clearTimeout(stallTimerRef.current);

        // If buffer is stuck for 3.5s while playing, reconnect the stream seamlessly
        stallTimerRef.current = setTimeout(() => {
            const audio = audioRef.current;
            if (audio && playing) {
                console.log("[AudioPlayer] Stream stalled, auto-recovering...");
                const currentPos = audio.currentTime;
                audio.load();
                audio.currentTime = currentPos;
                audio.play().catch(console.warn);
            }
        }, 3500);
    };

    const onError = (e: any) => {
        console.warn("[AudioPlayer] Audio playback element error:", e);
        setIsBuffering(false);
    };

    const handleSeekMouseDown = () => setSeeking(true);
    const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => setPlayed(parseFloat(e.target.value));
    const handleSeekMouseUp = (e: any) => {
        setSeeking(false);
        const value = parseFloat(e.target.value);
        if (audioRef.current && !isNaN(value)) {
            const targetTime = value * audioRef.current.duration;
            if (isFinite(targetTime)) {
                audioRef.current.currentTime = targetTime;
                setPlayed(value);
            }
        }
    };

    const handleAudioEnded = () => {
        localStorage.removeItem(`audio_pos_${activeUrl}`);
        if (isRepeat && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(console.warn);
        } else if (onNext) {
            onNext();
        } else {
            setPlaying(false);
            setIsBuffering(false);
            if (onEnded) onEnded();
        }
    };

    const formatTime = (seconds: number) => {
        if (typeof seconds !== 'number' || isNaN(seconds) || !isFinite(seconds) || seconds <= 0) return '0:00';
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
            link.download = `${activeTitle}.mp3`;
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

            {/* Buffering Shimmer Indicator */}
            {isBuffering && (
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-shimmer"></div>
            )}

            {/* Native HTML5 Audio with Spotify-grade mobile streaming support */}
            <audio
                ref={audioRef}
                src={activeUrl}
                preload="metadata"
                playsInline
                crossOrigin="anonymous"
                onTimeUpdate={onTimeUpdate}
                onLoadedMetadata={onLoadedMetadata}
                onCanPlay={onCanPlay}
                onWaiting={onWaiting}
                onPlaying={onPlaying}
                onPause={() => setIsBuffering(false)}
                onStalled={handleStalled}
                onEnded={handleAudioEnded}
                onError={onError}
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
                            onTouchStart={handleSeekMouseDown}
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
                            className="p-2 text-stone-400 hover:text-white transition-colors cursor-pointer"
                            aria-label="Restart"
                        >
                            <RotateCcw size={20} />
                        </button>

                        <button
                            onClick={onPrevious}
                            disabled={!onPrevious}
                            className="p-2 text-stone-400 hover:text-white transition-colors disabled:opacity-20 cursor-pointer"
                            aria-label="Previous Track"
                        >
                            <SkipBack size={24} fill="currentColor" />
                        </button>

                        {/* Always-interactive Play/Pause button (never deadlocked/disabled) */}
                        <button
                            onClick={handlePlayPause}
                            className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-600 hover:bg-orange-500 text-white rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl shadow-orange-900/40 relative cursor-pointer"
                            aria-label={playing ? "Pause" : "Play"}
                        >
                            {isBuffering && playing ? (
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
                            className="p-2 text-stone-400 hover:text-white transition-colors disabled:opacity-20 cursor-pointer"
                            aria-label="Next Track"
                        >
                            <SkipForward size={24} fill="currentColor" />
                        </button>

                        <button
                            onClick={() => setIsRepeat(!isRepeat)}
                            className={`p-2 transition-colors cursor-pointer ${isRepeat ? 'text-orange-500' : 'text-stone-400 hover:text-white'}`}
                            aria-label="Toggle Repeat"
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
                            className="flex items-center gap-2 px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all border border-white/10 active:scale-95 cursor-pointer"
                            aria-label="Download Audio"
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
