'use client';

import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Image from 'next/image';
import { 
    Mail, 
    Sparkles, 
    CheckCircle2, 
    MessageCircle, 
    Send, 
    Loader2, 
    X, 
    ShieldCheck, 
    Edit2 
} from 'lucide-react';
import { useLanguage } from '../providers/LanguageContext';
import { Locale } from '@/lib/dictionaries';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.askharekrishna.com/api';

const SUBSCRIBER_PHONE_KEY = 'askharekrishna-subscriber-phone';
const SUBSCRIBER_EMAIL_KEY = 'askharekrishna-subscriber-email';
const SUBSCRIBER_NAME_KEY = 'askharekrishna-subscriber-name';
const SUBSCRIBER_PICTURE_KEY = 'askharekrishna-subscriber-picture';

interface SubscriberData {
    name: string;
    email: string;
    picture: string;
    phone_number?: string;
}

const copyLabels: Record<string, {
    badge: string;
    heading: string;
    subtitle: string;
    benefit1: string;
    benefit2: string;
    benefit3: string;
    welcomeMsg: string;
    whatsappPromptHeading: string;
    whatsappPromptDesc: string;
    whatsappInputPlaceholder: string;
    whatsappSaveBtn: string;
    whatsappSkipBtn: string;
    whatsappSavedSuccess: string;
    activeStatus: string;
    subscribedWithEmail: string;
    subscribedWithWhatsapp: string;
    addWhatsappBtn: string;
    errorGoogle: string;
    errorPhone: string;
}> = {
    ta: {
        badge: 'இலவச ஆன்மீக சந்தா',
        heading: 'இலவச சந்தாதாரராக இணையுங்கள்',
        subtitle: 'தினசரி பகவானின் தத்துவார்த்த கட்டுரைகள், ஸ்ரீல பிரபுபாதரின் உபதேசங்கள் மற்றும் ஆன்மீக ஞானத்தை உங்கள் மின்னஞ்சலில் இலவசமாகப் பெறுங்கள்.',
        benefit1: '100% இலவசம்',
        benefit2: 'நேரடி மின்னஞ்சல்',
        benefit3: 'விளம்பரங்கள் இல்லை',
        welcomeMsg: 'ஹரே கிருஷ்ணா, {name}! நீங்கள் வெற்றிகரமாகச் சந்தா பெற்றுள்ளீர்கள்.',
        whatsappPromptHeading: 'வாட்ஸ்அப்பிலும் கட்டுரைகளைப் பெற விரும்புகிறீர்களா? (விருப்பத்திற்கேற்ப)',
        whatsappPromptDesc: 'உங்கள் வாட்ஸ்அப் எண்ணைச் சேர்த்து புதிய கட்டுரைகளை உடனுக்குடன் வாட்ஸ்அப்பில் நேரடியாகப் பெறுங்கள்.',
        whatsappInputPlaceholder: 'வாட்ஸ்அப் எண் (எ.கா. 9876543210)',
        whatsappSaveBtn: 'வாட்ஸ்அப் எண்ணைச் சேர்',
        whatsappSkipBtn: 'இப்போது வேண்டாம்',
        whatsappSavedSuccess: 'வாட்ஸ்அப் எண் வெற்றிகரமாகப் பதிவு செய்யப்பட்டது!',
        activeStatus: 'செயலில் உள்ள இலவச சந்தாதாரர்',
        subscribedWithEmail: 'கட்டுரைகள் அனுப்பப்படும் மின்னஞ்சல்:',
        subscribedWithWhatsapp: 'பதிவு செய்யப்பட்ட வாட்ஸ்அப் எண்:',
        addWhatsappBtn: '+ வாட்ஸ்அப் எண்ணைச் சேர்க்க',
        errorGoogle: 'Google உள்நுழைவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.',
        errorPhone: 'தயவுசெய்து சரியான 10-இலக்க தொலைபேசி எண்ணை உள்ளிடவும்.',
    },
    en: {
        badge: 'Free Spiritual Subscription',
        heading: 'Become a Free Subscriber',
        subtitle: 'Receive authentic Vaishnava philosophy, Srila Prabhupada\'s transcendental teachings, and daily wisdom directly to your inbox.',
        benefit1: '100% Free Forever',
        benefit2: 'Delivered to Inbox',
        benefit3: 'Zero Spam',
        welcomeMsg: 'Hare Krishna, {name}! You are now subscribed.',
        whatsappPromptHeading: 'Receive articles on WhatsApp too? (Optional)',
        whatsappPromptDesc: 'Add your WhatsApp number to receive instant article updates and daily transcendental quotes directly on your phone.',
        whatsappInputPlaceholder: 'WhatsApp Number (e.g. 9876543210)',
        whatsappSaveBtn: 'Add WhatsApp Number',
        whatsappSkipBtn: 'Skip for now',
        whatsappSavedSuccess: 'WhatsApp number added successfully!',
        activeStatus: 'Active Free Subscriber',
        subscribedWithEmail: 'Articles will be delivered to:',
        subscribedWithWhatsapp: 'Registered WhatsApp Number:',
        addWhatsappBtn: '+ Add WhatsApp Number',
        errorGoogle: 'Google Sign In failed. Please try again.',
        errorPhone: 'Please enter a valid 10-digit phone number.',
    },
    hi: {
        badge: 'निःशुल्क आध्यात्मिक सदस्यता',
        heading: 'निःशुल्क ग्राहक बनें',
        subtitle: 'प्रामाणिक वैदिक दर्शन, श्रील प्रभुपाद के उपदेश और दैनिक आध्यात्मिक लेख सीधे अपने ईमेल पर प्राप्त करें।',
        benefit1: 'सदैव निःशुल्क',
        benefit2: 'सीधे ईमेल पर',
        benefit3: 'कोई विज्ञापन नहीं',
        welcomeMsg: 'हरे कृष्ण, {name}! आप सफलतापूर्वक सदस्यता ले चुके हैं।',
        whatsappPromptHeading: 'क्या आप व्हाट्सएप पर भी लेख प्राप्त करना चाहते हैं? (वैकल्पिक)',
        whatsappPromptDesc: 'अपने फोन पर तुरंत लेख और सुविचार पाने के लिए अपना व्हाट्सएप नंबर जोड़ें।',
        whatsappInputPlaceholder: 'व्हाट्सएप नंबर (उदा. 9876543210)',
        whatsappSaveBtn: 'व्हाट्सएप नंबर जोड़ें',
        whatsappSkipBtn: 'अभी छोड़ें',
        whatsappSavedSuccess: 'व्हाट्सएप नंबर सफलतापूर्वक जुड़ गया!',
        activeStatus: 'सक्रिय निःशुल्क ग्राहक',
        subscribedWithEmail: 'लेख इस ईमेल पर भेजे जाएंगे:',
        subscribedWithWhatsapp: 'पंजीकृत व्हाट्सएप नंबर:',
        addWhatsappBtn: '+ व्हाट्सएप नंबर जोड़ें',
        errorGoogle: 'Google लॉगिन विफल रहा। कृपया पुनः प्रयास करें।',
        errorPhone: 'कृपया मान्य 10-अंकीय फोन नंबर दर्ज करें।',
    },
    kn: {
        badge: 'ಉಚಿತ ಆಧ್ಯಾತ್ಮಿಕ ಚಂದಾದಾರಿಕೆ',
        heading: 'ಉಚಿತ ಚಂದಾದಾರರಾಗಿ',
        subtitle: 'ದೈನಂದಿನ ಆಧ್ಯಾತ್ಮಿಕ ಲೇಖನಗಳು ಮತ್ತು ಶ್ರೀಲ ಪ್ರಭುಪಾದರ ಬೋಧನೆಗಳನ್ನು ನಿಮ್ಮ ಇಮೇಲ್‌ನಲ್ಲಿ ನೇರವಾಗಿ ಪಡೆಯಿರಿ.',
        benefit1: 'ಸಂಪೂರ್ಣ ಉಚಿತ',
        benefit2: 'ನೇರ ಇಮೇಲ್',
        benefit3: 'ಯಾವುದೇ ಜಾಹೀರಾತಿಲ್ಲ',
        welcomeMsg: 'ಹರೇ ಕೃಷ್ಣ, {name}! ನೀವು ಯಶಸ್ವಿಯಾಗಿ ಚಂದಾದಾರರಾಗಿದ್ದೀರಿ.',
        whatsappPromptHeading: 'ವಾಟ್ಸಾಪ್‌ನಲ್ಲೂ ಲೇಖನಗಳನ್ನು ಪಡೆಯಲು ಬಯಸುವಿರಾ? (ಐಚ್ಛಿಕ)',
        whatsappPromptDesc: 'ನಿಮ್ಮ ವಾಟ್ಸಾಪ್ ಸಂಖ್ಯೆಯನ್ನು ಸೇರಿಸಿ ಹೊಸ ಲೇಖನಗಳನ್ನು ನೇರವಾಗಿ ಪಡೆಯಿರಿ.',
        whatsappInputPlaceholder: 'ವಾಟ್ಸಾಪ್ ಸಂಖ್ಯೆ (ಉದಾ. 9876543210)',
        whatsappSaveBtn: 'ವಾಟ್ಸಾಪ್ ಸಂಖ್ಯೆ ಸೇರಿಸಿ',
        whatsappSkipBtn: 'ಈಗ ಬೇಡ',
        whatsappSavedSuccess: 'ವಾಟ್ಸಾಪ್ ಸಂಖ್ಯೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸೇರಿಸಲಾಗಿದೆ!',
        activeStatus: 'ಸಕ್ರಿಯ ಉಚಿತ ಚಂದಾದಾರ',
        subscribedWithEmail: 'ಲೇಖನಗಳನ್ನು ಕಳುಹಿಸಲಾಗುವ ಇಮೇಲ್:',
        subscribedWithWhatsapp: 'ನೋಂದಾಯಿತ ವಾಟ್ಸಾಪ್ ಸಂಖ್ಯೆ:',
        addWhatsappBtn: '+ ವಾಟ್ಸಾಪ್ ಸಂಖ್ಯೆ ಸೇರಿಸಿ',
        errorGoogle: 'Google ಲಾಗಿನ್ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
        errorPhone: 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ 10-ಅಂಕಿಯ ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.',
    },
    te: {
        badge: 'ఉచిత ఆధ్యాత్మిక చందా',
        heading: 'ఉచిత చందాదారు అవ్వండి',
        subtitle: 'రోజువారీ ఆధ్యాత్మిక వ్యాసాలు మరియు శ్రీల ప్రభుపాద ఉపదేశాలను నేరుగా మీ ఈమెయిల్‌లో ఉచితంగా పొందండి.',
        benefit1: 'పూర్తిగా ఉచితం',
        benefit2: 'ప్రత్యక్ష ఈమెయిల్',
        benefit3: 'ప్రకటనలు లేవు',
        welcomeMsg: 'హరే కృష్ణ, {name}! మీరు విజయవంతంగా చందా పొందారు.',
        whatsappPromptHeading: 'వాట్సాప్‌లో కూడా వ్యాసాలను పొందాలనుకుంటున్నారా? (ఐచ్ఛికం)',
        whatsappPromptDesc: 'మీ వాట్సాప్ నంబర్‌ను జోడించి నేరుగా వ్యాసాలను పొందండి.',
        whatsappInputPlaceholder: 'వాట్సాప్ నంబర్ (ఉదా. 9876543210)',
        whatsappSaveBtn: 'వాట్సాప్ నంబర్‌ను జోడించండి',
        whatsappSkipBtn: 'ఇప్పుడు వద్దు',
        whatsappSavedSuccess: 'వాట్సాప్ నంబర్ విజయవంతంగా జోడించబడింది!',
        activeStatus: 'యాక్టివ్ ఉచిత చందాదారు',
        subscribedWithEmail: 'వ్యాసాలు పంపబడే ఈమెయిల్:',
        subscribedWithWhatsapp: 'నమోదిత వాట్సాప్ నంబర్:',
        addWhatsappBtn: '+ వాట్సాప్ నంబర్‌ను జోడించండి',
        errorGoogle: 'Google లాగిన్ విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.',
        errorPhone: 'దయచేసి సరైన 10-అంకెల ఫోన్ నంబర్‌ను నమోదు చేయండి.',
    },
    ml: {
        badge: 'സൗജന്യ ആത്മീയ വരിക്കാരാകൂ',
        heading: 'സൗജന്യ വരിക്കാരാകൂ',
        subtitle: 'ആധികാരിക വൈഷ്ണവ ദർശനങ്ങളും ശ്രീലാ പ്രഭുപാദരുടെ ഉപദേശങ്ങളും നിങ്ങളുടെ ഇമെയിലിൽ നേരിട്ട് നേടൂ.',
        benefit1: 'പൂർണ്ണമായും സൗജന്യം',
        benefit2: 'നേരിട്ടുള്ള ഇമെയിൽ',
        benefit3: 'പരസ്യങ്ങളില്ല',
        welcomeMsg: 'ഹരേ കൃഷ്ണ, {name}! നിങ്ങൾ വിജയകരമായി വരിക്കാരായി.',
        whatsappPromptHeading: 'വാട്ട്‌സ്ആപ്പിലും ലേഖനങ്ങൾ ലഭിക്കാൻ ആഗ്രഹിക്കുന്നുണ്ടോ? (ഐച്ഛികം)',
        whatsappPromptDesc: 'പുതിയ ലേഖനങ്ങൾ നേരിട്ട് ലഭിക്കാൻ നിങ്ങളുടെ വാട്ട്‌സ്ആപ്പ് നമ്പർ ചേർക്കുക.',
        whatsappInputPlaceholder: 'വാട്ട്‌സ്ആപ്പ് നമ്പർ (ഉദാ: 9876543210)',
        whatsappSaveBtn: 'വാട്ട്‌സ്ആപ്പ് നമ്പർ ചേർക്കുക',
        whatsappSkipBtn: 'ഇപ്പോൾ വേണ്ട',
        whatsappSavedSuccess: 'വാട്ട്‌സ്ആപ്പ് നമ്പർ വിജയകരമായി ചേർത്തു!',
        activeStatus: 'സജീവ സൗജന്യ വരിക്കാരൻ',
        subscribedWithEmail: 'ലേഖനങ്ങൾ അയയ്ക്കുന്ന ഇമെയിൽ:',
        subscribedWithWhatsapp: 'രജിസ്റ്റർ ചെയ്ത വാട്ട്‌സ്ആപ്പ് നമ്പർ:',
        addWhatsappBtn: '+ വാട്ട്‌സ്ആപ്പ് നമ്പർ ചേർക്കുക',
        errorGoogle: 'Google ലോഗിൻ പരാജയപ്പെട്ടു. ദയവായി വീണ്ടും ശ്രമിക്കുക.',
        errorPhone: 'സാധുവായ 10 അക്ക ഫോൺ നമ്പർ നൽകുക.',
    },
    bn: {
        badge: 'বিনামূল্যে আধ্যাত্মিক গ্রাহক হন',
        heading: 'বিনামূল্যে গ্রাহক হন',
        subtitle: 'প্রামাণিক বৈষ্ণব দর্শন এবং শ্রীল প্রভুপাদের উপদেশাবলী সরাসরি আপনার ইমেলে পান।',
        benefit1: '১০০% বিনামূল্যে',
        benefit2: 'সরাসরি ইমেল',
        benefit3: 'কোনো বিজ্ঞাপন নেই',
        welcomeMsg: 'হরে কৃষ্ণ, {name}! আপনি সফলভাবে সাবস্ক্রাইব করেছেন।',
        whatsappPromptHeading: 'হোয়াটসঅ্যাপেও নিবন্ধ পেতে চান? (ঐচ্ছিক)',
        whatsappPromptDesc: 'ফোনে তাৎক্ষণিক নিবন্ধ পেতে আপনার হোয়াটসঅ্যাপ নম্বর যোগ করুন।',
        whatsappInputPlaceholder: 'হোয়াটসঅ্যাপ নম্বর (উদাঃ 9876543210)',
        whatsappSaveBtn: 'হোয়াটসঅ্যাপ নম্বর যোগ করুন',
        whatsappSkipBtn: 'এখন নয়',
        whatsappSavedSuccess: 'হোয়াটসঅ্যাপ নম্বর সফলভাবে সংরক্ষিত হয়েছে!',
        activeStatus: 'সক্রিয় ফ্রি গ্রাহক',
        subscribedWithEmail: 'নিবন্ধ পাঠানোর ইমেল:',
        subscribedWithWhatsapp: 'নিবন্ধিত হোয়াটসঅ্যাপ নম্বর:',
        addWhatsappBtn: '+ হোয়াটসঅ্যাপ নম্বর যোগ করুন',
        errorGoogle: 'Google সাইন-ইন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
        errorPhone: 'অনুগ্রহ করে একটি সঠিক ১০-সংখ্যার ফোন নম্বর লিখুন।',
    },
};

