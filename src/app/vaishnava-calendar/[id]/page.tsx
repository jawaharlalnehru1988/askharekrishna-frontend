import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Calendar as CalendarIcon, ArrowLeft, Clock, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { headers } from 'next/headers';
import { Locale } from '@/lib/dictionaries';
import { ShareButtons } from '@/components/categories/ShareButtons';
import { buildArticleMetadata, toAbsoluteMediaUrl, toPlainExcerpt } from '@/lib/metadata';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.askharekrishna.com/api';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export interface SingleEventDetail {
    id: number;
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

function resolveLocale(headersList: Headers): Locale {
    const hostHeader = headersList.get('host') || headersList.get('x-forwarded-host') || '';
    const lowerHost = hostHeader.toLowerCase();
    let derivedLocale: Locale = 'en';
    if (lowerHost.startsWith('tamil.') || lowerHost.startsWith('ta.')) {
        derivedLocale = 'ta';
    } else if (lowerHost.startsWith('hindi.') || lowerHost.startsWith('hi.')) {
        derivedLocale = 'hi';
    } else if (lowerHost.startsWith('kannada.') || lowerHost.startsWith('kn.')) {
        derivedLocale = 'kn';
    } else if (lowerHost.startsWith('telugu.') || lowerHost.startsWith('te.')) {
        derivedLocale = 'te';
    } else if (lowerHost.startsWith('malayalam.') || lowerHost.startsWith('ml.')) {
        derivedLocale = 'ml';
    }
    return (headersList.get('x-locale') as Locale) || derivedLocale;
}

