"use client";

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import axios from 'axios';
import { 
    ArrowRight, 
    ArrowLeft,
    Loader2, 
    BookOpen,
    Search,
    X,
    Home,
    HeartHandshake,
    Sparkles,
    CheckCircle2,
    ScrollText,
    Flower2,
} from 'lucide-react';
import { useLanguage } from '../providers/LanguageContext';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface EtiquetteArticle {
    id: number;
    subTopic: string;
    slug: string;
    article?: string;
    articleImage?: string | null;
    order?: number;
}

interface EtiquetteCategory {
    id: number;
    name: string;
    description: string;
    image: string | null;
    articleList: EtiquetteArticle[];
}

const ensureAbsoluteUrl = (path: string | null | undefined): string => {
    if (!path) return '';
    if (path.includes('127.0.0.1') || path.includes('localhost')) {
        return path.replace(/^https?:\/\/[^/]+/, 'https://api.askharekrishna.com');
    }
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const clean = path.startsWith('/') ? path : `/${path}`;
    if (!clean.startsWith('/media/')) {
        return `https://api.askharekrishna.com/media${clean}`;
    }
    return `https://api.askharekrishna.com${clean}`;
};

// Module-level in-memory cache for instant zero-delay back-navigation
const etiquetteCatalogCache: Record<string, EtiquetteCategory[]> = {};

