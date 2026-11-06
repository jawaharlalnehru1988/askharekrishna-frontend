'use client';

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Sun,
    Moon,
    Clock,
    BookOpen,
    CalendarDays,
    ListFilter,
    ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '../providers/LanguageContext';
import UpcomingEventsSection from '../home/UpcomingEventsSection';

interface ObservanceItem {
    id: number;
    title: string;
    category: string;
    order: number;
    description: string | null;
    imageUrl?: string | null;
    image?: string | null;
    audioUrl?: string | null;
}

interface CalendarDayItem {
    id: number;
    event_date: string;
    day_of_week: string;
    is_ekadashi: boolean;
    ekadashi_name: string | null;
    is_fast_day: boolean;
    fast_details: string | null;
    break_fast_date: string | null;
    break_fast_day_of_week: string | null;
    break_fast_window: string | null;
    observances: ObservanceItem[];
}

interface CalendarTranslationStrings {
    badge: string;
    title: string;
    subtitle: string;
    monthlyView: string;
    upcomingFeed: string;
    prevMonth: string;
    nextMonth: string;
    jumpToday: string;
    yearFormat: (y: number) => string;
    legendEkadashi: string;
    legendAppearance: string;
    legendParana: string;
    legendGeneral: string;
    todayBadge: string;
    selectedDay: string;
    sacredEkadashi: string;
    ekadashiInstruction: string;
    paranaTitle: string;
    breakFastToday: (w: string) => string;
    fastingRule: string;
    observancesTitle: (count: number) => string;
    regularDevotionalDay: string;
    regularAdvice: string;
    storyAvailable: string;
    readStory: string;
    monthNames: string[];
    weekdays: string[];
}

