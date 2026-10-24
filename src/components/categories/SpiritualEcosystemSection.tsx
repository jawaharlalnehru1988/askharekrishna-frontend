"use client";

import React from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, Scroll, ArrowRight, Compass } from 'lucide-react';
import { useLanguage } from '../providers/LanguageContext';

const ecosystemLabels: Record<string, {
    sectionTitle: string;
    sectionSubtitle: string;
    ekadasiTitle: string;
    ekadasiDesc: string;
    ekadasiBtn: string;
    calendarTitle: string;
    calendarDesc: string;
    calendarBtn: string;
    storiesTitle: string;
    storiesDesc: string;
    storiesBtn: string;
}> = {
    ta: {
        sectionTitle: 'ஆன்மீகப் பொக்கிஷங்களை மேலும் ஆராயுங்கள்',
        sectionSubtitle: 'ஏகாதசி மகிமைக் கதைகள், வைஷ்ணவ காலண்டர் மற்றும் ஆன்மீக வரலாறுகளுடன் உங்கள் பக்தியை வளர்த்துக் கொள்ளுங்கள்.',
        ekadasiTitle: 'ஏகாதசி மகிமைக் கதைகள்',
        ekadasiDesc: 'ஒவ்வொரு ஏகாதசியின் தெய்வீக தோற்றம், மகத்துவங்கள் மற்றும் விரத கதைகள்.',
        ekadasiBtn: 'ஏகாதசி கதைகளைப் படியுங்கள்',
        calendarTitle: 'வைஷ்ணவ காலண்டர்',
        calendarDesc: 'ஏகாதசி விரத தினங்கள், பாரணை நேரங்கள் மற்றும் திருவிழாக்கள்.',
        calendarBtn: 'நாட்காட்டியைப் பார்க்க',
        storiesTitle: 'ஆன்மீகக் கதைகள்',
        storiesDesc: 'பக்தியை வளர்க்கும் உன்னத வைஷ்ணவ சரித்திரங்கள்.',
        storiesBtn: 'கதைகளைப் படியுங்கள்',
    },
    en: {
        sectionTitle: 'Deepen Your Spiritual Journey',
        sectionSubtitle: 'Explore authentic wisdom through sacred Ekadashi stories, Vaishnava Calendar, and uplifting pastimes.',
        ekadasiTitle: 'Ekadashi Stories',
        ekadasiDesc: 'Divine origins, glories, and transcendental narratives of every sacred Ekadashi fast.',
        ekadasiBtn: 'Read Ekadashi Stories',
        calendarTitle: 'Vaishnava Calendar',
        calendarDesc: 'Accurate Ekadashi fasts, Parana timings, and festival dates.',
        calendarBtn: 'View Calendar',
        storiesTitle: 'Spiritual Stories',
        storiesDesc: 'Enlightening pastimes that illustrate timeless spiritual values.',
        storiesBtn: 'Explore Stories',
    },
    hi: {
        sectionTitle: 'अपनी आध्यात्मिक यात्रा को गहरा करें',
        sectionSubtitle: 'एकादशी कथाओं, वैष्णव कैलेंडर और प्रेरणादायक कथाओं के माध्यम से प्रामाणिक ज्ञान प्राप्त करें।',
        ekadasiTitle: 'एकादशी व्रत कथाएँ',
        ekadasiDesc: 'प्रत्येक पवित्र एकादशी की दिव्य उत्पत्ति, महिमा और पावन व्रत कथाएँ।',
        ekadasiBtn: 'एकादशी कथाएँ पढ़ें',
        calendarTitle: 'वैष्णव कैलेंडर',
        calendarDesc: 'एकादशी व्रत, पारण समय और उत्सव तिथियों की सटीक जानकारी।',
        calendarBtn: 'कैलेंडर देखें',
        storiesTitle: 'आध्यात्मिक कथाएँ',
        storiesDesc: 'शाश्वत आध्यात्मिक मूल्यों को उजागर करने वाली पावन कथाएँ।',
        storiesBtn: 'कथाएँ पढ़ें',
    },
    te: {
        sectionTitle: 'మీ ఆధ్యాత్మిక ప్రయాణాన్ని మరింత సుసంపన్నం చేసుకోండి',
        sectionSubtitle: 'ఏకాదశి కథలు, వైష్ணవ క్యాలెండర్ మరియు స్ఫూర్తిదాయకమైన కథల ద్వారా సత్యజ్ఞానాన్ని పొందండి.',
        ekadasiTitle: 'ఏకాదశి వ్రత కథలు',
        ekadasiDesc: 'ప్రతి ఏకాదశి యొక్క దివ్య ఆవిర్భావం, మహిమలు మరియు వ్రత కథలు.',
        ekadasiBtn: 'ఏకాదశి కథలు చదవండి',
        calendarTitle: 'వైష్ణవ క్యాలెండర్',
        calendarDesc: 'ఏకాదశి ఉపవాసాలు, పారణ సమయాలు మరియు పండుగల వివరాలు.',
        calendarBtn: 'క్యాలెండర్ చూడండి',
        storiesTitle: 'ఆధ్యాత్మిక కథలు',
        storiesDesc: 'దివ్యమైన వైష్ணవ చరిత్రలు మరియు భక్తి కథలు.',
        storiesBtn: 'கథలను చదవండి',
    },
    kn: {
        sectionTitle: 'ನಿಮ್ಮ ಆಧ್ಯಾತ್ಮಿಕ ಪ್ರಯಾಣವನ್ನು ಇನ್ನಷ್ಟು ಆಳಗೊಳಿಸಿ',
        sectionSubtitle: 'ಏಕಾದಶಿ ಕಥೆಗಳು, ವೈಷ್ಣವ ಕ್ಯಾಲೆಂಡರ್ ಮತ್ತು ಪ್ರೇರಣಾದಾಯಕ ಕಥೆಗಳ ಮೂಲಕ ಜ್ಞಾನವನ್ನು ಅನ್ವೇಷಿಸಿ.',
        ekadasiTitle: 'ಏಕಾದಶಿ ಕಥೆಗಳು',
        ekadasiDesc: 'ಪ್ರತಿಯೊಂದು ಪವಿತ್ರ ಏಕಾದಶಿಯ ದಿವ್ಯ ಮಹಿಮೆಗಳು ಮತ್ತು ವ್ರತ ಕಥೆಗಳು.',
        ekadasiBtn: 'ಏಕಾದಶಿ ಕಥೆಗಳನ್ನು ಓದಿ',
        calendarTitle: 'ವೈಷ್ಣವ ಕ್ಯಾಲೆಂಡರ್',
        calendarDesc: 'ಏಕಾದಶಿ ಉಪವಾಸ, ಪಾರಣೆ ಸಮಯ ಮತ್ತು ಹಬ್ಬಗಳ ನಿಖರ ದಿನಾಂಕಗಳು.',
        calendarBtn: 'ಕ್ಯಾಲೆಂಡರ್ ವೀಕ್ಷಿಸಿ',
        storiesTitle: 'ಆಧ್ಯಾತ್ಮಿಕ ಕಥೆಗಳು',
        storiesDesc: 'ಶಾಶ್ವತ ಮೌಲ್ಯಗಳನ್ನು ಸಾರುವ ವೈಷ್ಣವ ಚರಿತ್ರೆಗಳು.',
        storiesBtn: 'ಕಥೆಗಳನ್ನು ಓದಿ',
    },
    ml: {
        sectionTitle: 'നിങ്ങളുടെ ആത്മീയ യാത്ര കൂടുതൽ സമ്പന്നമാക്കുക',
        sectionSubtitle: 'ഏകാദശി വ്രതകഥകൾ, വൈഷ്ണവ കലണ്ടർ, പ്രചോദനാത്മകമായ കഥകൾ എന്നിവയിലൂടെ ആധികാരിക ജ്ഞാനം നേടുക.',
        ekadasiTitle: 'ഏകാദശി വ്രതകഥകൾ',
        ekadasiDesc: 'ഓരോ പവിത്ര ഏകാദശിയുടെയും ദിവ്യ മാഹാത്മ്യവും വ്രതകഥകളും.',
        ekadasiBtn: 'ഏകാദശി കഥകൾ വായിക്കുക',
        calendarTitle: 'വൈഷ്ണവ കലണ്ടർ',
        calendarDesc: 'ഏകാദശി വ്രതം, പാരണ സമയങ്ങൾ, ഉത്സവ തീയതികൾ എന്നിവ.',
        calendarBtn: 'കലണ്ടർ കാണുക',
        storiesTitle: 'ആത്മീയ കഥകൾ',
        storiesDesc: 'ഭക്തിയെ വളർത്തുന്ന ശ്രേഷ്ഠമായ വൈഷ്ണവ ചരിത്രങ്ങൾ.',
        storiesBtn: 'കഥകൾ വായിക്കുക',
    },
    bn: {
        sectionTitle: 'আপনার আধ্যাত্মিক যাত্রাকে আরও সমৃদ্ধ করুন',
        sectionSubtitle: 'একাদশী ব্রতকথা, বৈষ্ণব ক্যালেন্ডার এবং অনুপ্রেরণাদায়ী কাহিনীর মাধ্যমে প্রামাণিক জ্ঞান অর্জন করুন।',
        ekadasiTitle: 'একাদশী মাহাত্ম্য কথা',
        ekadasiDesc: 'প্রতিটি পরম পবিত্র একাদশীর দিব্য উৎপত্তি ও ফলপ্রদ ব্রতকথা।',
        ekadasiBtn: 'একাদশী ব্রতকথা পড়ুন',
        calendarTitle: 'বৈष्णব ক্যালেন্ডার',
        calendarDesc: 'একাদশী ব্রত, পারণ সময় ও উৎসবের সঠিক দিনপঞ্জি।',
        calendarBtn: 'ক্যালেন্ডার দেখুন',
        storiesTitle: 'আধ্যাত্মিক কাহিনী',
        storiesDesc: 'ভক্তি ও ধর্মবোধ জাগ্রতকারী অমূল্য বৈষ্ণব চরিত্রকথা।',
        storiesBtn: 'কাহিনী পড়ুন',
    },
};