async function fetchCalendarItemById(id: string, locale: string = 'en'): Promise<SingleEventDetail | null> {
    try {
        // First try fetching single observance by ID
        const obsRes = await fetch(`${API_BASE_URL}/vaishnava-calendar/observances/${id}/?lang=${locale}`, { cache: 'no-store' });
        if (obsRes.ok) {
            const obsData = await obsRes.json();
            return {
                id: obsData.id,
                day_id: obsData.day_id,
                event_date: obsData.event_date,
                day_of_week: obsData.day_of_week,
                is_ekadashi: obsData.is_ekadashi,
                ekadashi_name: obsData.ekadashi_name,
                is_fast_day: obsData.is_fast_day,
                fast_details: obsData.fast_details,
                break_fast_date: obsData.break_fast_date || null,
                break_fast_day_of_week: obsData.break_fast_day_of_week || null,
                break_fast_window: obsData.break_fast_window || null,
                category: obsData.category,
                title: obsData.title || obsData.ekadashi_name || obsData.event_date,
                description: obsData.description,
                imageUrl: obsData.imageUrl || obsData.image,
            };
        }

        // Fallback: try fetching day by ID (for legacy day links)
        const dayRes = await fetch(`${API_BASE_URL}/vaishnava-calendar/calendar-days/${id}/?lang=${locale}`, { cache: 'no-store' });
        if (dayRes.ok) {
            const dayData = await dayRes.json();
            const mainObs = dayData.observances?.[0];
            return {
                id: dayData.id,
                day_id: dayData.id,
                event_date: dayData.event_date,
                day_of_week: dayData.day_of_week,
                is_ekadashi: dayData.is_ekadashi,
                ekadashi_name: dayData.ekadashi_name,
                is_fast_day: dayData.is_fast_day,
                fast_details: dayData.fast_details,
                break_fast_date: dayData.break_fast_date || null,
                break_fast_day_of_week: dayData.break_fast_day_of_week || null,
                break_fast_window: dayData.break_fast_window || null,
                category: mainObs?.category || 'Observance',
                title: mainObs?.title || dayData.ekadashi_name || dayData.event_date,
                description: mainObs?.description || dayData.fast_details,
                imageUrl: mainObs?.imageUrl || mainObs?.image,
            };
        }

        return null;
    } catch {
        return null;
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const headersList = await headers();
    const locale = resolveLocale(headersList);
    const host = headersList.get('host') || headersList.get('x-forwarded-host') || 'askharekrishna.com';

    const item = await fetchCalendarItemById(id, locale);
    if (!item) {
        return {
            title: 'Vaishnava Event Not Found | Ask Hare Krishna',
            description: 'This calendar event is not available.',
        };
    }

    const description = toPlainExcerpt(item.description || item.fast_details || `${item.title} - ${item.event_date} (${item.day_of_week})`);
    const image = toAbsoluteMediaUrl(item.imageUrl);

    return buildArticleMetadata({
        host,
        path: `/vaishnava-calendar/${id}`,
        title: `${item.title} (${item.event_date}) | Ask Hare Krishna`,
        description,
        imageUrl: image,
    });
}

export default async function CalendarEventDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const headersList = await headers();
    const locale = resolveLocale(headersList);
    const item = await fetchCalendarItemById(id, locale);

    if (!item) {
        return notFound();
    }

    const host = headersList.get('host') || 'askharekrishna.com';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const articleUrl = `${protocol}://${host}/vaishnava-calendar/${id}`;

    const formatDate = (dateStr: string) => {
        try {
            const dateObj = new Date(dateStr);
            const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
            return dateObj.toLocaleDateString(locale === 'ta' ? 'ta-IN' : 'en-US', options);
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-200">
            <Navbar />
            <main className="flex-grow py-12 md:py-20 px-4 md:px-8 max-w-[1000px] mx-auto w-full">
                <Link
                    href="/vaishnava-calendar"
                    className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:text-amber-500 font-bold mb-8 transition-colors"
                >
                    <ArrowLeft size={20} />
                    {locale === 'ta' ? 'நாட்காட்டி பக்கத்திற்குத் திரும்பு' : 'Back to Calendar'}
                </Link>

                <div className="bg-white dark:bg-[#1a160f] rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-neutral-800">
                    {/* Header */}
                    <div className="p-6 md:p-8 border-b border-gray-100 dark:border-neutral-800 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent">
                        <div className="flex flex-wrap items-center gap-2.5 mb-4">
                            <span className="inline-flex items-center gap-1.5 bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold text-xs px-3.5 py-1.5 rounded-full border border-amber-500/30">
                                <CalendarIcon size={14} />
                                <span>{formatDate(item.event_date)} ({item.day_of_week})</span>
                            </span>

                            {item.is_ekadashi && (
                                <span className="bg-amber-500 text-black text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                                    🌕 Ekadashi
                                </span>
                            )}

                            {item.is_fast_day && (
                                <span className="bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                                    🙏 Fasting Day
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black text-text-main dark:text-white leading-tight">
                            {item.title}
                        </h1>
                    </div>

                    <div className="p-6 md:p-10 space-y-10">
                        {/* Fast Details if available */}
                        {item.fast_details && (
                            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-900 dark:text-purple-200 text-sm font-medium flex items-center gap-2">
                                <Sparkles size={18} className="text-purple-500 shrink-0" />
                                <span>{item.fast_details}</span>
                            </div>
                        )}

                        {/* Image */}
                        {item.imageUrl && (
                            <div className="relative h-[280px] md:h-[480px] w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-neutral-800">
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                            </div>
                        )}

                        {/* Article Content */}
                        {item.description ? (
                            <div className="prose prose-stone dark:prose-invert max-w-none 
                                prose-headings:font-black prose-headings:tracking-tight
                                prose-h1:text-3xl prose-h1:mb-6
                                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                                prose-p:text-lg prose-p:leading-relaxed prose-p:text-text-main dark:prose-p:text-gray-300
                                prose-blockquote:border-l-4 prose-blockquote:border-amber-500 prose-blockquote:bg-amber-500/5 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic
                                prose-strong:text-amber-600 dark:prose-strong:text-amber-400 prose-strong:font-bold">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {item.description}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <p className="text-text-muted italic text-center py-10">
                                {locale === 'ta' ? 'இந்த நிகழ்விற்கு விவரங்கள் எதுவும் கிடைக்கவில்லை.' : 'No article description available for this event.'}
                            </p>
                        )}

                        {/* Break Fast Window Box at Bottom of Article */}
                        {item.break_fast_window && (
                            <div className="mt-10 p-6 bg-gradient-to-br from-amber-500/15 via-amber-500/10 to-amber-500/5 border-2 border-amber-500/30 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-amber-950 dark:text-amber-100 shadow-md">
                                <div className="flex items-center gap-4">
                                    <div className="size-14 rounded-2xl bg-amber-500 text-black flex items-center justify-center shrink-0 shadow-lg font-black">
                                        <Clock size={28} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                                            {locale === 'ta' ? 'பார்ணை நேரம் (Break Fast Window)' : 'Break Fast (Parana) Window'}
                                        </div>
                                        <div className="text-xl md:text-2xl font-black mt-1 text-text-main dark:text-white">
                                            {item.break_fast_date ? `${formatDate(item.break_fast_date)} (${item.break_fast_day_of_week}) — ` : ''}
                                            <span className="text-amber-600 dark:text-amber-400">{item.break_fast_window}</span> (LT)
                                        </div>
                                    </div>
                                </div>
                                <span className="bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold text-xs px-3.5 py-1.5 rounded-full border border-amber-500/30">
                                    {locale === 'ta' ? 'அடுத்த நாள் உபவாசம் முடித்தல்' : 'Following Day Parana'}
                                </span>
                            </div>
                        )}

                        {/* Share section */}
                        <div className="mt-16 pt-10 border-t border-gray-100 dark:border-neutral-800 text-center">
                            <p className="text-sm font-bold text-text-muted mb-6 uppercase tracking-[0.3em]">
                                {locale === 'ta' ? 'இந்த நிகழ்வைப் பகிரவும்' : 'Share this Event Article'}
                            </p>
                            <ShareButtons 
                                articleUrl={articleUrl} 
                                subTopic={item.title} 
                                messagePrefix={locale === 'ta' ? '✨ இந்த வைஷ்ணவ நிகழ்வைப் பற்றிப் படியுங்கள்:' : '✨ Read about this Vaishnava event:'}
                            />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