export function FooterSubscriberSection() {
    const { locale } = useLanguage();
    const t = copyLabels[locale] || copyLabels.en;

    const [subscriber, setSubscriber] = useState<SubscriberData | null>(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [showWhatsappPrompt, setShowWhatsappPrompt] = useState(false);
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [isSavingWhatsapp, setIsSavingWhatsapp] = useState(false);
    const [whatsappSavedMessage, setWhatsappSavedMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [avatarError, setAvatarError] = useState(false);

    // Load subscriber state from localStorage
    const loadSubscriberFromStorage = () => {
        if (typeof window === 'undefined') return;
        const email = window.localStorage.getItem(SUBSCRIBER_EMAIL_KEY);
        const name = window.localStorage.getItem(SUBSCRIBER_NAME_KEY);
        const picture = window.localStorage.getItem(SUBSCRIBER_PICTURE_KEY) || '';
        const phone = window.localStorage.getItem(SUBSCRIBER_PHONE_KEY) || '';

        if (email) {
            setSubscriber({
                name: name || email.split('@')[0],
                email,
                picture,
                phone_number: phone || undefined,
            });
            // If email exists but no phone, show whatsapp prompt if not dismissed
            if (!phone) {
                const skipped = window.sessionStorage.getItem('askharekrishna-wa-skipped');
                if (!skipped) {
                    setShowWhatsappPrompt(true);
                }
            } else {
                setShowWhatsappPrompt(false);
            }
        } else {
            setSubscriber(null);
            setShowWhatsappPrompt(false);
        }
    };

    useEffect(() => {
        loadSubscriberFromStorage();

        const handleSubscriberUpdated = () => {
            loadSubscriberFromStorage();
        };

        window.addEventListener('subscriber-updated', handleSubscriberUpdated);
        return () => window.removeEventListener('subscriber-updated', handleSubscriberUpdated);
    }, []);

    const handleGoogleSuccess = async (credentialResponse: any) => {
        if (!credentialResponse?.credential) return;
        setErrorMessage(null);
        setIsLoggingIn(true);

        try {
            const decoded: any = jwtDecode(credentialResponse.credential);
            const email = decoded.email || '';
            const name = decoded.name || '';
            const picture = decoded.picture || '';
            const google_id = decoded.sub || '';

            // Register / update in database via API
            const response = await axios.post(`${API_BASE_URL}/subscribers/google-auth/`, {
                credential: credentialResponse.credential,
                email,
                name,
                picture,
                google_id,
                language: locale,
            });

            const sub = response.data;

            if (typeof window !== 'undefined') {
                if (email) window.localStorage.setItem(SUBSCRIBER_EMAIL_KEY, email);
                if (name) window.localStorage.setItem(SUBSCRIBER_NAME_KEY, name);
                if (picture) window.localStorage.setItem(SUBSCRIBER_PICTURE_KEY, picture);
                if (sub?.phone_number) {
                    window.localStorage.setItem(SUBSCRIBER_PHONE_KEY, sub.phone_number);
                }
                window.dispatchEvent(new Event('subscriber-updated'));
            }

            setSubscriber({
                name: name || (email.split('@')[0]),
                email,
                picture,
                phone_number: sub?.phone_number || undefined,
            });

            // If user has no phone number, open the WhatsApp prompt immediately
            if (!sub?.phone_number) {
                setShowWhatsappPrompt(true);
            }
        } catch (err) {
            console.error('Google Sign In error in Footer:', err);
            setErrorMessage(t.errorGoogle);
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleSaveWhatsapp = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        const cleanDigits = whatsappNumber.replace(/\D/g, '');
        if (cleanDigits.length < 10) {
            setErrorMessage(t.errorPhone);
            return;
        }

        setIsSavingWhatsapp(true);
        try {
            const formattedPhone = cleanDigits.length === 10 ? `+91${cleanDigits}` : `+${cleanDigits}`;

            await axios.post(`${API_BASE_URL}/subscribers/`, {
                email: subscriber?.email,
                name: subscriber?.name,
                phone_number: formattedPhone,
                language: locale,
            });

            if (typeof window !== 'undefined') {
                window.localStorage.setItem(SUBSCRIBER_PHONE_KEY, formattedPhone);
                window.dispatchEvent(new Event('subscriber-updated'));
            }

            setSubscriber((prev) => prev ? { ...prev, phone_number: formattedPhone } : null);
            setWhatsappSavedMessage(true);
            setTimeout(() => {
                setShowWhatsappPrompt(false);
                setWhatsappSavedMessage(false);
            }, 3000);
        } catch (err) {
            console.error('Failed to save WhatsApp number:', err);
            setErrorMessage(t.errorPhone);
        } finally {
            setIsSavingWhatsapp(false);
        }
    };

    const handleSkipWhatsapp = () => {
        setShowWhatsappPrompt(false);
        if (typeof window !== 'undefined') {
            window.sessionStorage.setItem('askharekrishna-wa-skipped', '1');
        }
    };

    return (
        <section 
            aria-label="Newsletter & Free Subscription"
            className="mb-12 relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-600/10 dark:from-[#2a1e12] dark:via-[#20180f] dark:to-[#171109] border border-amber-300/40 dark:border-amber-800/40 p-6 sm:p-8 md:p-10 shadow-xl"
        >
            {/* Background decorative glow */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
                {!subscriber ? (
                    /* STATE 1: GUEST USER - INVITATION & GOOGLE SIGN IN */
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="max-w-2xl text-center lg:text-left">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                                <Sparkles size={14} className="text-amber-500 animate-pulse" />
                                <span>{t.badge}</span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2.5">
                                {t.heading}
                            </h3>
                            <p className="text-sm sm:text-base text-text-muted dark:text-gray-300 leading-relaxed mb-4">
                                {t.subtitle}
                            </p>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-gray-700 dark:text-gray-300">
                                <span className="inline-flex items-center gap-1.5">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    <span>{t.benefit1}</span>
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Mail size={16} className="text-primary" />
                                    <span>{t.benefit2}</span>
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <ShieldCheck size={16} className="text-blue-500" />
                                    <span>{t.benefit3}</span>
                                </span>
                            </div>
                        </div>

                        {/* Google Sign In CTA */}
                        <div className="flex flex-col items-center gap-3 shrink-0">
                            {isLoggingIn ? (
                                <div className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-white dark:bg-neutral-800 shadow-md text-sm font-bold text-gray-700 dark:text-gray-200">
                                    <Loader2 className="size-5 animate-spin text-primary" />
                                    <span>Connecting...</span>
                                </div>
                            ) : (
                                <div className="p-1 rounded-2xl bg-white dark:bg-neutral-900/80 shadow-md border border-amber-200/50 dark:border-neutral-700">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => setErrorMessage(t.errorGoogle)}
                                        text="signup_with"
                                        shape="pill"
                                        size="large"
                                        theme="outline"
                                    />
                                </div>
                            )}

                            {errorMessage && (
                                <p className="text-xs text-red-500 dark:text-red-400 font-medium text-center max-w-xs">
                                    {errorMessage}
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    /* STATE 2 & 3: LOGGED IN USER */
                    <div className="flex flex-col gap-6">
                        {/* Subscriber Profile Info Card */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 pb-5 border-b border-amber-200/50 dark:border-neutral-800">
                            <div className="flex items-center gap-4 text-center sm:text-left">
                                <div className="relative size-14 rounded-full overflow-hidden border-2 border-emerald-500 shadow-md shrink-0 bg-emerald-500/10">
                                    {subscriber.picture && !avatarError ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={subscriber.picture}
                                            alt={subscriber.name}
                                            referrerPolicy="no-referrer"
                                            onError={() => setAvatarError(true)}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold text-xl">
                                            {(subscriber.name || subscriber.email || 'S').charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold mb-1">
                                        <CheckCircle2 size={13} />
                                        <span>{t.activeStatus}</span>
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                                        {t.welcomeMsg.replace('{name}', subscriber.name)}
                                    </h4>
                                    <p className="text-xs text-text-muted dark:text-gray-400 mt-0.5">
                                        {t.subscribedWithEmail} <strong className="text-primary">{subscriber.email}</strong>
                                    </p>
                                </div>
                            </div>

                            {/* WhatsApp Status Pill */}
                            <div className="shrink-0">
                                {subscriber.phone_number ? (
                                    <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                                        <MessageCircle size={16} className="fill-emerald-500/20" />
                                        <span>{subscriber.phone_number}</span>
                                        <button
                                            onClick={() => setShowWhatsappPrompt(true)}
                                            className="text-text-muted hover:text-primary transition-colors p-1"
                                            title="Edit WhatsApp number"
                                        >
                                            <Edit2 size={12} />
                                        </button>
                                    </div>
                                ) : !showWhatsappPrompt && (
                                    <button
                                        onClick={() => setShowWhatsappPrompt(true)}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
                                    >
                                        <MessageCircle size={15} />
                                        <span>{t.addWhatsappBtn}</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* WhatsApp Prompt Form */}
                        {showWhatsappPrompt && (
                            <div className="bg-white/80 dark:bg-[#1a140d]/90 backdrop-blur-md rounded-2xl p-5 border border-emerald-500/40 shadow-inner animate-in fade-in duration-300">
                                {whatsappSavedMessage ? (
                                    <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                                        <CheckCircle2 size={18} />
                                        <span>{t.whatsappSavedSuccess}</span>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSaveWhatsapp} className="flex flex-col md:flex-row items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0 text-center md:text-left">
                                            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#128C7E] dark:text-[#25D366] mb-1">
                                                <MessageCircle size={16} />
                                                <span>{t.whatsappPromptHeading}</span>
                                            </div>
                                            <p className="text-xs text-text-muted dark:text-gray-300">
                                                {t.whatsappPromptDesc}
                                            </p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
                                            <input
                                                type="tel"
                                                value={whatsappNumber}
                                                onChange={(e) => setWhatsappNumber(e.target.value)}
                                                placeholder={t.whatsappInputPlaceholder}
                                                className="w-full sm:w-64 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                                            />
                                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                                <button
                                                    type="submit"
                                                    disabled={isSavingWhatsapp}
                                                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#128C7E] disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all cursor-pointer whitespace-nowrap active:scale-95"
                                                >
                                                    {isSavingWhatsapp ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                                    <span>{t.whatsappSaveBtn}</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleSkipWhatsapp}
                                                    className="px-3 py-2.5 text-xs font-semibold text-text-muted hover:text-text-main dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                                                >
                                                    {t.whatsappSkipBtn}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                )}
                                {errorMessage && (
                                    <p className="text-xs text-red-500 font-medium mt-2">
                                        {errorMessage}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
