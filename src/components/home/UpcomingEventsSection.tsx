"use client";

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Link from 'next/link';
import {
    Calendar as CalendarIcon,
    ArrowRight,
    Clock,
    Share2,
    BookOpen,
    Sparkles,
    CheckCircle2,
    Search,
    Filter,
    ChevronDown
} from 'lucide-react';
import { useLanguage } from '../providers/LanguageContext';

export interface CalendarObservanceTranslation {
    id: number;
    language_code: string;
    title: string;
    description: string | null;
    audio_file: string | null;
    audioUrl: string | null;
}

export interface CalendarObservance {
    id: number;
    category: string;
    order: number;
    image: string | null;
    imageUrl: string | null;
    title: string;
    description: string | null;
    audioUrl: string | null;
    break_fast_date?: string | null;
    break_fast_day_of_week?: string | null;
    break_fast_window?: string | null;
    translations: CalendarObservanceTranslation[];
}

export interface CalendarDay {
    id: number;
    event_date: string;
    day_of_week: string;
    is_ekadashi: boolean;
    ekadashi_name: string | null;
    is_fast_day: boolean;
    fast_details: string | null;
    break_fast_start: string | null;
    break_fast_end: string | null;
    break_fast_date?: string | null;
    break_fast_day_of_week?: string | null;
    break_fast_window?: string | null;
    observances: CalendarObservance[];
}

export interface FlatEventItem {
    id: number; // Observance ID (or Day ID fallback)
    day_id: number;
    event_date: string;
    day_of_week: string;
    is_ekadashi: boolean;
    ekadashi_name: string | null;
    is_fast_day: boolean;
    fast_details: string | null;
    break_fast_date: string | null;
    break_fast_day_of_week: string | null;
    break_fast_window: string | null;
    category: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
}

