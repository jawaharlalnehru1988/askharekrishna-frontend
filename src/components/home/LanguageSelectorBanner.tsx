'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Globe, Check, Loader2, Sparkles } from 'lucide-react';
import { useLanguage } from '../providers/LanguageContext';
import { Locale } from '@/lib/dictionaries';

interface LanguageOption {
    code: Locale;
    nativeName: string;
    englishName: string;
}

const LANGUAGES_LIST: LanguageOption[] = [
    { code: 'en', nativeName: 'English', englishName: 'English' },
    { code: 'ta', nativeName: 'தமிழ்', englishName: 'Tamil' },
    { code: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi' },
    { code: 'kn', nativeName: 'ಕನ್ನಡ', englishName: 'Kannada' },
    { code: 'te', nativeName: 'తెలుగు', englishName: 'Telugu' },
    { code: 'ml', nativeName: 'മലയാളം', englishName: 'Malayalam' },
    { code: 'bn', nativeName: 'বাংলা', englishName: 'Bengali' },
];

const BANNER_STRINGS: Record<Locale, {
    badge: string;
    title: string;
    subtitle: string;
    activeText: string;
}> = {
    en: {
        badge: 'Multilingual Wisdom',
        title: 'Currently Supporting 7 Languages',
        subtitle: 'Select your preferred language to explore authentic Vedic philosophy, pastimes, and the Vaishnava calendar in your mother tongue.',
        activeText: 'Active',
    },
    ta: {
        badge: 'பன்மொழி வேத ஞானம்',
        title: 'தற்போது 7 மொழிகளில் கிடைக்கிறது',
        subtitle: 'வேத தத்துவம், கதைகள் மற்றும் வைஷ்ணவ நாள்காட்டியை உங்கள் தாய்மொழியில் வாசித்து மகிழ விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்.',
        activeText: 'தேர்வு செய்யப்பட்டது',
    },
    hi: {
        badge: 'बहुभाषी ज्ञान',
        title: 'वर्तमान में 7 भाषाओं में उपलब्ध',
        subtitle: 'अपनी मातृभाषा में प्रामाणिक वैदिक दर्शन, पावन लीलाओं और वैष्णव पंचांग का अन्वेषण करने के लिए भाषा चुनें।',
        activeText: 'सक्रिय',
    },
    kn: {
        badge: 'ಬಹುಭಾಷಾ ವೇದ ಜ್ಞಾನ',
        title: 'ಪ್ರಸ್ತುತ 7 ಭಾಷೆಗಳಲ್ಲಿ ಲಭ್ಯವಿದೆ',
        subtitle: 'ನಿಮ್ಮ ಮಾತೃಭಾಷೆಯಲ್ಲಿ ಪ್ರಾಮಾಣಿಕ ವೈದಿಕ ತತ್ತ್ವ, ಪಾವನ ಲೀಲೆಗಳು ಮತ್ತು ವೈಷ್ಣವ ಕ್ಯಾಲೆಂಡರ್ ಅನ್ವೇಷಿಸಲು ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
        activeText: 'ಸಕ್ರಿಯ',
    },
    te: {
        badge: 'బహుభాషా వేదిక',
        title: 'ప్రస్తుతం 7 భాషలలో అందుబాటులో ఉంది',
        subtitle: 'మీ మాతృభాషలో ప్రామాణిక వైదిక తత్త్వజ్ఞానం, లీలలు మరియు వైష్ణవ క్యాలెండర్ చదవడానికి భాషను ఎంచుకోండి.',
        activeText: 'ఎంపికైంది',
    },
    ml: {
        badge: 'ബഹുഭാഷാ പ്ലാറ്റ്‌ഫോം',
        title: 'നിലവിൽ 7 ഭാഷകളിൽ ലഭ്യമാണ്',
        subtitle: 'നിങ്ങളുടെ മാതൃഭാഷയിൽ ആധികാരിക വൈദിക തത്ത്വചിന്തയും ലീലകളും കലണ്ടറും വായിക്കാൻ ഭാഷ തിരഞ്ഞെടുക്കുക.',
        activeText: 'സജീവം',
    },
    bn: {
        badge: 'বহুভাষিক বৈদিক জ্ঞান',
        title: 'বর্তমানে ৭টি ভাষায় উপলব্ধ',
        subtitle: 'আপনার মাতৃভাষায় প্রামাণিক বৈদিক দর্শন, লীলাকথা এবং বৈষ্ণব পঞ্জিকা পাঠ করতে আপনার পছন্দের ভাষা নির্বাচন করুন।',
        activeText: 'সক্রিয়',
    },
};

export default function LanguageSelectorBanner() {
    const { locale } = useLanguage();
    const [navigatingLocale, setNavigatingLocale] = useState<Locale | null>(null);

    const strings = BANNER_STRINGS[locale] || BANNER_STRINGS.en;

    const switchLanguage = (nextLocale: Locale) => {
        if (navigatingLocale) return;
        if (nextLocale === locale) return;
        setNavigatingLocale(nextLocale);

        // 1. Set cookie for persistent language selection across sessions
        document.cookie = `askharekrishna-locale=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;

        // 2. Build target URL preserving current pathname and existing params
        const url = new URL(window.location.href);

        // Consolidate subdomains if needed
        if (url.hostname.includes('askharekrishna.com')) {
            url.hostname = 'askharekrishna.com';
        }

        // If viewing a category in debate or etiquettes, translate the category parameter to nextLocale
        const currentCategory = url.searchParams.get('category');
        if (currentCategory && typeof window !== 'undefined') {
            try {
                const mapStr = sessionStorage.getItem('askharekrishna_category_translations');
                const map = (window as any).__categoryTranslations || (mapStr ? JSON.parse(mapStr) : null);
                if (map) {
                    const cleanParam = decodeURIComponent(currentCategory).replace(/\+/g, ' ').trim();
                    const transObj = map[cleanParam] || map[cleanParam.toLowerCase()];
                    if (transObj && transObj[nextLocale]) {
                        url.searchParams.set('category', transObj[nextLocale]);
                    }
                }
            } catch (e) {
                // ignore
            }
        }

        // Update ?lang query parameter to reload with the new language
        url.searchParams.set('lang', nextLocale);

        window.location.href = url.toString();
    };

    return (
        <section
            aria-label="Language selection banner"
            className="w-full bg-background-light dark:bg-background-dark pt-1 pb-6 transition-colors duration-200"
        >
            <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="relative overflow-hidden rounded-2xl md:rounded-3xl p-5 sm:p-7 md:p-8 bg-gradient-to-br from-amber-500/[0.08] via-amber-500/[0.03] to-orange-500/[0.08] dark:from-amber-500/[0.06] dark:via-neutral-900/80 dark:to-orange-500/[0.06] border border-amber-500/25 dark:border-neutral-800 shadow-md"
                >
                    {/* Ambient Glows */}
                    <div className="absolute -top-16 -right-16 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Banner Header */}
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 pb-4 border-b border-amber-500/15 dark:border-neutral-800">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/15 dark:bg-amber-400/10 text-amber-700 dark:text-amber-400 font-bold uppercase tracking-[0.2em] text-[11px] rounded-full border border-amber-500/20 mb-2 shadow-sm">
                                <Globe size={13} className="text-amber-600 dark:text-amber-400" />
                                <span>{strings.badge}</span>
                                <Sparkles size={11} className="text-amber-500" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-white">
                                {strings.title}
                            </h2>
                            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mt-1">
                                {strings.subtitle}
                            </p>
                        </div>

                        {/* Language count indicator badge */}
                        <div className="hidden sm:inline-flex items-center gap-2 self-start md:self-center px-4 py-2 rounded-2xl bg-white/80 dark:bg-neutral-800/80 border border-amber-500/20 shadow-sm text-xs font-bold text-amber-800 dark:text-amber-300 shrink-0">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>7 Languages Online</span>
                        </div>
                    </div>

                    {/* 7 Language Interactive Buttons */}
                    <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3.5">
                        {LANGUAGES_LIST.map((lang, lIdx) => {
                            const isActive = locale === lang.code;
                            const isSwitching = navigatingLocale === lang.code;

                            return (
                                <motion.button
                                    key={lang.code}
                                    type="button"
                                    onClick={() => switchLanguage(lang.code)}
                                    disabled={navigatingLocale !== null}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.35, delay: lIdx * 0.04 }}
                                    whileHover={{ y: -3, scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    aria-pressed={isActive}
                                    aria-label={`Switch website language to ${lang.englishName} (${lang.nativeName})`}
                                    className={`group relative flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-200 text-center cursor-pointer select-none ${
                                        isActive
                                            ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white border-amber-400 shadow-lg shadow-amber-500/25 scale-[1.03] ring-2 ring-amber-400/40 z-10'
                                            : 'bg-white/85 dark:bg-neutral-800/70 hover:bg-white dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border-neutral-200/90 dark:border-neutral-700/80 hover:border-amber-500/60 hover:shadow-md'
                                    } ${
                                        navigatingLocale !== null && !isSwitching ? 'opacity-60 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {/* Primary Native Script */}
                                    <span className={`text-base sm:text-lg font-black tracking-tight transition-transform duration-200 group-hover:scale-105 ${
                                        isActive ? 'text-white' : 'text-neutral-900 dark:text-white'
                                    }`}>
                                        {lang.nativeName}
                                    </span>

                                    {/* Subtitle in English */}
                                    <span className={`text-[11px] font-semibold tracking-wider uppercase mt-0.5 ${
                                        isActive ? 'text-amber-100' : 'text-neutral-500 dark:text-neutral-400'
                                    }`}>
                                        {lang.englishName}
                                    </span>

                                    {/* Active or Loading Indicator Pill */}
                                    {isSwitching ? (
                                        <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white/20 text-white animate-pulse">
                                            <Loader2 size={11} className="animate-spin" />
                                            <span>Loading...</span>
                                        </span>
                                    ) : isActive ? (
                                        <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white/25 text-white shadow-sm">
                                            <Check size={11} strokeWidth={3} />
                                            <span>{strings.activeText}</span>
                                        </span>
                                    ) : (
                                        <span className="mt-2 text-[10px] font-bold text-transparent group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                            Select →
                                        </span>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
