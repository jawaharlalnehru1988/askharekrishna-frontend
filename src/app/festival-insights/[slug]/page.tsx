import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { headers } from 'next/headers';
import { 
    ArrowLeft, 
    ChevronLeft, 
    ChevronRight, 
    Clock, 
    Sparkles, 
    Flame, 
    ScrollText, 
    CheckCircle2, 
    Home,
    BookOpen,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FESTIVAL_ARTICLES, getFestivalArticleBySlug } from '@/data/festivalInsightsData';
import { buildArticleMetadata, toPlainExcerpt } from '@/lib/metadata';
import { ShareButtons } from '@/components/categories/ShareButtons';
import { FestivalArticleUrlSync } from '@/components/festival/FestivalArticleUrlSync';

const VALID_LOCALES = ['en', 'ta', 'hi', 'te', 'kn', 'ml', 'bn'] as const;
type ValidLocale = typeof VALID_LOCALES[number];

const UI_STRINGS: Record<ValidLocale, {
    home: string;
    festivalInsights: string;
    backToAll: string;
    pramanaTitle: string;
    previousArticle: string;
    nextArticle: string;
    exploreAll: string;
    shareArticle: string;
    sharePrefix: string;
}> = {
    en: {
        home: 'Home',
        festivalInsights: 'Festival Insights',
        backToAll: 'Back to All Festival Articles',
        pramanaTitle: 'Authoritative Scriptural References (Pramana):',
        previousArticle: 'Previous Article',
        nextArticle: 'Next Article',
        exploreAll: 'Explore All Festival Topics',
        shareArticle: 'Share this Festival Article',
        sharePrefix: 'Check out this Festival Insights article:',
    },
    ta: {
        home: 'முகப்பு',
        festivalInsights: 'பண்டிகைகளின் தாத்பரியம்',
        backToAll: 'அனைத்துப் பண்டிகைக் கட்டுரைகளுக்கும் திரும்புக',
        pramanaTitle: 'அங்கீகரிக்கப்பட்ட சாஸ்திர பிரமாணங்கள்:',
        previousArticle: 'முந்தைய கட்டுரை',
        nextArticle: 'அடுத்த கட்டுரை',
        exploreAll: 'அனைத்து பண்டிகைத் தலைப்புகளையும் காண்க',
        shareArticle: 'இந்த பண்டிகைக் கட்டுரையைப் பகிரவும்',
        sharePrefix: 'பண்டிகைகளின் தாத்பரியம் - இந்த கட்டுரையைப் படிக்கவும்:',
    },
    hi: {
        home: 'गृह',
        festivalInsights: 'पर्व तात्त्विक रहस्य',
        backToAll: 'सभी पर्व आलेखों पर लौटें',
        pramanaTitle: 'प्रमाणित शास्त्रीय संदर्भ (प्रमाण):',
        previousArticle: 'पिछला आलेख',
        nextArticle: 'अगला आलेख',
        exploreAll: 'समस्त पर्व आलेख देखें',
        shareArticle: 'यह पर्व आलेख साझा करें',
        sharePrefix: 'पर्व तात्त्विक रहस्य - यह आलेख पढ़ें:',
    },
    te: {
        home: 'గృహం',
        festivalInsights: 'పండుగల అంతరార్థం',
        backToAll: 'అన్ని పండుగల వ్యాసాలకు తిరిగి వెళ్లండి',
        pramanaTitle: 'ప్రామాణిక శాస్త్ర ప్రమాణాలు:',
        previousArticle: 'మునుపటి వ్యాసం',
        nextArticle: 'తరువాతి వ్యాసం',
        exploreAll: 'అన్ని పండుగలను అన్వేషించండి',
        shareArticle: 'ఈ పండుగ వ్యాసాన్ని పంచుకోండి',
        sharePrefix: 'పండుగల అంతరార్థం - ఈ వ్యాసాన్ని చదవండి:',
    },
    kn: {
        home: 'ಮುಖಪುಟ',
        festivalInsights: 'ಹಬ್ಬಗಳ ತಾತ್ಪರ್ಯ',
        backToAll: 'ಎಲ್ಲಾ ಹಬ್ಬಗಳ ಲೇಖನಗಳಿಗೆ ಹಿಂತಿರುಗಿ',
        pramanaTitle: 'ಅಧಿಕೃತ ಶಾಸ್ತ್ರ ಪ್ರಮಾಣಗಳು:',
        previousArticle: 'ಹಿಂದಿನ ಲೇಖನ',
        nextArticle: 'ಮುಂದಿನ ಲೇಖನ',
        exploreAll: 'ಎಲ್ಲಾ ಹಬ್ಬದ ಲೇಖನಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
        shareArticle: 'ಈ ಹಬ್ಬದ ಲೇಖನವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ',
        sharePrefix: 'ಹಬ್ಬಗಳ ತಾತ್ಪರ್ಯ - ಈ ಲೇಖನವನ್ನು ಓದಿ:',
    },
    ml: {
        home: 'മുഖം',
        festivalInsights: 'ഉത്സവങ്ങളുടെ തത്ത്വം',
        backToAll: 'എല്ലാ ഉത്സവ ലേഖനങ്ങളിലേക്കും മടങ്ങുക',
        pramanaTitle: 'ആധികാരിക ശാസ്ത്ര പ്രമാണങ്ങൾ:',
        previousArticle: 'മുൻപത്തെ ലേഖനം',
        nextArticle: 'അടുത്ത ലേഖനം',
        exploreAll: 'എല്ലാ ഉത്സവ ലേഖനങ്ങളും കാണുക',
        shareArticle: 'ഈ ഉത്സവ ലേഖനം പങ്കിടുക',
        sharePrefix: 'ഉത്സവങ്ങളുടെ തത്ത്വം - ഈ ലേഖനം വായിക്കുക:',
    },
    bn: {
        home: 'মূলপাতা',
        festivalInsights: 'উৎসবের তাৎপর্য',
        backToAll: 'সকল উৎসব প্রবন্ধে ফিরে যান',
        pramanaTitle: 'প্রামাণিক শাস্ত্রীয় নির্দেশ (প্রমাণ):',
        previousArticle: 'পূর্ববর্তী প্রবন্ধ',
        nextArticle: 'পরবর্তী প্রবন্ধ',
        exploreAll: 'সকল উৎসবের প্রবন্ধ দেখুন',
        shareArticle: 'এই উৎসবের প্রবন্ধটি শেয়ার করুন',
        sharePrefix: 'উৎসবের তাৎপর্য - এই প্রবন্ধটি পড়ুন:',
    },
};

