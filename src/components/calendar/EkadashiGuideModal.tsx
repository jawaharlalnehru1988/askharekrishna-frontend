'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, X, ExternalLink, Sparkles, Loader2, CheckCircle2, Hand } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { Locale } from '@/lib/dictionaries';

interface EkadashiGuideModalProps {
    locale: Locale;
}

const GUIDE_LOCALIZED_STRINGS: Record<string, {
    cardTitle: string;
    cardSubtitle: string;
    buttonLabel: string;
    clickToRead: string;
    modalSubtitle: string;
    closeBtn: string;
    openFullBtn: string;
    loadingText: string;
    errorText: string;
}> = {
    en: {
        cardTitle: "How to Follow Ekadashi Vrata?",
        cardSubtitle: "Fasting rules, allowed & forbidden foods, and devotional practices to please Bhagavan Sri Krishna.",
        buttonLabel: "Read Complete Fasting Guide",
        clickToRead: "Click to Read",
        modalSubtitle: "Authentic Guidelines according to Vaishnava Sastras",
        closeBtn: "Close Guide",
        openFullBtn: "Open Full Article",
        loadingText: "Loading Ekadashi Guide...",
        errorText: "Failed to load guide. Please try again.",
    },
    ta: {
        cardTitle: "ஏகாதசியை எப்படி கடைபிடிக்க வேண்டும்?",
        cardSubtitle: "உண்ணக்கூடியவை, தவிர்க்க வேண்டியவை மற்றும் பகவான் ஸ்ரீ கிருஷ்ணரின் அருளைப் பெறும் முழுமையான விரத நெறிமுறைகள்.",
        buttonLabel: "முழுமையான விரத வழிகாட்டி",
        clickToRead: "படிக்க கிளிக் செய்யவும்",
        modalSubtitle: "சாஸ்திர விதிகளின்படியான ஏகாதசி விரத முறைகள்",
        closeBtn: "வழிகாட்டியை மூடுக",
        openFullBtn: "முழுப் பக்கத்தில் படிக்க",
        loadingText: "வழிகாட்டி ஏற்றப்படுகிறது...",
        errorText: "வழிகாட்டியை ஏற்றுவதில் பிழை. மீண்டும் முயற்சிக்கவும்.",
    },
    hi: {
        cardTitle: "एकादशी व्रत का विधिपूर्वक पालन कैसे करें?",
        cardSubtitle: "एकादशी के अनिवार्य नियम, क्या खाएं, क्या न खाएं और भगवान श्रीकृष्ण को प्रसन्न करने की संपूर्ण भक्ति विधि।",
        buttonLabel: "संपूर्ण व्रत विधि पढ़ें",
        clickToRead: "पढ़ने के लिए क्लिक करें",
        modalSubtitle: "शास्त्रसम्मत एकादशी व्रत नियम एवं आचरण",
        closeBtn: "गाइड बंद करें",
        openFullBtn: "पूरा आलेख खोलें",
        loadingText: "गाइड लोड हो रही है...",
        errorText: "गाइड लोड करने में असमर्थ। कृपया पुनः प्रयास करें।",
    },
    kn: {
        cardTitle: "ಏಕಾದಶಿ ವ್ರತವನ್ನು ಆಚರಿಸುವ ವಿಧಾನ ಹೇಗೆ?",
        cardSubtitle: "ಉಪವಾಸದ ನಿಯಮಗಳು, ಸೇವಿಸಬಹುದಾದ ಮತ್ತು ವರ್ಜ್ಯ ಆಹಾರಗಳು ಹಾಗೂ ಭಗವಾನ್ ಶ್ರೀಕೃಷ್ಣನ ಕೃಪೆಗೆ ಪಾತ್ರರಾಗುವ ವಿಧಾನ.",
        buttonLabel: "ಸಂಪೂರ್ಣ ವ್ರತ ಮಾರ್ಗದರ್ಶನ ಓದಿ",
        clickToRead: "ಓದಲು ಕ್ಲಿಕ್ ಮಾಡಿ",
        modalSubtitle: "ಶಾಸ್ತ್ರೋಕ್ತ ಏಕಾದಶಿ ವ್ರತದ ನಿಯಮಗಳು",
        closeBtn: "ಮಾರ್ಗದರ್ಶನ ಮುಚ್ಚಿ",
        openFullBtn: "ಸಂಪೂರ್ಣ ಪುಟ ತೆರೆಯಿರಿ",
        loadingText: "ಮಾರ್ಗದರ್ಶನ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
        errorText: "ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಪುನಃ ಪ್ರಯತ್ನಿಸಿ.",
    },
    te: {
        cardTitle: "ఏకాదశి వ్రతాన్ని ఎలా ఆచరించాలి?",
        cardSubtitle: "ఉపవాస నియమాలు, తినవలసినవి, వర్జించవలసిన పదార్థాలు మరియు భగవాన్ శ్రీకృష్ణుని అనుగ్రహం పొందే పద్ధతి.",
        buttonLabel: "పూర్తి వ్రత నియమాలు చదవండి",
        clickToRead: "చదవడానికి క్లిక్ చేయండి",
        modalSubtitle: "శాస్త్రోక్త ఏకాదశి వ్రత నియమావళి",
        closeBtn: "గైడ్ మూసివేయి",
        openFullBtn: "పూర్తి వ్యాసాన్ని చూడండి",
        loadingText: "గైడ్ లోడ్ అవుతోంది...",
        errorText: "లోడ్ చేయడంలో లోపం. దయచేసి మళ్లీ ప్రయత్నించండి.",
    },
    ml: {
        cardTitle: "ഏകാദശി വ്രതം എങ്ങനെ അനുഷ്ഠിക്കാം?",
        cardSubtitle: "ഉപവാസ നിയമങ്ങൾ, വർജ്ജിക്കേണ്ട ഭക്ഷണങ്ങൾ, ഭഗവാൻ ശ്രീകൃഷ്ണന്റെ പ്രീതിക്കായി അനുഷ്ഠിക്കേണ്ട ഭക്തിമാർഗ്ഗങ്ങൾ.",
        buttonLabel: "പൂർണ്ണ വ്രത മാർഗ്ഗരേഖ വായിക്കുക",
        clickToRead: "വായിക്കാൻ ക്ലിക്ക് ചെയ്യുക",
        modalSubtitle: "ശാസ്ത്രീയമായ ഏകാദശി വ്രതാനുഷ്ഠാനങ്ങൾ",
        closeBtn: "അടയ്ക്കുക",
        openFullBtn: "പൂർണ്ണ പേജ് തുറക്കുക",
        loadingText: "വിവരങ്ങൾ ലഭ്യമാക്കുന്നു...",
        errorText: "വിവരങ്ങൾ ലഭിക്കുന്നതിൽ തടസ്സം നേരിട്ടു.",
    }
};

