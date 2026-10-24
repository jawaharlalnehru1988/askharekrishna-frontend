import React from 'react';
import Link from 'next/link';
import { Calendar as CalendarIcon, ArrowRight, Sparkles, Clock, Compass } from 'lucide-react';

export interface RelatedEventItem {
    id: number;
    title: string;
    event_date: string;
    day_of_week: string;
    category?: string;
    imageUrl?: string | null;
    is_ekadashi?: boolean;
    is_fast_day?: boolean;
    description?: string | null;
}

interface RelatedEventsSectionProps {
    locale: string;
    currentEventId: number;
    currentEventDate: string;
    sameDayEvents: RelatedEventItem[];
    upcomingEvents: RelatedEventItem[];
}

const SECTION_STRINGS: Record<string, {
    sameDayTitle: string;
    sameDaySubtitle: string;
    upcomingTitle: string;
    upcomingSubtitle: string;
    viewDetails: string;
    viewFullCalendar: string;
    fastingDay: string;
    ekadashi: string;
}> = {
    ta: {
        sameDayTitle: "இன்றைய மற்ற முக்கிய நிகழ்வுகள்",
        sameDaySubtitle: "இதே புண்ணிய நாளில் நடைபெறும் பிற உன்னத வைஷ்ணவ திருவிழாக்கள் மற்றும் விரதங்கள்.",
        upcomingTitle: "அடுத்த முக்கிய நிகழ்வுகள்",
        upcomingSubtitle: "அடுத்து வரும் திவ்ய திருவிழாக்கள் மற்றும் ஆச்சாரியர்களின் திருநட்சத்திரங்கள்.",
        viewDetails: "விவரங்களைக் காண்க",
        viewFullCalendar: "முழு நாட்காட்டிக்குச் செல்க",
        fastingDay: "உபவாசம்",
        ekadashi: "ஏகாதசி",
    },
    en: {
        sameDayTitle: "More Events on this Day",
        sameDaySubtitle: "Sacred celebrations and observances occurring on the very same calendar date.",
        upcomingTitle: "Next Upcoming Events",
        upcomingSubtitle: "Stay spiritually attuned with the upcoming sacred festivals and appearance days.",
        viewDetails: "View Details",
        viewFullCalendar: "View Full Calendar",
        fastingDay: "Fasting",
        ekadashi: "Ekadashi",
    },
    hi: {
        sameDayTitle: "इस पावन तिथि के अन्य उत्सव",
        sameDaySubtitle: "इसी पावन तिथि पर मनाए जाने वाले अन्य वैष्णव उत्सव एवं पावन व्रत।",
        upcomingTitle: "आगामी महत्वपूर्ण उत्सव",
        upcomingSubtitle: "आगामी पावन तिथियों, एकादशियों एवं आचार्य तिरोभाव/आविर्भाव दिवसों की जानकारी।",
        viewDetails: "विवरण देखें",
        viewFullCalendar: "संपूर्ण कैलेंडर देखें",
        fastingDay: "व्रत",
        ekadashi: "एकादशी",
    },
    bn: {
        sameDayTitle: "এই তিথির অন্যান্য মহোৎসব",
        sameDaySubtitle: "এই একই পুণ্য তিথিতে অনুষ্ঠিত অন্যান্য বৈষ্ণব মহোৎসব ও ব্রত।",
        upcomingTitle: "পরবর্তী আসন্ন উৎসবসমূহ",
        upcomingSubtitle: "আসন্ন পবিত্র তিথি, একাদশী এবং আচার্যগণের শুভ আবির্ভাব ও তিরোভাব মহোৎসব।",
        viewDetails: "বিস্তারিত দেখুন",
        viewFullCalendar: "সম্পূর্ণ পঞ্জিকা দেখুন",
        fastingDay: "উপবাস",
        ekadashi: "একাদশী",
    },
    kn: {
        sameDayTitle: "ಈ ದಿನದ ಇತರ ವಿಶೇಷ ಆಚರಣೆಗಳು",
        sameDaySubtitle: "ಇದೇ ಮಂಗಳಕರ ದಿನದಂದು ಆಚರಿಸಲಾಗುವ ಇತರ ವೈಷ್ಣವ ಉತ್ಸವಗಳು ಮತ್ತು ವ್ರತಗಳು.",
        upcomingTitle: "ಮುಂದಿನ ಮುಂಬರುವ ಉತ್ಸವಗಳು",
        upcomingSubtitle: "ಮುಂದೆ ಬರುವ ಪವಿತ್ರ ಹಬ್ಬಗಳು, ಏಕಾದಶಿಗಳು ಮತ್ತು ಆಚಾರ್ಯರ ತಿಥಿಗಳು.",
        viewDetails: "ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
        viewFullCalendar: "ಸಂಪೂರ್ಣ ಕ್ಯಾಲೆಂಡರ್ ವೀಕ್ಷಿಸಿ",
        fastingDay: "ಉಪವಾಸ",
        ekadashi: "ಏಕಾದಶಿ",
    },
    te: {
        sameDayTitle: "ఈ పవిత్ర దినాన ఇతర విశేషాలు",
        sameDaySubtitle: "ఇదే పవిత్రమైన రోజున ఆచరించబడే ఇతర వైష్ణవ ఉత్సవాలు మరియు వ్రతాలు.",
        upcomingTitle: "రాబోయే ముఖ్యమైన ఉత్సవాలు",
        upcomingSubtitle: "రాబోయే పవిత్రమైన పండుగలు, ఏకాదశులు మరియు ఆచార్యుల తిథుల వివరాలు.",
        viewDetails: "వివరాలు చూడండి",
        viewFullCalendar: "పూర్తి క్యాలెండర్ చూడండి",
        fastingDay: "ఉపవాసం",
        ekadashi: "ఏకాదశి",
    },
    ml: {
        sameDayTitle: "ഈ പുണ്യദിനത്തിലെ മറ്റ് വിശേഷങ്ങൾ",
        sameDaySubtitle: "ഇതേ പുണ്യദിനത്തിൽ ആചരിക്കുന്ന മറ്റ് വൈഷ്ണവ ഉത്സവങ്ങളും വ്രതങ്ങളും.",
        upcomingTitle: "അടുത്തുവരുന്ന പ്രധാന വിശേഷങ്ങൾ",
        upcomingSubtitle: "അടുത്തു വരുന്ന പുണ്യദിനങ്ങൾ, ഏകാദശികൾ, ആചാര്യന്മാരുടെ തിരുനാളുകൾ.",
        viewDetails: "വിശദാംശങ്ങൾ കാണുക",
        viewFullCalendar: "മുഴുവൻ കലണ്ടർ കാണുക",
        fastingDay: "ഉപവാസം",
        ekadashi: "ഏകാദശി",
    },
};

