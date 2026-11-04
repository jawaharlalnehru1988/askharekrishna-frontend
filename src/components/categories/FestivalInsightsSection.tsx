'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { 
    Sparkles, 
    BookOpen, 
    Clock, 
    Search, 
    X, 
    ArrowRight, 
    Home, 
    ScrollText, 
    CheckCircle2, 
    Flame,
} from 'lucide-react';
import { useLanguage } from '../providers/LanguageContext';
import { FESTIVAL_ARTICLES } from '@/data/festivalInsightsData';

const SECTION_LABELS: Record<string, {
    home: string;
    sectionTitle: string;
    sectionBadge: string;
    sectionSubtitle: string;
    allFestivals: string;
    dipavaliSeries: string;
    vaishnavaCalendar: string;
    searchPlaceholder: string;
    noResults: string;
    readArticle: string;
    pramanaTitle: string;
}> = {
    en: {
        home: 'Home',
        sectionTitle: 'Festival Insights',
        sectionBadge: '100% Shastric Festival Wisdom',
        sectionSubtitle: 'Uncover the deep philosophical wisdom, authentic scriptural origins, and essential sadachara rules (dos & don’ts) for sacred Vaishnava and Vedic festivals according to the Puranas and Itihasas.',
        allFestivals: 'All Festivals',
        dipavaliSeries: 'Dipavali Series',
        vaishnavaCalendar: 'Vaishnava Calendar',
        searchPlaceholder: 'Search festival topics, scriptures, or keywords...',
        noResults: 'No festival articles found matching your search.',
        readArticle: 'Read Full Article',
        pramanaTitle: 'Scriptural Evidence (Pramana)',
    },
    ta: {
        home: 'முகப்பு',
        sectionTitle: 'பண்டிகைகளின் தாத்பரியம் (Festival Insights)',
        sectionBadge: '100% சாஸ்திரப் பூர்வ உண்மை',
        sectionSubtitle: 'புராணங்கள் மற்றும் இதிகாசங்களின்படி புனித வைஷ்ணவ பண்டிகைகளின் ஆழ்ந்த சாஸ்திர தாத்பரியங்கள், திவ்ய லீலைகள் மற்றும் செய்ய வேண்டிய/கூடாத விரத நெறிமுறைகள்.',
        allFestivals: 'அனைத்துப் பண்டிகைகள்',
        dipavaliSeries: 'தீபாவளி தொடர்',
        vaishnavaCalendar: 'வைஷ்ணவ நாட்காட்டி',
        searchPlaceholder: 'பண்டிகைத் தலைப்புகள் அல்லது சாஸ்திரங்களைத் தேடுக...',
        noResults: 'உங்கள் தேடலுக்குரிய கட்டுரைகள் எதுவும் காணப்படவில்லை.',
        readArticle: 'கட்டுரையை முழுமையாக வாசிக்க',
        pramanaTitle: 'சாஸ்திர பிரமாணம்',
    },
    hi: {
        home: 'गृह',
        sectionTitle: 'पर्व तात्त्विक रहस्य (Festival Insights)',
        sectionBadge: '100% शास्त्रीय सत्य',
        sectionSubtitle: 'पुराणों और इतिहासों के अनुसार पावन वैदिक एवं वैष्णव पर्वों के गूढ़ दार्शनिक रहस्य, दिव्य लीलाएं तथा पालन करने योग्य सदाचार नियम (क्या करें और क्या न करें)।',
        allFestivals: 'सभी पर्व',
        dipavaliSeries: 'दीपावली श्रृंखला',
        vaishnavaCalendar: 'वैष्णव पंचांग',
        searchPlaceholder: 'पर्व विषय, शास्त्र अथवा कीवर्ड खोजें...',
        noResults: 'आपकी खोज के अनुसार कोई आलेख नहीं मिला।',
        readArticle: 'संपूर्ण आलेख पढ़ें',
        pramanaTitle: 'शास्त्रीय प्रमाण',
    },
    te: {
        home: 'గృహం',
        sectionTitle: 'పండుగల అంతరార్థం (Festival Insights)',
        sectionBadge: '100% శాస్త్రీయ సత్యం',
        sectionSubtitle: 'పురాణాలు మరియు ఇతిహాసాల ప్రకారం పవిత్ర వైష్ణవ పండుగల గంభీర ఆధ్యాత్మిక అంతరార్థాలు, దివ్య లీలలు మరియు ఆచరించవలసిన సదాచార నియమాలు.',
        allFestivals: 'అన్ని పండుగలు',
        dipavaliSeries: 'దీపావళి శ్రేణి',
        vaishnavaCalendar: 'వైష్ణవ క్యాలెండర్',
        searchPlaceholder: 'పండుగ విషయాలు లేదా శాస్త్రాలను వెతకండి...',
        noResults: 'మీ శోధనకు తగిన వ్యాసాలు ఏవీ లభించలేదు.',
        readArticle: 'పూర్తి వ్యాసాన్ని చదవండి',
        pramanaTitle: 'శాస్త్ర ప్రమాణం',
    },
    kn: {
        home: 'ಮುಖಪುಟ',
        sectionTitle: 'ಹಬ್ಬಗಳ ತಾತ್ಪರ್ಯ (Festival Insights)',
        sectionBadge: '100% ಶಾಸ್ತ್ರೋಕ್ತ ಸತ್ಯ',
        sectionSubtitle: 'ಪುರಾಣಗಳು ಮತ್ತು ಇತಿಹಾಸಗಳ ಪ್ರಕಾರ ಪವಿತ್ರ ವೈಷ್ಣವ ಹಬ್ಬಗಳ ನಿಗೂಢ ಆಧ್ಯಾತ್ಮಿಕ ತಾತ್ಪರ್ಯಗಳು, ದಿವ್ಯ ಲೀಲೆಗಳು ಮತ್ತು ಪಾಲಿಸಬೇಕಾದ ಸದಾಚಾರ ನಿಯಮಗಳು.',
        allFestivals: 'ಎಲ್ಲಾ ಹಬ್ಬಗಳು',
        dipavaliSeries: 'ದೀಪಾವಳಿ ಸರಣಿ',
        vaishnavaCalendar: 'ವೈಷ್ಣವ ಕ್ಯಾಲೆಂಡರ್',
        searchPlaceholder: 'ಹಬ್ಬದ ವಿಷಯಗಳು ಅಥವಾ ಶಾಸ್ತ್ರಗಳನ್ನು ಹುಡುಕಿ...',
        noResults: 'ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ಯಾವುದೇ ಲೇಖನಗಳು ಕಂಡುಬಂದಿಲ್ಲ.',
        readArticle: 'ಸಂಪೂರ್ಣ ಲೇಖನವನ್ನು ಓದಿ',
        pramanaTitle: 'ಶಾಸ್ತ್ರ ಪ್ರಮಾಣ',
    },
    ml: {
        home: 'മുഖം',
        sectionTitle: 'ഉത്സവങ്ങളുടെ തത്ത്വം (Festival Insights)',
        sectionBadge: '100% ശാസ്ത്രീയ സത്യം',
        sectionSubtitle: 'പുരാണങ്ങളുടെയും ഇതിഹാസങ്ങളുടെയും അടിസ്ഥാനത്തിൽ പുണ്യ വൈഷ്ണവ ഉത്സവങ്ങളുടെ ഗഹനമായ ആത്മീയ തത്ത്വങ്ങൾ, ദിവ്യ ലീലകൾ, ആചരിക്കേണ്ട സദാചാര നിയമങ്ങൾ.',
        allFestivals: 'എല്ലാ ഉത്സവങ്ങളും',
        dipavaliSeries: 'ദീപാവലി പരമ്പര',
        vaishnavaCalendar: 'വൈഷ്ണവ കലണ്ടർ',
        searchPlaceholder: 'ഉത്സവ വിഷയങ്ങളോ ശാസ്ത്രങ്ങളോ തിരയുക...',
        noResults: 'നിങ്ങൾ തിരഞ്ഞ ലേഖനങ്ങൾ ഒന്നും കണ്ടെത്താനായില്ല.',
        readArticle: 'പൂർണ്ണ ലേഖനം വായിക്കുക',
        pramanaTitle: 'ശാസ്ത്ര പ്രമാണം',
    },
    bn: {
        home: 'মূলপাতা',
        sectionTitle: 'উৎসবের তাৎপর্য (Festival Insights)',
        sectionBadge: '১০০% শাস্ত্রীয় সিদ্ধান্ত',
        sectionSubtitle: 'পুরাণ ও ইতিহাসের আলোকে পরম পবিত্র বৈষ্ণব উৎসবসমূহের নিগূঢ় পারমার্থিক তাৎপর্য, দিব্য লীলা এবং অবশ্য পালনীয় বৈদিক সদাচার বিধিমালা।',
        allFestivals: 'সকল উৎসব',
        dipavaliSeries: 'দীপাবলি শৃঙ্খল',
        vaishnavaCalendar: 'বৈষ্ণব পঞ্জিকা',
        searchPlaceholder: 'উৎসবের বিষয় বা শাস্ত্র অনুসন্ধান করুন...',
        noResults: 'আপনার অনুসন্ধান অনুযায়ী কোনো প্রবন্ধ পাওয়া যায়নি।',
        readArticle: 'সম্পূর্ণ প্রবন্ধ পড়ুন',
        pramanaTitle: 'শাস্ত্রীয় প্রমাণ',
    },
};