function resolveLocale(queryLang?: string, host?: string, headerLocale?: string | null): ValidLocale {
    const q = (queryLang || '').toLowerCase();
    if (VALID_LOCALES.includes(q as ValidLocale)) return q as ValidLocale;

    if (headerLocale && VALID_LOCALES.includes(headerLocale.toLowerCase() as ValidLocale)) {
        return headerLocale.toLowerCase() as ValidLocale;
    }

    const lowerHost = (host || '').toLowerCase();
    if (lowerHost.startsWith('tamil.') || lowerHost.startsWith('ta.')) return 'ta';
    if (lowerHost.startsWith('hindi.') || lowerHost.startsWith('hi.')) return 'hi';
    if (lowerHost.startsWith('telugu.') || lowerHost.startsWith('te.')) return 'te';
    if (lowerHost.startsWith('kannada.') || lowerHost.startsWith('kn.')) return 'kn';
    if (lowerHost.startsWith('malayalam.') || lowerHost.startsWith('ml.')) return 'ml';
    if (lowerHost.startsWith('bengali.') || lowerHost.startsWith('bn.')) return 'bn';

    return 'en';
}

export function generateStaticParams() {
    return FESTIVAL_ARTICLES.flatMap((item) => [
        { slug: item.id.toString() },
        { slug: item.slug },
    ]);
}