const labels: Record<string, {
    home: string;
    subtopics: string;
    viewAllSubtopics: string;
    exploreCategory: string;
    allCategories: string;
    backToCategories: string;
    searchPlaceholder: string;
    noEtiquettesFound: string;
    noArticlesFound: string;
    loading: string;
    sadacaraBadge: string;
    etiquettesTitle: string;
    etiquettesSubtitle: string;
    articlesInThisCategory: string;
    readArticle: string;
    categoryNotFound: string;
    categoryNotFoundDesc: string;
    totalArticlesBadge: string;
}> = {
    en: {
        home: 'Home',
        subtopics: 'Topics & Protocols',
        viewAllSubtopics: 'View All Topics',
        exploreCategory: 'Explore Category',
        allCategories: 'All Categories',
        backToCategories: 'Back to All Etiquettes',
        searchPlaceholder: 'Search topics across all categories...',
        noEtiquettesFound: 'No Etiquettes Found',
        noArticlesFound: 'No topics found matching your search.',
        loading: 'Loading Vaishnava Etiquettes...',
        sadacaraBadge: 'Authentic Vaishnava Sadācāra',
        etiquettesTitle: 'Vaishnava Etiquettes & Sadācāra',
        etiquettesSubtitle: 'The sacred science of devotional character, deity worship decorum, relationship ethics, and daily spiritual rhythm across 10 dimensions.',
        articlesInThisCategory: 'Articles & Practical Protocols',
        readArticle: 'Read Topic',
        categoryNotFound: 'Category Not Found',
        categoryNotFoundDesc: 'The requested etiquette category could not be found.',
        totalArticlesBadge: '10 Categories • 68 Shastric Articles',
    },
    ta: {
        home: 'முகப்பு',
        subtopics: 'தலைப்புகள் & நெறிமுறைகள்',
        viewAllSubtopics: 'அனைத்து தலைப்புகளையும் காண்க',
        exploreCategory: 'பிரிவை ஆராய்க',
        allCategories: 'அனைத்து பிரிவுகள்',
        backToCategories: 'அனைத்து நெறிமுறைகளுக்கும் திரும்புக',
        searchPlaceholder: 'நெறிமுறைகளைத் தேடுக...',
        noEtiquettesFound: 'நெறிமுறைகள் எதுவும் இல்லை',
        noArticlesFound: 'தேடலுக்குரிய தலைப்புகள் கிடைக்கவில்லை.',
        loading: 'வைஷ்ணவ நெறிமுறைகளை ஏற்றுகிறது...',
        sadacaraBadge: 'உண்மையான வைஷ்ணவ சதாசாரம்',
        etiquettesTitle: 'வைஷ்ணவ நெறிமுறைகள் & சதாசாரம்',
        etiquettesSubtitle: 'பக்திப் பண்பாடு, விக்ரஹ வழிபாடு, பக்தர்களுடனான உறவு மற்றும் தினசரி ஆன்மீக வாழ்க்கைக்கான 10 முக்கிய வழிகாட்டுதல்கள்.',
        articlesInThisCategory: 'கட்டுரைகள் & நெறிமுறைகள்',
        readArticle: 'படிக்க',
        categoryNotFound: 'பிரிவு கிடைக்கவில்லை',
        categoryNotFoundDesc: 'கோரப்பட்ட நெறிமுறைப் பிரிவு கிடைக்கவில்லை.',
        totalArticlesBadge: '10 பிரிவுகள் • 68 சாஸ்திரக் கட்டுரைகள்',
    },
    hi: {
        home: 'होम',
        subtopics: 'विषय एवं शिष्टाचार',
        viewAllSubtopics: 'सभी विषय देखें',
        exploreCategory: 'श्रेणी देखें',
        allCategories: 'सभी श्रेणियाँ',
        backToCategories: 'सभी सदाचारों पर वापस जाएँ',
        searchPlaceholder: 'विषय खोजें...',
        noEtiquettesFound: 'कोई शिष्टाचार नहीं मिला',
        noArticlesFound: 'खोज के अनुरूप कोई विषय नहीं मिला।',
        loading: 'वैष्णव सदाचार लोड हो रहा है...',
        sadacaraBadge: 'प्रामाणिक वैष्णव सदाचार',
        etiquettesTitle: 'वैष्णव सदाचार एवं शिष्टाचार',
        etiquettesSubtitle: 'भक्ति संस्कृति, विग्रह सेवा मर्यादा, भक्त संग शिष्टाचार और दैनिक आध्यात्मिक जीवन शैली का 10 आयामों में संपूर्ण मार्गदर्शन।',
        articlesInThisCategory: 'लेख एवं व्यावहारिक नियम',
        readArticle: 'विषय पढ़ें',
        categoryNotFound: 'श्रेणी नहीं मिली',
        categoryNotFoundDesc: 'अनुरोधित सदाचार श्रेणी नहीं मिली।',
        totalArticlesBadge: '10 श्रेणियाँ • 68 शास्त्रसम्मत लेख',
    },
    kn: {
        home: 'ಮುಖಪುಟ',
        subtopics: 'ವಿಷಯಗಳು & ನಿಯಮಗಳು',
        viewAllSubtopics: 'ಎಲ್ಲಾ ವಿಷಯಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
        exploreCategory: 'ವರ್ಗವನ್ನು ಅನ್ವೇಷಿಸಿ',
        allCategories: 'ಎಲ್ಲಾ ವರ್ಗಗಳು',
        backToCategories: 'ಎಲ್ಲಾ ಸದಾಚಾರಗಳಿಗೆ ಹಿಂತಿರುಗಿ',
        searchPlaceholder: 'ವಿಷಯಗಳನ್ನು ಹುಡುಕಿ...',
        noEtiquettesFound: 'ಸದಾಚಾರಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
        noArticlesFound: 'ಹುಡುಕಾಟಕ್ಕೆ ತಕ್ಕ ವಿಷಯಗಳು ಸಿಗಲಿಲ್ಲ.',
        loading: 'ವೈಷ್ಣವ ಸದಾಚಾರಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',
        sadacaraBadge: 'ಪ್ರಾಮಾಣಿಕ ವೈಷ್ಣವ ಸದಾಚಾರ',
        etiquettesTitle: 'ವೈಷ್ಣವ ಸದಾಚಾರ ಮತ್ತು ಶಿಷ್ಟಾಚಾರ',
        etiquettesSubtitle: 'ಭಕ್ತಿ ಸಂಸ್ಕೃತಿ, ಪೂಜಾ ವಿಧಿ, ಭಕ್ತರ ಸಂಬಂಧಗಳು ಮತ್ತು ದೈನಂದಿನ ಆಧ್ಯಾತ್ಮಿಕ ಜೀವನದ 10 ಪ್ರಮುಖ ಆಯಾಮಗಳು.',
        articlesInThisCategory: 'ಲೇಖನಗಳು ಮತ್ತು ನಿಯಮಗಳು',
        readArticle: 'ಓದಿ',
        categoryNotFound: 'ವರ್ಗ ಕಂಡುಬಂದಿಲ್ಲ',
        categoryNotFoundDesc: 'ವಿನಂತಿಸಿದ ಸದಾಚಾರ ವರ್ಗ ಕಂಡುಬಂದಿಲ್ಲ.',
        totalArticlesBadge: '10 ವರ್ಗಗಳು • 68 ಶಾಸ್ತ್ರೀಯ ಲೇಖನಗಳು',
    },
    te: {
        home: 'హోమ్',
        subtopics: 'అంశాలు & నిబంధనలు',
        viewAllSubtopics: 'అన్ని అంశాలను చూడండి',
        exploreCategory: 'విభాగాన్ని అన్వేషించండి',
        allCategories: 'అన్ని విభాగాలు',
        backToCategories: 'అన్ని సదాచారాలకు తిరిగి వెళ్లండి',
        searchPlaceholder: 'సదాచారాలను శోధించండి...',
        noEtiquettesFound: 'సదాచారాలు కనుగొనబడలేదు',
        noArticlesFound: 'శోధనకు సరిపోయే అంశాలు దొరకలేదు.',
        loading: 'వైష్ణవ సదాచారాలు లోడ్ అవుతున్నాయి...',
        sadacaraBadge: 'ప్రామాణిక వైష్ణవ సదాచారం',
        etiquettesTitle: 'వైష్ణవ సదాచారం మరియు ప్రవర్తనా నియమాలు',
        etiquettesSubtitle: 'భక్తి సంస్కృతి, విగ్రహారాధన పద్ధతులు, భక్తుల సంబంధాలు మరియు దినచర్యపై 10 ముఖ్య విభాగాలలో సమగ్ర మార్గదర్శి.',
        articlesInThisCategory: 'వ్యాసాలు & నియమాలు',
        readArticle: 'చదవండి',
        categoryNotFound: 'విభాగం కనుగొనబడలేదు',
        categoryNotFoundDesc: 'అభ్యర్థించిన సదాచార విభాగం దొరకలేదు.',
        totalArticlesBadge: '10 విభాగాలు • 68 శాస్త్రీయ వ్యాసాలు',
    },
    ml: {
        home: 'ഹോം',
        subtopics: 'വിഷയങ്ങളും ചട്ടങ്ങളും',
        viewAllSubtopics: 'എല്ലാ വിഷയങ്ങളും കാണുക',
        exploreCategory: 'വിഭാഗം പര്യവേക്ഷണം ചെയ്യുക',
        allCategories: 'എല്ലാ വിഭാഗങ്ങളും',
        backToCategories: 'എല്ലാ സദാചാരങ്ങളിലേക്കും മടങ്ങുക',
        searchPlaceholder: 'വിഷയങ്ങൾ തിരയുക...',
        noEtiquettesFound: 'സദാചാരങ്ങൾ കണ്ടെത്തിയില്ല',
        noArticlesFound: 'തിരയലിന് അനുയോജ്യമായ വിഷയങ്ങൾ ലഭ്യമല്ല.',
        loading: 'വൈഷ്ണവ സദാചാരങ്ങൾ ലോഡ് ചെയ്യുന്നു...',
        sadacaraBadge: 'ആധികാരിക വൈഷ്ണവ സദാചാരം',
        etiquettesTitle: 'വൈഷ്ണവ സദാചാരവും മര്യാദകളും',
        etiquettesSubtitle: 'ഭക്തി സംസ്കാരം, ക്ഷേത്ര മര്യാദകൾ, ഭക്ത ബന്ധങ്ങൾ, ദൈനംദിന ദിനചര്യ എന്നിവയെക്കുറിച്ചുള്ള 10 പ്രധാന അധ്യായങ്ങൾ.',
        articlesInThisCategory: 'ലേഖനങ്ങളും നിയമങ്ങളും',
        readArticle: 'വായിക്കുക',
        categoryNotFound: 'വിഭാഗം കണ്ടെത്തിയില്ല',
        categoryNotFoundDesc: 'ആവശ്യപ്പെട്ട സദാചാര വിഭാഗം കണ്ടെത്താനായില്ല.',
        totalArticlesBadge: '10 വിഭാഗങ്ങൾ • 68 ശാസ്ത്രീയ ലേഖനങ്ങൾ',
    },
    bn: {
        home: 'হোম',
        subtopics: 'বিষয় ও আচরণবিধি',
        viewAllSubtopics: 'সমস্ত বিষয় দেখুন',
        exploreCategory: 'বিভাগ অন্বেষণ করুন',
        allCategories: 'সমস্ত বিভাগ',
        backToCategories: 'সমস্ত সদাচারে ফিরে যান',
        searchPlaceholder: 'বিষয় অনুসন্ধান করুন...',
        noEtiquettesFound: 'কোনো সদাচার পাওয়া যায়নি',
        noArticlesFound: 'অনুসন্ধানের সাথে মেলে এমন কোনো বিষয় পাওয়া যায়নি।',
        loading: 'বৈষ্ণব সদাচার লোড হচ্ছে...',
        sadacaraBadge: 'প্রামাণিক বৈষ্ণব সদাচার',
        etiquettesTitle: 'বৈষ্ণব সদাচার ও শিষ্টাচার',
        etiquettesSubtitle: 'ভক্তি সংস্কৃতি, বিগ্রহ সেবা বিধি, ভক্ত সঙ্গের শিষ্টাচার ও পারমার্থিক জীবনশৈলীর ১০টি প্রধান বিভাগের নির্দেশিকা।',
        articlesInThisCategory: 'নিবন্ধ ও আচরণবিধি',
        readArticle: 'পড়ুন',
        categoryNotFound: 'বিভাগ পাওয়া যায়নি',
        categoryNotFoundDesc: 'অনুরোধ করা সদাচার বিভাগ খুঁজে পাওয়া যায়নি।',
        totalArticlesBadge: '১০টি বিভাগ • ৬৮টি শাস্ত্রীয় নিবন্ধ',
    },
};

