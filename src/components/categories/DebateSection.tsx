"use client";

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import axios from 'axios';
import { 
    ArrowRight, 
    ArrowLeft,
    Loader2, 
    Gavel,
    BookOpen,
    Search,
    X,
    Home
} from 'lucide-react';
import { useLanguage } from '../providers/LanguageContext';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface DebateArticle {
    id: number;
    subTopic: string;
    slug: string;
    article?: string;
    articleImage?: string | null;
}

interface DebateCategory {
    id?: number;
    name: string;
    description: string;
    image: string | null;
    articleList: DebateArticle[];
    translations?: Record<string, string>;
    all_names?: string[];
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
const debateCatalogCache: Record<string, DebateCategory[]> = {};

const labels: Record<string, {
    home: string;
    subtopics: string;
    viewAllSubtopics: string;
    exploreCategory: string;
    allCategories: string;
    backToCategories: string;
    searchPlaceholder: string;
    noDebatesFound: string;
    noArticlesFound: string;
    loading: string;
    logicAndPhilosophy: string;
    debates: string;
    debatesSubtitle: string;
    articlesInThisCategory: string;
    readDebate: string;
    categoryNotFound: string;
    categoryNotFoundDesc: string;
}> = {
    en: {
        home: 'Home',
        subtopics: 'Subtopics',
        viewAllSubtopics: 'View All Subtopics',
        exploreCategory: 'Explore Category',
        allCategories: 'All Categories',
        backToCategories: 'Back to All Debates',
        searchPlaceholder: 'Search topics in this category...',
        noDebatesFound: 'No Debates Found',
        noArticlesFound: 'No topics found matching your search.',
        loading: 'Loading Debates...',
        logicAndPhilosophy: 'Logic & Philosophy',
        debates: 'Debates',
        debatesSubtitle: 'Deep dives into Vedic logic and philosophy to answer challenging questions.',
        articlesInThisCategory: 'Articles & Topics',
        readDebate: 'Read Debate',
        categoryNotFound: 'Category Not Found',
        categoryNotFoundDesc: 'The requested debate category could not be found.',
    },
    ta: {
        home: 'முகப்பு',
        subtopics: 'உட்தலைப்புகள்',
        viewAllSubtopics: 'அனைத்து உட்தலைப்புகளையும் காண்க',
        exploreCategory: 'பிரிவை ஆராய்க',
        allCategories: 'அனைத்து பிரிவுகள்',
        backToCategories: 'அனைத்து விவாதங்களுக்கும் திரும்புக',
        searchPlaceholder: 'இந்த பிரிவில் தேடுக...',
        noDebatesFound: 'விவாதங்கள் எதுவும் இல்லை',
        noArticlesFound: 'தேடலுக்குரிய தலைப்புகள் எதுவும் கிடைக்கவில்லை.',
        loading: 'விவாதங்களை ஏற்றுகிறது...',
        logicAndPhilosophy: 'தர்க்கம் மற்றும் தத்துவம்',
        debates: 'விவாதங்கள்',
        debatesSubtitle: 'வேத தர்க்கம் மற்றும் தத்துவத்தின் ஆழமான ஆய்வுகள்.',
        articlesInThisCategory: 'கட்டுரைகள் & தலைப்புகள்',
        readDebate: 'விவாதத்தை வாசிக்க',
        categoryNotFound: 'பிரிவு கிடைக்கவில்லை',
        categoryNotFoundDesc: 'கோரப்பட்ட விவாதப் பிரிவு காணப்படவில்லை.',
    },
    hi: {
        home: 'होम',
        subtopics: 'उपविषय',
        viewAllSubtopics: 'सभी उपविषय देखें',
        exploreCategory: 'श्रेणी का अन्वेषण करें',
        allCategories: 'सभी श्रेणियाँ',
        backToCategories: 'सभी वाद-विवाद पर वापस जाएँ',
        searchPlaceholder: 'इस श्रेणी में खोजें...',
        noDebatesFound: 'कोई वाद-विवाद नहीं मिला',
        noArticlesFound: 'खोज से संबंधित कोई विषय नहीं मिला।',
        loading: 'वाद-विवाद लोड हो रहे हैं...',
        logicAndPhilosophy: 'तर्क और दर्शन',
        debates: 'वाद-विवाद',
        debatesSubtitle: 'वैदिक तर्क और दर्शन के गहन विश्लेषण।',
        articlesInThisCategory: 'लेख और विषय',
        readDebate: 'लेख पढ़ें',
        categoryNotFound: 'श्रेणी नहीं मिली',
        categoryNotFoundDesc: 'अनुरोधित वाद-विवाद श्रेणी नहीं मिली।',
    },
    te: {
        home: 'హోమ్',
        subtopics: 'ఉప అంశాలు',
        viewAllSubtopics: 'అన్ని ఉప అంశాలను చూడండి',
        exploreCategory: 'విభాగాన్ని అన్వేషించండి',
        allCategories: 'అన్ని విభాగాలు',
        backToCategories: 'అన్ని చర్చలకు తిరిగి వెళ్లండి',
        searchPlaceholder: 'ఈ విభాగంలో శోధించండి...',
        noDebatesFound: 'చర్చలు కనుగొనబడలేదు',
        noArticlesFound: 'శోధనకు సరిపోలే అంశాలు కనుగొనబడలేదు.',
        loading: 'చర్చలు లోడ్ అవుతున్నాయి...',
        logicAndPhilosophy: 'తర్కం మరియు తత్వశాస్త్రం',
        debates: 'చర్చలు',
        debatesSubtitle: 'వేద తర్కం మరియు తత్వశాస్త్రం యొక్క లోతైన విశ్లేషణలు.',
        articlesInThisCategory: 'వ్యాసాలు & అంశాలు',
        readDebate: 'చదవండి',
        categoryNotFound: 'విభాగం కనుగొనబడలేదు',
        categoryNotFoundDesc: 'అభ్యర్థించిన చర్చా విభాగం కనుగొనబడలేదు.',
    },
    kn: {
        home: 'ಮುಖಪುಟ',
        subtopics: 'ಉಪವಿಷಯಗಳು',
        viewAllSubtopics: 'ಎಲ್ಲಾ ಉಪವಿಷಯಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
        exploreCategory: 'ವರ್ಗವನ್ನು ಅನ್ವೇಷಿಸಿ',
        allCategories: 'ಎಲ್ಲಾ ವರ್ಗಗಳು',
        backToCategories: 'ಎಲ್ಲಾ ಚರ್ಚೆಗಳಿಗೆ ಹಿಂತಿರುಗಿ',
        searchPlaceholder: 'ಈ ವರ್ಗದಲ್ಲಿ ಹುಡುಕಿ...',
        noDebatesFound: 'ಯಾವುದೇ ಚರ್ಚೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
        noArticlesFound: 'ಹುಡುಕಾಟಕ್ಕೆ ಸೂಕ್ತವಾದ ವಿಷಯಗಳು ಸಿಗಲಿಲ್ಲ.',
        loading: 'ಚರ್ಚೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',
        logicAndPhilosophy: 'ತರ್ಕ ಮತ್ತು ತತ್ವಶಾಸ್ತ್ರ',
        debates: 'ಚರ್ಚೆಗಳು',
        debatesSubtitle: 'ವೈದಿಕ ತರ್ಕ ಮತ್ತು ತತ್ತ್ವಶಾಸ್ತ್ರದ ಆಳವಾದ ಅಧ್ಯಯನಗಳು.',
        articlesInThisCategory: 'ಲೇಖನಗಳು ಮತ್ತು ವಿಷಯಗಳು',
        readDebate: 'ಓದಿ',
        categoryNotFound: 'ವರ್ಗ ಕಂಡುಬಂದಿಲ್ಲ',
        categoryNotFoundDesc: 'ವಿನಂತಿಸಿದ ಚರ್ಚಾ ವರ್ಗ ಕಂಡುಬಂದಿಲ್ಲ.',
    },
    ml: {
        home: 'ഹോം',
        subtopics: 'ഉപവിഷയങ്ങൾ',
        viewAllSubtopics: 'എല്ലാ ഉപവിഷയങ്ങളും കാണുക',
        exploreCategory: 'വിഭാഗം പര്യവേക്ഷണം ചെയ്യുക',
        allCategories: 'എല്ലാ വിഭാഗങ്ങളും',
        backToCategories: 'എല്ലാ സംവാദങ്ങളിലേക്കും മടങ്ങുക',
        searchPlaceholder: 'ഈ വിഭാഗത്തിൽ തിരയുക...',
        noDebatesFound: 'സംവാദങ്ങളൊന്നും കണ്ടെത്തിയില്ല',
        noArticlesFound: 'തിരയലിന് അനുയോജ്യമായ വിഷയങ്ങളൊന്നും കണ്ടെത്തിയില്ല.',
        loading: 'സംവാദങ്ങൾ ലോഡ് ചെയ്യുന്നു...',
        logicAndPhilosophy: 'തർക്കവും തത്ത്വചിന്തയും',
        debates: 'സംവാദങ്ങൾ',
        debatesSubtitle: 'വേദ തർക്കത്തിന്റെയും തത്ത്വചിന്തയുടെയും ആഴത്തിലുള്ള പഠനങ്ങൾ.',
        articlesInThisCategory: 'ലേഖനങ്ങളും വിഷയങ്ങളും',
        readDebate: 'വായിക്കുക',
        categoryNotFound: 'വിഭാഗം കണ്ടെത്തിയില്ല',
        categoryNotFoundDesc: 'അഭ്യർത്ഥിച്ച സംവാദ വിഭാഗം കണ്ടെത്താനായില്ല.',
    },
    bn: {
        home: 'হোম',
        subtopics: 'উপবিষয়',
        viewAllSubtopics: 'সমস্ত উপবিষয় দেখুন',
        exploreCategory: 'বিভাগ অন্বেষণ করুন',
        allCategories: 'সমস্ত বিভাগ',
        backToCategories: 'সমস্ত বিতর্কে ফিরে যান',
        searchPlaceholder: 'এই বিভাগে অনুসন্ধান করুন...',
        noDebatesFound: 'কোনো বিতর্ক পাওয়া যায়নি',
        noArticlesFound: 'অনুসন্ধানের সাথে মেলে এমন কোনো বিষয় পাওয়া যায়নি।',
        loading: 'বিতর্ক লোড হচ্ছে...',
        logicAndPhilosophy: 'যুক্তি ও দর্শন',
        debates: 'বিতর্ক',
        debatesSubtitle: 'বৈদিক যুক্তি ও দর্শনের গভীর বিশ্লেষণ।',
        articlesInThisCategory: 'নিবন্ধ ও বিষয়',
        readDebate: 'নিবন্ধ পড়ুন',
        categoryNotFound: 'বিভাগ পাওয়া যায়নি',
        categoryNotFoundDesc: 'অনুরোধ করা বিতর্ক বিভাগ খুঁজে পাওয়া যায়নি।',
    },
};

const DebateSectionInner = () => {
    const { locale } = useLanguage();
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category');
    const [searchQuery, setSearchQuery] = useState('');

    const l = labels[locale] || labels.en;

    const [categories, setCategories] = useState<DebateCategory[]>(() => {
        return debateCatalogCache[locale] || [];
    });
    const [loading, setLoading] = useState(() => {
        return !debateCatalogCache[locale] || debateCatalogCache[locale].length === 0;
    });

    useEffect(() => {
        let isMounted = true;

        const fetchDebates = async () => {
            const normalizeResponse = (payload: any): DebateCategory[] => {
                if (Array.isArray(payload)) return payload;
                return payload?.results || [];
            };

            if (!debateCatalogCache[locale] || debateCatalogCache[locale].length === 0) {
                setLoading(true);
            }

            try {
                const response = await axios.get(`https://api.askharekrishna.com/api/v1/debate/articles/?language=${locale}`);
                let data = normalizeResponse(response.data);

                const hasTopicData = data.some((cat) => (cat.articleList || []).length > 0);
                if (!hasTopicData && locale !== 'en') {
                    const fallbackResponse = await axios.get('https://api.askharekrishna.com/api/v1/debate/articles/?language=en');
                    data = normalizeResponse(fallbackResponse.data);
                }

                debateCatalogCache[locale] = data;

                // Cache translations to sessionStorage and window for seamless Navbar language switching
                if (typeof window !== 'undefined') {
                    try {
                        const existingStr = sessionStorage.getItem('askharekrishna_category_translations');
                        const map = existingStr ? JSON.parse(existingStr) : {};
                        data.forEach((cat) => {
                            if (cat.translations) {
                                Object.values(cat.translations).forEach((name) => {
                                    if (name) {
                                        map[name.trim()] = cat.translations;
                                        map[name.trim().toLowerCase()] = cat.translations;
                                    }
                                });
                                if (cat.name) {
                                    map[cat.name.trim()] = cat.translations;
                                    map[cat.name.trim().toLowerCase()] = cat.translations;
                                }
                            }
                            if (cat.all_names) {
                                cat.all_names.forEach((name) => {
                                    if (name && cat.translations) {
                                        map[name.trim()] = cat.translations;
                                        map[name.trim().toLowerCase()] = cat.translations;
                                    }
                                });
                            }
                        });
                        (window as any).__categoryTranslations = map;
                        sessionStorage.setItem('askharekrishna_category_translations', JSON.stringify(map));
                    } catch (e) {
                        // ignore
                    }
                }

                if (isMounted) {
                    setCategories(data);
                }
            } catch (err) {
                console.error('Debate fetch failed:', err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchDebates();

        return () => {
            isMounted = false;
        };
    }, [locale]);

    // Helper to normalize strings for comparison (handles + vs space, accents, trimming, and casing)
    const normalizeCatString = (s: string | null | undefined): string => {
        if (!s) return '';
        return decodeURIComponent(s)
            .replace(/\+/g, ' ')
            .trim()
            .toLowerCase();
    };

    // Find the currently selected category if categoryParam is present in the URL
    const selectedCategory = useMemo(() => {
        if (!categoryParam || categories.length === 0) return null;
        const target = normalizeCatString(categoryParam);

        // 1. Direct match on current category name
        let match = categories.find((cat) => {
            return normalizeCatString(cat.name) === target;
        });

        // 2. Cross-language / alias match
        if (!match) {
            match = categories.find((cat) => {
                // Check all translations
                if (cat.translations) {
                    const transMatches = Object.values(cat.translations).some(
                        (t) => normalizeCatString(t) === target
                    );
                    if (transMatches) return true;
                }
                // Check all_names
                if (cat.all_names) {
                    const aliasMatches = cat.all_names.some(
                        (n) => normalizeCatString(n) === target
                    );
                    if (aliasMatches) return true;
                }
                // Check ID if numeric
                if (cat.id && String(cat.id) === target) {
                    return true;
                }
                return false;
            });
        }

        return match || null;
    }, [categoryParam, categories]);

    // Keep URL category query parameter in sync with the current locale's category name
    useEffect(() => {
        if (selectedCategory && categoryParam && typeof window !== 'undefined') {
            const rawParam = decodeURIComponent(categoryParam).replace(/\+/g, ' ').trim();
            if (rawParam !== selectedCategory.name.trim()) {
                const url = new URL(window.location.href);
                url.searchParams.set('category', selectedCategory.name);
                window.history.replaceState(null, '', url.pathname + url.search);
            }
        }
    }, [selectedCategory, categoryParam]);

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
                <Loader2 size={44} className="text-primary animate-spin mb-4" />
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
        // If category is not found after loading finishes
        if (!loading && !selectedCategory) {
            return (
                <section className="py-16 md:py-24 bg-gradient-to-b from-[#fdfbf7] to-background-light dark:from-[#2a2418] dark:to-background-dark">
                    <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                        <div className="mb-8">
                            <Link 
                                href={`/debate?lang=${locale}`}
                                className="group inline-flex items-center gap-2 text-sm font-bold text-text-muted hover:text-primary transition-colors py-2 px-3.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
                            >
                                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                                {l.backToCategories}
                            </Link>
                        </div>
                        <div className="bg-white dark:bg-[#2a2418] rounded-3xl p-12 text-center border border-[#e7dfcf] dark:border-neutral-800 shadow-sm max-w-2xl mx-auto">
                            <div className="size-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Gavel size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-text-main dark:text-white mb-2">
                                {l.categoryNotFound}
                            </h2>
                            <p className="text-text-muted dark:text-gray-400 mb-6">
                                {l.categoryNotFoundDesc}
                            </p>
                            <Link
                                href={`/debate?lang=${locale}`}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors shadow-md"
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
                    <Loader2 size={44} className="text-primary animate-spin mb-4" />
                    <p className="text-text-muted animate-pulse font-medium text-base">
                        {l.loading}
                    </p>
                </div>
            );
        }

        const categoryImageUrl = ensureAbsoluteUrl(selectedCategory.image);
        const articleCount = (selectedCategory.articleList || []).length;

        return (
            <section className="py-10 md:py-16 bg-gradient-to-b from-[#fdfbf7] via-background-light to-background-light dark:from-[#2a2418] dark:via-background-dark dark:to-background-dark">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    {/* Breadcrumbs & Back Navigation */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <nav aria-label="Breadcrumb" className="flex items-center text-sm font-medium text-text-muted">
                            <ol className="flex items-center space-x-2">
                                <li>
                                    <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1.5">
                                        <Home size={15} />
                                        <span>{l.home}</span>
                                    </Link>
                                </li>
                                <li className="text-gray-300 dark:text-gray-600">/</li>
                                <li>
                                    <Link href={`/debate?lang=${locale}`} className="hover:text-primary transition-colors">
                                        {l.debates}
                                    </Link>
                                </li>
                                <li className="text-gray-300 dark:text-gray-600">/</li>
                                <li className="text-text-main dark:text-white font-bold line-clamp-1 max-w-[280px] sm:max-w-md">
                                    {selectedCategory.name}
                                </li>
                            </ol>
                        </nav>

                        <Link
                            href={`/debate?lang=${locale}`}
                            className="group inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-dark transition-colors py-2 px-3.5 rounded-xl hover:bg-primary/5 dark:hover:bg-primary/10 border border-primary/20"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            <span>{l.backToCategories}</span>
                        </Link>
                    </div>

                    {/* Category Hero Banner */}
                    <div className="relative rounded-3xl bg-white dark:bg-[#2a2418] border border-[#e7dfcf] dark:border-neutral-800 shadow-xl overflow-hidden p-6 sm:p-8 md:p-10 mb-12">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 justify-between">
                            <div className="flex-1 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest border border-primary/20 mb-4">
                                    <Gavel size={14} />
                                    <span>{l.logicAndPhilosophy}</span>
                                </div>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-main dark:text-white tracking-tight leading-tight mb-4">
                                    {selectedCategory.name}
                                </h1>
                                {selectedCategory.description && (
                                    <p className="text-base sm:text-lg text-text-muted dark:text-gray-300 leading-relaxed max-w-2xl">
                                        {selectedCategory.description}
                                    </p>
                                )}
                                <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-3">
                                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/5 dark:bg-white/10 text-text-main dark:text-white font-bold text-sm">
                                        <BookOpen size={16} className="text-primary" />
                                        <span>{articleCount} {l.subtopics}</span>
                                    </span>
                                </div>
                            </div>

                            {/* Category Hero Image */}
                            <div className="relative w-full md:w-80 lg:w-96 h-56 sm:h-64 rounded-2xl overflow-hidden shadow-lg border border-[#e7dfcf] dark:border-neutral-800 shrink-0 bg-neutral-900">
                                {categoryImageUrl ? (
                                    <img
                                        src={categoryImageUrl}
                                        alt={selectedCategory.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                                        <Gavel size={56} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-3 right-3">
                                    <span className="px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md text-amber-300 text-xs font-semibold border border-white/10">
                                        {articleCount} {l.subtopics}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Articles Section Controls & Search */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-text-main dark:text-white">
                                {l.articlesInThisCategory}
                            </h2>
                            <p className="text-sm text-text-muted dark:text-gray-400 mt-0.5">
                                {filteredArticles.length} of {articleCount} {l.subtopics.toLowerCase()}
                            </p>
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full sm:w-80">
                            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={l.searchPlaceholder}
                                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#e7dfcf] dark:border-neutral-800 bg-white dark:bg-[#2a2418] text-sm text-text-main dark:text-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main dark:hover:text-white"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Articles List */}
                    {filteredArticles.length === 0 ? (
                        <div className="bg-white dark:bg-[#2a2418] rounded-2xl p-12 text-center border border-[#e7dfcf] dark:border-neutral-800 shadow-sm">
                            <Search size={36} className="mx-auto text-text-muted mb-3 opacity-50" />
                            <h3 className="text-lg font-bold text-text-main dark:text-white mb-1">
                                {l.noArticlesFound}
                            </h3>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="mt-4 text-xs font-bold text-primary hover:underline"
                                >
                                    Clear search filter
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            {filteredArticles.map((article, index) => {
                                const articleImageUrl = ensureAbsoluteUrl(article.articleImage || selectedCategory.image);

                                return (
                                    <Link
                                        key={article.slug}
                                        href={`/debate/${article.id || article.slug}?lang=${locale}`}
                                        className="group flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#2a2418] border border-[#e7dfcf] dark:border-neutral-800 hover:border-primary/60 hover:shadow-xl dark:hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
                                    >
                                        {/* Article Thumbnail */}
                                        <div className="relative w-full sm:w-28 md:w-32 h-40 sm:h-24 md:h-28 rounded-xl overflow-hidden shrink-0 bg-neutral-900 border border-[#e7dfcf]/60 dark:border-neutral-800">
                                            {articleImageUrl ? (
                                                <img
                                                    src={articleImageUrl}
                                                    alt={article.subTopic}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                                                    <Gavel size={28} />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:hidden" />
                                            <div className="absolute top-2 left-2">
                                                <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-amber-300 font-black text-xs border border-white/10 shadow-sm">
                                                    {String(index + 1).padStart(2, '0')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Article Details */}
                                        <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                                            <div>
                                                <h3 className="text-base sm:text-lg font-bold text-text-main dark:text-white group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                                    {article.subTopic}
                                                </h3>
                                            </div>

                                            <div className="mt-3 sm:mt-2 flex items-center justify-between pt-2 border-t border-[#f3efe7] dark:border-neutral-800/60 sm:border-0 sm:pt-0">
                                                <span className="text-xs font-bold text-primary inline-flex items-center gap-1 group-hover:text-primary-dark transition-colors">
                                                    <span>{l.readDebate}</span>
                                                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                                                </span>
                                                <div className="size-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-text-muted group-hover:bg-primary group-hover:text-white transition-all">
                                                    <ArrowRight size={15} />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        );
    }

    // =========================================================================
    // VIEW 2: ALL CATEGORIES CATALOG VIEW (when no ?category=... is in the URL)
    // =========================================================================
    return (
        <section className="py-16 md:py-24 bg-gradient-to-b from-[#fdfbf7] to-background-light dark:from-[#2a2418] dark:to-background-dark border-[#f3efe7] dark:border-neutral-800/50">
            <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className="text-center w-full max-w-3xl mx-auto">
                        <span className="inline-block mb-3 text-primary font-bold uppercase tracking-[0.2em] text-xs">
                            {l.logicAndPhilosophy}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-text-main dark:text-white leading-tight">
                            {l.debates}
                        </h1>
                        <p className="text-lg text-text-muted dark:text-gray-400 leading-relaxed">
                            {l.debatesSubtitle}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-96 bg-white dark:bg-[#2a2418] rounded-2xl border border-gray-100 dark:border-neutral-800 animate-pulse"></div>
                        ))
                    ) : categories.length === 0 ? (
                        <div className="col-span-full py-20 text-center">
                            <div className="size-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Gavel size={32} className="text-text-muted" />
                            </div>
                            <h2 className="text-xl font-bold text-text-main dark:text-white mb-2">
                                {l.noDebatesFound}
                            </h2>
                        </div>
                    ) : (
                        categories.map((category) => {
                            const imageUrl = ensureAbsoluteUrl(category?.image);
                            const categoryUrl = `/debate?category=${encodeURIComponent(category.name)}&lang=${locale}`;
                            const subtopicCount = (category.articleList || []).length;

                            return (
                                <div
                                    key={category.name}
                                    id={`cat-${encodeURIComponent(category.name)}`}
                                    className="group rounded-2xl bg-white dark:bg-[#2a2418] border border-[#e7dfcf] dark:border-neutral-800 hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                                >
                                    {/* Category Image - Clickable to Category Details */}
                                    <Link 
                                        href={categoryUrl}
                                        className="relative h-52 w-full overflow-hidden bg-neutral-900 block group/img cursor-pointer"
                                        title={`${l.exploreCategory}: ${category.name}`}
                                    >
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={category.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                                                <Gavel size={40} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                                        
                                        {/* Subtopic Badge */}
                                        <div className="absolute bottom-3 left-4 flex items-center gap-2">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-amber-300 text-xs font-semibold border border-white/10 shadow-sm">
                                                <Gavel size={13} />
                                                <span>{subtopicCount} {l.subtopics}</span>
                                            </span>
                                        </div>

                                        {/* Hover Overlay Hint */}
                                        <div className="absolute top-3 right-3 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary text-white text-xs font-bold shadow-md">
                                                <span>{l.exploreCategory}</span>
                                                <ArrowRight size={12} />
                                            </span>
                                        </div>
                                    </Link>

                                    {/* Category Title & Description */}
                                    <div className="p-6 pb-4">
                                        <Link href={categoryUrl} className="block">
                                            <h3 className="text-xl font-bold text-text-main dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                                                {category.name}
                                            </h3>
                                        </Link>
                                        {category.description && (
                                            <p className="mt-2 text-sm text-text-muted dark:text-gray-400 line-clamp-2 leading-relaxed">
                                                {category.description}
                                            </p>
                                        )}
                                        <div className="mt-4">
                                            <Link
                                                href={categoryUrl}
                                                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark transition-colors"
                                            >
                                                <span>{l.exploreCategory}</span>
                                                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Subtopics List */}
                                    <div className="px-6 pb-6 pt-3 border-t border-[#f3efe7] dark:border-neutral-800/80 flex-grow flex flex-col">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-semibold text-text-muted dark:text-gray-400 uppercase tracking-wider">
                                                {l.subtopics}
                                            </span>
                                            <Link
                                                href={categoryUrl}
                                                className="text-xs font-bold text-primary hover:underline"
                                            >
                                                {l.viewAllSubtopics} &rarr;
                                            </Link>
                                        </div>
                                        <ul className="space-y-1 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                                            {(category.articleList || []).map((article) => (
                                                <li key={article.slug}>
                                                    <Link
                                                        href={`/debate/${article.id || article.slug}?lang=${locale}`}
                                                        className="group/item flex items-center justify-between gap-3 text-sm text-text-main dark:text-gray-200 hover:text-primary py-2 px-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                                    >
                                                        <span className="line-clamp-2">{article.subTopic}</span>
                                                        <ArrowRight size={14} className="shrink-0 text-text-muted group-hover/item:text-primary group-hover/item:translate-x-0.5 transition-all" />
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </section>
    );
};

export default function DebateSection() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-28 bg-background-light dark:bg-background-dark min-h-[50vh]">
                <Loader2 size={44} className="text-primary animate-spin mb-4" />
                <p className="text-text-muted animate-pulse font-medium text-base">
                    Loading Debates...
                </p>
            </div>
        }>
            <DebateSectionInner />
        </Suspense>
    );
}
