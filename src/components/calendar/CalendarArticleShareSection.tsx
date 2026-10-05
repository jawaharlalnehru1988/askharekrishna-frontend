'use client';

import React, { useState } from 'react';
import { Copy, FileDown, Share2, Check, X } from 'lucide-react';
import { Locale } from '@/lib/dictionaries';

interface CalendarArticleShareSectionProps {
    locale: Locale;
    title: string;
    description?: string | null;
    eventDate: string;
    dayOfWeek?: string | null;
    articleUrl: string;
    isEkadashi?: boolean;
    breakFastDate?: string | null;
    breakFastDayOfWeek?: string | null;
    breakFastWindow?: string | null;
}

const ACTION_LABELS: Record<string, {
    sectionTitle: string;
    sectionDesc: string;
    copyText: string;
    copiedText: string;
    copyTextDesc: string;
    downloadPdf: string;
    downloadPdfDesc: string;
    shareMedia: string;
    shareMediaDesc: string;
    quickShare: string;
    copyLink: string;
    linkCopied: string;
    shareModalTitle: string;
    shareModalDesc: string;
    close: string;
}> = {
    en: {
        sectionTitle: 'Share, Copy & Download Event',
        sectionDesc: 'Share devotional pastimes as text, download lightweight PDF (<1MB), or post across any media.',
        copyText: 'Copy as Text',
        copiedText: 'Text Copied!',
        copyTextDesc: 'Full Article (Plain Text)',
        downloadPdf: 'Download as PDF',
        downloadPdfDesc: 'Lightweight (<1MB) • Print Ready',
        shareMedia: 'Share to Any Media',
        shareMediaDesc: 'WhatsApp, X, Facebook, Telegram...',
        quickShare: 'QUICK SHARE:',
        copyLink: 'Copy Link',
        linkCopied: 'Link copied to clipboard!',
        shareModalTitle: 'Share to Any Media',
        shareModalDesc: 'Select any platform below to share this sacred event with your friends & devotees:',
        close: 'Close',
    },
    ta: {
        sectionTitle: 'பகிரவும், நகலெடுக்கவும் & பதிவிறக்கவும்',
        sectionDesc: 'இந்த வைஷ்ணவ நிகழ்வை உரையாக பகிரவும், இலகுவான PDF வடிவில் பதிவிறக்கவும் அல்லது சமூக ஊடகங்களில் பகிரவும்.',
        copyText: 'உரையாக நகலெடு',
        copiedText: 'உரை நகலெடுக்கப்பட்டது!',
        copyTextDesc: 'முழு கட்டுரை (எளிய உரை)',
        downloadPdf: 'PDF பதிவிறக்கம்',
        downloadPdfDesc: 'இலகுவானது (<1MB) • அச்சு வடிவம்',
        shareMedia: 'ஊடகங்களில் பகிரவும்',
        shareMediaDesc: 'WhatsApp, X, Facebook, Telegram...',
        quickShare: 'உடனடிப் பகிர்வு:',
        copyLink: 'இணைப்பை நகலெடு',
        linkCopied: 'இணைப்பு நகலெடுக்கப்பட்டது!',
        shareModalTitle: 'எந்த ஊடகத்திலும் பகிரவும்',
        shareModalDesc: 'கீழே உள்ள எந்த செயலியைத் தேர்ந்தெடுத்தும் இந்த நிகழ்வைப் பகிரலாம்:',
        close: 'மூடுக',
    },
    hi: {
        sectionTitle: 'साझा करें, कॉपी करें और डाउनलोड करें',
        sectionDesc: 'इस दिव्य प्रसंग को टेक्स्ट के रूप में कॉपी करें, लाइटवेट PDF (<1MB) डाउनलोड करें या किसी भी माध्यम पर साझा करें।',
        copyText: 'टेक्स्ट कॉपी करें',
        copiedText: 'टेक्स्ट कॉपी हो गया!',
        copyTextDesc: 'पूरा लेख (सादा टेक्स्ट)',
        downloadPdf: 'PDF डाउनलोड करें',
        downloadPdfDesc: 'हल्का (<1MB) • प्रिंट के लिए तैयार',
        shareMedia: 'किसी भी माध्यम पर साझा करें',
        shareMediaDesc: 'WhatsApp, X, Facebook, Telegram...',
        quickShare: 'त्वरित साझा:',
        copyLink: 'लिंक कॉपी करें',
        linkCopied: 'लिंक कॉपी हो गया!',
        shareModalTitle: 'किसी भी माध्यम पर साझा करें',
        shareModalDesc: 'इस पावन प्रसंग को साझा करने के लिए नीचे किसी भी प्लेटफॉर्म का चयन करें:',
        close: 'बंद करें',
    },
    kn: {
        sectionTitle: 'ಹಂಚಿಕೊಳ್ಳಿ, ನಕಲಿಸಿ ಮತ್ತು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
        sectionDesc: 'ಈ ಲೇಖನವನ್ನು ಪಠ್ಯವಾಗಿ ನಕಲಿಸಿ, ಹಗುರವಾದ PDF (<1MB) ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ ಅಥವಾ ಹಂಚಿಕೊಳ್ಳಿ.',
        copyText: 'ಪಠ್ಯವಾಗಿ ನಕಲಿಸಿ',
        copiedText: 'ಪಠ್ಯ ನಕಲಿಸಲಾಗಿದೆ!',
        copyTextDesc: 'ಸಂಪೂರ್ಣ ಲೇಖನ (ಪ್ಲೇನ್ ಟೆಕ್ಸ್ಟ್)',
        downloadPdf: 'PDF ಡೌನ್‌ಲೋಡ್',
        downloadPdfDesc: 'ಹಗುರವಾದದ್ದು (<1MB) • ಪ್ರಿಂಟ್ ರೆಡಿ',
        shareMedia: 'ಯಾವುದೇ ಮಾಧ್ಯಮಕ್ಕೆ ಹಂಚಿಕೊಳ್ಳಿ',
        shareMediaDesc: 'WhatsApp, X, Facebook, Telegram...',
        quickShare: 'ತ್ವರಿತ ಹಂಚಿಕೆ:',
        copyLink: 'ಲಿಂಕ್ ನಕಲಿಸಿ',
        linkCopied: 'ಲಿಂಕ್ ನಕಲಿಸಲಾಗಿದೆ!',
        shareModalTitle: 'ಯಾವುದೇ ಮಾಧ್ಯಮಕ್ಕೆ ಹಂಚಿಕೊಳ್ಳಿ',
        shareModalDesc: 'ಈ ಪವಿತ್ರ ಲೇಖನವನ್ನು ಹಂಚಿಕೊಳ್ಳಲು ಕೆಳಗಿನ ಯಾವುದೇ ವೇದಿಕೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:',
        close: 'ಮುಚ್ಚಿ',
    },
    te: {
        sectionTitle: 'పంచుకోండి, కాపీ చేయండి మరియు డౌన్‌లోడ్ చేయండి',
        sectionDesc: 'ఈ వ్యాసాన్ని టెక్స్ట్‌గా కాపీ చేయండి, తేలికైన PDF (<1MB) డౌన్‌లోడ్ చేయండి లేదా పంచుకోండి.',
        copyText: 'టెక్స్ట్‌గా కాపీ చేయండి',
        copiedText: 'టెక్స్ట్ కాపీ చేయబడింది!',
        copyTextDesc: 'పూర్తి వ్యాసం (ప్లెయిన్ టెక్స్ట్)',
        downloadPdf: 'PDF డౌన్‌లోడ్',
        downloadPdfDesc: 'తేలికైనది (<1MB) • ప్రింట్ సిద్ధం',
        shareMedia: 'ఏ మాధ్యమంలోనైనా పంచుకోండి',
        shareMediaDesc: 'WhatsApp, X, Facebook, Telegram...',
        quickShare: 'త్వరిత భాగస్వామ్యం:',
        copyLink: 'లింక్ కాపీ చేయండి',
        linkCopied: 'లింక్ కాపీ చేయబడింది!',
        shareModalTitle: 'ఏ మాధ్యమంలోనైనా పంచుకోండి',
        shareModalDesc: 'ఈ దివ్య చరిత్రను పంచుకోవడానికి క్రింది ఏ వేదికనైనా ఎంచుకోండి:',
        close: 'మూసివేయండి',
    },
    ml: {
        sectionTitle: 'പങ്കിടുക, പകർത്തുക, ഡൗൺലോഡ് ചെയ്യുക',
        sectionDesc: 'ഈ ലേഖനം ടെക്സ്റ്റായി പകർത്തുക, ഭാരം കുറഞ്ഞ PDF (<1MB) ഡൗൺലോഡ് ചെയ്യുക അല്ലെങ്കിൽ പങ്കിടുക.',
        copyText: 'ടെക്സ്റ്റായി പകർത്തുക',
        copiedText: 'ടെക്സ്റ്റ് പകർത്തി!',
        copyTextDesc: 'മുഴുവൻ ലേഖനം (പ്ലെയിൻ ടെക്സ്റ്റ്)',
        downloadPdf: 'PDF ഡൗൺലോഡ്',
        downloadPdfDesc: 'ഭാരം കുറഞ്ഞത് (<1MB) • പ്രിന്റ് റെഡി',
        shareMedia: 'ഏത് മാധ്യമത്തിലും പങ്കിടുക',
        shareMediaDesc: 'WhatsApp, X, Facebook, Telegram...',
        quickShare: 'ദ്രുത പങ്കിടൽ:',
        copyLink: 'ലിങ്ക് പകർത്തുക',
        linkCopied: 'ലിങ്ക് പകർത്തി!',
        shareModalTitle: 'ഏത് മാധ്യമത്തിലും പങ്കിടുക',
        shareModalDesc: 'ഈ പവിത്ര സംഭവം പങ്കിടുന്നതിന് താഴെയുള്ള ഏതെങ്കിലും പ്ലാറ്റ്‌ഫോം തിരഞ്ഞെടുക്കുക:',
        close: 'അടയ്ക്കുക',
    },
};