const VaishnavaEtiquettesInner = () => {
    const { locale } = useLanguage();
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category');
    const [searchQuery, setSearchQuery] = useState('');

    const l = labels[locale] || labels.en;

    const [categories, setCategories] = useState<EtiquetteCategory[]>(() => {
        return etiquetteCatalogCache[locale] || [];
    });
    const [loading, setLoading] = useState(() => {
        return !etiquetteCatalogCache[locale] || etiquetteCatalogCache[locale].length === 0;
    });

    useEffect(() => {
        let isMounted = true;

        const fetchEtiquettes = async () => {
            const normalizeResponse = (payload: any): EtiquetteCategory[] => {
                if (Array.isArray(payload)) return payload;
                return payload?.results || [];
            };

            if (!etiquetteCatalogCache[locale] || etiquetteCatalogCache[locale].length === 0) {
                setLoading(true);
            }

            try {
                const response = await axios.get(`https://api.askharekrishna.com/api/v1/vaishnava_etiquettes/articles/?language=${locale}`);
                let data = normalizeResponse(response.data);

                const hasTopicData = data.some((cat) => (cat.articleList || []).length > 0);
                if (!hasTopicData && locale !== 'en') {
                    const fallbackResponse = await axios.get('https://api.askharekrishna.com/api/v1/vaishnava_etiquettes/articles/?language=en');
                    data = normalizeResponse(fallbackResponse.data);
                }

                etiquetteCatalogCache[locale] = data;
                if (isMounted) {
                    setCategories(data);
                }
            } catch (err) {
                console.error('Vaishnava Etiquettes fetch failed:', err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchEtiquettes();

        return () => {
            isMounted = false;
        };
    }, [locale]);

    // Find the currently selected category if categoryParam is present in the URL
    const selectedCategory = useMemo(() => {
        if (!categoryParam || categories.length === 0) return null;
        const decodedParam = decodeURIComponent(categoryParam).trim().toLowerCase();
        return categories.find((cat) => {
            const catNameLower = cat.name.trim().toLowerCase();
            return catNameLower === decodedParam || cat.name.trim() === categoryParam.trim();
        }) || null;
    }, [categoryParam, categories]);

    // Filtered articles when viewing a single category
    const filteredArticles = useMemo(() => {
        if (!selectedCategory) return [];
        const list = selectedCategory.articleList || [];
        if (!searchQuery.trim()) return list;
        const q = searchQuery.toLowerCase().trim();
        return list.filter((article) => 
            article.subTopic.toLowerCase().includes(q)
        );
    }, [selectedCategory, searchQuery]);

    // Loading State
    if (loading && categories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-28 bg-background-light dark:bg-background-dark min-h-[50vh]">
                <Loader2 size={44} className="text-amber-600 dark:text-amber-400 animate-spin mb-4" />
                <p className="text-text-muted animate-pulse font-medium text-base">
                    {l.loading}
                </p>
            </div>
        );
    }

    // =========================================================================
    // VIEW 1: SINGLE CATEGORY VIEW (when ?category=... is in the URL)
    // =========================================================================
    if (categoryParam) {
        if (!loading && !selectedCategory) {
            return (
                <section className="py-16 md:py-24 bg-gradient-to-b from-[#fdfbf7] to-background-light dark:from-[#2a2418] dark:to-background-dark">
                    <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                        <div className="mb-8">
                            <Link 
                                href={`/vaishnava-etiquettes?lang=${locale}`}
                                className="group inline-flex items-center gap-2 text-sm font-bold text-text-muted hover:text-amber-600 transition-colors py-2 px-3.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
                            >
                                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                                {l.backToCategories}
                            </Link>
                        </div>
                        <div className="bg-white dark:bg-[#2a2418] rounded-3xl p-12 text-center border border-[#e7dfcf] dark:border-neutral-800 shadow-sm max-w-2xl mx-auto">
                            <div className="size-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                <HeartHandshake size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-text-main dark:text-white mb-2">
                                {l.categoryNotFound}
                            </h2>
                            <p className="text-text-muted dark:text-gray-400 mb-6">
                                {l.categoryNotFoundDesc}
                            </p>
                            <Link
                                href={`/vaishnava-etiquettes?lang=${locale}`}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors shadow-md"
                            >
                                <ArrowLeft size={18} />
                                {l.backToCategories}
                            </Link>
                        </div>
                    </div>
                </section>
            );
        }

        if (!selectedCategory) {
            return (
                <div className="flex flex-col items-center justify-center py-28 bg-background-light dark:bg-background-dark min-h-[50vh]">
                    <Loader2 size={44} className="text-amber-600 dark:text-amber-400 animate-spin mb-4" />
                    <p className="text-text-muted animate-pulse font-medium text-base">
                        {l.loading}
                    </p>
                </div>
            );
        }

        const articleCount = (selectedCategory.articleList || []).length;

        return (
            <section className="py-8 md:py-14 bg-gradient-to-b from-[#fdfbf7] via-background-light to-background-light dark:from-[#241e15] dark:via-background-dark dark:to-background-dark min-h-screen transition-colors">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-xs md:text-sm text-text-muted mb-6 flex-wrap">
                        <Link href="/" className="hover:text-amber-600 flex items-center gap-1 transition-colors">
                            <Home size={14} />
                            {l.home}
                        </Link>
                        <span>/</span>
                        <Link href={`/vaishnava-etiquettes?lang=${locale}`} className="hover:text-amber-600 transition-colors">
                            {l.allCategories}
                        </Link>
                        <span>/</span>
                        <span className="font-semibold text-text-main dark:text-white truncate max-w-[240px] md:max-w-none">
                            {selectedCategory.name}
                        </span>
                    </nav>

                    {/* Back button */}
                    <div className="mb-6">
                        <Link
                            href={`/vaishnava-etiquettes?lang=${locale}`}
                            className="group inline-flex items-center gap-2 text-sm font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 transition-colors py-2 px-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            {l.backToCategories}
                        </Link>
                    </div>

                    {/* Category Hero Banner */}
                    <div className="relative rounded-3xl overflow-hidden mb-8 border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.12] via-orange-500/[0.06] to-amber-900/[0.15] dark:from-amber-950/40 dark:via-neutral-900 dark:to-neutral-950 p-6 md:p-10 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="max-w-3xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider text-[11px] rounded-full border border-amber-500/30 mb-3">
                                    <Sparkles size={13} className="text-amber-600 dark:text-amber-400" />
                                    <span>{articleCount} {l.articlesInThisCategory}</span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-text-main dark:text-white tracking-tight mb-3">
                                    {selectedCategory.name}
                                </h1>
                                {selectedCategory.description && (
                                    <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl">
                                        {selectedCategory.description}
                                    </p>
                                )}
                            </div>

                            <div className="shrink-0 size-20 md:size-24 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/25">
                                <HeartHandshake size={44} className="stroke-[1.6]" />
                            </div>
                        </div>

                        {/* Search in this category */}
                        <div className="mt-6 pt-6 border-t border-amber-500/15">
                            <div className="relative max-w-md">
                                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={l.searchPlaceholder}
                                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-sm text-text-main dark:text-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Articles Grid */}
                    {filteredArticles.length === 0 ? (
                        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-10 text-center border border-neutral-200 dark:border-neutral-800">
                            <BookOpen size={36} className="mx-auto text-text-muted mb-3 opacity-40" />
                            <p className="text-text-muted font-medium">{l.noArticlesFound}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                            {filteredArticles.map((article, idx) => (
                                <Link
                                    key={article.id || article.slug}
                                    href={`/vaishnava-etiquettes/${article.slug}?lang=${locale}`}
                                    className="group relative flex flex-col justify-between p-5 md:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-amber-500/60 dark:hover:border-amber-400/50 shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                    <div>
                                        <div className="flex items-center justify-between gap-3 mb-2.5">
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/20 px-2.5 py-0.5 rounded-md">
                                                Topic #{idx + 1}
                                            </span>
                                            <ArrowRight size={16} className="text-neutral-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                                        </div>
                                        <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug">
                                            {article.subTopic}
                                        </h3>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-text-muted">
                                        <span className="flex items-center gap-1.5 font-medium">
                                            <ScrollText size={14} className="text-amber-600" />
                                            Authentic Shastric Sadācāra
                                        </span>
                                        <span className="font-bold text-amber-700 dark:text-amber-400 group-hover:underline">
                                            {l.readArticle} →
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        );
    }

    // =========================================================================
    // VIEW 2: MASTER CATALOG OF ALL 10 CATEGORIES
    // =========================================================================
    return (
        <section className="py-8 md:py-14 bg-gradient-to-b from-[#fdfbf7] via-background-light to-background-light dark:from-[#241e15] dark:via-background-dark dark:to-background-dark min-h-screen transition-colors">
            <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs md:text-sm text-text-muted mb-6">
                    <Link href="/" className="hover:text-amber-600 flex items-center gap-1 transition-colors">
                        <Home size={14} />
                        {l.home}
                    </Link>
                    <span>/</span>
                    <span className="font-semibold text-text-main dark:text-white">
                        {l.etiquettesTitle}
                    </span>
                </nav>

                {/* Master Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-neutral-200/80 dark:border-neutral-800">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold uppercase tracking-[0.2em] text-[11px] rounded-full border border-amber-500/25 mb-3 shadow-sm">
                            <Flower2 size={13} className="text-amber-600 dark:text-amber-400" />
                            <span>{l.sadacaraBadge}</span>
                            <Sparkles size={11} className="text-amber-500" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tight leading-tight">
                            {l.etiquettesTitle}
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg text-neutral-600 dark:text-neutral-400 mt-3 leading-relaxed">
                            {l.etiquettesSubtitle}
                        </p>
                    </div>

                    <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-600/15 border border-amber-500/30 text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200 shadow-sm shrink-0 self-start md:self-end">
                        <CheckCircle2 size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
                        <span>{l.totalArticlesBadge}</span>
                    </div>
                </div>

                {/* 10 Category Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
                    {categories.map((cat, idx) => {
                        const count = (cat.articleList || []).length;
                        const previewArticles = (cat.articleList || []).slice(0, 4);

                        return (
                            <div
                                key={cat.id || cat.name}
                                className="group relative flex flex-col justify-between rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 hover:border-amber-500/60 dark:hover:border-amber-400/50 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                            >
                                {/* Card Accent Header */}
                                <div className="p-6 md:p-7">
                                    <div className="flex items-center justify-between gap-3 mb-4">
                                        <div className="size-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-amber-500/25">
                                            {String(idx + 1).padStart(2, '0')}
                                        </div>
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                                            <ScrollText size={12} className="text-amber-600" />
                                            {count} {l.subtopics}
                                        </span>
                                    </div>

                                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug mb-2">
                                        {cat.name}
                                    </h2>

                                    {cat.description && (
                                        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed mb-5">
                                            {cat.description}
                                        </p>
                                    )}

                                    {/* Preview Topics List */}
                                    <div className="space-y-2 border-t border-neutral-100 dark:border-neutral-800 pt-4">
                                        {previewArticles.map((art) => (
                                            <Link
                                                key={art.id || art.slug}
                                                href={`/vaishnava-etiquettes/${art.slug}?lang=${locale}`}
                                                className="group/item flex items-center justify-between gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 py-1 transition-colors"
                                            >
                                                <span className="truncate">• {art.subTopic}</span>
                                                <ArrowRight size={13} className="shrink-0 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 transition-all text-amber-600" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Card Footer CTA */}
                                <div className="p-4 px-6 md:px-7 bg-neutral-50/70 dark:bg-neutral-800/40 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                                    <Link
                                        href={`/vaishnava-etiquettes?category=${encodeURIComponent(cat.name)}&lang=${locale}`}
                                        className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 transition-colors flex items-center gap-1.5"
                                    >
                                        <span>{l.exploreCategory}</span>
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <span className="text-[11px] font-semibold text-text-muted">
                                        {count} Topics
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default function VaishnavaEtiquettesSection() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-28 bg-background-light dark:bg-background-dark min-h-[50vh]">
                <Loader2 size={44} className="text-amber-600 animate-spin mb-4" />
                <p className="text-text-muted animate-pulse font-medium text-base">
                    Loading Vaishnava Etiquettes...
                </p>
            </div>
        }>
            <VaishnavaEtiquettesInner />
        </Suspense>
    );
}