export async function generateMetadata({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>;
    searchParams?: Promise<{ lang?: string; language?: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const article = getFestivalArticleBySlug(slug);
    if (!article) return { title: 'Article Not Found | AskHareKrishna' };

    const search = searchParams ? await searchParams : undefined;
    const reqLang = search?.lang || search?.language;

    const headersList = await headers();
    const host = headersList.get('host') || headersList.get('x-forwarded-host') || 'askharekrishna.com';
    const headerLocale = headersList.get('x-locale');
    const locale = resolveLocale(reqLang, host, headerLocale);

    const trans = article.translations[locale] || article.translations.en;
    const articleNumber = article.id || article.order;
    const path = `/festival-insights/${articleNumber}?lang=${locale}`;
    const description = toPlainExcerpt(trans.excerpt || trans.article);

    return buildArticleMetadata({
        host,
        path,
        title: `${trans.title} | AskHareKrishna Festival Insights`,
        description,
        imageUrl: article.imageUrl,
    });
}

export default async function FestivalArticleDetailPage({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>;
    searchParams?: Promise<{ lang?: string; language?: string }>;
}) {
    const { slug } = await params;
    const article = getFestivalArticleBySlug(slug);
    if (!article) notFound();

    const search = searchParams ? await searchParams : undefined;
    const queryLang = search?.lang || search?.language;

    const headersList = await headers();
    const host = headersList.get('host') || headersList.get('x-forwarded-host') || 'askharekrishna.com';
    const headerLocale = headersList.get('x-locale');
    const currentLang = resolveLocale(queryLang, host, headerLocale);

    const ui = UI_STRINGS[currentLang] || UI_STRINGS.en;
    const trans = article.translations[currentLang] || article.translations.en;
    const pramana = trans.scripturePramana || (currentLang === 'ta' ? article.scripturePramanaTamil : article.scripturePramana);
    const readTime = trans.readTime || (currentLang === 'ta' ? article.readTimeTamil : article.readTime);
    const festivalName = trans.festivalName || (currentLang === 'ta' ? article.festivalTamil : article.festival);

    const articleNumber = article.id || article.order;
    const rawHost = headersList.get('host') || headersList.get('x-forwarded-host') || 'askharekrishna.com';
    const cleanHost = (rawHost.includes('127.0.0.1') || rawHost.includes('localhost') || !rawHost) ? 'askharekrishna.com' : rawHost;
    const protocol = cleanHost.includes('localhost') ? 'http' : 'https';
    const articleUrl = `${protocol}://${cleanHost}/festival-insights/${articleNumber}?lang=${currentLang}`;

    // Previous and Next articles by article ID
    const currentIndex = FESTIVAL_ARTICLES.findIndex((a) => a.id === article.id);
    const previousArticle = currentIndex > 0 ? FESTIVAL_ARTICLES[currentIndex - 1] : null;
    const nextArticle = currentIndex < FESTIVAL_ARTICLES.length - 1 ? FESTIVAL_ARTICLES[currentIndex + 1] : null;

    const prevTrans = previousArticle ? (previousArticle.translations[currentLang] || previousArticle.translations.en) : null;
    const nextTrans = nextArticle ? (nextArticle.translations[currentLang] || nextArticle.translations.en) : null;

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Article",
                "headline": trans.title,
                "description": trans.excerpt,
                "image": article.imageUrl?.startsWith('/') ? `https://askharekrishna.com${article.imageUrl}` : article.imageUrl,
                "publisher": {
                    "@type": "Organization",
                    "name": "Ask Hare Krishna",
                    "url": "https://askharekrishna.com",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://askharekrishna.com/askharekrishnalogo.jpg"
                    }
                },
                "inLanguage": currentLang,
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": `https://askharekrishna.com/festival-insights/${articleNumber}`
                }
            }
        ]
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-200">
            <FestivalArticleUrlSync articleNumber={articleNumber} locale={currentLang} />
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <Navbar />

            <main className="flex-1 w-full pt-6 pb-20">
                <div className="max-w-[960px] mx-auto px-4 sm:px-6 md:px-8">
                    {/* Top Bar: Breadcrumbs */}
                    <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-neutral-200/80 dark:border-neutral-800">
                        {/* Breadcrumbs */}
                        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs md:text-sm text-text-muted flex-wrap">
                            <Link href="/" className="hover:text-amber-600 flex items-center gap-1 transition-colors">
                                <Home size={14} />
                                <span>{ui.home}</span>
                            </Link>
                            <span>/</span>
                            <Link href="/festival-insights" className="hover:text-amber-600 transition-colors">
                                <span>{ui.festivalInsights}</span>
                            </Link>
                            <span>/</span>
                            <span className="font-semibold text-text-main dark:text-white truncate max-w-[240px] sm:max-w-md">
                                {trans.title}
                            </span>
                        </nav>
                    </div>

                    {/* Back to all festival insights */}
                    <div className="mb-6">
                        <Link
                            href="/festival-insights"
                            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 transition-colors py-2 px-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            <span>{ui.backToAll}</span>
                        </Link>
                    </div>

                    {/* Article Header Card */}
                    <header className="rounded-3xl p-6 sm:p-10 mb-8 border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.12] via-orange-500/[0.05] to-rose-900/[0.15] dark:from-amber-950/40 dark:via-neutral-900 dark:to-neutral-950 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                            <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-800 dark:text-amber-300 font-mono">
                                0{article.order} / 0{FESTIVAL_ARTICLES.length}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                                <Flame size={13} className="text-amber-600 shrink-0" />
                                <span>{festivalName}</span>
                            </span>
                            <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-medium ml-auto">
                                <Clock size={13} />
                                <span>{readTime}</span>
                            </div>
                        </div>

                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-text-main dark:text-white tracking-tight leading-tight mb-3">
                            {trans.title}
                        </h1>

                        <p className="text-sm sm:text-base font-bold text-amber-700 dark:text-amber-400 mb-6 flex items-center gap-2">
                            <span className="size-2 rounded-full bg-amber-500 shrink-0" />
                            <span>{trans.subTopic}</span>
                        </p>

                        {/* Scripture Pramana Box */}
                        <div className="p-4 rounded-2xl bg-white/80 dark:bg-neutral-900/80 border border-amber-500/25 text-xs sm:text-sm flex items-start gap-3 shadow-sm mb-6">
                            <ScrollText size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold text-neutral-800 dark:text-neutral-200 block mb-1">
                                    {ui.pramanaTitle}
                                </span>
                                <span className="text-neutral-600 dark:text-neutral-300 italic">
                                    {pramana}
                                </span>
                            </div>
                        </div>

                        {/* Highlights Pill List */}
                        <div className="flex flex-wrap gap-2">
                            {trans.highlights.map((h, i) => (
                                <span
                                    key={i}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/90 dark:bg-neutral-800/90 border border-neutral-200/80 dark:border-neutral-700/80 text-xs font-semibold text-neutral-800 dark:text-neutral-200"
                                >
                                    <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                                    <span>{h}</span>
                                </span>
                            ))}
                        </div>
                    </header>

                    {/* Hero Devotional Painting Image */}
                    {article.imageUrl && (
                        <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden mb-10 shadow-lg border border-amber-500/25 bg-neutral-900 group">
                            <img
                                src={article.imageUrl}
                                alt={article.imageAlt || trans.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Article Content Container */}
                    <div className="bg-white dark:bg-[#1f1a12] rounded-3xl p-6 sm:p-10 md:p-12 border border-neutral-200/90 dark:border-neutral-800 shadow-sm mb-12">
                        <article className="prose prose-stone dark:prose-invert max-w-none 
                            prose-headings:font-black prose-headings:tracking-tight
                            prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-5 prose-h2:text-neutral-900 dark:prose-h2:text-white prose-h2:border-b prose-h2:border-neutral-200 dark:prose-h2:border-neutral-800 prose-h2:pb-3
                            prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-amber-700 dark:prose-h3:text-amber-400
                            prose-h4:text-lg sm:prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-2 prose-h4:font-bold prose-h4:text-neutral-800 dark:prose-h4:text-neutral-200
                            prose-p:text-base sm:prose-p:text-lg prose-p:leading-relaxed prose-p:text-neutral-700 dark:prose-p:text-neutral-300 prose-p:mb-5
                            prose-li:text-base sm:prose-li:text-lg prose-li:leading-relaxed prose-li:text-neutral-700 dark:prose-li:text-neutral-300
                            prose-blockquote:border-l-4 prose-blockquote:border-amber-500 prose-blockquote:bg-amber-500/10 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic prose-blockquote:text-neutral-800 dark:prose-blockquote:text-neutral-200
                            prose-strong:text-amber-700 dark:prose-strong:text-amber-400 prose-strong:font-bold
                            prose-pre:bg-neutral-900 prose-pre:text-amber-300 prose-pre:p-5 prose-pre:rounded-2xl prose-pre:border prose-pre:border-amber-500/20">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {trans.article}
                            </ReactMarkdown>
                        </article>

                        {/* Share Article Section */}
                        <div className="mt-12 pt-10 border-t border-neutral-200/90 dark:border-neutral-800 text-center">
                            <p className="text-xs sm:text-sm font-bold text-neutral-500 dark:text-neutral-400 mb-6 uppercase tracking-[0.25em]">
                                {ui.shareArticle}
                            </p>
                            <ShareButtons 
                                articleUrl={articleUrl} 
                                subTopic={trans.title} 
                                messagePrefix={ui.sharePrefix}
                            />
                        </div>
                    </div>

                    {/* Navigation between Articles */}
                    <nav aria-label="Article pagination" className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                        {previousArticle ? (
                            <Link
                                href={`/festival-insights/${previousArticle.id}?lang=${currentLang}`}
                                className="group p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 hover:border-amber-500/50 transition-all flex items-center gap-4"
                            >
                                <div className="size-10 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:-translate-x-1 transition-transform">
                                    <ChevronLeft size={20} />
                                </div>
                                <div className="min-w-0">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                                        {ui.previousArticle}
                                    </span>
                                    <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200 truncate group-hover:text-amber-600 transition-colors">
                                        {prevTrans?.title}
                                    </p>
                                </div>
                            </Link>
                        ) : (
                            <div className="hidden sm:block" />
                        )}

                        {nextArticle && (
                            <Link
                                href={`/festival-insights/${nextArticle.id}?lang=${currentLang}`}
                                className="group p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 hover:border-amber-500/50 transition-all flex items-center justify-between gap-4 text-right"
                            >
                                <div className="min-w-0 flex-1">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                                        {ui.nextArticle}
                                    </span>
                                    <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200 truncate group-hover:text-amber-600 transition-colors">
                                        {nextTrans?.title}
                                    </p>
                                </div>
                                <div className="size-10 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
                                    <ChevronRight size={20} />
                                </div>
                            </Link>
                        )}
                    </nav>

                    {/* Back to top/overview */}
                    <div className="text-center">
                        <Link
                            href="/festival-insights"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md shadow-amber-600/20 transition-all"
                        >
                            <BookOpen size={16} />
                            <span>{ui.exploreAll}</span>
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
