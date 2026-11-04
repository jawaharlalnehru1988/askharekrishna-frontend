'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
    Baby,
    Sparkles,
    Search,
    X,
    Home,
    Heart,
    BookOpen,
    Copy,
    Check,
    ScrollText,
    Flame,
    Filter,
    Layers,
    UserCheck,
    CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '../providers/LanguageContext';
import {
    BABY_NAMES_DATA,
    BabyNameItem,
    DeityCategory,
    GenderCategory,
    getAvailablePrefixes,
} from '@/data/babyNamesData';

const UI_LABELS: Record<string, {
    home: string;
    sectionTitle: string;
    sectionBadge: string;
    sectionSubtitle: string;
    searchPlaceholder: string;
    prefixSearchPlaceholder: string;
    filterByLength: string;
    char1Mode: string;
    char2Mode: string;
    char3Mode: string;
    allPrefixes: string;
    genderFilter: string;
    allGenders: string;
    boys: string;
    girls: string;
    deityFilter: string;
    allDeities: string;
    deityKrishna: string;
    deityVishnu: string;
    deityRadha: string;
    deityLakshmi: string;
    deityRama: string;
    deityChaitanya: string;
    resultsFound: string;
    noResultsTitle: string;
    noResultsDesc: string;
    clearFilters: string;
    copyBtn: string;
    copiedBtn: string;
    sourceLabel: string;
    shastraTitle: string;
    shastraQuote: string;
    shastraRef: string;
}> = {
    en: {
        home: 'Home',
        sectionTitle: 'Vedic & Vaishnava Baby Names',
        sectionBadge: '100% Shastric Divine Names',
        sectionSubtitle: 'Discover sacred, transcendental names of Bhagavan Sri Krishna, Sri Vishnu, Goddess Lakshmi, and Srimati Radharani for newborn children, complete with authentic scriptural meanings and multi-character prefix filters.',
        searchPlaceholder: 'Search name, meaning, or scripture...',
        prefixSearchPlaceholder: 'Type 1, 2, or 3 starting letters (e.g. Kr, Rad, Gov, Lak)...',
        filterByLength: 'Filter by Starting Characters:',
        char1Mode: '1 Letter (A-Z)',
        char2Mode: '2 Letters (Prefix)',
        char3Mode: '3 Letters (Prefix)',
        allPrefixes: 'All Letters',
        genderFilter: 'Gender:',
        allGenders: 'All',
        boys: 'Boys (Bālaka)',
        girls: 'Girls (Bālikā)',
        deityFilter: 'Deity:',
        allDeities: 'All Deities',
        deityKrishna: 'Sri Krishna',
        deityVishnu: 'Sri Vishnu / Narayana',
        deityRadha: 'Srimati Radharani',
        deityLakshmi: 'Goddess Lakshmi',
        deityRama: 'Lord Rama',
        deityChaitanya: 'Sri Chaitanya',
        resultsFound: 'Divine Names Found',
        noResultsTitle: 'No Divine Names Found',
        noResultsDesc: 'Try adjusting your starting letters, clearing your search query, or selecting different deity/gender filters.',
        clearFilters: 'Clear All Filters',
        copyBtn: 'Copy Name & Meaning',
        copiedBtn: 'Copied!',
        sourceLabel: 'Scriptural Pramana:',
        shastraTitle: 'The Shastric Importance of Naming Children (Nama-karana Samskara)',
        shastraQuote: 'In Vedic culture, children are always given transcendental names of Bhagavan or His eternal associates. As revealed in the history of Ajamila, calling even unintentionally the holy name of Narayana removes mountains of sins and bestows spiritual liberation.',
        shastraRef: 'Srimad-Bhagavatam, Canto 6, Chapter 1 & 2 (Srila Prabhupada Purport)',
    },
    ta: {
        home: 'முகப்பு',
        sectionTitle: 'குழந்தைகளுக்கான தெய்வீகப் பெயர்கள்',
        sectionBadge: '100% சாஸ்திரத் திருநாமங்கள்',
        sectionSubtitle: 'ஸ்ரீ கிருஷ்ணர், விஷ்ணு, லக்ஷ்மி தேவி மற்றும் ஸ்ரீமதி ராதாராணியின் மங்களகரமான திருநாமங்கள்; பிறந்த ஆண் மற்றும் பெண் குழந்தைகளுக்கான ஆன்மீக அர்த்தங்கள் மற்றும் எழுத்து வாரியான வடிகட்டிகள்.',
        searchPlaceholder: 'பெயர், அர்த்தம் அல்லது சாஸ்திரத்தைத் தேடுக...',
        prefixSearchPlaceholder: 'தொடக்க எழுத்துகளைத் தட்டச்சு செய்க (எ.கா: Kr, Rad, Gov, Lak)...',
        filterByLength: 'தொடக்க எழுத்துகளின்படி வடிகட்டுக:',
        char1Mode: '1 எழுத்து (A-Z)',
        char2Mode: '2 எழுத்துகள்',
        char3Mode: '3 எழுத்துகள்',
        allPrefixes: 'அனைத்து எழுத்துகளும்',
        genderFilter: 'பாலினம்:',
        allGenders: 'அனைத்தும்',
        boys: 'ஆண் குழந்தை',
        girls: 'பெண் குழந்தை',
        deityFilter: 'தெய்வம்:',
        allDeities: 'அனைத்து தெய்வங்கள்',
        deityKrishna: 'ஸ்ரீ கிருஷ்ணர்',
        deityVishnu: 'ஸ்ரீ விஷ்ணு / நாராயணர்',
        deityRadha: 'ஸ்ரீமதி ராதாராணி',
        deityLakshmi: 'லக்ஷ்மி தேவி',
        deityRama: 'ஸ்ரீ ராமர்',
        deityChaitanya: 'ஸ்ரீ சைதன்யர்',
        resultsFound: 'தெய்வீகப் பெயர்கள் உள்ளன',
        noResultsTitle: 'பெயர்கள் எதுவும் காணப்படவில்லை',
        noResultsDesc: 'உங்கள் தேடல் அளவுகோல்களை மாற்றி அல்லது வடிகட்டிகளை மீட்டமைத்து மீண்டும் முயற்சிக்கவும்.',
        clearFilters: 'அனைத்து வடிகட்டிகளையும் நீக்குக',
        copyBtn: 'பெயர் & அர்த்தத்தை நகலெடுக்க',
        copiedBtn: 'நகலெடுக்கப்பட்டது!',
        sourceLabel: 'சாஸ்திர பிரமாணம்:',
        shastraTitle: 'குழந்தைகளுக்குத் திருநாமம் சூட்டுவதன் சாஸ்திர முக்கியத்துவம் (நாமகரண சம்ஸ்காரம்)',
        shastraQuote: 'வேத கலாச்சாரத்தில் குழந்தைகளுக்கு எப்போதும் பகவானின் திவ்ய திருநாமங்களே சூட்டப்படுகின்றன. அஜாமிளனின் சரித்திரத்தில் விவரிக்கப்பட்டுள்ளபடி, நாராயணனின் திருநாமத்தை அறியாமல் உச்சரித்தாலும் அது பாபங்களை அழித்து முக்தியளிக்கும்.',
        shastraRef: 'ஸ்ரீமத் பாகவதம், ஸ்கந்தம் 6, அத்தியாயம் 1 & 2 (ஸ்ரீல பிரபுபாதரின் உரை)',
    },
    hi: {
        home: 'गृह',
        sectionTitle: 'वैदिक एवं वैष्णव बाल नाम',
        sectionBadge: '100% शास्त्रसम्मत पावन नाम',
        sectionSubtitle: 'भगवान श्री कृष्ण, विष्णु, लक्ष्मी देवी एवं श्रीमति राधा रानी के मंगलकारी दिव्य नाम; नवजात बालकों एवं बालिकाओं हेतु प्रामाणिक आध्यात्मिक अर्थ एवं अक्षराधारित फ़िल्टर।',
        searchPlaceholder: 'नाम, अर्थ अथवा शास्त्र खोजें...',
        prefixSearchPlaceholder: 'प्रारंभिक 1, 2 या 3 अक्षर टाइप करें (जैसे Kr, Rad, Gov, Lak)...',
        filterByLength: 'प्रारंभिक अक्षरों द्वारा फ़िल्टर करें:',
        char1Mode: '1 अक्षर (A-Z)',
        char2Mode: '2 अक्षर',
        char3Mode: '3 अक्षर',
        allPrefixes: 'सभी अक्षर',
        genderFilter: 'लिंग:',
        allGenders: 'सभी',
        boys: 'बालक',
        girls: 'बालिका',
        deityFilter: 'देवता / स्वरूप:',
        allDeities: 'सभी स्वरूप',
        deityKrishna: 'श्री कृष्ण',
        deityVishnu: 'श्री विष्णु / नारायण',
        deityRadha: 'श्रीमती राधा रानी',
        deityLakshmi: 'लक्ष्मी देवी',
        deityRama: 'श्री राम',
        deityChaitanya: 'श्री चैतन्य',
        resultsFound: 'दिव्य नाम उपलब्ध हैं',
        noResultsTitle: 'कोई नाम नहीं मिला',
        noResultsDesc: 'कृपया प्रारंभिक अक्षरों अथवा फ़िल्टर को बदलकर पुनः प्रयास करें।',
        clearFilters: 'सभी फ़िल्टर साफ़ करें',
        copyBtn: 'नाम व अर्थ कॉपी करें',
        copiedBtn: 'कॉपी हो गया!',
        sourceLabel: 'शास्त्रीय प्रमाण:',
        shastraTitle: 'बच्चों के नामकरण का शास्त्रीय महत्त्व (नामकरण संस्कार)',
        shastraQuote: 'वैदिक संस्कृति में संतानों को सदैव भगवान अथवा उनके नित्य परिकरों के दिव्य नाम दिए जाते हैं। अजामिल के आख्यान से स्पष्ट है कि नारायण नाम का अनजाने में भी उच्चारण समस्त पापों को नष्ट कर परम गति प्रदान करता है।',
        shastraRef: 'श्रीमद्भागवतम्, स्कंध 6, अध्याय 1 व 2 (श्रील प्रभुपाद तात्पर्य)',
    },
    te: {
        home: 'గృహం',
        sectionTitle: 'వైదిక మరియు వైష్ణవ శిశు నామాలు',
        sectionBadge: '100% శాస్త్రీయ దివ్య నామాలు',
        sectionSubtitle: 'శ్రీకృష్ణుడు, విష్ణువు, లక్ష్మీదేవి మరియు రాధారాణిల పవిత్ర దివ్య నామాలు; నవజాత శిశువుల కోసం శాస్త్రీయ ఆధ్యాత్మిక అర్థాలు మరియు అక్షర ఫిల్టర్లు.',
        searchPlaceholder: 'పేరు, అర్థం లేదా శాస్త్రాన్ని వెతకండి...',
        prefixSearchPlaceholder: 'మొదటి 1, 2 లేదా 3 అక్షరాలను టైప్ చేయండి (ఉదా: Kr, Rad, Gov)...',
        filterByLength: 'ప్రారంభ అక్షరాల ఆధారంగా ఫిల్టర్ చేయండి:',
        char1Mode: '1 అక్షరం (A-Z)',
        char2Mode: '2 అక్షరాలు',
        char3Mode: '3 అక్షరాలు',
        allPrefixes: 'అన్ని అక్షరాలు',
        genderFilter: 'లింగము:',
        allGenders: 'అన్ని',
        boys: 'బాలురు',
        girls: 'బాలికలు',
        deityFilter: 'దేవతా స్వరూపం:',
        allDeities: 'అన్ని స్వరూపాలు',
        deityKrishna: 'శ్రీ కృష్ణుడు',
        deityVishnu: 'శ్రీ విష్ణు / నారాయణ',
        deityRadha: 'శ్రీమతి రాధారాణి',
        deityLakshmi: 'లక్ష్మీ దేవి',
        deityRama: 'శ్రీ రాముడు',
        deityChaitanya: 'శ్రీ చైతన్యుడు',
        resultsFound: 'దివ్య నామాలు లభించాయి',
        noResultsTitle: 'నామాలు ఏవీ లభించలేదు',
        noResultsDesc: 'మీ శోధన ప్రమాణాలను సవరించి మళ్లీ ప్రయత్నించండి.',
        clearFilters: 'అన్ని ఫిల్టర్లను తొలగించండి',
        copyBtn: 'పేరు & అర్థాన్ని కాపీ చేయండి',
        copiedBtn: 'కాపీ చేయబడింది!',
        sourceLabel: 'శాస్త్ర ప్రమాణం:',
        shastraTitle: 'నామకరణ సంస్కార విశిష్టత (శాస్త్రీయ ప్రాముఖ్యత)',
        shastraQuote: 'వైదిక సంస్కృతిలో పిల్లలకు భగవంతుని దివ్య నామాలను పెట్టడం ఆచారం. అజామిళుని కథ నిరూపించినట్లుగా, భగవన్నామ స్మరణ సమస్త పాపాలను హరిస్తుంది.',
        shastraRef: 'శ్రీమద్భాగవతం, స్కంధం 6, అధ్యాయం 1 & 2 (శ్రీల ప్రభుపాద తాత్పర్యం)',
    },
    kn: {
        home: 'ಮುಖಪುಟ',
        sectionTitle: 'ವೈದಿಕ ಮತ್ತು ವೈಷ್ಣವ ಶಿಶು ನಾಮಗಳು',
        sectionBadge: '100% ಶಾಸ್ತ್ರೋಕ್ತ ದಿವ್ಯ ನಾಮಗಳು',
        sectionSubtitle: 'ಶ್ರೀಕೃಷ್ಣ, ವಿಷ್ಣು, ಮಹಾಲಕ್ಷ್ಮಿ ಮತ್ತು ರಾಧಾರಾಣಿಯವರ ಮಂಗಳಕರ ದಿವ್ಯ ನಾಮಗಳು; ನವಜಾತ ಗಂಡು ಮತ್ತು ಹೆಣ್ಣು ಮಕ್ಕಳಿಗೆ ಶಾಸ್ತ್ರೀಯ ಆಧ್ಯಾತ್ಮಿಕ ಅರ್ಥಗಳು ಹಾಗೂ ಅಕ್ಷರ ಫಿಲ್ಟರ್‌ಗಳು.',
        searchPlaceholder: 'ಹೆಸರು, ಅರ್ಥ ಅಥವಾ ಶಾಸ್ತ್ರವನ್ನು ಹುಡುಕಿ...',
        prefixSearchPlaceholder: 'ಮೊದಲ 1, 2 ಅಥವಾ 3 ಅಕ್ಷರಗಳನ್ನು ಟೈಪ್ ಮಾಡಿ (ಉದಾ: Kr, Rad, Gov)...',
        filterByLength: 'ಆರಂಭಿಕ ಅಕ್ಷರಗಳ ಆಧಾರದಲ್ಲಿ ಫಿಲ್ಟರ್ ಮಾಡಿ:',
        char1Mode: '1 ಅಕ್ಷರ (A-Z)',
        char2Mode: '2 ಅಕ್ಷರಗಳು',
        char3Mode: '3 ಅಕ್ಷರಗಳು',
        allPrefixes: 'ಎಲ್ಲಾ ಅಕ್ಷರಗಳು',
        genderFilter: 'ಲಿಂಗ:',
        allGenders: 'ಎಲ್ಲವೂ',
        boys: 'ಗಂಡು ಮಗು',
        girls: 'ಹೆಣ್ಣು ಮಗು',
        deityFilter: 'ದೇವರ ಸ್ವರೂಪ:',
        allDeities: 'ಎಲ್ಲಾ ಸ್ವರೂಪಗಳು',
        deityKrishna: 'ಶ್ರೀ ಕೃಷ್ಣ',
        deityVishnu: 'ಶ್ರೀ ವಿಷ್ಣು / ನಾರಾಯಣ',
        deityRadha: 'ಶ್ರೀಮತಿ ರಾಧಾರಾಣಿ',
        deityLakshmi: 'ಮಹಾಲಕ್ಷ್ಮಿ',
        deityRama: 'ಶ್ರೀ ರಾಮ',
        deityChaitanya: 'ಶ್ರೀ ಚೈತನ್ಯ',
        resultsFound: 'ದಿವ್ಯ ನಾಮಗಳು ಲಭ್ಯವಿವೆ',
        noResultsTitle: 'ಯಾವುದೇ ಹೆಸರುಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
        noResultsDesc: 'ದಯವಿಟ್ಟು ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಬದಲಿಸಿ ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.',
        clearFilters: 'ಎಲ್ಲಾ ಫಿಲ್ಟರ್‌ಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ',
        copyBtn: 'ಹೆಸರು ಮತ್ತು ಅರ್ಥವನ್ನು ನಕಲಿಸಿ',
        copiedBtn: 'ನಕಲಿಸಲಾಗಿದೆ!',
        sourceLabel: 'ಶಾಸ್ತ್ರ ಪ್ರಮಾಣ:',
        shastraTitle: 'ಮಕ್ಕಳಿಗೆ ನಾಮಕರಣ ಮಾಡುವ ಶಾಸ್ತ್ರೀಯ ಮಹತ್ವ (ನಾಮಕರಣ ಸಂಸ್ಕಾರ)',
        shastraQuote: 'ವೈದಿಕ ಸಂಸ್ಕೃತಿಯಲ್ಲಿ ಮಕ್ಕಳಿಗೆ ಸದಾ ಭಗವಂತನ ದಿವ್ಯ ನಾಮಗಳನ್ನೇ ಇಡಲಾಗುತ್ತದೆ. ಅಜಾಮಿಳನ ಇತಿಹಾಸದಲ್ಲಿ ತಿಳಿಸಿದಂತೆ, ನಾರಾಯಣ ನಾಮಸ್ಮರಣೆಯು ಮುಕ್ತಿಯನ್ನು ಕರುಣಿಸುತ್ತದೆ.',
        shastraRef: 'ಶ್ರೀಮದ್ಭಾಗವತ, ಸ್ಕಂಧ 6, ಅಧ್ಯಾಯ 1 ಮತ್ತು 2 (ಶ್ರೀಲ ಪ್ರಭುಪಾದರ ಭಾವಾರ್ಥ)',
    },
    ml: {
        home: 'മുഖം',
        sectionTitle: 'വൈദിക വൈഷ്ണവ ശിശു നാമങ്ങൾ',
        sectionBadge: '100% ശാസ്ത്രീയ ദിവ്യ നാമങ്ങൾ',
        sectionSubtitle: 'ശ്രീകൃഷ്ണൻ, വിഷ്ണു, ലക്ഷ്മീദേവി, രാധാറാണി എന്നിവരുടെ പുണ്യ നാമങ്ങൾ; നവജാത ശിശുക്കൾക്കായി ആത്മീയ അർത്ഥങ്ങളും അക്ഷരാടിസ്ഥാനത്തിലുള്ള ഫിൽട്ടറുകളും.',
        searchPlaceholder: 'പേര്, അർത്ഥം, ശാസ്ത്രം എന്നിവ തിരയുക...',
        prefixSearchPlaceholder: 'ആദ്യ 1, 2 അല്ലെങ്കിൽ 3 അക്ഷരങ്ങൾ ടൈപ്പ് ചെയ്യുക (ഉദാ: Kr, Rad, Gov)...',
        filterByLength: 'ആദ്യക്ഷരങ്ങൾ അനുസരിച്ച് ഫിൽട്ടർ ചെയ്യുക:',
        char1Mode: '1 അക്ഷരം (A-Z)',
        char2Mode: '2 അക്ഷരങ്ങൾ',
        char3Mode: '3 അക്ഷരങ്ങൾ',
        allPrefixes: 'എല്ലാ അക്ഷരങ്ങളും',
        genderFilter: 'ലിംഗഭേദം:',
        allGenders: 'എല്ലാം',
        boys: 'ആൺകുട്ടി',
        girls: 'പെൺകുട്ടി',
        deityFilter: 'ഭഗവദ് സ്വരൂപം:',
        allDeities: 'എല്ലാ സ്വരൂപങ്ങളും',
        deityKrishna: 'ശ്രീ കൃഷ്ണൻ',
        deityVishnu: 'ശ്രീ വിഷ്ണു / നാരായണൻ',
        deityRadha: 'ശ്രീമതി രാധാറാണി',
        deityLakshmi: 'ലക്ഷ്മീദേവി',
        deityRama: 'ശ്രീ രാമൻ',
        deityChaitanya: 'ശ്രീ ചൈതന്യൻ',
        resultsFound: 'ദിവ്യ നാമങ്ങൾ കണ്ടെത്തി',
        noResultsTitle: 'നാമങ്ങൾ ഒന്നും കണ്ടെത്താനായില്ല',
        noResultsDesc: 'ഫിൽട്ടറുകൾ മാറ്റി വീണ്ടും ശ്രമിക്കുക.',
        clearFilters: 'ഫിൽട്ടറുകൾ നീക്കം ചെയ്യുക',
        copyBtn: 'പേരും അർത്ഥവും പകർത്തുക',
        copiedBtn: 'പകർത്തി!',
        sourceLabel: 'ശാസ്ത്ര പ്രമാണം:',
        shastraTitle: 'നാമകരണ സംസ്കാരത്തിന്റെ ശാസ്ത്രീയ പ്രാധാന്യം',
        shastraQuote: 'വൈദിക സംസ്കാരത്തിൽ കുഞ്ഞുങ്ങൾക്ക് എപ്പോഴും ഭഗവാന്റെ ദിവ്യനാമങ്ങളാണ് നൽകുന്നത്. അജാമിളന്റെ ചരിത്രം വ്യക്തമാക്കുന്നത് പോലെ നാരായണ നാമം മോക്ഷം നൽകുന്നു.',
        shastraRef: 'ശ്രീമദ്ഭാഗവതം, സ്കന്ധം 6, അധ്യായം 1 & 2 (ശ്രീല പ്രഭുപദ ഭാഷ്യം)',
    },
    bn: {
        home: 'মূলপাতা',
        sectionTitle: 'বৈদিক ও বৈষ্ণব শিশুর পবিত্র নাম',
        sectionBadge: '১০০% শাস্ত্রীয় পরম পবিত্র নাম',
        sectionSubtitle: 'ভগবান শ্রীকৃষ্ণ, শ্রীবিষ্ণু, লক্ষ্মীদেবী ও শ্রীমতী রাধারাণীর পরম কল্যাণময় অপ্রাকৃত নাম; নবজাতক বালক ও বালিকাদের জন্য প্রামাণিক শাস্ত্রীয় অর্থ ও আদ্যক্ষর ভিত্তিক ফিল্টার।',
        searchPlaceholder: 'নাম, অর্থ বা শাস্ত্রীয় সূত্র অনুসন্ধান করুন...',
        prefixSearchPlaceholder: 'প্রথম ১, ২ বা ৩টি অক্ষর টাইপ করুন (যেমন Kr, Rad, Gov, Lak)...',
        filterByLength: 'আদ্যক্ষরের ভিত্তিতে ফিল্টার করুন:',
        char1Mode: '১টি অক্ষর (A-Z)',
        char2Mode: '২টি অক্ষর',
        char3Mode: '৩টি অক্ষর',
        allPrefixes: 'সকল অক্ষর',
        genderFilter: 'লিঙ্গ:',
        allGenders: 'সকল',
        boys: 'বালক',
        girls: 'বালিকা',
        deityFilter: 'স্বরূপ / দেবতা:',
        allDeities: 'সকল স্বরূপ',
        deityKrishna: 'শ্রীকৃষ্ণ',
        deityVishnu: 'শ্রীবিষ্ণু / নারায়ণ',
        deityRadha: 'শ্রীমতী রাধারাণী',
        deityLakshmi: 'লক্ষ্মীদেবী',
        deityRama: 'শ্রীরাম',
        deityChaitanya: 'শ্রীচৈতন্য',
        resultsFound: 'টি পবিত্র নাম পাওয়া গেছে',
        noResultsTitle: 'কোনো নাম পাওয়া যায়নি',
        noResultsDesc: 'অনুগ্রহ করে অনুসন্ধানের অক্ষর পরিবর্তন করুন বা ফিল্টার রিসেট করুন।',
        clearFilters: 'সকল ফিল্টার মুছুন',
        copyBtn: 'নাম ও অর্থ কপি করুন',
        copiedBtn: 'কপি করা হয়েছে!',
        sourceLabel: 'শাস্ত্রীয় প্রমাণ:',
        shastraTitle: 'শিশুদের নামকরণের শাস্ত্রীয় তাৎপর্য (নামকরণ সংস্কার)',
        shastraQuote: 'বৈদিক সংস্কৃতিতে শিশুদের সর্বদা ভগবান ও তাঁর অপ্রাকৃত নিত্য পরিকরদের পবিত্র নাম রাখা হয়। অজামিলের ইতিহাসে দৃষ্ট হয় যে, অজ্ঞাতসারেও নারায়ণ নাম উচ্চারণে পরম মুক্তি লাভ হয়।',
        shastraRef: 'শ্রীমদ্ভাগবত, ষষ্ঠ স্কন্ধ, প্রথম ও দ্বিতীয় অধ্যায় (শ্রীল প্রভুপাদের তাৎপর্য)',
    },
};