const UpcomingEventsSection = ({ isHomePage = true }: { isHomePage?: boolean }) => {
    const { locale, dictionary } = useLanguage();
    const u = dictionary?.upcomingEvents || {};
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.askharekrishna.com/api';

    const [events, setEvents] = useState<CalendarDay[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('all');

    useEffect(() => {
        const fetchUpcomingEvents = async () => {
            try {
                setLoading(true);
                const limit = isHomePage ? 16 : 120;
                const response = await axios.get(`${apiBaseUrl}/vaishnava-calendar/calendar-days/upcoming/?limit=${limit}&lang=${locale}`);
                const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
                setEvents(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching upcoming events:', err);
                setError('Failed to load upcoming events.');
            } finally {
                setLoading(false);
            }
        };

        fetchUpcomingEvents();
    }, [locale, apiBaseUrl, isHomePage]);

    const formatDate = (dateStr: string) => {
        try {
            const dateObj = new Date(dateStr);
            const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
            return dateObj.toLocaleDateString(locale === 'ta' ? 'ta-IN' : 'en-US', options);
        } catch {
            return dateStr;
        }
    };

    // Flatten day observances into individual separate event cards, filtering out standalone Parana cards
    const flatEvents = useMemo(() => {
        const items: FlatEventItem[] = [];

        for (const day of events) {
            if (!day.observances || day.observances.length === 0) {
                items.push({
                    id: day.id,
                    day_id: day.id,
                    event_date: day.event_date,
                    day_of_week: day.day_of_week,
                    is_ekadashi: day.is_ekadashi,
                    ekadashi_name: day.ekadashi_name,
                    is_fast_day: day.is_fast_day,
                    fast_details: day.fast_details,
                    break_fast_date: day.break_fast_date || null,
                    break_fast_day_of_week: day.break_fast_day_of_week || null,
                    break_fast_window: day.break_fast_window || null,
                    category: 'Observance',
                    title: day.ekadashi_name || day.event_date,
                    description: day.fast_details,
                    imageUrl: null,
                });
                continue;
            }

            const seenDescriptions = new Set<string>();
            for (const obs of day.observances) {
                // Filter out standalone Parana observances so they don't produce a standalone card
                if (obs.category === 'Parana') {
                    continue;
                }

                if (obs.description) {
                    const trimmed = obs.description.trim();
                    if (seenDescriptions.has(trimmed)) {
                        continue; // Deduplicate identical story article text on Ekadashis
                    }
                    seenDescriptions.add(trimmed);
                }

                items.push({
                    id: obs.id,
                    day_id: day.id,
                    event_date: day.event_date,
                    day_of_week: day.day_of_week,
                    is_ekadashi: obs.category === 'Ekadashi',
                    ekadashi_name: day.ekadashi_name,
                    is_fast_day: day.is_fast_day,
                    fast_details: day.fast_details,
                    break_fast_date: obs.break_fast_date || day.break_fast_date || null,
                    break_fast_day_of_week: obs.break_fast_day_of_week || day.break_fast_day_of_week || null,
                    break_fast_window: obs.break_fast_window || day.break_fast_window || null,
                    category: obs.category,
                    title: obs.title || day.ekadashi_name || day.event_date,
                    description: obs.description,
                    imageUrl: obs.imageUrl || obs.image,
                });
            }
        }

        return items;
    }, [events]);

    const handleWhatsAppShare = (item: FlatEventItem) => {
        const pageUrl = typeof window !== 'undefined' ? `${window.location.origin}/vaishnava-calendar/${item.id}` : `https://askharekrishna.com/vaishnava-calendar/${item.id}`;
        let message = `✨ *${item.title}*\n📅 Date: ${item.event_date} (${item.day_of_week})\n`;
        if (item.is_ekadashi) {
            message += `🌕 Ekadashi Fasting\n`;
        }
        if (item.break_fast_window) {
            message += `⏰ Break Fast: ${item.break_fast_date ? item.break_fast_date + ' ' : ''}${item.break_fast_window}\n`;
        }
        message += `Read full details here: ${pageUrl}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const filteredEvents = useMemo(() => {
        return flatEvents.filter(item => {
            let matchesFilter = true;
            const cat = (item.category || '').toLowerCase();

            if (filterCategory === 'ekadashi') {
                matchesFilter = item.is_ekadashi || cat.includes('ekadashi');
            } else if (filterCategory === 'festival') {
                matchesFilter = cat.includes('festival');
            } else if (filterCategory === 'appearance') {
                matchesFilter = cat.includes('appearance') || item.title.includes('Appearance') || item.title.includes('Disappearance');
            } else if (filterCategory === 'fasting') {
                matchesFilter = item.is_fast_day || cat.includes('fasting');
            } else if (filterCategory === 'observance') {
                matchesFilter = cat.includes('observance');
            }

            const query = searchQuery.toLowerCase();
            const matchesQuery = !query ||
                item.event_date.includes(query) ||
                (item.ekadashi_name && item.ekadashi_name.toLowerCase().includes(query)) ||
                item.title.toLowerCase().includes(query) ||
                (item.description && item.description.toLowerCase().includes(query));

            return matchesFilter && matchesQuery;
        });
    }, [flatEvents, filterCategory, searchQuery]);

    const displayEvents = isHomePage ? filteredEvents.slice(0, 8) : filteredEvents;

    const SkeletonCard = () => (
        <div className="flex flex-col bg-white dark:bg-[#1f1910] rounded-2xl border border-[#f3efe7] dark:border-neutral-800 p-6 animate-pulse shrink-0 w-[85vw] md:w-auto snap-center">
            <div className="h-4 w-28 bg-gray-200 dark:bg-neutral-800 rounded mb-4" />
            <div className="h-6 w-3/4 bg-gray-200 dark:bg-neutral-800 rounded mb-3" />
            <div className="h-4 w-1/2 bg-gray-100 dark:bg-neutral-800 rounded mb-6" />
            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-neutral-800 flex justify-between items-center">
                <div className="h-8 w-24 bg-gray-200 dark:bg-neutral-800 rounded-xl" />
                <div className="h-8 w-8 bg-gray-200 dark:bg-neutral-800 rounded-full" />
            </div>
        </div>
    );

    if (error || (!loading && flatEvents.length === 0 && isHomePage)) {
        return null;
    }

    return (
        <section className={`py-16 md:py-20 bg-gradient-to-b from-background-light via-[#fbf8f2] to-background-light dark:from-background-dark dark:via-[#19140b] to-background-dark ${isHomePage ? 'border-y border-[#f3efe7] dark:border-neutral-800/60' : ''}`}>
            <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div className={isHomePage ? 'text-left max-w-2xl' : 'text-center w-full max-w-3xl mx-auto'}>
                        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 bg-amber-500/10 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 font-bold uppercase tracking-[0.2em] text-xs rounded-full border border-amber-500/20">
                            <Sparkles size={14} />
                            <span>{u.badge || (locale === 'ta' ? 'வைஷ்ணவ நாட்காட்டி' : 'Vaishnava Calendar')}</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-text-main dark:text-white leading-tight">
                            {u.title || (locale === 'ta' ? 'வரவிருக்கும் வைஷ்ணவ விழாக்கள்' : 'Upcoming Devotional Events')}
                        </h2>
                        <p className="mt-3 text-base md:text-lg text-text-muted dark:text-gray-400 leading-relaxed">
                            {u.subtitle || (locale === 'ta' ? 'முக்கியமான விரத நாட்கள், ஏகாதசி மற்றும் ஆச்சார்யர்களின் திருநாட்கள்.' : 'Important fasting dates, Ekadashis, and sacred festivals.')}
                        </p>
                    </div>

                    {isHomePage && (
                        <div className="shrink-0">
                            <Link
                                href="/vaishnava-calendar"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500/10 hover:bg-amber-500 text-amber-600 hover:text-black font-bold rounded-xl transition-all border border-amber-500/30 hover:border-transparent shadow-sm active:scale-95 whitespace-nowrap"
                            >
                                <span>{u.viewAll || (locale === 'ta' ? 'அனைத்து நிகழ்வுகளையும் காண்க' : 'View All Events')}</span>
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    )}
                </div>

                {/* Filter and Search Bar for Full Page */}
                {!isHomePage && (
                    <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
                        <div className="relative w-full md:max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted size-5" />
                            <input
                                type="text"
                                placeholder={u.searchPlaceholder || (locale === 'ta' ? 'நிகழ்வுகளைத் தேடுங்கள்...' : 'Search events, Ekadashis...')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-[#1f1910] border border-[#f3efe7] dark:border-neutral-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-sm"
                            />
                        </div>

                        {/* Category Dropdown Selector */}
                        <div className="relative w-full md:w-auto min-w-[260px]">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none">
                                <Filter size={18} />
                            </div>
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="w-full pl-11 pr-10 py-3.5 bg-white dark:bg-[#1f1910] text-text-main dark:text-white font-bold border border-[#f3efe7] dark:border-neutral-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-sm appearance-none cursor-pointer shadow-sm hover:border-amber-500/50"
                            >
                                <option value="all">{locale === 'ta' ? 'அனைத்து வகைகளும் (All Categories)' : 'All Categories'}</option>
                                <option value="ekadashi">{locale === 'ta' ? '🌕 ஏகாதசி (Ekadashis)' : '🌕 Ekadashis'}</option>
                                <option value="festival">{locale === 'ta' ? '🎉 விழாக்கள் (Festivals)' : '🎉 Festivals & Celebrations'}</option>
                                <option value="appearance">{locale === 'ta' ? '✨ திரு நட்சத்திரங்கள் (Appearance Days)' : '✨ Appearance & Disappearance Days'}</option>
                                <option value="fasting">{locale === 'ta' ? '🙏 உபவாச நாட்கள் (Fasting Days)' : '🙏 Fasting Days'}</option>
                                <option value="observance">{locale === 'ta' ? '📜 சிறப்பு நிகழ்வுகள் (Special Observances)' : '📜 Special Observances'}</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                                <ChevronDown size={18} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Grid layout */}
                <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto md:overflow-x-visible pb-8 md:pb-0 snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                    {loading ? (
                        Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                    ) : displayEvents.length > 0 ? (
                        displayEvents.map((item) => {
                            const hasArticle = Boolean(item.description);

                            return (
                                <Link
                                    key={`${item.day_id}-${item.id}`}
                                    href={`/vaishnava-calendar/${item.id}`}
                                    className="group flex flex-col bg-white dark:bg-[#1f1910] rounded-2xl border border-[#f3efe7] dark:border-neutral-800 hover:border-amber-500/40 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden shrink-0 w-[85vw] md:w-auto snap-center relative cursor-pointer"
                                >
                                    {item.imageUrl && (
                                        <div className="h-40 w-full relative overflow-hidden bg-neutral-900">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#1f1910] via-transparent to-transparent" />
                                        </div>
                                    )}

                                    <div className="p-6 flex flex-col flex-grow">
                                        {/* Date and Badges */}
                                        <div className="flex items-center justify-between gap-2 mb-3">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full">
                                                <CalendarIcon size={14} />
                                                <span>{formatDate(item.event_date)} ({item.day_of_week})</span>
                                            </div>

                                            {item.is_ekadashi ? (
                                                <span className="bg-amber-500/90 text-black text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                                                    🌕 Ekadashi
                                                </span>
                                            ) : item.is_fast_day ? (
                                                <span className="bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                                    🙏 Fasting
                                                </span>
                                            ) : null}
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-lg font-bold text-text-main dark:text-white group-hover:text-amber-500 transition-colors line-clamp-2 mb-2 leading-snug">
                                            {item.title}
                                        </h3>

                                        {/* Break Fast Window */}
                                        {item.break_fast_window && (
                                            <div className="mt-1 mb-3 flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                                                <Clock size={14} className="text-amber-500 shrink-0" />
                                                <span>
                                                    {u.breakFastWindow || (locale === 'ta' ? 'பார்ணை நேரம்' : 'Break Fast')}: {' '}
                                                    <strong className="font-black text-amber-800 dark:text-amber-200">
                                                        {item.break_fast_date ? `${formatDate(item.break_fast_date)} ` : ''}{item.break_fast_window}
                                                    </strong>
                                                </span>
                                            </div>
                                        )}

                                        {/* Footer Actions */}
                                        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between gap-2">
                                            {hasArticle ? (
                                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:text-amber-500 bg-amber-500/10 group-hover:bg-amber-500/20 px-3.5 py-2 rounded-xl transition-all">
                                                    <BookOpen size={14} />
                                                    <span>{u.readDetails || (locale === 'ta' ? 'விவரங்கள்' : 'Read Details')}</span>
                                                </span>
                                            ) : (
                                                <span className="text-xs text-text-muted italic flex items-center gap-1">
                                                    <CheckCircle2 size={13} className="text-emerald-500" />
                                                    {locale === 'ta' ? 'அறிவிப்பு' : 'Observance'}
                                                </span>
                                            )}

                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleWhatsAppShare(item);
                                                }}
                                                className="p-2 text-text-muted hover:text-[#25D366] hover:bg-[#25D366]/10 rounded-full transition-all"
                                                title={u.shareOnWhatsapp || 'Share on WhatsApp'}
                                            >
                                                <Share2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-16 text-center">
                            <CalendarIcon size={36} className="mx-auto mb-3 text-text-muted" />
                            <p className="text-base font-bold text-text-main dark:text-white">
                                {u.noEventsFound || (locale === 'ta' ? 'நிகழ்வுகள் எதுவும் இல்லை.' : 'No upcoming events found.')}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default UpcomingEventsSection;
