"use client";

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Loader2, Gavel, ArrowLeft, Share2, ChevronLeft, ChevronRight, ListOrdered, ArrowUp, Copy, Check, FileDown, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLanguage } from '../providers/LanguageContext';
import Link from 'next/link';
import { AudioPlayer } from '@/components/audio/AudioPlayer';

interface DebateArticleNav {
    slug: string;
    subTopic: string;
    order?: number;
}

interface DebateArticle {
    subTopic: string;
    article: string;
    slug: string;
    articleImage?: string;
    audioPath?: string | null;
    previousArticle?: DebateArticleNav | null;
    nextArticle?: DebateArticleNav | null;
}

import { ArticleUrlSync } from '../layout/ArticleUrlSync';

interface DebateCategory {
    name: string;
    description: string;
    image: string | null;
    articleList: DebateArticle[];
}

const navLabels: Record<string, { prev: string; next: string }> = {
    en: { prev: 'Previous Article', next: 'Next Article' },
    ta: { prev: 'முந்தைய கட்டுரை', next: 'அடுத்த கட்டுரை' },
    hi: { prev: 'पिछला लेख', next: 'अगला लेख' },
    te: { prev: 'మునుపటి వ్యాసం', next: 'తరువాతి వ్యాసం' },
    kn: { prev: 'ಹಿಂದಿನ ಲೇಖನ', next: 'ಮುಂದಿನ ಲೇಖನ' },
    ml: { prev: 'മുമ്പത്തെ ലേഖനം', next: 'അടുത്ത ലേഖനം' },
    bn: { prev: 'পূর্ববর্তী নিবন্ধ', next: 'পরবর্তী নিবন্ধ' },
};

const tocLabels: Record<string, string> = {
    en: 'Table of Contents',
    ta: 'பொருளடக்கம் (Table of Contents)',
    hi: 'विषय-सूची (Table of Contents)',
    kn: 'ಪರಿವಿಡಿ (Table of Contents)',
    te: 'విషయ సూచిక (Table of Contents)',
    ml: 'ഉള്ളടക്കം (Table of Contents)',
    bn: 'সূচিপত্র (Table of Contents)',
};