export default function BabyNamesSection() {
    const { locale } = useLanguage();
    const l = UI_LABELS[locale] || UI_LABELS.en;

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGender, setSelectedGender] = useState<GenderCategory | 'all'>('all');
    const [selectedDeity, setSelectedDeity] = useState<DeityCategory | 'all'>('all');
    const [prefixLengthMode, setPrefixLengthMode] = useState<1 | 2 | 3>(1);
    const [selectedPrefix, setSelectedPrefix] = useState<string>('all');
    const [customPrefixInput, setCustomPrefixInput] = useState<string>('');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Compute available prefixes based on active length mode
    const availablePrefixes = useMemo(() => {
        return getAvailablePrefixes(prefixLengthMode, BABY_NAMES_DATA);
    }, [prefixLengthMode]);

    // Filter names based on all criteria
    const filteredNames = useMemo(() => {
        return BABY_NAMES_DATA.filter((item) => {
            // Gender filter
            if (selectedGender !== 'all' && item.gender !== selectedGender) return false;

            // Deity filter
            if (selectedDeity !== 'all' && item.deity !== selectedDeity) return false;

            // Character prefix pill filter
            if (selectedPrefix !== 'all') {
                if (prefixLengthMode === 1 && item.char1.toUpperCase() !== selectedPrefix.toUpperCase()) return false;
                if (prefixLengthMode === 2 && item.char2.toLowerCase() !== selectedPrefix.toLowerCase()) return false;
                if (prefixLengthMode === 3 && item.char3.toLowerCase() !== selectedPrefix.toLowerCase()) return false;
            }

            // Custom prefix typing input (supports 1, 2, or 3+ chars)
            if (customPrefixInput.trim()) {
                const pre = customPrefixInput.trim().toLowerCase();
                if (!item.name.toLowerCase().startsWith(pre)) return false;
            }

            // General search query (searches in name, devanagari, tamil, meaning, and source)
            if (searchQuery.trim()) {
                const q = searchQuery.trim().toLowerCase();
                const inName = item.name.toLowerCase().includes(q);
                const inDeva = item.devanagari.toLowerCase().includes(q);
                const inTamil = item.tamil.toLowerCase().includes(q);
                const currentMeaning = item.meaning[locale as keyof typeof item.meaning] || item.meaning.en;
                const inMeaning = currentMeaning.toLowerCase().includes(q);
                const inSource = item.source.toLowerCase().includes(q);
                if (!inName && !inDeva && !inTamil && !inMeaning && !inSource) return false;
            }

            return true;
        });
    }, [selectedGender, selectedDeity, selectedPrefix, prefixLengthMode, customPrefixInput, searchQuery, locale]);

    const handleCopy = (item: BabyNameItem) => {
        const meaning = item.meaning[locale as keyof typeof item.meaning] || item.meaning.en;
        const textToCopy = `${item.name} (${item.devanagari} / ${item.tamil})\nMeaning: ${meaning}\nSource: ${item.source}`;
        navigator.clipboard.writeText(textToCopy);
        setCopiedId(item.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleClearAll = () => {
        setSearchQuery('');
        setSelectedGender('all');
        setSelectedDeity('all');
        setSelectedPrefix('all');
        setCustomPrefixInput('');
    };

    const hasActiveFilters = searchQuery || selectedGender !== 'all' || selectedDeity !== 'all' || selectedPrefix !== 'all' || customPrefixInput;

    return (
        <div className="w-full bg-background-light dark:bg-background-dark pt-6 pb-20 transition-colors duration-200">
            <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                {/* Breadcrumbs */}
                <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs md:text-sm text-text-muted mb-6 flex-wrap">
                    <Link href="/" className="hover:text-pink-600 flex items-center gap-1 transition-colors">
                        <Home size={14} />
                        <span>{l.home}</span>
                    </Link>
                    <span>/</span>
                    <span className="font-semibold text-text-main dark:text-white">
                        {l.sectionTitle}
                    </span>
                </nav>

                {/* Hero Banner */}
                <div className="relative rounded-3xl overflow-hidden mb-10 border border-pink-500/20 bg-gradient-to-br from-pink-500/[0.12] via-rose-500/[0.06] to-amber-900/[0.15] dark:from-pink-950/40 dark:via-neutral-900 dark:to-neutral-950 p-6 sm:p-8 md:p-12 shadow-sm">
                    {/* Background glow circle */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-pink-400/20 via-rose-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/20 text-pink-800 dark:text-pink-300 font-bold uppercase tracking-wider text-[11px] rounded-full border border-pink-500/30 mb-4 shadow-sm">
                                <Sparkles size={13} className="text-pink-600 dark:text-pink-400" />
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
                        <div className="shrink-0 size-20 md:size-28 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-amber-600 text-white flex flex-col items-center justify-center shadow-xl shadow-pink-500/25">
                            <Baby size={38} className="mb-1" />
                            <span className="text-[10px] font-bold tracking-widest uppercase">Nama</span>
                        </div>
                    </div>

                    {/* Shastric Wisdom Box */}
                    <div className="mt-8 pt-6 border-t border-pink-500/20">
                        <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-neutral-900/70 border border-pink-500/20 text-xs sm:text-sm shadow-sm flex items-start gap-3.5">
                            <ScrollText size={20} className="text-pink-600 dark:text-pink-400 shrink-0 mt-0.5" />
                            <div>
                                <h2 className="font-bold text-neutral-800 dark:text-neutral-200 mb-1 flex items-center gap-2">
                                    <span>{l.shastraTitle}</span>
                                    <span className="px-2 py-0.5 rounded-md bg-pink-500/15 text-pink-700 dark:text-pink-300 text-[10px] uppercase font-mono font-bold">Pramana</span>
                                </h2>
                                <p className="text-neutral-600 dark:text-neutral-300 italic mb-1.5 leading-relaxed">
                                    &ldquo;{l.shastraQuote}&rdquo;
                                </p>
                                <span className="text-[11px] font-semibold text-pink-700 dark:text-pink-400">
                                    — {l.shastraRef}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Interactive Character Filters Card */}
                <div className="rounded-3xl p-5 sm:p-7 bg-white dark:bg-[#1f1a12] border border-neutral-200/90 dark:border-neutral-800 shadow-sm mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-neutral-200/70 dark:border-neutral-800">
                        <div className="flex items-center gap-2">
                            <Filter size={18} className="text-pink-600 dark:text-pink-400" />
                            <h2 className="text-sm sm:text-base font-black text-text-main dark:text-white">
                                {l.filterByLength}
                            </h2>
                        </div>

                        {/* Character Mode Buttons: 1, 2, or 3 characters */}
                        <div className="inline-flex rounded-xl bg-neutral-100 dark:bg-neutral-800 p-1 border border-neutral-200/60 dark:border-neutral-700">
                            <button
                                onClick={() => {
                                    setPrefixLengthMode(1);
                                    setSelectedPrefix('all');
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    prefixLengthMode === 1
                                        ? 'bg-pink-600 text-white shadow-sm'
                                        : 'text-neutral-600 dark:text-neutral-300 hover:text-pink-600'
                                }`}
                            >
                                {l.char1Mode}
                            </button>
                            <button
                                onClick={() => {
                                    setPrefixLengthMode(2);
                                    setSelectedPrefix('all');
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    prefixLengthMode === 2
                                        ? 'bg-pink-600 text-white shadow-sm'
                                        : 'text-neutral-600 dark:text-neutral-300 hover:text-pink-600'
                                }`}
                            >
                                {l.char2Mode}
                            </button>
                            <button
                                onClick={() => {
                                    setPrefixLengthMode(3);
                                    setSelectedPrefix('all');
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    prefixLengthMode === 3
                                        ? 'bg-pink-600 text-white shadow-sm'
                                        : 'text-neutral-600 dark:text-neutral-300 hover:text-pink-600'
                                }`}
                            >
                                {l.char3Mode}
                            </button>
                        </div>
                    </div>

                    {/* Direct Prefix Typing Input */}
                    <div className="mb-4">
                        <div className="relative max-w-lg">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <input
                                type="text"
                                value={customPrefixInput}
                                onChange={(e) => setCustomPrefixInput(e.target.value)}
                                placeholder={l.prefixSearchPlaceholder}
                                className="w-full pl-9 pr-9 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm text-text-main dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-pink-500/40"
                            />
                            {customPrefixInput && (
                                <button
                                    onClick={() => setCustomPrefixInput('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Prefix Pills Grid */}
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap max-h-48 overflow-y-auto pr-1">
                        <button
                            onClick={() => setSelectedPrefix('all')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                selectedPrefix === 'all'
                                    ? 'bg-pink-600 text-white shadow-sm'
                                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-pink-50 dark:hover:bg-neutral-700 border border-neutral-200/60 dark:border-neutral-700'
                            }`}
                        >
                            {l.allPrefixes} ({BABY_NAMES_DATA.length})
                        </button>

                        {availablePrefixes.map((item) => (
                            <button
                                key={item.prefix}
                                onClick={() => setSelectedPrefix(item.prefix)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                                    selectedPrefix === item.prefix
                                        ? 'bg-pink-600 text-white shadow-sm'
                                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-pink-50 dark:hover:bg-neutral-700 border border-neutral-200/60 dark:border-neutral-700'
                                }`}
                            >
                                <span>{item.prefix}</span>
                                <span className={`text-[10px] font-mono px-1 py-0.2 rounded ${
                                    selectedPrefix === item.prefix
                                        ? 'bg-white/20 text-white'
                                        : 'bg-neutral-200/70 dark:bg-neutral-700/70 text-neutral-500 dark:text-neutral-400'
                                }`}>
                                    {item.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Secondary Filters Bar: Gender, Deity & Full Text Search */}
                <div className="rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#1f1a12] border border-neutral-200/90 dark:border-neutral-800 shadow-sm mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    {/* Gender Filters */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider shrink-0 mr-1">
                            {l.genderFilter}
                        </span>
                        <button
                            onClick={() => setSelectedGender('all')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                selectedGender === 'all'
                                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm'
                                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
                            }`}
                        >
                            {l.allGenders}
                        </button>
                        <button
                            onClick={() => setSelectedGender('boy')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                selectedGender === 'boy'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 border border-blue-200 dark:border-blue-900/50'
                            }`}
                        >
                            <Baby size={13} />
                            <span>{l.boys}</span>
                        </button>
                        <button
                            onClick={() => setSelectedGender('girl')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                selectedGender === 'girl'
                                    ? 'bg-rose-600 text-white shadow-sm'
                                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 border border-rose-200 dark:border-rose-900/50'
                            }`}
                        >
                            <Heart size={13} />
                            <span>{l.girls}</span>
                        </button>
                    </div>

                    {/* Deity Filters */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider shrink-0 mr-1">
                            {l.deityFilter}
                        </span>
                        <select
                            value={selectedDeity}
                            onChange={(e) => setSelectedDeity(e.target.value as any)}
                            className="px-3.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                        >
                            <option value="all">{l.allDeities}</option>
                            <option value="Krishna">{l.deityKrishna}</option>
                            <option value="Vishnu">{l.deityVishnu}</option>
                            <option value="Radha">{l.deityRadha}</option>
                            <option value="Lakshmi">{l.deityLakshmi}</option>
                            <option value="Rama">{l.deityRama}</option>
                            <option value="Chaitanya">{l.deityChaitanya}</option>
                        </select>

                        {/* General Keyword Search Input */}
                        <div className="relative flex-1 min-w-[200px]">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={l.searchPlaceholder}
                                className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-text-main dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
                                >
                                    <X size={13} />
                                </button>
                            )}
                        </div>

                        {/* Reset All Filters Button */}
                        {hasActiveFilters && (
                            <button
                                onClick={handleClearAll}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 transition-colors shrink-0"
                            >
                                {l.clearFilters}
                            </button>
                        )}
                    </div>
                </div>

                {/* Results Count Banner */}
                <div className="flex items-center justify-between mb-6 px-1">
                    <p className="text-xs sm:text-sm font-bold text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                        <Sparkles size={14} className="text-pink-600 dark:text-pink-400" />
                        <span>
                            {filteredNames.length} {l.resultsFound}
                        </span>
                        {selectedPrefix !== 'all' && (
                            <span className="px-2 py-0.5 rounded-md bg-pink-500/15 text-pink-700 dark:text-pink-300 text-xs font-mono font-bold">
                                Prefix: {selectedPrefix}
                            </span>
                        )}
                    </p>
                </div>

                {/* Name Cards Grid */}
                {filteredNames.length === 0 ? (
                    <div className="p-12 text-center rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                        <BookOpen size={40} className="mx-auto text-neutral-400 mb-3" />
                        <h3 className="text-lg font-bold text-text-main dark:text-white mb-1">{l.noResultsTitle}</h3>
                        <p className="text-sm text-neutral-500 mb-4">{l.noResultsDesc}</p>
                        <button
                            onClick={handleClearAll}
                            className="px-4 py-2 rounded-xl bg-pink-600 text-white font-bold text-xs hover:bg-pink-700 transition-colors"
                        >
                            {l.clearFilters}
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                        {filteredNames.map((item, idx) => {
                            const meaning = item.meaning[locale as keyof typeof item.meaning] || item.meaning.en;
                            const isCopied = copiedId === item.id;
                            const isGirl = item.gender === 'girl';

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.35, delay: Math.min(idx * 0.03, 0.3) }}
                                    className="flex flex-col rounded-3xl p-6 bg-white dark:bg-[#1f1a12] border border-neutral-200/90 dark:border-neutral-800 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
                                >
                                    {/* Accent corner glow */}
                                    <div className={`absolute top-0 right-0 w-28 h-28 rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-125 ${
                                        isGirl
                                            ? 'bg-gradient-to-br from-rose-500/10 to-transparent'
                                            : 'bg-gradient-to-br from-blue-500/10 to-transparent'
                                    }`} />

                                    {/* Card Header: Gender & Deity badges */}
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <div className="flex items-center gap-1.5">
                                            {/* Gender Badge */}
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                isGirl
                                                    ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/20'
                                                    : 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/20'
                                            }`}>
                                                {isGirl ? <Heart size={10} /> : <Baby size={10} />}
                                                <span>{isGirl ? l.girls : l.boys}</span>
                                            </span>

                                            {/* Deity Badge */}
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/25">
                                                <Flame size={10} className="text-amber-600" />
                                                <span>{item.deity}</span>
                                            </span>
                                        </div>

                                        {/* Prefix Tag */}
                                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                                            {item.char2}
                                        </span>
                                    </div>

                                    {/* Name Titles: English, Devanagari, Tamil */}
                                    <div className="mb-3">
                                        <h3 className="text-xl sm:text-2xl font-black text-text-main dark:text-white tracking-tight group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                                            {item.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 mt-0.5">
                                            <span className="font-serif">{item.devanagari}</span>
                                            <span>•</span>
                                            <span>{item.tamil}</span>
                                        </div>
                                    </div>

                                    {/* Transcendental Meaning */}
                                    <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4 flex-1">
                                        {meaning}
                                    </p>

                                    {/* Scriptural Source (Pramana) */}
                                    <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 mb-4 text-[11px] text-neutral-500 dark:text-neutral-400 flex items-start gap-1.5">
                                        <ScrollText size={13} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                        <span className="line-clamp-2 italic">
                                            {item.source}
                                        </span>
                                    </div>

                                    {/* Action Button: Copy */}
                                    <button
                                        onClick={() => handleCopy(item)}
                                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                            isCopied
                                                ? 'bg-emerald-600 text-white'
                                                : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-pink-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 border border-neutral-200/60 dark:border-neutral-700'
                                        }`}
                                    >
                                        {isCopied ? (
                                            <>
                                                <Check size={13} />
                                                <span>{l.copiedBtn}</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={13} />
                                                <span>{l.copyBtn}</span>
                                            </>
                                        )}
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