export default function FestivalInsightsSection() {
    const { locale } = useLanguage();
    const l = SECTION_LABELS[locale] || SECTION_LABELS.en;

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFestival, setSelectedFestival] = useState<string>('All');

    const dipavaliCount = useMemo(() => FESTIVAL_ARTICLES.filter(a => a.festival === 'Dipavali').length, []);
    const vaishnavaCalendarCount = useMemo(() => FESTIVAL_ARTICLES.filter(a => a.festival === 'Vaishnava Calendar').length, []);

    const filteredArticles = useMemo(() => {
        return FESTIVAL_ARTICLES.filter((item) => {
            const trans = item.translations[locale] || item.translations.en;
            const matchesFestival = selectedFestival === 'All' || item.festival === selectedFestival;
            const query = searchQuery.trim().toLowerCase();
            if (!query) return matchesFestival;

            const inTitle = trans.title.toLowerCase().includes(query);
            const inSub = trans.subTopic.toLowerCase().includes(query);
            const inExcerpt = trans.excerpt.toLowerCase().includes(query);
            const pramana = trans.scripturePramana || (locale === 'ta' ? item.scripturePramanaTamil : item.scripturePramana);
            const inPramana = pramana.toLowerCase().includes(query);
            const inHighlights = trans.highlights.some(h => h.toLowerCase().includes(query));

            return matchesFestival && (inTitle || inSub || inExcerpt || inPramana || inHighlights);
        });
    }, [searchQuery, selectedFestival, locale]);

    return (
        <div className="w-full bg-background-light dark:bg-background-dark pt-6 pb-20 transition-colors duration-200">
            <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                {/* Breadcrumbs */}
                <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs md:text-sm text-text-muted mb-6 flex-wrap">
                    <Link href="/" className="hover:text-amber-600 flex items-center gap-1 transition-colors">
                        <Home size={14} />
                        <span>{l.home}</span>
                    </Link>
                    <span>/</span>
                    <span className="font-semibold text-text-main dark:text-white">
                        {l.sectionTitle}
                    </span>
                </nav>

                {/* Hero Banner */}
                <div className="relative rounded-3xl overflow-hidden mb-10 border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.12] via-orange-500/[0.06] to-rose-900/[0.15] dark:from-amber-950/40 dark:via-neutral-900 dark:to-neutral-950 p-6 sm:p-8 md:p-12 shadow-sm">
                    {/* Background glow circle */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-400/20 via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider text-[11px] rounded-full border border-amber-500/30 mb-4 shadow-sm">
                                <Sparkles size={13} className="text-amber-600 dark:text-amber-400" />
                                <span>{l.sectionBadge}</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-text-main dark:text-white tracking-tight leading-tight mb-4">
                                {l.sectionTitle}
                            </h1>
                            <p className="text-sm sm:text-base md:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl">
                                {l.sectionSubtitle}
                            </p>
                        </div>

                        {/* Visual Emblem Badge */}
                        <div className="shrink-0 size-20 md:size-28 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 text-white flex flex-col items-center justify-center shadow-xl shadow-amber-500/25">
                            <Flame size={36} className="mb-1" />
                            <span className="text-[10px] font-bold tracking-widest uppercase">Shastra</span>
                        </div>
                    </div>

                    {/* Search & Filter Toolbar */}
                    <div className="mt-8 pt-6 border-t border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-md">
                            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={l.searchPlaceholder}
                                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-sm text-text-main dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* Festival Category Filter Pills */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <button
                                onClick={() => setSelectedFestival('All')}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                    selectedFestival === 'All'
                                        ? 'bg-amber-600 text-white shadow-sm'
                                        : 'bg-white/80 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-amber-50 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700'
                                }`}
                            >
                                {l.allFestivals} ({FESTIVAL_ARTICLES.length})
                            </button>
                            <button
                                onClick={() => setSelectedFestival('Dipavali')}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                    selectedFestival === 'Dipavali'
                                        ? 'bg-amber-600 text-white shadow-sm'
                                        : 'bg-white/80 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-amber-50 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700'
                                }`}
                            >
                                {l.dipavaliSeries} ({dipavaliCount})
                            </button>
                            <button
                                onClick={() => setSelectedFestival('Vaishnava Calendar')}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                    selectedFestival === 'Vaishnava Calendar'
                                        ? 'bg-amber-600 text-white shadow-sm'
                                        : 'bg-white/80 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-amber-50 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700'
                                }`}
                            >
                                {l.vaishnavaCalendar} ({vaishnavaCalendarCount})
                            </button>
                        </div>
                    </div>
                </div>

                {/* Articles Grid */}
                {filteredArticles.length === 0 ? (
                    <div className="p-12 text-center rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                        <BookOpen size={40} className="mx-auto text-neutral-400 mb-3" />
                        <h3 className="text-lg font-bold text-text-main dark:text-white mb-1">{l.noResults}</h3>
                        <p className="text-sm text-neutral-500">Try clearing your search query or switching filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                        {filteredArticles.map((item, idx) => {
                            const trans = item.translations[locale] || item.translations.en;
                            const pramanaText = trans.scripturePramana || (locale === 'ta' ? item.scripturePramanaTamil : item.scripturePramana);
                            const readTimeText = trans.readTime || (locale === 'ta' ? item.readTimeTamil : item.readTime);
                            const festivalName = trans.festivalName || (locale === 'ta' ? item.festivalTamil : item.festival);

                            return (
                                <motion.article
                                    key={item.id}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.45, delay: idx * 0.08 }}
                                    className="group relative flex flex-col justify-between rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#1a1610] border border-neutral-200/90 dark:border-neutral-800 shadow-sm hover:shadow-xl hover:border-amber-500/50 transition-all duration-300"
                                >
                                    <div>
                                        {/* Article Visual Painting Card */}
                                        {item.imageUrl && (
                                            <Link 
                                                href={`/festival-insights/${item.slug}?lang=${locale}`} 
                                                className="block relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-5 bg-neutral-900 border border-amber-500/20 group-hover:border-amber-500/50 transition-colors shadow-sm"
                                            >
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.imageAlt || trans.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />
                                                
                                                {/* Top Badges */}
                                                <div className="absolute top-3 left-3 flex items-center gap-2">
                                                    <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-amber-300 font-mono border border-amber-500/30">
                                                        0{item.order}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/30">
                                                        <Flame size={12} className="text-amber-400 shrink-0" />
                                                        <span>{festivalName}</span>
                                                    </span>
                                                </div>

                                                {/* Bottom Reading Time */}
                                                <div className="absolute bottom-3 right-3">
                                                    <span className="inline-flex items-center gap-1.5 text-xs text-neutral-200 font-medium px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                                                        <Clock size={12} />
                                                        <span>{readTimeText}</span>
                                                    </span>
                                                </div>
                                            </Link>
                                        )}

                                        {/* Article Title */}
                                        <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug mb-2">
                                            <Link href={`/festival-insights/${item.slug}?lang=${locale}`}>
                                                {trans.title}
                                            </Link>
                                        </h2>

                                        {/* Subtopic */}
                                        <p className="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-1.5">
                                            <span className="size-1.5 rounded-full bg-amber-500 shrink-0" />
                                            <span>{trans.subTopic}</span>
                                        </p>

                                        {/* Excerpt */}
                                        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-5 line-clamp-3">
                                            {trans.excerpt}
                                        </p>

                                        {/* Scriptural Pramana Badge */}
                                        <div className="mb-5 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 text-xs flex items-start gap-2.5">
                                            <ScrollText size={15} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                            <div className="leading-snug">
                                                <span className="font-bold text-neutral-700 dark:text-neutral-300 block mb-0.5">
                                                    {l.pramanaTitle}:
                                                </span>
                                                <span className="text-neutral-600 dark:text-neutral-400 italic">
                                                    {pramanaText}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Key Highlights / Pillars */}
                                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6">
                                            {trans.highlights.map((highlight, hIdx) => (
                                                <span
                                                    key={hIdx}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-100/90 dark:bg-neutral-800/90 border border-neutral-200/60 dark:border-neutral-700/60 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300"
                                                >
                                                    <CheckCircle2 size={11} className="text-emerald-500 shrink-0" />
                                                    <span>{highlight}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Footer Action */}
                                    <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                                        <Link
                                            href={`/festival-insights/${item.slug}?lang=${locale}`}
                                            className="inline-flex items-center gap-2 text-sm font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 transition-colors group-hover:translate-x-1 transition-transform"
                                        >
                                            <span>{l.readArticle}</span>
                                            <ArrowRight size={16} />
                                        </Link>

                                        <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-sm">
                                            <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </motion.article>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
