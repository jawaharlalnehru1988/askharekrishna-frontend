"use client";

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
    ArrowLeft, 
    Share2, 
    ChevronLeft, 
    ChevronRight, 
    ListOrdered, 
    Copy, 
    Check, 
    X,
    Sparkles,
    ScrollText,
    Flower2,
    Loader2,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLanguage } from '../providers/LanguageContext';
import Link from 'next/link';

interface EtiquetteArticleNav {
    id?: number;
    slug: string;
    subTopic: string;
    order?: number;
}

export interface EtiquetteArticle {
    id?: number;
    subTopic: string;
    article: string;
    slug: string;
    articleImage?: string | null;
    audioPath?: string | null;
    previousArticle?: EtiquetteArticleNav | null;
    nextArticle?: EtiquetteArticleNav | null;
}

const navLabels: Record<string, { prev: string; next: string }> = {
    en: { prev: 'Previous Topic', next: 'Next Topic' },
    ta: { prev: 'முந்தைய தலைப்பு', next: 'அடுத்த தலைப்பு' },
    hi: { prev: 'पिछला विषय', next: 'अगला विषय' },
    te: { prev: 'మునుపటి అంశం', next: 'తరువాతి అంశం' },
    kn: { prev: 'ಹಿಂದಿನ ವಿಷಯ', next: 'ಮುಂದಿನ ವಿಷಯ' },
    ml: { prev: 'മുമ്പത്തെ വിഷയം', next: 'അടുത്ത വിഷയം' },
    bn: { prev: 'পূর্ববর্তী বিষয়', next: 'পরবর্তী বিষয়' },
};

const tocLabels: Record<string, string> = {
    en: 'Table of Contents',
    ta: 'பொருளடக்கம்',
    hi: 'विषय-सूची',
    kn: 'ಪರಿವಿಡಿ',
    te: 'విషయ సూచిక',
    ml: 'ഉള്ളടക്കം',
    bn: 'সূচিপত্র',
};

const shareLabels: Record<string, {
    shareTitle: string;
    copyLink: string;
    linkCopied: string;
    copyText: string;
    textCopied: string;
    allTopics: string;
    close: string;
    loading: string;
}> = {
    en: {
        shareTitle: 'Share Vaishnava Etiquette Topic',
        copyLink: 'Copy Link',
        linkCopied: 'Link Copied!',
        copyText: 'Copy Text',
        textCopied: 'Text Copied!',
        allTopics: 'Back to All Etiquettes',
        close: 'Close',
        loading: 'Loading topic...',
    },
    ta: {
        shareTitle: 'இந்த நெறிமுறைத் தலைப்பைப் பகிரவும்',
        copyLink: 'இணைப்பை நகலெடு',
        linkCopied: 'இணைப்பு நகலெடுக்கப்பட்டது!',
        copyText: 'உரையை நகலெடு',
        textCopied: 'உரை நகலெடுக்கப்பட்டது!',
        allTopics: 'அனைத்து நெறிமுறைகளுக்கும் திரும்புக',
        close: 'மூடுக',
        loading: 'தலைப்பை ஏற்றுகிறது...',
    },
    hi: {
        shareTitle: 'सदाचार विषय साझा करें',
        copyLink: 'लिंक कॉपी करें',
        linkCopied: 'लिंक कॉपी हो गया!',
        copyText: 'टेक्स्ट कॉपी करें',
        textCopied: 'टेक्स्ट कॉपी हो गया!',
        allTopics: 'सभी सदाचारों पर वापस जाएँ',
        close: 'बंद करें',
        loading: 'विषय लोड हो रहा है...',
    },
    kn: {
        shareTitle: 'ಸದಾಚಾರ ವಿಷಯವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ',
        copyLink: 'ಲಿಂಕ್ ನಕಲಿಸಿ',
        linkCopied: 'ಲಿಂಕ್ ನಕಲಿಸಲಾಗಿದೆ!',
        copyText: 'ಪಠ್ಯ ನಕಲಿಸಿ',
        textCopied: 'ಪಠ್ಯ ನಕಲಿಸಲಾಗಿದೆ!',
        allTopics: 'ಎಲ್ಲಾ ಸದಾಚಾರಗಳಿಗೆ ಹಿಂತಿರುಗಿ',
        close: 'ಮುಚ್ಚಿ',
        loading: 'ವಿಷಯ ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    },
    te: {
        shareTitle: 'సదాచార అంశాన్ని పంచుకోండి',
        copyLink: 'లింక్ కాపీ చేయండి',
        linkCopied: 'లింక్ కాపీ చేయబడింది!',
        copyText: 'టెక్స్ట్ కాపీ చేయండి',
        textCopied: 'టెక్స్ట్ కాపీ చేయబడింది!',
        allTopics: 'అన్ని సదాచారాలకు తిరిగి వెళ్లండి',
        close: 'మూసివేయి',
        loading: 'అంశం లోడ్ అవుతోంది...',
    },
    ml: {
        shareTitle: 'സദാചാര വിഷയം പങ്കിടുക',
        copyLink: 'ലിങ്ക് പകർത്തുക',
        linkCopied: 'ലിങ്ക് പകർത്തി!',
        copyText: 'വാചകം പകർത്തുക',
        textCopied: 'വാചകം പകർത്തി!',
        allTopics: 'എല്ലാ സദാചാരങ്ങളിലേക്കും മടങ്ങുക',
        close: 'അടയ്ക്കുക',
        loading: 'വിഷയം ലോഡ് ചെയ്യുന്നു...',
    },
    bn: {
        shareTitle: 'সদাচার বিষয় ভাগ করুন',
        copyLink: 'লিঙ্ক কপি করুন',
        linkCopied: 'লিঙ্ক কপি হয়েছে!',
        copyText: 'টেক্সট কপি করুন',
        textCopied: 'টেক্সট কপি হয়েছে!',
        allTopics: 'সমস্ত সদাচারে ফিরে যান',
        close: 'বন্ধ করুন',
        loading: 'বিষয় লোড হচ্ছে...',
    },
};

const slugify = (text: string) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
};