const actionLabels: Record<string, {
    sectionTitle: string;
    sectionDesc: string;
    copyText: string;
    copiedText: string;
    copyTextDesc: string;
    downloadPdf: string;
    downloadPdfDesc: string;
    shareMedia: string;
    shareMediaDesc: string;
    copyLink: string;
    linkCopied: string;
    quickShare: string;
    shareModalTitle: string;
    shareModalDesc: string;
    close: string;
}> = {
    ta: {
        sectionTitle: 'விவாதத்தைப் பகிரவும் & பதிவிறக்கவும்',
        sectionDesc: 'இந்த விவாதத்தின் கருத்துக்களை உரையாகவோ, ஆஃப்லைன் PDF-ஆகவோ (<1MB) அல்லது சமூக ஊடகங்களிலோ பகிருங்கள்.',
        copyText: 'உரையாக நகலெடு',
        copiedText: 'உரை நகலெடுக்கப்பட்டது!',
        copyTextDesc: 'முழு உரை (Plain Text)',
        downloadPdf: 'PDF பதிவிறக்கம்',
        downloadPdfDesc: 'இலகுவானது (<1MB) • அச்சு வடிவம்',
        shareMedia: 'ஊடகங்களில் பகிரவும்',
        shareMediaDesc: 'WhatsApp, X, Facebook, Telegram...',
        copyLink: 'இணைப்பை நகலெடு',
        linkCopied: 'இணைப்பு நகலெடுக்கப்பட்டது!',
        quickShare: 'உடனடிப் பகிர்வு:',
        shareModalTitle: 'எந்த ஊடகத்திலும் பகிரவும்',
        shareModalDesc: 'கீழே உள்ள எந்த செயலியைத் தேர்ந்தெடுத்தும் இந்த விவாதத்தைப் பகிரலாம்:',
        close: 'மூடுக',
    },
    en: {
        sectionTitle: 'Share, Copy & Download Debate',
        sectionDesc: 'Share philosophical insights as text, download lightweight PDF (<1MB), or post across any media.',
        copyText: 'Copy as Text',
        copiedText: 'Text Copied!',
        copyTextDesc: 'Full Article (Plain Text)',
        downloadPdf: 'Download as PDF',
        downloadPdfDesc: 'Lightweight (<1MB) • Print Ready',
        shareMedia: 'Share to Any Media',
        shareMediaDesc: 'WhatsApp, X, Facebook, Telegram...',
        copyLink: 'Copy Link',
        linkCopied: 'Link copied to clipboard!',
        quickShare: 'Quick Share:',
        shareModalTitle: 'Share to Any Media',
        shareModalDesc: 'Select any platform below to share this debate with your network:',
        close: 'Close',
    },
    hi: {
        sectionTitle: 'इस वाद-विवाद को साझा और डाउनलोड करें',
        sectionDesc: 'इस लेख को टेक्स्ट के रूप में कॉपी करें, लाइटवेट PDF (<1MB) डाउनलोड करें या किसी भी माध्यम पर साझा करें।',
        copyText: 'टेक्स्ट कॉपी करें',
        copiedText: 'टेक्स्ट कॉपी हो गया!',
        copyTextDesc: 'पूरा लेख (सादा टेक्स्ट)',
        downloadPdf: 'PDF डाउनलोड करें',
        downloadPdfDesc: 'हल्का (<1MB) • प्रिंट के लिए तैयार',
        shareMedia: 'किसी भी माध्यम पर साझा करें',
        shareMediaDesc: 'WhatsApp, X, Facebook, Telegram...',
        copyLink: 'लिंक कॉपी करें',
        linkCopied: 'लिंक कॉपी हो गया!',
        quickShare: 'त्वरित साझा:',
        shareModalTitle: 'किसी भी माध्यम पर साझा करें',
        shareModalDesc: 'इस वाद-विवाद को साझा करने के लिए नीचे किसी भी प्लेटफॉर्म का चयन करें:',
        close: 'बंद करें',
    },
    kn: {
        sectionTitle: 'ಈ ಚರ್ಚೆಯನ್ನು ಹಂಚಿಕೊಳ್ಳಿ ಮತ್ತು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
        sectionDesc: 'ಈ ಲೇಖನವನ್ನು ಪಠ್ಯವಾಗಿ ನಕಲಿಸಿ, ಹಗುರವಾದ PDF (<1MB) ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ ಅಥವಾ ಹಂಚಿಕೊಳ್ಳಿ.',
        copyText: 'ಪಠ್ಯವಾಗಿ ನಕಲಿಸಿ',
        copiedText: 'ಪಠ್ಯ ನಕಲಿಸಲಾಗಿದೆ!',
        copyTextDesc: 'ಸಂಪೂರ್ಣ ಲೇಖನ (ಪ್ಲೇನ್ ಟೆಕ್ಸ್ಟ್)',
        downloadPdf: 'PDF ಡೌನ್‌ಲೋಡ್',
        downloadPdfDesc: 'ಹಗುರವಾದದ್ದು (<1MB) • ಪ್ರಿಂಟ್ ರೆಡಿ',
        shareMedia: 'ಯಾವುದೇ ಮಾಧ್ಯಮಕ್ಕೆ ಹಂಚಿಕೊಳ್ಳಿ',
        shareMediaDesc: 'WhatsApp, X, Facebook, Telegram...',
        copyLink: 'ಲಿಂಕ್ ನಕಲಿಸಿ',
        linkCopied: 'ಲಿಂಕ್ ನಕಲಿಸಲಾಗಿದೆ!',
        quickShare: 'ತ್ವರಿತ ಹಂಚಿಕೆ:',
        shareModalTitle: 'ಯಾವುದೇ ಮಾಧ್ಯಮಕ್ಕೆ ಹಂಚಿಕೊಳ್ಳಿ',
        shareModalDesc: 'ಈ ಚರ್ಚೆಯನ್ನು ಹಂಚಿಕೊಳ್ಳಲು ಕೆಳಗಿನ ಯಾವುದೇ ವೇದಿಕೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:',
        close: 'ಮುಚ್ಚಿ',
    },
    te: {
        sectionTitle: 'ఈ చర్చను పంచుకోండి మరియు డౌన్‌లోడ్ చేయండి',
        sectionDesc: 'ఈ వ్యాసాన్ని టెక్స్ట్‌గా కాపీ చేయండి, తేలికైన PDF (<1MB) డౌన్‌లోడ్ చేయండి లేదా పంచుకోండి.',
        copyText: 'టెక్స్ట్‌గా కాపీ చేయండి',
        copiedText: 'టెక్స్ట్ కాపీ చేయబడింది!',
        copyTextDesc: 'పూర్తి వ్యాసం (ప్లెయిన్ టెక్స్ట్)',
        downloadPdf: 'PDF డౌన్‌లోడ్',
        downloadPdfDesc: 'తేలికైనది (<1MB) • ప్రింట్ సిద్ధం',
        shareMedia: 'ఏ మాధ్యమంలోనైనా పంచుకోండి',
        shareMediaDesc: 'WhatsApp, X, Facebook, Telegram...',
        copyLink: 'లింక్ కాపీ చేయండి',
        linkCopied: 'లింక్ కాపీ చేయబడింది!',
        quickShare: 'త్వరిత భాగస్వామ్యం:',
        shareModalTitle: 'ఏ మాధ్యమంలోనైనా పంచుకోండి',
        shareModalDesc: 'ఈ చర్చను పంచుకోవడానికి క్రింది ఏ వేదికనైనా ఎంచుకోండి:',
        close: 'మూసివేయండి',
    },
    ml: {
        sectionTitle: 'ഈ സംവാദം പങ്കിടുകയും ഡൗൺലോഡ് ചെയ്യുകയും ചെയ്യുക',
        sectionDesc: 'ഈ ലേഖനം ടെക്സ്റ്റായി പകർത്തുക, ഭാരം കുറഞ്ഞ PDF (<1MB) ഡൗൺലോഡ് ചെയ്യുക അല്ലെങ്കിൽ പങ്കിടുക.',
        copyText: 'ടെക്സ്റ്റായി പകർത്തുക',
        copiedText: 'ടെക്സ്റ്റ് പകർത്തി!',
        copyTextDesc: 'മുഴുവൻ ലേഖനം (പ്ലെയിൻ ടെക്സ്റ്റ്)',
        downloadPdf: 'PDF ഡൗൺലോഡ്',
        downloadPdfDesc: 'ഭാരം കുറഞ്ഞത് (<1MB) • പ്രിന്റ് റെഡി',
        shareMedia: 'ഏത് മാധ്യമത്തിലും പങ്കിടുക',
        shareMediaDesc: 'WhatsApp, X, Facebook, Telegram...',
        copyLink: 'ലിങ്ക് പകർത്തുക',
        linkCopied: 'ലിങ്ക് പകർത്തി!',
        quickShare: 'ദ്രുത പങ്കിടൽ:',
        shareModalTitle: 'ഏത് മാധ്യമത്തിലും പങ്കിടുക',
        shareModalDesc: 'ഈ സംവാദം പങ്കിടുന്നതിന് താഴെയുള്ള ഏതെങ്കിലും പ്ലാറ്റ്‌ഫോം തിരഞ്ഞെടുക്കുക:',
        close: 'അടയ്ക്കുക',
    },
    bn: {
        sectionTitle: 'বিতর্কটি শেয়ার এবং ডাউনলোড করুন',
        sectionDesc: 'এই অন্তর্দৃষ্টি টেক্সট হিসেবে কপি করুন, হালকা PDF (<1MB) ডাউনলোড করুন বা শেয়ার করুন।',
        copyText: 'টেক্সট হিসেবে কপি করুন',
        copiedText: 'টেক্সট কপি হয়েছে!',
        copyTextDesc: 'সম্পূর্ণ প্রবন্ধ (প্লেন টেক্সট)',
        downloadPdf: 'PDF ডাউনলোড',
        downloadPdfDesc: 'হালকা (<1MB) • প্রিন্ট প্রস্তুত',
        shareMedia: 'যেকোনো মাধ্যমে শেয়ার করুন',
        shareMediaDesc: 'WhatsApp, X, Facebook, Telegram...',
        copyLink: 'লিঙ্ক কপি করুন',
        linkCopied: 'লিঙ্ক কপি হয়েছে!',
        quickShare: 'দ্রুত শেয়ার:',
        shareModalTitle: 'যেকোনো মাধ্যমে শেয়ার করুন',
        shareModalDesc: 'এই বিতর্কটি শেয়ার করতে নিচের যেকোনো প্ল্যাটফর্ম বেছে নিন:',
        close: 'বন্ধ করুন',
    },
};