export function SpiritualEcosystemSection() {
    const { locale } = useLanguage();
    const t = ecosystemLabels[locale] || ecosystemLabels.en;

    const cards = [
        {
            title: t.ekadasiTitle,
            desc: t.ekadasiDesc,
            btn: t.ekadasiBtn,
            href: `/stories?topic=Ekadasi%20Stories&lang=${locale}`,
            icon: BookOpen,
            color: 'from-amber-500/20 to-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
        },
        {
            title: t.calendarTitle,
            desc: t.calendarDesc,
            btn: t.calendarBtn,
            href: `/vaishnava-calendar?lang=${locale}`,
            icon: Calendar,
            color: 'from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        },
        {
            title: t.storiesTitle,
            desc: t.storiesDesc,
            btn: t.storiesBtn,
            href: `/stories?lang=${locale}`,
            icon: Scroll,
            color: 'from-purple-500/20 to-indigo-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        },
    ];

    return (
        <section className="mt-16 pt-10 border-t border-gray-200 dark:border-neutral-800 no-print">
            <div className="text-center max-w-2xl mx-auto mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2.5">
                    <Compass size={14} />
                    <span>Ask Hare Krishna</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-text-main dark:text-white tracking-tight mb-2">
                    {t.sectionTitle}
                </h3>
                <p className="text-sm text-text-muted">
                    {t.sectionSubtitle}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, idx) => {
                    const IconComponent = card.icon;
                    return (
                        <Link
                            key={idx}
                            href={card.href}
                            className="group relative rounded-2xl bg-white dark:bg-[#2a2418] border border-[#e7dfcf] dark:border-neutral-800 hover:border-primary/50 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1"
                        >
                            <div>
                                <div className={`size-12 rounded-xl bg-gradient-to-br ${card.color} border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <IconComponent size={24} />
                                </div>
                                <h4 className="text-lg font-bold text-text-main dark:text-white group-hover:text-primary transition-colors mb-2">
                                    {card.title}
                                </h4>
                                <p className="text-xs text-text-muted leading-relaxed line-clamp-3">
                                    {card.desc}
                                </p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-[#f3efe7] dark:border-neutral-800/80 flex items-center justify-between text-xs font-bold text-primary">
                                <span>{card.btn}</span>
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