const CALENDAR_STRINGS: Record<string, CalendarTranslationStrings> = {
    en: {
        badge: 'Vaishnava Panjika & Gaurabda Calendar',
        title: 'Vaishnava Devotional Calendar',
        subtitle: 'Accurate fasting dates, Ekadashis, Parana timings, and appearance days of Bhagavan Sri Krishna, Sri Gauranga, and Vaishnava Acharyas.',
        monthlyView: 'Monthly Calendar View',
        upcomingFeed: 'Upcoming Events Feed',
        prevMonth: 'Previous Month',
        nextMonth: 'Next Month',
        jumpToday: 'Jump to Today',
        yearFormat: (y) => `Year ${y}`,
        legendEkadashi: 'Ekadashi Fast',
        legendAppearance: 'Appearance / Festival',
        legendParana: 'Parana (Break Fast)',
        legendGeneral: 'General Observance',
        todayBadge: 'Today',
        selectedDay: 'Selected Day',
        sacredEkadashi: 'Sacred Ekadashi Fasting',
        ekadashiInstruction: 'Fast from all grains and beans. Chant the Holy Names of Bhagavan Sri Krishna and hear His pastimes.',
        paranaTitle: 'Parana (Break-Fast Window)',
        breakFastToday: (w) => `Break fast today: ${w} (Local Time)`,
        fastingRule: 'Fasting Rule:',
        observancesTitle: (c) => `Observances & Festivals (${c})`,
        regularDevotionalDay: 'Regular devotional day.',
        regularAdvice: 'Chant Hare Krishna, remember Bhagavan, and honor Prasadam. 🙏',
        storyAvailable: 'Story Available',
        readStory: 'Read Full Pastime Story ➔',
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    },
    kn: {
        badge: 'ವೈಷ್ಣವ ಪಂಚಾಂಗ & ಗೌರಾಬ್ದ ಕ್ಯಾಲೆಂಡರ್',
        title: 'ವೈಷ್ಣವ ಭಕ್ತಿ ಕ್ಯಾಲೆಂಡರ್',
        subtitle: 'ಭಗವಾನ್ ಶ್ರೀ ಕೃಷ್ಣ, ಶ್ರೀ ಗೌರಾಂಗ ಮತ್ತು ವೈಷ್ಣವ ಆಚಾರ್ಯರ ಆವಿರ್ಭಾವ ದಿನಗಳು, ನಿಖರವಾದ ಉಪವಾಸ ದಿನಾಂಕಗಳು, ಏಕಾದಶಿಗಳು ಮತ್ತು ಪಾರಣ ಸಮಯಗಳು.',
        monthlyView: 'ಮಾಸಿಕ ಕ್ಯಾಲೆಂಡರ್ ವೀಕ್ಷಣೆ',
        upcomingFeed: 'ಮುಂಬರುವ ವೈಷ್ಣವ ದಿನಗಳು',
        prevMonth: 'ಹಿಂದಿನ ತಿಂಗಳು',
        nextMonth: 'ಮುಂದಿನ ತಿಂಗಳು',
        jumpToday: 'ಇಂದಿನ ದಿನಕ್ಕೆ ಹೋಗಿ',
        yearFormat: (y) => `ವರ್ಷ ${y}`,
        legendEkadashi: 'ಏಕಾದಶಿ ವ್ರತ',
        legendAppearance: 'ಆವಿರ್ಭಾವ / ಮಹೋತ್ಸವ',
        legendParana: 'ಪಾರಣೆ (ಉಪವಾಸ ಮುಕ್ತಾಯ)',
        legendGeneral: 'ಸಾಮಾನ್ಯ ಆಚರಣೆ',
        todayBadge: 'ಇಂದು',
        selectedDay: 'ಆಯ್ಕೆಮಾಡಿದ ದಿನ',
        sacredEkadashi: 'ಪವಿತ್ರ ಏಕಾದಶಿ ಉಪವಾಸ',
        ekadashiInstruction: 'ಧಾನ್ಯಗಳು ಮತ್ತು ಬೇಳೆಗಳಿಂದ ಉಪವಾಸ ಮಾಡಿ. ಭಗವಾನ್ ಶ್ರೀ ಕೃಷ್ಣನ ಪವಿತ್ರ ನಾಮಗಳನ್ನು ಜಪಿಸಿ ಮತ್ತು ಆತನ ಲೀಲೆಗಳನ್ನು ಶ್ರವಣ ಮಾಡಿ.',
        paranaTitle: 'ಪಾರಣ ಸಮಯ (ಉಪವಾಸ ಮುಕ್ತಾಯ)',
        breakFastToday: (w) => `ಇಂದು ಉಪವಾಸ ಮುಕ್ತಾಯ (ಪಾರಣ): ${w} (ಸ್ಥಳೀಯ ಸಮಯ)`,
        fastingRule: 'ಉಪವಾಸ ನಿಯಮ:',
        observancesTitle: (c) => `ಆಚರಣೆಗಳು ಮತ್ತು ಉತ್ಸವಗಳು (${c})`,
        regularDevotionalDay: 'ಸಾಮಾನ್ಯ ಭಕ್ತಿ ದಿನ.',
        regularAdvice: 'ಹರೇ ಕೃಷ್ಣ ಮಹಾಮಂತ್ರವನ್ನು ಜಪಿಸಿ, ಭಗವಂತನನ್ನು ಸ್ಮರಿಸಿ ಮತ್ತು ಪ್ರಸಾದವನ್ನು ಸ್ವೀಕರಿಸಿ. 🙏',
        storyAvailable: 'ಲೀಲೆಯ ಕಥೆ ಲಭ್ಯವಿದೆ',
        readStory: 'ಸಂಪೂರ್ಣ ಲೀಲಾ ಕಥೆಯನ್ನು ಓದಿ ➔',
        monthNames: ['ಜನವರಿ', 'ಫೆಬ್ರವರಿ', 'ಮಾರ್ಚ್', 'ಏಪ್ರಿಲ್', 'ಮೇ', 'ಜೂನ್', 'ಜುಲೈ', 'ಆಗಸ್ಟ್', 'ಸೆಪ್ಟೆಂಬರ್', 'ಅಕ್ಟೋಬರ್', 'ನವೆಂಬರ್', 'ಡಿಸೆಂಬರ್'],
        weekdays: ['ರವಿ', 'ಸೋಮ', 'ಮಂಗಳ', 'ಬುಧ', 'ಗುರು', 'ಶುಕ್ರ', 'ಶನಿ'],
    },
    ta: {
        badge: 'வைஷ்ணவ பஞ்சாங்கம் & கௌராப்த நாட்காட்டி',
        title: 'வைஷ்ணவ பக்தி நாட்காட்டி',
        subtitle: 'பகவான் ஸ்ரீ கிருஷ்ணர், ஸ்ரீ கௌராங்கர் மற்றும் வைஷ்ணவ ஆச்சார்யர்களின் அவதார தினங்கள், துல்லியமான விரத நாட்கள், ஏகாதசிகள் மற்றும் பாரணை நேரங்கள்.',
        monthlyView: 'மாதாந்திர நாட்காட்டி பார்வை',
        upcomingFeed: 'வரவிருக்கும் நிகழ்வுகள்',
        prevMonth: 'முந்தைய மாதம்',
        nextMonth: 'அடுத்த மாதம்',
        jumpToday: 'இன்றைய தேதிக்கு செல்க',
        yearFormat: (y) => `ஆண்டு ${y}`,
        legendEkadashi: 'ஏகாதசி விரதம்',
        legendAppearance: 'அவதார தினம் / திருவிழா',
        legendParana: 'பாரணை (விரத முறிவு)',
        legendGeneral: 'பொதுவான வைஷ்ணவ நிகழ்வு',
        todayBadge: 'இன்று',
        selectedDay: 'தேர்ந்தெடுக்கப்பட்ட நாள்',
        sacredEkadashi: 'புனித ஏகாதசி விரதம்',
        ekadashiInstruction: 'தானியங்கள் மற்றும் பருப்பு வகைகளைத் தவிர்த்து விரதமிருக்கவும். பகவான் ஸ்ரீ கிருஷ்ணரின் திருநாமங்களை ஜபித்து, அவரது திவ்ய லீலைகளைக் கேட்கவும்.',
        paranaTitle: 'பாரணை நேரம் (விரத முறிவு)',
        breakFastToday: (w) => `இன்றைய பாரணை நேரம்: ${w} (உள்ளூர் நேரம்)`,
        fastingRule: 'விரத விதிமுறை:',
        observancesTitle: (c) => `வைஷ்ணவ நிகழ்வுகள் & திருவிழாக்கள் (${c})`,
        regularDevotionalDay: 'வழக்கமான பக்தி நாள்.',
        regularAdvice: 'ஹரே கிருஷ்ண மஹாமந்திரத்தை ஜபியுங்கள், பகவானை நினையுங்கள், பிரசாதத்தை ஏற்றுக்கொள்ளுங்கள். 🙏',
        storyAvailable: 'கதை உள்ளது',
        readStory: 'முழுக் கதையைப் படிக்க ➔',
        monthNames: ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'],
        weekdays: ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'],
    },
    hi: {
        badge: 'वैष्णव पंचांग एवं गौराब्द कैलेंडर',
        title: 'वैष्णव भक्ति कैलेंडर',
        subtitle: 'भगवान श्री कृष्ण, श्री गौरांग एवं वैष्णव आचार्यों के आविर्भाव दिवस, सटीक उपवास तिथियां, एकादशी और पारण समय।',
        monthlyView: 'मासिक कैलेंडर दृश्य',
        upcomingFeed: 'आगामी पर्व सूची',
        prevMonth: 'पिछला महीना',
        nextMonth: 'अगला महीना',
        jumpToday: 'आज की तिथि पर जाएं',
        yearFormat: (y) => `वर्ष ${y}`,
        legendEkadashi: 'एकादशी व्रत',
        legendAppearance: 'आविर्भाव / उत्सव',
        legendParana: 'पारण (व्रत समाप्ति)',
        legendGeneral: 'सामान्य उत्सव',
        todayBadge: 'आज',
        selectedDay: 'चयनित दिवस',
        sacredEkadashi: 'पावन एकादशी उपवास',
        ekadashiInstruction: 'सभी प्रकार के अन्न और दालों से उपवास रखें। भगवान श्री कृष्ण के पावन नामों का जप करें और उनकी लीलाओं का श्रवण करें।',
        paranaTitle: 'पारण समय (उपवास समाप्ति)',
        breakFastToday: (w) => `आज पारण का समय: ${w} (स्थानीय समय)`,
        fastingRule: 'उपवास नियम:',
        observancesTitle: (c) => `उत्सव एवं पर्व (${c})`,
        regularDevotionalDay: 'सामान्य भक्ति दिवस।',
        regularAdvice: 'हरे कृष्ण महामंत्र का जप करें, भगवान का स्मरण करें और प्रसादम ग्रहण करें। 🙏',
        storyAvailable: 'कथा उपलब्ध है',
        readStory: 'संपूर्ण लीला कथा पढ़ें ➔',
        monthNames: ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'],
        weekdays: ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'],
    },
    te: {
        badge: 'వైష్ణవ పంచాంగం & గౌరాబ్ద క్యాలెండర్',
        title: 'వైష్ణవ భక్తి క్యాలెండర్',
        subtitle: 'భగవాన్ శ్రీ కృష్ణుడు, శ్రీ గౌరాంగుడు మరియు వైష్ణవ ఆచార్యుల ఆవిర్భావ దినాలు, ఉపవాస తేదీలు, ఏకాదశులు మరియు పారణ సమయాలు.',
        monthlyView: 'నెలవారీ క్యాలెండర్ వీక్షణ',
        upcomingFeed: 'రాబోయే పండుగలు',
        prevMonth: 'మునుపటి నెల',
        nextMonth: 'తరువాతి నెల',
        jumpToday: 'ఈ రోజుకు వెళ్ళండి',
        yearFormat: (y) => `సంవత్సరం ${y}`,
        legendEkadashi: 'ఏకాదశి వ్రతం',
        legendAppearance: 'ఆవిర్భావం / ఉత్సవం',
        legendParana: 'పారణ (వ్రత విరమణ)',
        legendGeneral: 'సాధారణ ఆచరణ',
        todayBadge: 'నేడు',
        selectedDay: 'ఎంచుకున్న రోజు',
        sacredEkadashi: 'పవిత్ర ఏకాదశి వ్రతం',
        ekadashiInstruction: 'ధాನ್ಯాలు మరియు పప్పు దినుసులు తీసుకోకుండా ఉపవాసం ఉండండి. భగవాన్ శ్రీ కృష్ణుని నామాలను జపించండి మరియు ఆయన లీలలను వినండి.',
        paranaTitle: 'పారణ సమయం (ఉపవాస విరమణ)',
        breakFastToday: (w) => `నేడు ఉపవాస విరమణ (పారణ): ${w} (స్థానిక సమయం)`,
        fastingRule: 'ఉపవాస నియమం:',
        observancesTitle: (c) => `ఉత్సవాలు మరియు పండుగలు (${c})`,
        regularDevotionalDay: 'సాధారణ భక్తి దినం.',
        regularAdvice: 'హరే కృష్ణ మహామంత్రాన్ని జపించండి, భగవంతుని స్మరించండి మరియు ప్రసాదాన్ని స్వీకరించండి. 🙏',
        storyAvailable: 'లీల కథ అందుబాటులో ఉంది',
        readStory: 'పూర్తి లీలా కథను చదవండి ➔',
        monthNames: ['జనవరి', 'ఫిబ్రవరి', 'మార్చి', 'ఏప్రిల్', 'మే', 'జూన్', 'జూలై', 'ఆగస్టు', 'సెప్టెంబర్', 'అక్టోబర్', 'నవంబర్', 'డిసెంబర్'],
        weekdays: ['ఆది', 'సోమ', 'మంగళ', 'బుధ', 'గురు', 'శుక్ర', 'శని'],
    },
    ml: {
        badge: 'വൈഷ്ണവ പഞ്ചാംഗവും ഗൗരാബ്ദ കലണ്ടറും',
        title: 'വൈഷ്ണവ ഭക്തി കലണ്ടർ',
        subtitle: 'ഭഗവാൻ ശ്രീ കൃഷ്ണന്റെയും ശ്രീ ഗൗരാംഗന്റെയും വൈഷ്ണവ ആചാര്യന്മാരുടെയും ആവിർഭാവ ദിനങ്ങൾ, വ്രത തീയതികൾ, ഏകാദശികൾ, പാരണ സമയങ്ങൾ.',
        monthlyView: 'പ്രതിമാസ കലണ്ടർ കാഴ്ച',
        upcomingFeed: 'വരാനിരിക്കുന്ന ഉത്സവങ്ങൾ',
        prevMonth: 'മുൻപത്തെ മാസം',
        nextMonth: 'അടുത്ത മാസം',
        jumpToday: 'ഇന്നത്തെ തീയതിയിലേക്ക്',
        yearFormat: (y) => `വർഷം ${y}`,
        legendEkadashi: 'ഏകാദശി വ്രതം',
        legendAppearance: 'ആവിർഭാവം / ഉത്സവം',
        legendParana: 'പാരണ (വ്രത സമാപനം)',
        legendGeneral: 'പൊതു ആചരണങ്ങൾ',
        todayBadge: 'ഇന്ന്',
        selectedDay: 'തിരഞ്ഞെടുത്ത ദിവസം',
        sacredEkadashi: 'പവിത്ര ഏകാദശി വ്രതം',
        ekadashiInstruction: 'ധാന്യങ്ങളും പയറുവർഗ്ഗങ്ങളും ഒഴിവാക്കി ഉപവസിക്കുക. ഭഗവാൻ ശ്രീകൃഷ്ണന്റെ തിരുനാമങ്ങൾ ജപിക്കുകയും ലീലകൾ കേൾക്കുകയും ചെയ്യുക.',
        paranaTitle: 'പാരണ സമയം (വ്രത സമാപനം)',
        breakFastToday: (w) => `ഇന്നത്തെ പാരണ സമയം: ${w} (പ്രാദേശിക സമയം)`,
        fastingRule: 'വ്രത നിയമം:',
        observancesTitle: (c) => `ആചരണങ്ങളും ഉത്സവങ്ങളും (${c})`,
        regularDevotionalDay: 'സാധാരണ ഭക്തി ദിനം.',
        regularAdvice: 'ഹരേ കൃഷ്ണ മഹാമന്ത്രം ജപിക്കുക, ഭഗവാനെ സ്മരിക്കുക, പ്രസാദം സ്വീകരിക്കുക. 🙏',
        storyAvailable: 'ലീല കഥ ലഭ്യമാണ്',
        readStory: 'മുഴുവൻ ലീല കഥ വായിക്കുക ➔',
        monthNames: ['ജനുവരി', 'ഫെബ്രുവരി', 'മാർച്ച്', 'ഏപ്രിൽ', 'മെയ്', 'ജൂൺ', 'ജൂലൈ', 'ആഗസ്റ്റ്', 'സെപ്റ്റംബർ', 'ഒക്ടോബർ', 'നവംബർ', 'ഡിസംബർ'],
        weekdays: ['ഞായർ', 'തിങ്കൾ', 'ചൊവ്വ', 'ബുധൻ', 'വ്യാഴം', 'വെള്ളി', 'ശനി'],
    },
    bn: {
        badge: 'বৈষ্ণব পঞ্জিকা ও গৌরাব্দ ক্যালেন্ডার',
        title: 'বৈষ্ণব ভক্তি ক্যালেন্ডার',
        subtitle: 'ভগবান শ্রীকৃষ্ণ, শ্রী গৌরাঙ্গ ও বৈষ্ণব আচার্যবৃন্দের আবির্ভাব তিথি, সঠিক উপবাস দিন, একাদশী ও পারণ সময়সূচি।',
        monthlyView: 'মাসিক ক্যালেন্ডার ভিউ',
        upcomingFeed: 'আসন্ন উৎসব তালিকা',
        prevMonth: 'পূর্ববর্তী মাস',
        nextMonth: 'পরবর্তী মাস',
        jumpToday: 'আজকের দিনে যান',
        yearFormat: (y) => `বছর ${y}`,
        legendEkadashi: 'একাদশী ব্রত',
        legendAppearance: 'আবির্ভাব / মহোৎসব',
        legendParana: 'পারণ (ব্রত সমাপ্তি)',
        legendGeneral: 'সাধারণ উৎসব',
        todayBadge: 'আজ',
        selectedDay: 'নির্বাচিত দিন',
        sacredEkadashi: 'পবিত্র একাদশী উপবাস',
        ekadashiInstruction: 'সকল প্রকার শস্য ও ডাল পরিহার করে উপবাস রাখুন। ভগবান শ্রীকৃষ্ণের পবিত্র নাম জপ করুন ও তাঁর লীলা শ্রবণ করুন।',
        paranaTitle: 'পারণ সময় (ব্রত সমাপ্তি)',
        breakFastToday: (w) => `আজকের পারণ সময়: ${w} (স্থানীয় সময়)`,
        fastingRule: 'উপবাসের নিয়ম:',
        observancesTitle: (c) => `উৎসব ও তিথি (${c})`,
        regularDevotionalDay: 'নিয়মিত ভক্তি দিবস।',
        regularAdvice: 'হরে কৃষ্ণ মহামন্ত্র জপ করুন, ভগবানকে স্মরণ করুন এবং প্রসাদ গ্রহণ করুন। 🙏',
        storyAvailable: 'লীলা কাহিনী উপলব্ধ',
        readStory: 'সম্পূর্ণ লীলা কাহিনী পড়ুন ➔',
        monthNames: ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'],
        weekdays: ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র', 'শনি'],
    },
};