function getHeadingIds(text: string): string[] {
    const raw = text.replace(/\*\*/g, '').trim();
    const cleanId = raw
        .toLowerCase()
        .replace(/[^\w\u0B80-\u0BFF\u0900-\u097F\u0C80-\u0CFF\u0C00-\u0C7F\u0D00-\u0D7F\u0980-\u09FF]+/g, '-')
        .replace(/^-+|-+$/g, '');
    const strippedId = raw
        .replace(/^[0-9]+[.\-)]\s*/, '')
        .toLowerCase()
        .replace(/[^\w\u0B80-\u0BFF\u0900-\u097F\u0C80-\u0CFF\u0C00-\u0C7F\u0D00-\u0D7F\u0980-\u09FF]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return Array.from(new Set([cleanId, strippedId].filter(Boolean)));
}

export default function DebateArticleDetail({ slug }: { slug: string }) {
    const { locale } = useLanguage();
    const [article, setArticle] = useState<DebateArticle | null>(null);
    const [categoryName, setCategoryName] = useState<string>('');
    const [categoryImage, setCategoryImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [copiedText, setCopiedText] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 400) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`https://api.askharekrishna.com/api/v1/debate/articles/?language=${locale}&slug=${slug}`);
                const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
                
                let foundArticle = null;
                let foundCatName = '';
                let foundCatImage = null;

                for (const cat of data) {
                    if (cat.articleList && cat.articleList.length > 0) {
                        const match = cat.articleList.find((a: any) => a.slug === slug && a.article && a.article.trim());
                        if (match) {
                            foundArticle = match;
                            foundCatName = cat.name || '';
                            foundCatImage = cat.image || null;
                            break;
                        }
                    }
                }

                if (!foundArticle && locale !== 'en') {
                    const fallbackResponse = await axios.get(`https://api.askharekrishna.com/api/v1/debate/articles/?language=en&slug=${slug}`);
                    const fallbackData = Array.isArray(fallbackResponse.data) ? fallbackResponse.data : (fallbackResponse.data.results || []);
                    for (const cat of fallbackData) {
                        if (cat.articleList && cat.articleList.length > 0) {
                            const match = cat.articleList.find((a: any) => a.slug === slug && a.article && a.article.trim());
                            if (match) {
                                foundArticle = match;
                                foundCatName = cat.name || '';
                                foundCatImage = cat.image || null;
                                break;
                            }
                        }
                    }
                }

                setArticle(foundArticle);
                setCategoryName(foundCatName);
                setCategoryImage(foundCatImage);
            } catch (err) {
                console.error('Error fetching debate article:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [locale, slug]);

    // Parse headings for the Table of Contents
    const tocItems = useMemo(() => {
        if (!article?.article) return [];
        const lines = article.article.split('\n');
        const items: { id: string; text: string; level: number }[] = [];
        const headingRegex = /^(#{2,3})\s+(.*)$/;
        
        for (const line of lines) {
            const match = line.match(headingRegex);
            if (match) {
                const level = match[1].length;
                const text = match[2].trim().replace(/\*\*/g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1');
                const cleanId = text
                    .toLowerCase()
                    .replace(/[^\w\u0B80-\u0BFF\u0900-\u097F\u0C80-\u0CFF\u0C00-\u0C7F\u0D00-\u0D7F\u0980-\u09FF]+/g, '-')
                    .replace(/^-+|-+$/g, '');
                if (cleanId && text && !cleanId.includes('table-of-contents') && !cleanId.includes('பொருளடக்கம்')) {
                    items.push({ id: cleanId, text, level });
                }
            }
        }
        return items;
    }, [article?.article]);

    const handleCopyText = async () => {
        if (!article) return;
        try {
            const cleanedText = article.article
                .replace(/^#{1,6}\s+(.*)$/gm, '\n$1\n')
                .replace(/\*\*(.*?)\*\*/g, '$1')
                .replace(/\*(.*?)\*/g, '$1')
                .replace(/\[(.*?)\]\((.*?)\)/g, '$1 ($2)')
                .replace(/^>\s+/gm, '“ ')
                .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
                .trim();

            const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
            const fullText = `${article.subTopic.toUpperCase()}\n${categoryName ? `[${categoryName}]\n` : ''}\n${cleanedText}\n\n---\nSource: ${currentUrl}\nAsk Hare Krishna (askharekrishna.com)`;

            await navigator.clipboard.writeText(fullText);
            setCopiedText(true);
            setTimeout(() => setCopiedText(false), 3000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    const handleDownloadPdf = () => {
        window.print();
    };

    const handleShareToMedia = async () => {
        if (!article) return;
        const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
        const shareData = {
            title: article.subTopic,
            text: `${article.subTopic}\n\nRead this debate on Ask Hare Krishna:\n`,
            url: currentUrl,
        };

        if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
                return;
            } catch {
                // Ignore cancel or fallback
            }
        }
        setIsShareModalOpen(true);
    };

    const handleDirectShare = (platform: 'whatsapp' | 'twitter' | 'facebook' | 'telegram' | 'linkedin') => {
        if (!article) return;
        const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
        const text = encodeURIComponent(`*${article.subTopic}*\n\nRead here: ${currentUrl}`);
        const rawUrl = encodeURIComponent(currentUrl);

        let url = '';
        switch (platform) {
            case 'whatsapp':
                url = `https://wa.me/?text=${text}`;
                break;
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.subTopic)}&url=${rawUrl}`;
                break;
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${rawUrl}`;
                break;
            case 'telegram':
                url = `https://t.me/share/url?url=${rawUrl}&text=${encodeURIComponent(article.subTopic)}`;
                break;
            case 'linkedin':
                url = `https://www.linkedin.com/sharing/share-offsite/?url=${rawUrl}`;
                break;
        }

        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    const handleCopyLink = async () => {
        try {
            const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
            await navigator.clipboard.writeText(currentUrl);
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 3000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    const scrollToTop = () => {
        const tocEl = document.getElementById('table-of-contents') || document.getElementById('article-top');
        if (tocEl) {
            tocEl.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-background-light dark:bg-background-dark">
                <Loader2 size={40} className="text-primary animate-spin mb-4" />
                <p className="text-text-muted animate-pulse font-medium">
                    {locale === 'ta' ? 'கட்டுரையை ஏற்றுகிறது...' : 'Loading Article...'}
                </p>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-background-light dark:bg-background-dark text-center px-4">
                <Gavel size={48} className="text-text-muted mb-4" />
                <h3 className="text-2xl font-bold text-text-main dark:text-white mb-2">
                    {locale === 'ta' ? 'கட்டுரை கிடைக்கவில்லை' : 'Article Not Found'}
                </h3>
                <Link href="/debate" className="text-primary hover:underline font-bold mt-4">
                    {locale === 'ta' ? 'விவாதங்களுக்கு திரும்பவும்' : 'Back to Debates'}
                </Link>
            </div>
        );
    }

    return (
        <section id="article-top" className="bg-background-light dark:bg-background-dark min-h-screen pt-12 pb-24 scroll-mt-24">
            <ArticleUrlSync locale={locale} />
            <div className="max-w-4xl mx-auto px-4 md:px-8">
                {/* Print-only Editorial Header */}
                <div className="hidden print:block mb-8 pb-4 border-b-2 border-primary/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-black text-black tracking-tight">Ask Hare Krishna</h2>
                            <p className="text-xs text-gray-600">Transcendental Knowledge & Philosophical Answers • askharekrishna.com</p>
                        </div>
                        {categoryName && (
                            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 bg-gray-100 rounded text-gray-800 border border-gray-200">
                                {categoryName}
                            </span>
                        )}
                    </div>
                </div>
                {/* Back button and Category breadcrumb */}
                <div className="mb-8 flex items-center gap-4 no-print">
                    <Link href={`/debate?category=${encodeURIComponent(categoryName)}&lang=${locale}`} className="inline-flex items-center text-text-muted hover:text-primary transition-colors">
                        <ArrowLeft size={20} className="mr-2" />
                        {locale === 'ta' ? 'திரும்புக' : 'Back'}
                    </Link>
                    <span className="text-gray-300 dark:text-gray-700">|</span>
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">{categoryName}</span>
                </div>

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-black text-text-main dark:text-white leading-tight mb-6">
                        {article.subTopic}
                    </h1>
                </div>

                {/* Hero Image */}
                <div className="relative h-64 md:h-[400px] w-full rounded-3xl overflow-hidden mb-12 shadow-2xl">
                    <img 
                        src={article.articleImage || categoryImage || 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=1200'} 
                        alt={article.subTopic}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-6 left-6 flex items-center gap-3">
                        <div className="size-12 rounded-xl bg-primary/90 text-white flex items-center justify-center backdrop-blur-sm shadow-lg">
                            <Gavel size={28} />
                        </div>
                    </div>
                </div>

                {/* Audio Player – shown only when an audio file is attached to this article */}
                {article.audioPath && (
                    <div className="mb-10 no-print">
                        <AudioPlayer
                            url={article.audioPath.startsWith('http') ? article.audioPath : `https://api.askharekrishna.com${article.audioPath.startsWith('/') ? '' : '/'}${article.audioPath}`}
                            title={article.subTopic}
                            playing={isAudioPlaying}
                            setPlaying={setIsAudioPlaying}
                        />
                    </div>
                )}

                {/* Anchor targets for Back to TOC */}
                <div id="table-of-contents" className="scroll-mt-24" />
                <div id="பொருளடக்கம்-table-of-contents" className="scroll-mt-24" />
                <div id="பொருளடக்கம்" className="scroll-mt-24" />
                <div id="विषय-सूची" className="scroll-mt-24" />
                <div id="ಪರಿವಿಡಿ" className="scroll-mt-24" />
                <div id="విషయ-సూచిక" className="scroll-mt-24" />
                <div id="ഉള്ളടക്കം" className="scroll-mt-24" />
                <div id="সূচিপত্র" className="scroll-mt-24" />

                {/* Interactive Table of Contents */}
                {tocItems.length > 1 && (
                    <div className="mb-12 p-6 md:p-8 rounded-2xl bg-white/70 dark:bg-[#252016]/90 border border-[#e7dfcf] dark:border-neutral-800 shadow-sm backdrop-blur-xs">
                        <div className="flex items-center gap-2.5 mb-4 text-primary font-black text-lg md:text-xl">
                            <ListOrdered size={22} className="text-primary" />
                            <h2 className="font-bold">{tocLabels[locale] || tocLabels.en}</h2>
                        </div>
                        <nav aria-label="Table of Contents">
                            <ul className="space-y-2.5">
                                {tocItems.map((item, idx) => (
                                    <li key={`${item.id}-${idx}`} className={item.level === 3 ? 'ml-2' : ''}>
                                        <a 
                                            href={`#${item.id}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const el = document.getElementById(item.id);
                                                if (el) {
                                                    el.scrollIntoView({ behavior: 'smooth' });
                                                }
                                            }}
                                            className="text-text-main dark:text-neutral-200 hover:text-primary font-medium text-sm md:text-base transition-colors flex items-start gap-2.5 group cursor-pointer"
                                        >
                                            <span className="text-primary/70 group-hover:text-primary font-bold text-xs mt-1 shrink-0">
                                                {idx + 1}.
                                            </span>
                                            <span className="group-hover:underline">
                                                {item.text}
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                )}

                {/* Article Content */}
                <div className="prose prose-stone dark:prose-invert max-w-none 
                    prose-headings:font-black prose-headings:tracking-tight
                    prose-h1:text-4xl prose-h1:mb-8
                    prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                    prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                    prose-p:text-lg prose-p:leading-relaxed prose-p:text-text-main dark:prose-p:text-gray-300
                    prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic
                    prose-strong:text-primary prose-strong:font-bold prose-img:rounded-2xl prose-img:shadow-lg">
                    <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h2: ({ children, ...props }) => {
                                const text = React.Children.toArray(children).map(c => typeof c === 'string' ? c : '').join('');
                                const ids = getHeadingIds(text);
                                const primaryId = ids[0] || '';
                                return (
                                    <div id={primaryId} className="scroll-mt-24">
                                        {ids[1] && <div id={ids[1]} className="scroll-mt-24" />}
                                        <h2 className="font-black" {...props}>{children}</h2>
                                    </div>
                                );
                            },
                            h3: ({ children, ...props }) => {
                                const text = React.Children.toArray(children).map(c => typeof c === 'string' ? c : '').join('');
                                const ids = getHeadingIds(text);
                                const primaryId = ids[0] || '';
                                return (
                                    <div id={primaryId} className="scroll-mt-24">
                                        {ids[1] && <div id={ids[1]} className="scroll-mt-24" />}
                                        <h3 className="font-bold" {...props}>{children}</h3>
                                    </div>
                                );
                            },
                            a: ({ href, children, ...props }) => {
                                if (href?.startsWith('#')) {
                                    return (
                                        <a
                                            href={href}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const rawId = href.replace(/^#/, '');
                                                const decodedId = decodeURIComponent(rawId).toLowerCase();

                                                const isTocOrTop = 
                                                    decodedId === 'table-of-contents' ||
                                                    decodedId === 'article-top' ||
                                                    decodedId === 'top' ||
                                                    decodedId.includes('toc') ||
                                                    decodedId.includes('பொருளடக்கம்') ||
                                                    decodedId.includes('विषय-सूची') ||
                                                    decodedId.includes('ಪರಿವಿಡಿ') ||
                                                    decodedId.includes('సూచిక') ||
                                                    decodedId.includes('ഉള്ളടക്കം') ||
                                                    decodedId.includes('সূচিপত্র');

                                                if (isTocOrTop) {
                                                    const tocEl = document.getElementById('table-of-contents') || document.getElementById('article-top');
                                                    if (tocEl) {
                                                        tocEl.scrollIntoView({ behavior: 'smooth' });
                                                        return;
                                                    }
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                    return;
                                                }

                                                const targetEl = document.getElementById(rawId) 
                                                    || document.getElementById(decodedId);
                                                if (targetEl) {
                                                    targetEl.scrollIntoView({ behavior: 'smooth' });
                                                } else {
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }
                                            }}
                                            className="cursor-pointer text-primary hover:underline font-bold inline-flex items-center gap-1 transition-colors"
                                            {...props}
                                        >
                                            {children}
                                        </a>
                                    );
                                }
                                return (
                                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline transition-colors" {...props}>
                                        {children}
                                    </a>
                                );
                            }
                        }}
                    >
                        {article.article}
                    </ReactMarkdown>
                </div>

                {/* Previous & Next Article Navigation */}
                {(article.previousArticle || article.nextArticle) && (
                    <nav aria-label="Article Navigation" className="mt-14 pt-8 border-t border-[#e7dfcf] dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {article.previousArticle ? (
                            <Link 
                                href={`/debate/${article.previousArticle.slug}?lang=${locale}`}
                                className="group flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-[#2a2418] border border-[#e7dfcf] dark:border-neutral-800 hover:border-primary/60 dark:hover:border-primary/60 shadow-sm hover:shadow-md transition-all duration-200 text-left active:scale-[0.99]"
                            >
                                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-text-muted group-hover:text-primary transition-colors mb-2">
                                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                    <span>{navLabels[locale]?.prev || navLabels.en.prev}</span>
                                </div>
                                <span className="text-sm md:text-base font-bold text-text-main dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                                    {article.previousArticle.subTopic}
                                </span>
                            </Link>
                        ) : (
                            <div className="hidden sm:block" />
                        )}

                        {article.nextArticle ? (
                            <Link 
                                href={`/debate/${article.nextArticle.slug}?lang=${locale}`}
                                className="group flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-[#2a2418] border border-[#e7dfcf] dark:border-neutral-800 hover:border-primary/60 dark:hover:border-primary/60 shadow-sm hover:shadow-md transition-all duration-200 text-right sm:col-start-2 active:scale-[0.99]"
                            >
                                <div className="flex items-center justify-end gap-1.5 text-xs font-bold uppercase tracking-wider text-text-muted group-hover:text-primary transition-colors mb-2">
                                    <span>{navLabels[locale]?.next || navLabels.en.next}</span>
                                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                                <span className="text-sm md:text-base font-bold text-text-main dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                                    {article.nextArticle.subTopic}
                                </span>
                            </Link>
                        ) : (
                            <div className="hidden sm:block" />
                        )}
                    </nav>
                )}
                
                {/* Actions & Sharing Section */}
                <div className="mt-16 pt-10 border-t border-gray-200 dark:border-neutral-800 no-print">
                    <div className="text-center max-w-xl mx-auto mb-8">
                        <h3 className="text-xl md:text-2xl font-black text-text-main dark:text-white tracking-tight mb-2">
                            {actionLabels[locale]?.sectionTitle || actionLabels.en.sectionTitle}
                        </h3>
                        <p className="text-sm text-text-muted">
                            {actionLabels[locale]?.sectionDesc || actionLabels.en.sectionDesc}
                        </p>
                    </div>

                    {/* Primary 3 Action Cards: Copy as Text, Download PDF, Share to Media */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        {/* 1. Copy as Text */}
                        <button
                            onClick={handleCopyText}
                            className={`group flex flex-col items-center justify-center p-5 rounded-2xl border transition-all duration-200 shadow-sm active:scale-95 cursor-pointer text-center ${
                                copiedText
                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                                    : 'bg-white dark:bg-[#2a2418] border-[#e7dfcf] dark:border-neutral-800 hover:border-primary/60 dark:hover:border-primary/60 hover:shadow-md'
                            }`}
                        >
                            <div className={`size-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                                copiedText
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'
                            }`}>
                                {copiedText ? <Check size={24} /> : <Copy size={24} />}
                            </div>
                            <span className="font-extrabold text-base text-text-main dark:text-white mb-1">
                                {copiedText
                                    ? (actionLabels[locale]?.copiedText || actionLabels.en.copiedText)
                                    : (actionLabels[locale]?.copyText || actionLabels.en.copyText)}
                            </span>
                            <span className="text-xs text-text-muted font-medium">
                                {actionLabels[locale]?.copyTextDesc || actionLabels.en.copyTextDesc}
                            </span>
                        </button>

                        {/* 2. Download as PDF (<1MB) */}
                        <button
                            onClick={handleDownloadPdf}
                            className="group flex flex-col items-center justify-center p-5 rounded-2xl border bg-white dark:bg-[#2a2418] border-[#e7dfcf] dark:border-neutral-800 hover:border-primary/60 dark:hover:border-primary/60 hover:shadow-md transition-all duration-200 shadow-sm active:scale-95 cursor-pointer text-center"
                        >
                            <div className="size-12 rounded-xl flex items-center justify-center mb-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 group-hover:bg-red-600 group-hover:text-white transition-colors">
                                <FileDown size={24} />
                            </div>
                            <span className="font-extrabold text-base text-text-main dark:text-white mb-1">
                                {actionLabels[locale]?.downloadPdf || actionLabels.en.downloadPdf}
                            </span>
                            <span className="text-xs text-text-muted font-medium">
                                {actionLabels[locale]?.downloadPdfDesc || actionLabels.en.downloadPdfDesc}
                            </span>
                        </button>

                        {/* 3. Share to Any Media */}
                        <button
                            onClick={handleShareToMedia}
                            className="group flex flex-col items-center justify-center p-5 rounded-2xl border bg-white dark:bg-[#2a2418] border-[#e7dfcf] dark:border-neutral-800 hover:border-primary/60 dark:hover:border-primary/60 hover:shadow-md transition-all duration-200 shadow-sm active:scale-95 cursor-pointer text-center"
                        >
                            <div className="size-12 rounded-xl flex items-center justify-center mb-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Share2 size={24} />
                            </div>
                            <span className="font-extrabold text-base text-text-main dark:text-white mb-1">
                                {actionLabels[locale]?.shareMedia || actionLabels.en.shareMedia}
                            </span>
                            <span className="text-xs text-text-muted font-medium">
                                {actionLabels[locale]?.shareMediaDesc || actionLabels.en.shareMediaDesc}
                            </span>
                        </button>
                    </div>

                    {/* Quick 1-Click Social Media Strip */}
                    <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#2a2418]/70 border border-[#e7dfcf] dark:border-neutral-800/80 backdrop-blur-sm flex flex-wrap items-center justify-center gap-2.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-text-muted mr-1">
                            {actionLabels[locale]?.quickShare || actionLabels.en.quickShare}
                        </span>

                        {/* WhatsApp */}
                        <button
                            onClick={() => handleDirectShare('whatsapp')}
                            title="WhatsApp"
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white text-xs font-bold transition-all active:scale-95 cursor-pointer"
                        >
                            <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            <span>WhatsApp</span>
                        </button>

                        {/* X / Twitter */}
                        <button
                            onClick={() => handleDirectShare('twitter')}
                            title="X (Twitter)"
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-text-main dark:text-white text-xs font-bold transition-all active:scale-95 cursor-pointer"
                        >
                            <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                            <span>X</span>
                        </button>

                        {/* Facebook */}
                        <button
                            onClick={() => handleDirectShare('facebook')}
                            title="Facebook"
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2] text-[#1877F2] hover:text-white text-xs font-bold transition-all active:scale-95 cursor-pointer"
                        >
                            <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            <span>Facebook</span>
                        </button>

                        {/* Telegram */}
                        <button
                            onClick={() => handleDirectShare('telegram')}
                            title="Telegram"
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#229ED9]/10 hover:bg-[#229ED9] text-[#229ED9] hover:text-white text-xs font-bold transition-all active:scale-95 cursor-pointer"
                        >
                            <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.94z" />
                            </svg>
                            <span>Telegram</span>
                        </button>

                        {/* LinkedIn */}
                        <button
                            onClick={() => handleDirectShare('linkedin')}
                            title="LinkedIn"
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0A66C2]/10 hover:bg-[#0A66C2] text-[#0A66C2] hover:text-white text-xs font-bold transition-all active:scale-95 cursor-pointer"
                        >
                            <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.778-.773 1.778-1.729V1.73C24 .774 23.205 0 22.225 0z" />
                            </svg>
                            <span>LinkedIn</span>
                        </button>

                        {/* Copy Link */}
                        <button
                            onClick={handleCopyLink}
                            title={actionLabels[locale]?.copyLink || actionLabels.en.copyLink}
                            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                                copiedLink
                                    ? 'bg-emerald-500 text-white shadow-md'
                                    : 'bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-text-main dark:text-white'
                            }`}
                        >
                            {copiedLink ? <Check size={14} /> : <Share2 size={14} />}
                            <span>{copiedLink ? (actionLabels[locale]?.linkCopied || actionLabels.en.linkCopied) : (actionLabels[locale]?.copyLink || actionLabels.en.copyLink)}</span>
                        </button>
                    </div>
                </div>

                {/* Print-only Footer */}
                <div className="hidden print:flex items-center justify-between mt-12 pt-4 border-t border-gray-300 text-xs text-gray-500">
                    <span>© Ask Hare Krishna • askharekrishna.com</span>
                    <span>{typeof window !== 'undefined' ? window.location.href : ''}</span>
                </div>
            </div>

            {/* Share to Any Media Modal */}
            {isShareModalOpen && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 no-print"
                    onClick={() => setIsShareModalOpen(false)}
                >
                    <div 
                        className="bg-white dark:bg-[#2a2418] border border-[#e7dfcf] dark:border-neutral-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setIsShareModalOpen(false)}
                            className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-text-muted hover:text-text-main dark:hover:text-white transition-colors cursor-pointer"
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <Share2 size={20} />
                            </div>
                            <div>
                                <h4 className="text-lg font-black text-text-main dark:text-white">
                                    {actionLabels[locale]?.shareModalTitle || actionLabels.en.shareModalTitle}
                                </h4>
                                <p className="text-xs text-text-muted line-clamp-1">
                                    {article?.subTopic}
                                </p>
                            </div>
                        </div>

                        <p className="text-xs text-text-muted mb-4">
                            {actionLabels[locale]?.shareModalDesc || actionLabels.en.shareModalDesc}
                        </p>

                        {/* Social Buttons Grid */}
                        <div className="grid grid-cols-2 gap-2.5 mb-5">
                            <button
                                onClick={() => { handleDirectShare('whatsapp'); setIsShareModalOpen(false); }}
                                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white font-bold text-xs transition-colors cursor-pointer"
                            >
                                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                <span>WhatsApp</span>
                            </button>

                            <button
                                onClick={() => { handleDirectShare('twitter'); setIsShareModalOpen(false); }}
                                className="flex items-center gap-2.5 p-3 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-bold text-xs transition-colors cursor-pointer"
                            >
                                <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                                <span>X (Twitter)</span>
                            </button>

                            <button
                                onClick={() => { handleDirectShare('facebook'); setIsShareModalOpen(false); }}
                                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2] text-[#1877F2] hover:text-white font-bold text-xs transition-colors cursor-pointer"
                            >
                                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                <span>Facebook</span>
                            </button>

                            <button
                                onClick={() => { handleDirectShare('telegram'); setIsShareModalOpen(false); }}
                                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#229ED9]/10 hover:bg-[#229ED9] text-[#229ED9] hover:text-white font-bold text-xs transition-colors cursor-pointer"
                            >
                                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.94z" />
                                </svg>
                                <span>Telegram</span>
                            </button>

                            <button
                                onClick={() => { handleDirectShare('linkedin'); setIsShareModalOpen(false); }}
                                className="col-span-2 flex items-center justify-center gap-2.5 p-3 rounded-xl bg-[#0A66C2]/10 hover:bg-[#0A66C2] text-[#0A66C2] hover:text-white font-bold text-xs transition-colors cursor-pointer"
                            >
                                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.778-.773 1.778-1.729V1.73C24 .774 23.205 0 22.225 0z" />
                                </svg>
                                <span>LinkedIn</span>
                            </button>
                        </div>

                        {/* Copy Link field */}
                        <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800">
                            <input
                                type="text"
                                readOnly
                                value={typeof window !== 'undefined' ? window.location.href : ''}
                                className="bg-transparent text-xs text-text-muted flex-1 px-2 outline-none select-all"
                            />
                            <button
                                onClick={handleCopyLink}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    copiedLink
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-primary text-white hover:bg-primary-dark'
                                }`}
                            >
                                {copiedLink ? (actionLabels[locale]?.linkCopied || actionLabels.en.linkCopied) : (actionLabels[locale]?.copyLink || actionLabels.en.copyLink)}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Back to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    aria-label="Back to top"
                    className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-primary text-white shadow-2xl hover:bg-primary-dark transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center group"
                >
                    <ArrowUp size={22} className="group-hover:-translate-y-0.5 transition-transform" />
                </button>
            )}
        </section>
    );
}