const DEFAULT_EVENT_IMAGE = 'https://api.askharekrishna.com/media/vaishnava_calendar/images/parana_break_fast.jpg';

export function RelatedEventsSection({
    locale,
    currentEventId,
    currentEventDate,
    sameDayEvents,
    upcomingEvents,
}: RelatedEventsSectionProps) {
    const t = SECTION_STRINGS[locale] || SECTION_STRINGS.en;

    const formatDate = (dateStr: string) => {
        try {
            const dateObj = new Date(dateStr);
            const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
            return dateObj.toLocaleDateString(locale === 'ta' ? 'ta-IN' : 'en-US', options);
        } catch {
            return dateStr;
        }
    };

    // Filter out current event from sameDay list just in case
    const filteredSameDay = sameDayEvents.filter((item) => Number(item.id) !== Number(currentEventId));
    // Filter out any events on or before current date from upcoming list
    const filteredUpcoming = upcomingEvents.filter((item) => Number(item.id) !== Number(currentEventId));

    if (filteredSameDay.length === 0 && filteredUpcoming.length === 0) {
        return null;
    }

    return (
        <section className="space-y-12 mt-12 pt-10 border-t border-gray-100 dark:border-neutral-800">
            {/* 1. SAME-DAY EVENTS (If this date has multiple events) */}
            {filteredSameDay.length > 0 && (
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-2 border border-amber-500/20">
                                <Sparkles size={13} />
                                <span>{formatDate(currentEventDate)}</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black text-text-main dark:text-white tracking-tight">
                                {t.sameDayTitle}
                            </h3>
                            <p className="text-sm text-text-muted mt-1 max-w-2xl">
                                {t.sameDaySubtitle}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
                        {filteredSameDay.map((event) => {
                            const img = event.imageUrl || DEFAULT_EVENT_IMAGE;
                            return (
                                <Link
                                    key={`sameday-${event.id}`}
                                    href={`/vaishnava-calendar/${event.id}?lang=${locale}`}
                                    className="group flex flex-col sm:flex-row bg-white dark:bg-[#1a160f] rounded-2xl border border-amber-500/20 hover:border-amber-500/60 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                                >
                                    <div className="sm:w-44 h-40 sm:h-auto shrink-0 relative overflow-hidden bg-neutral-900">
                                        <img
                                            src={img}
                                            alt={event.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:hidden" />
                                    </div>

                                    <div className="p-5 flex flex-col justify-between flex-grow">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                {event.category && (
                                                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20">
                                                        {event.category}
                                                    </span>
                                                )}
                                                {event.is_fast_day && (
                                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30">
                                                        🙏 {t.fastingDay}
                                                    </span>
                                                )}
                                                {event.is_ekadashi && (
                                                    <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500 text-black shadow-xs">
                                                        🌕 {t.ekadashi}
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className="font-extrabold text-base md:text-lg text-text-main dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                                                {event.title}
                                            </h4>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-neutral-800/80 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
                                            <span>{t.viewDetails}</span>
                                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* 2. UPCOMING EVENTS (Chronological next observances) */}
            {filteredUpcoming.length > 0 && (
                <div className="space-y-6 pt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold text-xs uppercase tracking-wider mb-2 border border-sky-500/20">
                                <Clock size={13} />
                                <span>{t.upcomingTitle}</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black text-text-main dark:text-white tracking-tight">
                                {t.upcomingTitle}
                            </h3>
                            <p className="text-sm text-text-muted mt-1 max-w-2xl">
                                {t.upcomingSubtitle}
                            </p>
                        </div>

                        <Link
                            href={`/vaishnava-calendar?lang=${locale}`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline shrink-0 group self-start sm:self-auto"
                        >
                            <span>{t.viewFullCalendar}</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredUpcoming.map((event) => {
                            const img = event.imageUrl || DEFAULT_EVENT_IMAGE;
                            return (
                                <Link
                                    key={`upcoming-${event.id}`}
                                    href={`/vaishnava-calendar/${event.id}?lang=${locale}`}
                                    className="group flex flex-col bg-white dark:bg-[#1a160f] rounded-2xl border border-gray-100 dark:border-neutral-800 hover:border-amber-500/40 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                                >
                                    <div className="h-40 w-full relative overflow-hidden bg-neutral-900">
                                        <img
                                            src={img}
                                            alt={event.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                        
                                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                                            <span className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-md text-white font-bold text-[11px] px-2.5 py-1 rounded-full border border-white/10">
                                                <CalendarIcon size={11} className="text-amber-400" />
                                                <span>{formatDate(event.event_date)}</span>
                                            </span>
                                        </div>

                                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                            {event.is_ekadashi && (
                                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500 text-black shadow-xs uppercase">
                                                    🌕 {t.ekadashi}
                                                </span>
                                            )}
                                            {event.is_fast_day && !event.is_ekadashi && (
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-600/90 text-white shadow-xs uppercase">
                                                    🙏 {t.fastingDay}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-5 flex flex-col justify-between flex-grow">
                                        <div>
                                            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-1">
                                                {event.category || 'Observance'}
                                            </span>
                                            <h4 className="font-extrabold text-base text-text-main dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                                                {event.title}
                                            </h4>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between text-xs font-bold text-text-muted group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                            <span>{t.viewDetails}</span>
                                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </section>
    );
}
