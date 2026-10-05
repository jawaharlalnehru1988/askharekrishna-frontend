'use client';

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Sun,
    Moon,
    Clock,
    BookOpen,
    CalendarDays,
    ListFilter,
    ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '../providers/LanguageContext';
import UpcomingEventsSection from '../home/UpcomingEventsSection';

interface ObservanceItem {
    id: number;
    title: string;
    category: string;
    order: number;
    description: string | null;
    imageUrl?: string | null;
    image?: string | null;
    audioUrl?: string | null;
}

interface CalendarDayItem {
    id: number;
    event_date: string;
    day_of_week: string;
    is_ekadashi: boolean;
    ekadashi_name: string | null;
    is_fast_day: boolean;
    fast_details: string | null;
    break_fast_date: string | null;
    break_fast_day_of_week: string | null;
    break_fast_window: string | null;
    observances: ObservanceItem[];
}

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function InteractiveCalendarView() {
    const { locale } = useLanguage();
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.askharekrishna.com/api';

    const todayObj = useMemo(() => new Date(), []);
    const todayStr = useMemo(() => {
        const y = todayObj.getFullYear();
        const m = String(todayObj.getMonth() + 1).padStart(2, '0');
        const d = String(todayObj.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }, [todayObj]);

    const [currentYear, setCurrentYear] = useState<number>(todayObj.getFullYear());
    const [currentMonth, setCurrentMonth] = useState<number>(todayObj.getMonth() + 1);
    const [selectedDate, setSelectedDate] = useState<string>(todayStr);
    const [monthDays, setMonthDays] = useState<CalendarDayItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [viewMode, setViewMode] = useState<'grid' | 'feed'>('grid');

    // Fetch month data whenever currentYear, currentMonth, or locale changes
    useEffect(() => {
        let isCancelled = false;
        const fetchMonthData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(
                    `${apiBaseUrl}/vaishnava-calendar/calendar-days/?year=${currentYear}&month=${currentMonth}&lang=${locale}`
                );
                const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
                if (!isCancelled) {
                    setMonthDays(data);
                }
            } catch (err) {
                console.error('Failed to fetch calendar days:', err);
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        };

        fetchMonthData();
        return () => {
            isCancelled = true;
        };
    }, [currentYear, currentMonth, locale, apiBaseUrl]);

    // Map days by date string YYYY-MM-DD
    const daysMap = useMemo(() => {
        const map = new Map<string, CalendarDayItem>();
        for (const d of monthDays) {
            map.set(d.event_date, d);
        }
        return map;
    }, [monthDays]);

    // Navigation functions
    const handlePrevMonth = () => {
        if (currentMonth === 1) {
            setCurrentYear(prev => prev - 1);
            setCurrentMonth(12);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 12) {
            setCurrentYear(prev => prev + 1);
            setCurrentMonth(1);
        } else {
            setCurrentMonth(prev => prev + 1);
        }
    };

    const handleJumpToToday = () => {
        setCurrentYear(todayObj.getFullYear());
        setCurrentMonth(todayObj.getMonth() + 1);
        setSelectedDate(todayStr);
    };

    // Calculate grid numbers
    const totalDaysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay();

    const selectedDayData = daysMap.get(selectedDate);

    // Format display string for selected date
    const selectedFormatted = useMemo(() => {
        if (!selectedDate) return '';
        try {
            const [y, m, d] = selectedDate.split('-').map(Number);
            const dt = new Date(y, m - 1, d);
            return dt.toLocaleDateString(locale === 'en' ? 'en-US' : locale, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch {
            return selectedDate;
        }
    }, [selectedDate, locale]);

    return (
        <div className="w-full min-h-screen pb-24">
            {/* Top Hero Banner */}
            <div className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-500/5 dark:via-neutral-900/40 dark:to-transparent pt-10 pb-8 px-4 md:px-8 border-b border-amber-500/10 dark:border-neutral-800">
                <div className="max-w-[1280px] mx-auto text-center">
                    <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1 bg-amber-500/15 dark:bg-amber-400/10 text-amber-700 dark:text-amber-400 font-bold uppercase tracking-[0.2em] text-xs rounded-full border border-amber-500/20 shadow-sm">
                        <Sparkles size={14} className="animate-spin text-amber-500" style={{ animationDuration: '6s' }} />
                        <span>Vaishnava Panjika & Gaurabda Calendar</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text-main dark:text-white mb-3">
                        Vaishnava Devotional Calendar
                    </h1>
                    <p className="text-sm md:text-base text-text-muted dark:text-neutral-400 max-w-2xl mx-auto">
                        Accurate fasting dates, Ekadashis, Parana timings, and appearance days of Bhagavan Sri Krishna, Sri Gauranga, and Vaishnava Acharyas.
                    </p>

                    {/* View Switcher Toggle */}
                    <div className="mt-6 inline-flex p-1 bg-neutral-200/80 dark:bg-neutral-800/80 rounded-xl shadow-inner border border-neutral-300/60 dark:border-neutral-700">
                        <button
                            type="button"
                            onClick={() => setViewMode('grid')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 ${
                                viewMode === 'grid'
                                    ? 'bg-white dark:bg-amber-500 text-amber-900 dark:text-neutral-950 shadow-md font-bold'
                                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                            }`}
                        >
                            <CalendarDays size={16} />
                            <span>Monthly Calendar View</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('feed')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 ${
                                viewMode === 'feed'
                                    ? 'bg-white dark:bg-amber-500 text-amber-900 dark:text-neutral-950 shadow-md font-bold'
                                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                            }`}
                        >
                            <ListFilter size={16} />
                            <span>Upcoming Events Feed</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* If in feed mode, render the standard UpcomingEventsSection */}
            {viewMode === 'feed' ? (
                <div className="max-w-[1280px] mx-auto">
                    <UpcomingEventsSection isHomePage={false} />
                </div>
            ) : (
                /* Interactive Grid Mode */
                <div className="max-w-[1280px] mx-auto px-4 md:px-8 mt-8">
                    {/* Controls Bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-amber-500/20 dark:border-neutral-800 shadow-sm">
                        {/* Month navigation */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handlePrevMonth}
                                className="p-2 rounded-xl bg-amber-50 dark:bg-neutral-800 text-amber-800 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-neutral-700 transition"
                                title="Previous Month"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <h2 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white min-w-[180px] text-center">
                                {MONTH_NAMES[currentMonth - 1]} {currentYear}
                            </h2>
                            <button
                                type="button"
                                onClick={handleNextMonth}
                                className="p-2 rounded-xl bg-amber-50 dark:bg-neutral-800 text-amber-800 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-neutral-700 transition"
                                title="Next Month"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        {/* Jump Controls */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleJumpToToday}
                                className="px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-white transition"
                            >
                                Jump to Today
                            </button>

                            {/* Year Selector */}
                            <select
                                value={currentYear}
                                onChange={(e) => setCurrentYear(Number(e.target.value))}
                                className="px-3 py-1.5 rounded-xl text-xs md:text-sm font-semibold bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            >
                                {[2025, 2026, 2027, 2028, 2029, 2030].map(y => (
                                    <option key={y} value={y}>Year {y}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap items-center justify-center gap-4 text-xs mb-6 text-neutral-600 dark:text-neutral-400 bg-amber-50/50 dark:bg-neutral-900/50 py-2.5 px-4 rounded-xl border border-amber-500/10 dark:border-neutral-800">
                        <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-sm inline-block" />
                            <span className="font-medium text-neutral-800 dark:text-neutral-200">Ekadashi Fast</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-sm inline-block" />
                            <span className="font-medium text-neutral-800 dark:text-neutral-200">Appearance / Festival</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-sm inline-block" />
                            <span className="font-medium text-neutral-800 dark:text-neutral-200">Parana (Break Fast)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded-full bg-orange-400 shadow-sm inline-block" />
                            <span className="font-medium text-neutral-800 dark:text-neutral-200">General Observance</span>
                        </div>
                    </div>

                    {/* Main Layout: Calendar Grid + Selected Day Details Panel */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left: 7-Day Month Grid (7 cols on lg) */}
                        <div className="lg:col-span-7 bg-white dark:bg-neutral-900 rounded-3xl p-4 md:p-6 border border-amber-500/20 dark:border-neutral-800 shadow-xl">
                            {/* Days of week header */}
                            <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 text-center text-xs md:text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider py-2">
                                {WEEKDAYS.map((wd, i) => (
                                    <div key={wd} className={i === 0 ? 'text-rose-500' : ''}>
                                        {wd}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Days Cells */}
                            {loading ? (
                                <div className="grid grid-cols-7 gap-2 py-12">
                                    {Array.from({ length: 35 }).map((_, i) => (
                                        <div key={i} className="h-14 md:h-18 rounded-2xl bg-neutral-100 dark:bg-neutral-800/50 animate-pulse" />
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-7 gap-1.5 md:gap-2.5">
                                    {/* Empty cells before first day */}
                                    {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                                        <div key={`empty-${i}`} className="h-14 md:h-20 rounded-2xl opacity-0 pointer-events-none" />
                                    ))}

                                    {/* Actual month days */}
                                    {Array.from({ length: totalDaysInMonth }).map((_, i) => {
                                        const dayNum = i + 1;
                                        const dStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                                        const dayData = daysMap.get(dStr);
                                        const isSelected = selectedDate === dStr;
                                        const isToday = todayStr === dStr;

                                        // Badge types
                                        const isEkadashi = dayData?.is_ekadashi;
                                        const isFastDay = dayData?.is_fast_day;
                                        const hasParana = Boolean(dayData?.break_fast_window);
                                        const hasAppearance = dayData?.observances?.some(o => o.category === 'Appearance');
                                        const hasFestival = dayData?.observances?.some(o => o.category === 'Festival');
                                        const hasObservances = (dayData?.observances?.length || 0) > 0;

                                        // Determine background accent
                                        let cellStyle = 'bg-neutral-50/80 dark:bg-neutral-800/40 hover:bg-amber-50 dark:hover:bg-neutral-800';
                                        if (isEkadashi) {
                                            cellStyle = 'bg-amber-100/70 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/60';
                                        } else if (hasAppearance || hasFestival) {
                                            cellStyle = 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/40';
                                        }

                                        return (
                                            <button
                                                type="button"
                                                key={dStr}
                                                onClick={() => setSelectedDate(dStr)}
                                                className={`relative flex flex-col items-center justify-between p-1.5 md:p-2.5 h-16 md:h-20 rounded-2xl border transition-all duration-200 text-left ${cellStyle} ${
                                                    isSelected
                                                        ? 'ring-2 ring-amber-500 shadow-lg scale-[1.03] z-10 !bg-amber-500 !text-white'
                                                        : 'border-neutral-200/70 dark:border-neutral-800'
                                                }`}
                                            >
                                                {/* Top row: day number and "Today" tag */}
                                                <div className="w-full flex items-center justify-between">
                                                    <span className={`text-xs md:text-sm font-bold ${
                                                        isSelected
                                                            ? 'text-white'
                                                            : isToday
                                                            ? 'text-amber-600 dark:text-amber-400 font-extrabold'
                                                            : 'text-neutral-800 dark:text-neutral-200'
                                                    }`}>
                                                        {dayNum}
                                                    </span>
                                                    {isToday && (
                                                        <span className={`text-[9px] px-1 py-0.2 rounded font-extrabold tracking-wider uppercase ${
                                                            isSelected ? 'bg-white/20 text-white' : 'bg-amber-500 text-white'
                                                        }`}>
                                                            Today
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Devotional Indicator Badges */}
                                                <div className="flex items-center gap-1 mt-auto flex-wrap justify-center w-full">
                                                    {isEkadashi && (
                                                        <span
                                                            className={`flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full font-extrabold text-[10px] shadow-sm ${
                                                                isSelected
                                                                    ? 'bg-white text-amber-600'
                                                                    : 'bg-amber-500 text-white'
                                                            }`}
                                                            title={dayData?.ekadashi_name || 'Ekadashi Fast'}
                                                        >
                                                            🌕
                                                        </span>
                                                    )}

                                                    {!isEkadashi && (hasAppearance || hasFestival) && (
                                                        <span
                                                            className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${
                                                                isSelected ? 'bg-white' : 'bg-rose-500'
                                                            }`}
                                                            title="Appearance / Festival"
                                                        />
                                                    )}

                                                    {hasParana && (
                                                        <span
                                                            className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${
                                                                isSelected ? 'bg-emerald-200' : 'bg-emerald-500'
                                                            }`}
                                                            title={`Break fast: ${dayData?.break_fast_window}`}
                                                        />
                                                    )}

                                                    {!isEkadashi && !hasAppearance && !hasFestival && hasObservances && (
                                                        <span
                                                            className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
                                                                isSelected ? 'bg-white/80' : 'bg-orange-400'
                                                            }`}
                                                        />
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Right: Selected Date Devotional Panel (5 cols on lg) */}
                        <div className="lg:col-span-5 bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-amber-500/20 dark:border-neutral-800 shadow-xl sticky top-24">
                            {/* Panel Header */}
                            <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                                <div>
                                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
                                        <CalendarIcon size={14} />
                                        <span>Selected Day</span>
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-black text-neutral-900 dark:text-white">
                                        {selectedFormatted}
                                    </h3>
                                </div>
                            </div>

                            {/* Devotional Details */}
                            <div className="mt-5 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                                {/* Ekadashi Banner */}
                                {selectedDayData?.is_ekadashi && (
                                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-2xl shadow-md">
                                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-100 mb-1">
                                            <Moon size={14} />
                                            <span>Sacred Ekadashi Fasting</span>
                                        </div>
                                        <h4 className="text-lg font-extrabold">
                                            {selectedDayData.ekadashi_name || 'Ekadashi'}
                                        </h4>
                                        <p className="text-xs text-amber-50 mt-1">
                                            Fast from all grains and beans. Chant the Holy Names of Bhagavan Sri Krishna and hear His pastimes.
                                        </p>
                                    </div>
                                )}

                                {/* Parana (Break-Fast) Timing Banner */}
                                {selectedDayData?.break_fast_window && (
                                    <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 p-3.5 rounded-2xl text-emerald-900 dark:text-emerald-300">
                                        <Sun size={24} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                                        <div>
                                            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                                                Parana (Break-Fast Window)
                                            </div>
                                            <div className="text-sm font-extrabold">
                                                Break fast today: {selectedDayData.break_fast_window} (Local Time)
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Fast Details Banner */}
                                {selectedDayData?.fast_details && (
                                    <div className="flex items-center gap-2.5 bg-orange-50 dark:bg-orange-950/30 border border-orange-400/30 px-3.5 py-2.5 rounded-xl text-orange-900 dark:text-orange-300 text-xs font-semibold">
                                        <Clock size={16} className="text-orange-500 shrink-0" />
                                        <span>Fasting Rule: {selectedDayData.fast_details}</span>
                                    </div>
                                )}

                                {/* Observances List */}
                                <div className="space-y-3">
                                    <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                        Observances & Festivals ({selectedDayData?.observances?.length || 0})
                                    </h5>

                                    {(!selectedDayData || selectedDayData.observances.length === 0) ? (
                                        <div className="text-center py-8 bg-neutral-50 dark:bg-neutral-800/40 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800">
                                            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                                Regular devotional day.
                                            </p>
                                            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                                                Chant Hare Krishna, remember Bhagavan, and honor Prasadam. 🙏
                                            </p>
                                        </div>
                                    ) : (
                                        selectedDayData.observances.map((obs) => {
                                            const hasStory = Boolean(obs.description);
                                            const cardContent = (
                                                <>
                                                    <div className="flex items-start justify-between gap-2">
                                                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400">
                                                            {obs.category}
                                                        </span>
                                                        {hasStory && (
                                                            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                                                <BookOpen size={12} /> {locale === 'ta' ? 'கதை உள்ளது' : 'Story Available'}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h6 className="text-base font-bold text-neutral-900 dark:text-white mt-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition flex items-center justify-between gap-2">
                                                        <span>{obs.title}</span>
                                                        {hasStory && (
                                                            <ArrowUpRight size={16} className="text-amber-500 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                                        )}
                                                    </h6>

                                                    {hasStory && (
                                                        <div className="mt-2 text-xs font-semibold text-amber-600 dark:text-amber-400 group-hover:underline flex items-center gap-1">
                                                            <span>{locale === 'ta' ? 'முழுக் கதையைப் படிக்க ➔' : 'Read Full Pastime Story ➔'}</span>
                                                        </div>
                                                    )}
                                                </>
                                            );

                                            if (hasStory) {
                                                return (
                                                    <Link
                                                        key={obs.id}
                                                        href={`/vaishnava-calendar/${obs.id}?lang=${locale}`}
                                                        className="block bg-neutral-50/90 dark:bg-neutral-800/60 p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 hover:border-amber-500 hover:shadow-md transition-all group cursor-pointer"
                                                    >
                                                        {cardContent}
                                                    </Link>
                                                );
                                            }

                                            return (
                                                <div
                                                    key={obs.id}
                                                    className="bg-neutral-50/90 dark:bg-neutral-800/60 p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800"
                                                >
                                                    {cardContent}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