export function EkadashiGuideModal({ locale }: EkadashiGuideModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [guideTitle, setGuideTitle] = useState<string>('');
    const [guideContent, setGuideContent] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const labels = GUIDE_LOCALIZED_STRINGS[locale] || GUIDE_LOCALIZED_STRINGS.en;

    const fetchGuide = () => {
        if (guideContent) {
            setIsOpen(true);
            return;
        }

        setLoading(true);
        setError(null);
        setIsOpen(true);

        fetch(`https://api.askharekrishna.com/api/v1/stories/id/111/?language=${locale}`)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setGuideTitle(data.subTopic || data.title || labels.cardTitle);
                setGuideContent(data.article || '');
            })
            .catch((err) => {
                console.error('Failed to load Ekadashi guide:', err);
                setError(labels.errorText);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Handle ESC key press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    return (
        <>
            {/* Feature Card: Entire Card is Clickable */}
            <div 
                onClick={fetchGuide}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        fetchGuide();
                    }
                }}
                className="mb-6 p-6 md:p-7 rounded-3xl bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-yellow-500/10 border-2 border-orange-500/30 hover:border-orange-500/70 shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer group active:scale-[0.99] select-none"
            >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                    <div className="flex items-start gap-4">
                        <div className="size-12 md:size-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                            <Sparkles size={26} className="animate-pulse" />
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-800 dark:text-orange-300 font-extrabold text-[11px] uppercase tracking-wider">
                                    <CheckCircle2 size={13} />
                                    <span>{labels.cardTitle}</span>
                                </span>

                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-700 dark:text-orange-300 font-extrabold text-[11px] border border-orange-500/25 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                    <span>👉 {labels.clickToRead}</span>
                                </span>
                            </div>

                            <p className="text-sm md:text-base text-neutral-700 dark:text-neutral-300 font-medium max-w-2xl leading-relaxed">
                                {labels.cardSubtitle}
                            </p>
                        </div>
                    </div>

                    <div className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl bg-orange-600 group-hover:bg-orange-500 text-white font-black text-sm shadow-lg group-hover:shadow-orange-500/30 transition-all shrink-0 pointer-events-none">
                        <BookOpen size={18} className="group-hover:scale-110 transition-transform" />
                        <span>{labels.buttonLabel}</span>
                    </div>
                </div>
            </div>

            {/* Modal Dialog */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setIsOpen(false)}
                >
                    <div 
                        className="relative flex flex-col w-full max-w-4xl max-h-[90vh] bg-surface-light dark:bg-[#181510] text-text-main dark:text-white rounded-3xl shadow-2xl border border-amber-500/30 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="p-5 md:p-6 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between gap-4 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                                    <BookOpen size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg md:text-xl font-black text-text-main dark:text-white leading-snug">
                                        {guideTitle || labels.cardTitle}
                                    </h3>
                                    <p className="text-xs font-semibold text-text-muted mt-0.5">
                                        {labels.modalSubtitle}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                                aria-label="Close dialog"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 md:p-10 overflow-y-auto flex-grow space-y-6">
                            {loading ? (
                                <div className="py-20 flex flex-col items-center justify-center gap-3 text-orange-500">
                                    <Loader2 size={36} className="animate-spin" />
                                    <span className="text-sm font-bold text-neutral-600 dark:text-neutral-300">
                                        {labels.loadingText}
                                    </span>
                                </div>
                            ) : error ? (
                                <div className="py-12 text-center text-red-500 font-bold">
                                    <p>{error}</p>
                                    <button
                                        onClick={fetchGuide}
                                        className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-xl font-bold text-sm cursor-pointer"
                                    >
                                        Retry
                                    </button>
                                </div>
                            ) : (
                                <div className="prose prose-stone dark:prose-invert max-w-none 
                                    prose-headings:font-black prose-headings:tracking-tight
                                    prose-h1:text-2xl prose-h1:text-orange-600 dark:prose-h1:text-orange-400 prose-h1:mb-4
                                    prose-h2:text-xl prose-h2:text-amber-600 dark:prose-h2:text-amber-400 prose-h2:mt-6 prose-h2:mb-3
                                    prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2
                                    prose-p:text-base prose-p:leading-relaxed prose-p:text-text-main dark:prose-p:gray-300
                                    prose-li:text-base prose-li:leading-relaxed
                                    prose-table:border prose-table:border-gray-200 dark:prose-table:border-neutral-800
                                    prose-th:bg-amber-500/10 prose-th:p-3
                                    prose-td:p-3
                                    prose-strong:text-orange-600 dark:prose-strong:text-orange-400 prose-strong:font-bold">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {guideContent}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 md:p-5 border-t border-gray-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 bg-surface-light dark:bg-[#14110b] shrink-0">
                            <Link
                                href={`/stories/111?lang=${locale}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline"
                            >
                                <span>{labels.openFullBtn}</span>
                                <ExternalLink size={14} />
                            </Link>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-5 py-2.5 rounded-xl bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-white font-black text-xs transition-colors cursor-pointer"
                            >
                                {labels.closeBtn}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