const getHeadingIds = (text: string) => {
    const raw = text.trim();
    const primary = slugify(raw);
    const parts = raw.split(/[:\-\.]/);
    if (parts.length > 1) {
        const afterPrefix = parts.slice(1).join(' ').trim();
        const secondary = slugify(afterPrefix);
        if (secondary && secondary !== primary) {
            return [primary, secondary];
        }
    }
    return [primary];
};

interface Props {
    slug: string;
    initialArticle?: EtiquetteArticle | null;
    initialCategoryName?: string;
}

export default function VaishnavaEtiquetteArticleDetail({ slug, initialArticle, initialCategoryName }: Props) {
    const { locale } = useLanguage();
    const [article, setArticle] = useState<EtiquetteArticle | null>(initialArticle || null);
    const [categoryName, setCategoryName] = useState<string>(initialCategoryName || '');
    const [loading, setLoading] = useState<boolean>(!initialArticle);
    const [copiedLink, setCopiedLink] = useState(false);
    const [copiedText, setCopiedText] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const s = shareLabels[locale] || shareLabels.en;
    const n = navLabels[locale] || navLabels.en;

    useEffect(() => {
        let isMounted = true;
        const fetchArticle = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `https://api.askharekrishna.com/api/v1/vaishnava_etiquettes/articles/?language=${locale}&slug=${encodeURIComponent(slug)}`
                );
                const data = Array.isArray(response.data) ? response.data : (response.data.results || []);

                let foundArticle = null;
                let foundCatName = '';

                for (const cat of data) {
                    if (cat.articleList && cat.articleList.length > 0) {
                        const match = cat.articleList.find((a: any) => 
                            (a.slug === slug || a.id?.toString() === slug) && a.article && a.article.trim()
                        );
                        if (match) {
                            foundArticle = match;
                            foundCatName = cat.name || '';
                            break;
                        }
                    }
                }

                if (!foundArticle && locale !== 'en') {
                    const fallbackResponse = await axios.get(
                        `https://api.askharekrishna.com/api/v1/vaishnava_etiquettes/articles/?language=en&slug=${encodeURIComponent(slug)}`
                    );
                    const fallbackData = Array.isArray(fallbackResponse.data) ? fallbackResponse.data : (fallbackResponse.data.results || []);
                    for (const cat of fallbackData) {
                        if (cat.articleList && cat.articleList.length > 0) {
                            const match = cat.articleList.find((a: any) => 
                                (a.slug === slug || a.id?.toString() === slug) && a.article && a.article.trim()
                            );
                            if (match) {
                                foundArticle = match;
                                foundCatName = cat.name || '';
                                break;
                            }
                        }
                    }
                }

                if (isMounted && foundArticle) {
                    setArticle(foundArticle);
                    setCategoryName(foundCatName);
                }
            } catch (err) {
                console.error('Error fetching article:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchArticle();
        return () => {
            isMounted = false;
        };
    }, [slug, locale]);

    const tocItems = useMemo(() => {
        if (!article?.article) return [];
        const lines = article.article.split('\n');
        const items: { id: string; text: string; level: number }[] = [];
        for (const line of lines) {
            const h2Match = line.match(/^##\s+(.+)$/);
            const h3Match = line.match(/^###\s+(.+)$/);
            if (h2Match) {
                const text = h2Match[1].trim();
                if (!text.toLowerCase().includes('sequential study') && !text.toLowerCase().includes('navigation')) {
                    items.push({ id: getHeadingIds(text)[0], text, level: 2 });
                }
            } else if (h3Match) {
                const text = h3Match[1].trim();
                if (!text.toLowerCase().includes('sequential study') && !text.toLowerCase().includes('navigation')) {
                    items.push({ id: getHeadingIds(text)[0], text, level: 3 });
                }
            }
        }
        return items;
    }, [article?.article]);

    const handleCopyLink = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href);
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2500);
        }
    };

    const handleCopyText = () => {
        if (typeof window !== 'undefined' && article) {
            navigator.clipboard.writeText(`${article.subTopic}\n\n${article.article}\n\nSource: https://askharekrishna.com/vaishnava-etiquettes/${article.slug}`);
            setCopiedText(true);
            setTimeout(() => setCopiedText(false), 2500);
        }
    };

    if (loading && !article) {
        return (
            <div className="flex flex-col items-center justify-center py-28 bg-background-light dark:bg-background-dark min-h-[50vh]">
                <Loader2 size={44} className="text-amber-600 dark:text-amber-400 animate-spin mb-4" />
                <p className="text-text-muted animate-pulse font-medium text-base">
                    {s.loading}
                </p>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">Topic Not Found</h2>
                <Link
                    href={`/vaishnava-etiquettes?lang=${locale}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 text-white font-bold"
                >
                    <ArrowLeft size={16} />
                    {s.allTopics}
                </Link>
            </div>
        );
    }

    return (
        <article className="min-h-screen bg-gradient-to-b from-[#fdfbf7] via-background-light to-background-light dark:from-[#221c13] dark:via-background-dark dark:to-background-dark py-8 md:py-14 transition-colors">
            <div className="max-w-4xl mx-auto px-4 md:px-8">
                {/* Top Nav & Breadcrumbs */}
                <div className="flex items-center justify-between gap-4 mb-6">
                    <Link
                        href={`/vaishnava-etiquettes?lang=${locale}`}
                        className="group inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-800 dark:text-amber-300 hover:text-amber-900 transition-colors py-2 px-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span>{s.allTopics}</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCopyLink}
                            aria-label="Copy article link"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:text-amber-600 transition-colors shadow-xs"
                        >
                            {copiedLink ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                            <span>{copiedLink ? s.linkCopied : s.copyLink}</span>
                        </button>
                        <button
                            onClick={() => setIsShareModalOpen(true)}
                            aria-label="Share article"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-xs"
                        >
                            <Share2 size={14} />
                            <span>Share</span>
                        </button>
                    </div>
                </div>

                {/* Article Header Card */}
                <header className="mb-10 rounded-3xl p-6 md:p-10 border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.12] via-orange-500/[0.05] to-amber-900/[0.12] dark:from-amber-950/40 dark:via-neutral-900 dark:to-neutral-950 shadow-sm">
                    {categoryName && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider text-[11px] rounded-full border border-amber-500/30 mb-4">
                            <Flower2 size={13} className="text-amber-600 dark:text-amber-400" />
                            <span>{categoryName}</span>
                        </div>
                    )}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-neutral-900 dark:text-white tracking-tight leading-tight mb-4">
                        {article.subTopic}
                    </h1>
                    <div className="flex items-center gap-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-medium pt-3 border-t border-amber-500/15">
                        <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400">
                            <Sparkles size={14} />
                            Authentic Vedic Sadācāra
                        </span>
                        <span>•</span>
                        <span>Śrīla Prabhupāda Standard</span>
                    </div>
                </header>

                {/* Table of Contents */}
                {tocItems.length > 1 && (
                    <div className="mb-10 p-6 md:p-7 rounded-2xl bg-white dark:bg-neutral-900 border border-amber-500/20 shadow-xs">
                        <div className="flex items-center gap-2 mb-4 text-amber-800 dark:text-amber-400 font-bold text-base md:text-lg">
                            <ListOrdered size={20} className="text-amber-600" />
                            <span>{tocLabels[locale] || tocLabels.en}</span>
                        </div>
                        <ul className="space-y-2">
                            {tocItems.map((item, idx) => (
                                <li key={`${item.id}-${idx}`} className={item.level === 3 ? 'ml-4' : ''}>
                                    <a
                                        href={`#${item.id}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const el = document.getElementById(item.id);
                                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-start gap-2"
                                    >
                                        <span className="text-amber-600 font-bold shrink-0">{idx + 1}.</span>
                                        <span className="hover:underline">{item.text}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Markdown Content */}
                <div className="prose prose-stone dark:prose-invert max-w-none 
                    prose-headings:font-black prose-headings:tracking-tight
                    prose-h1:text-3xl prose-h1:mb-6
                    prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-5 prose-h2:text-amber-900 dark:prose-h2:text-amber-200
                    prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
                    prose-p:text-base sm:prose-p:text-lg prose-p:leading-relaxed prose-p:text-neutral-800 dark:prose-p:text-neutral-200
                    prose-blockquote:border-l-4 prose-blockquote:border-amber-500 prose-blockquote:bg-amber-500/[0.07] dark:prose-blockquote:bg-amber-950/20 prose-blockquote:p-5 prose-blockquote:rounded-r-2xl prose-blockquote:italic
                    prose-strong:text-amber-800 dark:prose-strong:text-amber-300 prose-strong:font-bold">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h2: ({ children, ...props }) => {
                                const text = React.Children.toArray(children).map(c => typeof c === 'string' ? c : '').join('');
                                const ids = getHeadingIds(text);
                                return (
                                    <div id={ids[0]} className="scroll-mt-24">
                                        <h2 {...props}>{children}</h2>
                                    </div>
                                );
                            },
                            h3: ({ children, ...props }) => {
                                const text = React.Children.toArray(children).map(c => typeof c === 'string' ? c : '').join('');
                                const ids = getHeadingIds(text);
                                return (
                                    <div id={ids[0]} className="scroll-mt-24">
                                        <h3 {...props}>{children}</h3>
                                    </div>
                                );
                            },
                        }}
                    >
                        {article.article}
                    </ReactMarkdown>
                </div>

                {/* Bottom Navigation: Previous & Next Article */}
                {(article.previousArticle || article.nextArticle) && (
                    <div className="mt-14 pt-8 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {article.previousArticle ? (
                            <Link
                                href={`/vaishnava-etiquettes/${article.previousArticle.slug}?lang=${locale}`}
                                className="group flex flex-col p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-amber-500/60 dark:hover:border-amber-400/50 shadow-xs hover:shadow-md transition-all"
                            >
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 mb-2">
                                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                    {n.prev}
                                </span>
                                <span className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white line-clamp-2 leading-snug group-hover:text-amber-600 transition-colors">
                                    {article.previousArticle.subTopic}
                                </span>
                            </Link>
                        ) : <div />}

                        {article.nextArticle && (
                            <Link
                                href={`/vaishnava-etiquettes/${article.nextArticle.slug}?lang=${locale}`}
                                className="group flex flex-col items-end text-right p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-amber-500/60 dark:hover:border-amber-400/50 shadow-xs hover:shadow-md transition-all"
                            >
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 mb-2">
                                    {n.next}
                                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                                <span className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white line-clamp-2 leading-snug group-hover:text-amber-600 transition-colors">
                                    {article.nextArticle.subTopic}
                                </span>
                            </Link>
                        )}
                    </div>
                )}
            </div>

            {/* Quick Share Modal */}
            {isShareModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-8 max-w-md w-full border border-neutral-200 dark:border-neutral-800 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg text-neutral-900 dark:text-white">{s.shareTitle}</h3>
                            <button onClick={() => setIsShareModalOpen(false)} className="text-neutral-400 hover:text-neutral-600">
                                <X size={20} />
                            </button>
                        </div>
                        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                            {article.subTopic}
                        </p>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <button
                                onClick={handleCopyLink}
                                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold text-xs border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors"
                            >
                                {copiedLink ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                                <span>{copiedLink ? s.linkCopied : s.copyLink}</span>
                            </button>
                            <button
                                onClick={handleCopyText}
                                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold text-xs hover:bg-neutral-200 transition-colors"
                            >
                                {copiedText ? <Check size={16} className="text-emerald-500" /> : <ScrollText size={16} />}
                                <span>{copiedText ? s.textCopied : s.copyText}</span>
                            </button>
                        </div>
                        <button
                            onClick={() => setIsShareModalOpen(false)}
                            className="w-full py-2.5 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold text-xs"
                        >
                            {s.close}
                        </button>
                    </div>
                </div>
            )}
        </article>
    );
}