const LOCALE_CODE_MAP: Record<string, string> = {
    kn: 'kn-IN',
    ta: 'ta-IN',
    hi: 'hi-IN',
    te: 'te-IN',
    ml: 'ml-IN',
    bn: 'bn-IN',
    en: 'en-US',
};

export default function InteractiveCalendarView() {
    const { locale } = useLanguage();
    const s = CALENDAR_STRINGS[locale] || CALENDAR_STRINGS.en;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.askharekrishna.com/api';

    const todayObj = useMemo(() => new Date(), []);
    const todayStr = useMemo(() => {
        const y = todayObj.getFullYear();
        const m = String(todayObj.getMonth() + 1).padStart(2, '0');
        const d = String(todayObj.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }, [todayObj]);

    const [currentYear, setCurrentYear] = useState<number>(todayObj.getFullYear());
    const [currentMonth, setCurrentMonth] = useState<number>(todayObj.getMonth() + 1);
    const [selectedDate, setSelectedDate] = useState<string>(todayStr);
    const [monthDays, setMonthDays] = useState<CalendarDayItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [viewMode, setViewMode] = useState<'grid' | 'feed'>('grid');

    // Fetch month data whenever currentYear, currentMonth, or locale changes
    useEffect(() => {
        let isCancelled = false;
        const fetchMonthData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(
                    `${apiBaseUrl}/vaishnava-calendar/calendar-days/?year=${currentYear}&month=${currentMonth}&lang=${locale}`
                );
                const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
                if (!isCancelled) {
                    setMonthDays(data);
                }
            } catch (err) {
                console.error('Failed to fetch calendar days:', err);
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        };

        fetchMonthData();
        return () => {
            isCancelled = true;
        };
    }, [currentYear, currentMonth, locale, apiBaseUrl]);

    // Map days by date string YYYY-MM-DD
    const daysMap = useMemo(() => {
        const map = new Map<string, CalendarDayItem>();
        for (const d of monthDays) {
            map.set(d.event_date, d);
        }
        return map;
    }, [monthDays]);

    // Navigation functions
    const handlePrevMonth = () => {
        if (currentMonth === 1) {
            setCurrentYear(prev => prev - 1);
            setCurrentMonth(12);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 12) {
            setCurrentYear(prev => prev + 1);
            setCurrentMonth(1);
        } else {
            setCurrentMonth(prev => prev + 1);
        }
    };

    const handleJumpToToday = () => {
        setCurrentYear(todayObj.getFullYear());
        setCurrentMonth(todayObj.getMonth() + 1);
        setSelectedDate(todayStr);
    };

    // Calculate grid numbers
    const totalDaysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay();

    const selectedDayData = daysMap.get(selectedDate);

    // Format display string for selected date in current locale
    const selectedFormatted = useMemo(() => {
        if (!selectedDate) return '';
        try {
            const [y, m, d] = selectedDate.split('-').map(Number);
            const dt = new Date(y, m - 1, d);
            const intlLocale = LOCALE_CODE_MAP[locale] || 'en-US';
            return dt.toLocaleDateString(intlLocale, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch {
            return selectedDate;
        }
    }, [selectedDate, locale]);

    // Deduplicate observances for the selected date
    const displayObservances = useMemo(() => {
        if (!selectedDayData?.observances) return [];

        const seen = new Set<string>();
        const result: ObservanceItem[] = [];

        for (const obs of selectedDayData.observances) {
            if (obs.category === 'Parana') {
                continue;
            }

            const title = (obs.title || '').trim();
            if (!title) continue;

            const normalizedTitle = title
                .replace(/\b(fasting\s+for|fasting|fast)\b/gi, '')
                .replace(/\s*(விரதம்|vrata|vratham|vrat|ವ್ರತ|വ്രതം)\s*/gi, '')
                .replace(/\s+/g, ' ')
                .trim()
                .toLowerCase();

            const key = obs.category === 'Ekadashi' ? 'Ekadashi' : `${obs.category}:${normalizedTitle}`;
            if (seen.has(key)) {
                continue;
            }
            seen.add(key);
            result.push(obs);
        }

        return result;
    }, [selectedDayData]);

    return (
        <div className="w-full min-h-screen pb-24">
            {/* Top Hero Banner */}
            <div className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-500/5 dark:via-neutral-900/40 dark:to-transparent pt-10 pb-8 px-4 md:px-8 border-b border-amber-500/10 dark:border-neutral-800">
                <div className="max-w-[1280px] mx-auto text-center">
                    <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1 bg-amber-500/15 dark:bg-amber-400/10 text-amber-700 dark:text-amber-400 font-bold uppercase tracking-[0.2em] text-xs rounded-full border border-amber-500/20 shadow-sm">
                        <Sparkles size={14} className="animate-spin text-amber-500" style={{ animationDuration: '6s' }} />
                        <span>{s.badge}</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text-main dark:text-white mb-3">
                        {s.title}
                    </h1>
                    <p className="text-sm md:text-base text-text-muted dark:text-neutral-400 max-w-2xl mx-auto">
                        {s.subtitle}
                    </p>

                    {/* View Switcher Toggle */}
                    <div className="mt-6 inline-flex p-1 bg-neutral-200/80 dark:bg-neutral-800/80 rounded-xl shadow-inner border border-neutral-300/60 dark:border-neutral-700">
                        <button
                            type="button"
                            onClick={() => setViewMode('grid')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 ${
                                viewMode === 'grid'
                                    ? 'bg-white dark:bg-amber-500 text-amber-900 dark:text-neutral-950 shadow-md font-bold'
                                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                            }`}
                        >
                            <CalendarDays size={16} />
                            <span>{s.monthlyView}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('feed')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 ${
                                viewMode === 'feed'
                                    ? 'bg-white dark:bg-amber-500 text-amber-900 dark:text-neutral-950 shadow-md font-bold'
                                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                            }`}
                        >
                            <ListFilter size={16} />
                            <span>{s.upcomingFeed}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* If in feed mode, render the standard UpcomingEventsSection */}
            {viewMode === 'feed' ? (
                <div className="max-w-[1280px] mx-auto">
                    <UpcomingEventsSection isHomePage={false} />
                </div>
            ) : (
                /* Interactive Grid Mode */
                <div className="max-w-[1280px] mx-auto px-4 md:px-8 mt-8">
                    {/* Controls Bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-amber-500/20 dark:border-neutral-800 shadow-sm">
                        {/* Month navigation */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handlePrevMonth}
                                className="p-2 rounded-xl bg-amber-50 dark:bg-neutral-800 text-amber-800 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-neutral-700 transition"
                                title={s.prevMonth}
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <h2 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white min-w-[180px] text-center">
                                {s.monthNames[currentMonth - 1]} {currentYear}
                            </h2>
                            <button
                                type="button"
                                onClick={handleNextMonth}
                                className="p-2 rounded-xl bg-amber-50 dark:bg-neutral-800 text-amber-800 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-neutral-700 transition"
                                title={s.nextMonth}
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        {/* Jump Controls */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleJumpToToday}
                                className="px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-white transition"
                            >
                                {s.jumpToday}
                            </button>

                            {/* Year Selector */}
                            <select
                                value={currentYear}
                                onChange={(e) => setCurrentYear(Number(e.target.value))}
                                className="px-3 py-1.5 rounded-xl text-xs md:text-sm font-semibold bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            >
                                {[2025, 2026, 2027, 2028, 2029, 2030].map(y => (
                                    <option key={y} value={y}>{s.yearFormat(y)}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap items-center justify-center gap-4 text-xs mb-6 text-neutral-600 dark:text-neutral-400 bg-amber-50/50 dark:bg-neutral-900/50 py-2.5 px-4 rounded-xl border border-amber-500/10 dark:border-neutral-800">
                        <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-sm inline-block" />
                            <span className="font-medium text-neutral-800 dark:text-neutral-200">{s.legendEkadashi}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-sm inline-block" />
                            <span className="font-medium text-neutral-800 dark:text-neutral-200">{s.legendAppearance}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-sm inline-block" />
                            <span className="font-medium text-neutral-800 dark:text-neutral-200">{s.legendParana}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded-full bg-orange-400 shadow-sm inline-block" />
                            <span className="font-medium text-neutral-800 dark:text-neutral-200">{s.legendGeneral}</span>
                        </div>
                    </div>

                    {/* Main Layout: Calendar Grid + Selected Day Details Panel */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left: 7-Day Month Grid (7 cols on lg) */}
                        <div className="lg:col-span-7 bg-white dark:bg-neutral-900 rounded-3xl p-4 md:p-6 border border-amber-500/20 dark:border-neutral-800 shadow-xl">
                            {/* Days of week header */}
                            <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 text-center text-xs md:text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider py-2">
                                {s.weekdays.map((wd, i) => (
                                    <div key={wd} className={i === 0 ? 'text-rose-500' : ''}>
                                        {wd}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Days Cells */}
                            {loading ? (
                                <div className="grid grid-cols-7 gap-2 py-12">
                                    {Array.from({ length: 35 }).map((_, i) => (
                                        <div key={i} className="h-14 md:h-18 rounded-2xl bg-neutral-100 dark:bg-neutral-800/50 animate-pulse" />
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-7 gap-1.5 md:gap-2.5">
                                    {/* Empty cells before first day */}
                                    {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                                        <div key={`empty-${i}`} className="h-14 md:h-20 rounded-2xl opacity-0 pointer-events-none" />
                                    ))}

                                    {/* Actual month days */}
                                    {Array.from({ length: totalDaysInMonth }).map((_, i) => {
                                        const dayNum = i + 1;
                                        const dStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                                        const dayData = daysMap.get(dStr);
                                        const isSelected = selectedDate === dStr;
                                        const isToday = todayStr === dStr;

                                        // Badge types
                                        const isEkadashi = dayData?.is_ekadashi;
                                        const isFastDay = dayData?.is_fast_day;
                                        const hasParana = Boolean(dayData?.break_fast_window);
                                        const hasAppearance = dayData?.observances?.some(o => o.category === 'Appearance');
                                        const hasFestival = dayData?.observances?.some(o => o.category === 'Festival');
                                        const hasObservances = (dayData?.observances?.length || 0) > 0;

                                        // Determine background accent
                                        let cellStyle = 'bg-neutral-50/80 dark:bg-neutral-800/40 hover:bg-amber-50 dark:hover:bg-neutral-800';
                                        if (isEkadashi) {
                                            cellStyle = 'bg-amber-100/70 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/60';
                                        } else if (hasAppearance || hasFestival) {
                                            cellStyle = 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/40';
                                        }

                                        return (
                                            <button
                                                type="button"
                                                key={dStr}
                                                onClick={() => setSelectedDate(dStr)}
                                                className={`relative flex flex-col items-center justify-between p-1.5 md:p-2.5 h-16 md:h-20 rounded-2xl border transition-all duration-200 text-left ${cellStyle} ${
                                                    isSelected
                                                        ? 'ring-2 ring-amber-500 shadow-lg scale-[1.03] z-10 !bg-amber-500 !text-white'
                                                        : 'border-neutral-200/70 dark:border-neutral-800'
                                                }`}
                                            >
                                                {/* Top row: day number and "Today" tag */}
                                                <div className="w-full flex items-center justify-between">
                                                    <span className={`text-xs md:text-sm font-bold ${
                                                        isSelected
                                                            ? 'text-white'
                                                            : isToday
                                                            ? 'text-amber-600 dark:text-amber-400 font-extrabold'
                                                            : 'text-neutral-800 dark:text-neutral-200'
                                                    }`}>
                                                        {dayNum}
                                                    </span>
                                                    {isToday && (
                                                        <span className={`text-[9px] px-1 py-0.2 rounded font-extrabold tracking-wider uppercase ${
                                                            isSelected ? 'bg-white/20 text-white' : 'bg-amber-500 text-white'
                                                        }`}>
                                                            {s.todayBadge}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Devotional Indicator Badges */}
                                                <div className="flex items-center gap-1 mt-auto flex-wrap justify-center w-full">
                                                    {isEkadashi && (
                                                        <span
                                                            className={`flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full font-extrabold text-[10px] shadow-sm ${
                                                                isSelected
                                                                    ? 'bg-white text-amber-600'
                                                                    : 'bg-amber-500 text-white'
                                                            }`}
                                                            title={dayData?.ekadashi_name || s.legendEkadashi}
                                                        >
                                                            🌕
                                                        </span>
                                                    )}

                                                    {!isEkadashi && (hasAppearance || hasFestival) && (
                                                        <span
                                                            className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${
                                                                isSelected ? 'bg-white' : 'bg-rose-500'
                                                            }`}
                                                            title={s.legendAppearance}
                                                        />
                                                    )}

                                                    {hasParana && (
                                                        <span
                                                            className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${
                                                                isSelected ? 'bg-emerald-200' : 'bg-emerald-500'
                                                            }`}
                                                            title={dayData?.break_fast_window ? s.breakFastToday(dayData.break_fast_window) : s.legendParana}
                                                        />
                                                    )}

                                                    {!isEkadashi && !hasAppearance && !hasFestival && hasObservances && (
                                                        <span
                                                            className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
                                                                isSelected ? 'bg-white/80' : 'bg-orange-400'
                                                            }`}
                                                        />
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Right: Selected Date Devotional Panel (5 cols on lg) */}
                        <div className="lg:col-span-5 bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-amber-500/20 dark:border-neutral-800 shadow-xl sticky top-24">
                            {/* Panel Header */}
                            <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                                <div>
                                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
                                        <CalendarIcon size={14} />
                                        <span>{s.selectedDay}</span>
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-black text-neutral-900 dark:text-white">
                                        {selectedFormatted}
                                    </h3>
                                </div>
                            </div>

                            {/* Devotional Details */}
                            <div className="mt-5 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                                {/* Ekadashi Banner */}
                                {selectedDayData?.is_ekadashi && (
                                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-2xl shadow-md">
                                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-100 mb-1">
                                            <Moon size={14} />
                                            <span>{s.sacredEkadashi}</span>
                                        </div>
                                        <h4 className="text-lg font-extrabold">
                                            {selectedDayData.ekadashi_name || s.legendEkadashi}
                                        </h4>
                                        <p className="text-xs text-amber-50 mt-1">
                                            {s.ekadashiInstruction}
                                        </p>
                                    </div>
                                )}

                                {/* Parana (Break-Fast) Timing Banner */}
                                {selectedDayData?.break_fast_window && (
                                    <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 p-3.5 rounded-2xl text-emerald-900 dark:text-emerald-300">
                                        <Sun size={24} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                                        <div>
                                            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                                                {s.paranaTitle}
                                            </div>
                                            <div className="text-sm font-extrabold">
                                                {s.breakFastToday(selectedDayData.break_fast_window)}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Fast Details Banner */}
                                {selectedDayData?.fast_details && (
                                    <div className="flex items-center gap-2.5 bg-orange-50 dark:bg-orange-950/30 border border-orange-400/30 px-3.5 py-2.5 rounded-xl text-orange-900 dark:text-orange-300 text-xs font-semibold">
                                        <Clock size={16} className="text-orange-500 shrink-0" />
                                        <span>{s.fastingRule} {selectedDayData.fast_details}</span>
                                    </div>
                                )}

                                {/* Observances List */}
                                <div className="space-y-3">
                                    <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                        {s.observancesTitle(displayObservances.length)}
                                    </h5>

                                    {displayObservances.length === 0 ? (
                                        <div className="text-center py-8 bg-neutral-50 dark:bg-neutral-800/40 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800">
                                            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                                {s.regularDevotionalDay}
                                            </p>
                                            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                                                {s.regularAdvice}
                                            </p>
                                        </div>
                                    ) : (
                                        displayObservances.map((obs) => {
                                            const hasStory = Boolean(obs.description);
                                            const cardContent = (
                                                <>
                                                    <div className="flex items-start justify-between gap-2">
                                                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400">
                                                            {obs.category}
                                                        </span>
                                                        {hasStory && (
                                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                                                                <BookOpen size={12} /> {s.storyAvailable}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h6 className="text-base font-bold text-neutral-900 dark:text-white mt-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition flex items-center justify-between gap-2">
                                                        <span>{obs.title}</span>
                                                        {hasStory && (
                                                            <ArrowUpRight size={16} className="text-amber-500 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                                        )}
                                                    </h6>

                                                    {hasStory && (
                                                        <div className="mt-2 text-xs font-semibold text-amber-600 dark:text-amber-400 group-hover:underline flex items-center gap-1">
                                                            <span>{s.readStory}</span>
                                                        </div>
                                                    )}
                                                </>
                                            );

                                            if (hasStory) {
                                                return (
                                                    <Link
                                                        key={obs.id}
                                                        href={`/vaishnava-calendar/${obs.id}?lang=${locale}`}
                                                        className="block bg-neutral-50/90 dark:bg-neutral-800/60 p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 hover:border-amber-500 hover:shadow-md transition-all group cursor-pointer"
                                                    >
                                                        {cardContent}
                                                    </Link>
                                                );
                                            }

                                            return (
                                                <div
                                                    key={obs.id}
                                                    className="bg-neutral-50/90 dark:bg-neutral-800/60 p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800"
                                                >
                                                    {cardContent}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