export function CalendarArticleShareSection({
    locale,
    title,
    description,
    eventDate,
    dayOfWeek,
    articleUrl,
    isEkadashi,
    breakFastDate,
    breakFastDayOfWeek,
    breakFastWindow,
}: CalendarArticleShareSectionProps) {
    const [copiedText, setCopiedText] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const labels = ACTION_LABELS[locale] || ACTION_LABELS.en;

    // Build the tailored share message
    const getShareMessage = (): string => {
        const paranaTimingText = breakFastWindow
            ? `${breakFastDate ? `${breakFastDate} (${breakFastDayOfWeek || ''}) — ` : ''}${breakFastWindow} (LT)`
            : 'Dvadashi morning';

        if (isEkadashi) {
            switch (locale) {
                case 'ta':
                    return `🌸 *${title}* (${eventDate})\n\n` +
                        `✨ முழுமையான ஏகாதசி திவ்ய சரித்திரம் & மஹிமை\n` +
                        `⏰ துவாதசி பாரணை நேரம் (Break Fast Window): ${paranaTimingText}\n` +
                        `📖 ஏகாதசியை எப்படி கடைபிடிக்க வேண்டும் என்பதற்கான முழு வழிகாட்டி இதில் அடங்கும்\n\n` +
                        `🔗 முழுமையாக இங்கே படியுங்கள்:\n${articleUrl}\n\n` +
                        `— ஆஸ்க் ஹரே கிருஷ்ணா (askharekrishna.com)`;
                case 'hi':
                    return `🌸 *${title}* (${eventDate})\n\n` +
                        `✨ पावन एकादशी कथा एवं महात्म्य\n` +
                        `⏰ द्वादशी पारण समय (Break Fast Window): ${paranaTimingText}\n` +
                        `📖 एकादशी व्रत का विधिपूर्वक पालन कैसे करें - संपूर्ण मार्गदर्शिका सम्मिलित\n\n` +
                        `🔗 पूरा आलेख यहाँ पढ़ें:\n${articleUrl}\n\n` +
                        `— आस्क हरे कृष्णा (askharekrishna.com)`;
                case 'kn':
                    return `🌸 *${title}* (${eventDate})\n\n` +
                        `✨ ಸಂಪೂರ್ಣ ಏಕಾದಶಿ ಮಹಿಮೆ ಮತ್ತು ಕಥೆ\n` +
                        `⏰ ದ್ವಾದಶಿ ಪಾರಣೆ ಸಮಯ (Break Fast Window): ${paranaTimingText}\n` +
                        `📖 ಏಕಾದಶಿ ವ್ರತವನ್ನು ಆಚರಿಸುವ ಸಂಪೂರ್ಣ ವಿಧಿ ಮತ್ತು ಮಾರ್ಗದರ್ಶನ ಒಳಗೊಂಡಿದೆ\n\n` +
                        `🔗 ಸಂಪೂರ್ಣವಾಗಿ ಇಲ್ಲಿ ಓದಿ:\n${articleUrl}\n\n` +
                        `— ಆಸ್ಕ್ ಹರೇ ಕೃಷ್ಣ (askharekrishna.com)`;
                case 'te':
                    return `🌸 *${title}* (${eventDate})\n\n` +
                        `✨ సంపూర్ణ ఏకాదశి చరిత్ర మరియు మహిమ\n` +
                        `⏰ ద్వాదశి పారణ సమయం (Break Fast Window): ${paranaTimingText}\n` +
                        `📖 ఏకాదశి వ్రతాన్ని ఎలా ఆచరించాలి అనే సంపూర్ణ మార్గదర్శకత్వం కలదు\n\n` +
                        `🔗 పూర్తిగా ఇక్కడ చదవండి:\n${articleUrl}\n\n` +
                        `— ఆస్క్ హరే కృష్ణ (askharekrishna.com)`;
                case 'ml':
                    return `🌸 *${title}* (${eventDate})\n\n` +
                        `✨ സമ്പൂർണ്ണ ഏകാദശി ചരിത്രവും മാഹാത്മ്യവും\n` +
                        `⏰ ദ്വാദശി പാരണ സമയം (Break Fast Window): ${paranaTimingText}\n` +
                        `📖 ഏകാദശി വ്രതം എങ്ങനെ അനുഷ്ഠിക്കാം എന്നതിനുള്ള സമഗ്രമായ മാർഗ്ഗരേഖ ഉൾപ്പെടുന്നു\n\n` +
                        `🔗 പൂർണ്ണമായി ഇവിടെ വായിക്കുക:\n${articleUrl}\n\n` +
                        `— ആസ്ക് ഹരേ കൃഷ്ണ (askharekrishna.com)`;
                default:
                    return `🌸 *${title}* (${eventDate})\n\n` +
                        `✨ Complete Pastime Story & Glories\n` +
                        `⏰ Includes Parana (Break Fast) Timings: ${paranaTimingText}\n` +
                        `📖 Includes Complete Guidelines on How to Follow Ekadashi Vrata\n\n` +
                        `🔗 Read full article here:\n${articleUrl}\n\n` +
                        `— Ask Hare Krishna (askharekrishna.com)`;
            }
        }

        // Standard event sharing
        switch (locale) {
            case 'ta':
                return `✨ *${title}* (${eventDate})\n\nஇந்த வைஷ்ணவ நிகழ்வைப் பற்றி ஆஸ்க் ஹரே கிருஷ்ணாவில் படியுங்கள்:\n${articleUrl}`;
            case 'hi':
                return `✨ *${title}* (${eventDate})\n\nइस पावन वैष्णव प्रसंग को आस्क हरे कृष्णा पर पढ़ें:\n${articleUrl}`;
            case 'kn':
                return `✨ *${title}* (${eventDate})\n\nಈ ಪವಿತ್ರ ವೈಷ್ಣವ ಲೇಖನವನ್ನು ಆಸ್ಕ್ ಹರೇ ಕೃಷ್ಣದಲ್ಲಿ ಓದಿ:\n${articleUrl}`;
            case 'te':
                return `✨ *${title}* (${eventDate})\n\nఈ దివ్య వైష్ణవ చరిత్రను ఆస్క్ హరే కృష్ణలో చదవండి:\n${articleUrl}`;
            case 'ml':
                return `✨ *${title}* (${eventDate})\n\nഈ പവിത്ര വൈഷ്ണവ സംഭവം ആസ്ക് ഹരേ കൃഷ്ണയിൽ വായിക്കുക:\n${articleUrl}`;
            default:
                return `✨ *${title}* (${eventDate})\n\nRead about this sacred Vaishnava event on Ask Hare Krishna:\n${articleUrl}`;
        }
    };

    // Copy full article text
    const handleCopyText = async () => {
        try {
            const cleanedText = (description || '')
                .replace(/^#+\s+/gm, '')
                .replace(/\*\*(.*?)\*\*/g, '$1')
                .replace(/\*(.*?)\*/g, '$1')
                .replace(/\[(.*?)\]\((.*?)\)/g, '$1 ($2)')
                .replace(/^>\s+/gm, '“ ')
                .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
                .trim();

            const shareMsg = getShareMessage();
            const fullText = `${title.toUpperCase()} (${eventDate}${dayOfWeek ? `, ${dayOfWeek}` : ''})\n\n${cleanedText}\n\n---\n${shareMsg}`;

            await navigator.clipboard.writeText(fullText);
            setCopiedText(true);
            setTimeout(() => setCopiedText(false), 3000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    // Print / Save as PDF
    const handleDownloadPdf = () => {
        window.print();
    };

    // Share to native media or open modal
    const handleShareToMedia = async () => {
        const shareText = getShareMessage();
        const shareData = {
            title,
            text: shareText,
            url: articleUrl,
        };

        if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
                return;
            } catch {
                // User cancelled or fallback
            }
        }
        setIsShareModalOpen(true);
    };

    // 1-Click Social Sharing
    const handleDirectShare = (platform: 'whatsapp' | 'twitter' | 'facebook' | 'telegram' | 'linkedin') => {
        const shareText = getShareMessage();
        const encodedText = encodeURIComponent(shareText);
        const encodedUrl = encodeURIComponent(articleUrl);

        let url = '';
        switch (platform) {
            case 'whatsapp':
                url = `https://wa.me/?text=${encodedText}`;
                break;
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encodedText}`;
                break;
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case 'telegram':
                url = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
                break;
            case 'linkedin':
                url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
                break;
        }

        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    // Copy link only
    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(articleUrl);
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 3000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    return (
        <div className="mt-14 pt-10 border-t border-gray-100 dark:border-neutral-800">
            {/* Header */}
            <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-black text-text-main dark:text-white mb-2">
                    {labels.sectionTitle}
                </h3>
                <p className="text-sm text-text-muted max-w-lg mx-auto">
                    {labels.sectionDesc}
                </p>
            </div>

            {/* Primary 3 Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {/* 1. Copy as Text */}
                <button
                    onClick={handleCopyText}
                    className={`group flex flex-col items-center justify-center p-5 rounded-2xl border transition-all duration-200 shadow-sm active:scale-95 cursor-pointer text-center ${
                        copiedText
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                            : 'bg-white dark:bg-[#1a160f] border-gray-200 dark:border-neutral-800 hover:border-amber-500/60 dark:hover:border-amber-500/60 hover:shadow-md'
                    }`}
                >
                    <div className={`size-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                        copiedText
                            ? 'bg-emerald-500 text-white'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-black'
                    }`}>
                        {copiedText ? <Check size={24} /> : <Copy size={24} />}
                    </div>
                    <span className="font-extrabold text-base text-text-main dark:text-white mb-1">
                        {copiedText ? labels.copiedText : labels.copyText}
                    </span>
                    <span className="text-xs text-text-muted font-medium">
                        {labels.copyTextDesc}
                    </span>
                </button>

                {/* 2. Download as PDF */}
                <button
                    onClick={handleDownloadPdf}
                    className="group flex flex-col items-center justify-center p-5 rounded-2xl border bg-white dark:bg-[#1a160f] border-gray-200 dark:border-neutral-800 hover:border-red-500/60 dark:hover:border-red-500/60 hover:shadow-md transition-all duration-200 shadow-sm active:scale-95 cursor-pointer text-center"
                >
                    <div className="size-12 rounded-xl flex items-center justify-center mb-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 group-hover:bg-red-600 group-hover:text-white transition-colors">
                        <FileDown size={24} />
                    </div>
                    <span className="font-extrabold text-base text-text-main dark:text-white mb-1">
                        {labels.downloadPdf}
                    </span>
                    <span className="text-xs text-text-muted font-medium">
                        {labels.downloadPdfDesc}
                    </span>
                </button>

                {/* 3. Share to Any Media */}
                <button
                    onClick={handleShareToMedia}
                    className="group flex flex-col items-center justify-center p-5 rounded-2xl border bg-white dark:bg-[#1a160f] border-gray-200 dark:border-neutral-800 hover:border-blue-500/60 dark:hover:border-blue-500/60 hover:shadow-md transition-all duration-200 shadow-sm active:scale-95 cursor-pointer text-center"
                >
                    <div className="size-12 rounded-xl flex items-center justify-center mb-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Share2 size={24} />
                    </div>
                    <span className="font-extrabold text-base text-text-main dark:text-white mb-1">
                        {labels.shareMedia}
                    </span>
                    <span className="text-xs text-text-muted font-medium">
                        {labels.shareMediaDesc}
                    </span>
                </button>
            </div>

            {/* Quick 1-Click Social Media Strip */}
            <div className="p-4 rounded-2xl bg-surface-light dark:bg-[#15120c] border border-gray-200 dark:border-neutral-800/80 backdrop-blur-sm flex flex-wrap items-center justify-center gap-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted mr-1">
                    {labels.quickShare}
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

                {/* X (Twitter) */}
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
                    title={labels.copyLink}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                        copiedLink
                            ? 'bg-emerald-500 text-white shadow-md'
                            : 'bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-text-main dark:text-white'
                    }`}
                >
                    {copiedLink ? <Check size={14} /> : <Share2 size={14} />}
                    <span>{copiedLink ? labels.linkCopied : labels.copyLink}</span>
                </button>
            </div>

            {/* Share to Any Media Modal */}
            {isShareModalOpen && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 no-print"
                    onClick={() => setIsShareModalOpen(false)}
                >
                    <div 
                        className="bg-white dark:bg-[#2a2418] border border-amber-500/30 rounded-3xl max-w-md w-full p-6 shadow-2xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsShareModalOpen(false)}
                            className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-text-muted hover:text-text-main dark:hover:text-white transition-colors cursor-pointer"
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="size-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                <Share2 size={20} />
                            </div>
                            <div>
                                <h4 className="text-lg font-black text-text-main dark:text-white">
                                    {labels.shareModalTitle}
                                </h4>
                                <p className="text-xs text-text-muted line-clamp-1">
                                    {title}
                                </p>
                            </div>
                        </div>

                        <p className="text-xs text-text-muted mb-4">
                            {labels.shareModalDesc}
                        </p>

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
                                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0A66C2]/10 hover:bg-[#0A66C2] text-[#0A66C2] hover:text-white font-bold text-xs transition-colors cursor-pointer"
                            >
                                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.778-.773 1.778-1.729V1.73C24 .774 23.205 0 22.225 0z" />
                                </svg>
                                <span>LinkedIn</span>
                            </button>

                            <button
                                onClick={handleCopyLink}
                                className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-text-main dark:text-white font-bold text-xs transition-colors cursor-pointer"
                            >
                                <Share2 size={16} />
                                <span>{copiedLink ? labels.linkCopied : labels.copyLink}</span>
                            </button>
                        </div>

                        <div className="flex justify-end pt-2 border-t border-gray-100 dark:border-neutral-800">
                            <button
                                onClick={() => setIsShareModalOpen(false)}
                                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 font-bold text-xs text-text-main dark:text-white cursor-pointer"
                            >
                                {labels.close}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
