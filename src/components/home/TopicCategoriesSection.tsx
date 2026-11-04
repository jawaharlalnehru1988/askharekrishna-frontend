'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useLanguage } from '../providers/LanguageContext';
import {
    Scale,
    BookOpen,
    Calendar,
    Flame,
    ShieldCheck,
    ArrowRight,
    Sparkles,
    CheckCircle2,
    Compass,
    ScrollText,
    HeartHandshake,
    Baby,
} from 'lucide-react';

interface CategoryCardData {
    id: string;
    number: string;
    title: string;
    subtopic: string;
    description: string;
    href: string;
    badge: string;
    highlights: string[];
    actionLabel: string;
    gradient: string;
    borderHover: string;
    badgeStyle: string;
    iconBg: string;
    iconColor: string;
    IconComponent: React.ElementType;
}

interface LocalizedContent {
    sectionBadge: string;
    sectionTitle: string;
    sectionSubtitle: string;
    guaranteeBannerTitle: string;
    guaranteeBannerText: string;
    cards: {
        debate: {
            title: string;
            subtopic: string;
            description: string;
            badge: string;
            highlights: string[];
            actionLabel: string;
        };
        stories: {
            title: string;
            subtopic: string;
            description: string;
            badge: string;
            highlights: string[];
            actionLabel: string;
        };
        calendar: {
            title: string;
            subtopic: string;
            description: string;
            badge: string;
            highlights: string[];
            actionLabel: string;
        };
        pooja: {
            title: string;
            subtopic: string;
            description: string;
            badge: string;
            highlights: string[];
            actionLabel: string;
        };
        diksha: {
            title: string;
            subtopic: string;
            description: string;
            badge: string;
            highlights: string[];
            actionLabel: string;
        };
        etiquette: {
            title: string;
            subtopic: string;
            description: string;
            badge: string;
            highlights: string[];
            actionLabel: string;
        };
        festival: {
            title: string;
            subtopic: string;
            description: string;
            badge: string;
            highlights: string[];
            actionLabel: string;
        };
        babyNames: {
            title: string;
            subtopic: string;
            description: string;
            badge: string;
            highlights: string[];
            actionLabel: string;
        };
    };
}

const LOCALIZED_CONTENT: Record<string, LocalizedContent> = {
    en: {
        sectionBadge: 'Authentic Vedic Portals',
        sectionTitle: 'Topic Categories',
        sectionSubtitle: 'Explore authoritative Vedic wisdom, time-tested spiritual practices, and scriptural resolutions across our core learning portals — backed 100% by Shastra Pramana.',
        guaranteeBannerTitle: 'Our Commitment to Authenticity',
        guaranteeBannerText: 'Every topic, procedure, and analysis is strictly aligned with authentic Gaudiya Vaishnava siddhanta as taught by His Divine Grace A.C. Bhaktivedanta Swami Prabhupada.',
        cards: {
            debate: {
                title: 'Philosophical & Debate Topics',
                subtopic: 'Vedic Logic, Siddhanta & Faith Resolution',
                description: 'Clear, fearless refutations of modern atheism, Mayavada, and theological misconceptions through rigorous Vedic logic (yukti) and authentic scriptural evidence (shabda-pramana).',
                badge: '100% Shastric Siddhanta',
                highlights: ['Vedic Logic (Yukti)', 'Resolving Doubts', 'Scientific Proofs of God'],
                actionLabel: 'Explore Debates',
            },
            stories: {
                title: 'Stories / Pastimes',
                subtopic: 'Lilas of Bhagavan & Pure Devotees',
                description: 'Relish uplifting, transcendental narrations from the Srimad-Bhagavatam, Mahabharata, and Ramayana, revealing the personal nature, divine pastimes, and loving reciprocation of Bhagavan Sri Krishna.',
                badge: 'Pure Transcendental Nectar',
                highlights: ['Krishna’s Pastimes', 'Lives of the Acharyas', 'Puranic Nectar'],
                actionLabel: 'Read Pastimes',
            },
            calendar: {
                title: 'Vaishnava Calendar',
                subtopic: 'Ekadashi Fasts & Holy Festivals',
                description: 'Authoritative astronomical calculations for sacred Ekadashi fasts, auspicious Vaishnava festival dates, and precise Parana break-fast windows calculated to ensure spiritual potency.',
                badge: 'Astronomically Verified',
                highlights: ['Ekadashi Vrata Dates', 'Accurate Parana Windows', 'Acharya Appearance Days'],
                actionLabel: 'View Calendar',
            },
            pooja: {
                title: 'Pooja Vidhis & Procedures',
                subtopic: 'Authentic Deity Worship & Daily Rituals',
                description: 'Step-by-step practical training for home altar deity worship, Tulasi Aarti, offering Bhoga to Bhagavan, and Japa meditation according to authentic Pancharatrika standards.',
                badge: 'Pancharatra Pradipa Standard',
                highlights: ['Daily Home Worship', 'Bhoga Offering Mantras', 'Tulasi & Japa Vidhis'],
                actionLabel: 'Learn Vidhis',
            },
            diksha: {
                title: 'The Process of Diksha in ISKCON',
                subtopic: 'Srila Prabhupada’s Direct Directives',
                description: 'A transparent, evidence-based presentation of Srila Prabhupada’s signed institutional orders, historical letters, and the authentic continuation of initiation within ISKCON.',
                badge: 'Verified Historical Records',
                highlights: ['July 9th Directive', 'Will & Institutional Orders', 'Parampara Siddhanta'],
                actionLabel: 'Study Diksha Process',
            },
            etiquette: {
                title: 'Vaishnava Etiquettes & Sadācāra',
                subtopic: 'Devotional Culture, Character & Protocols',
                description: 'Comprehensive compendium of authentic Vaishnava etiquettes across 10 vital dimensions: deity worship decorum, dealing with devotees, speech control, domestic harmony, and crisis management.',
                badge: '100% Shastric Sadācāra (68 Topics)',
                highlights: ['Temple Decorum & Seva', 'Spiritual Relationships', 'Daily Dina-Caryā Protocol'],
                actionLabel: 'Explore Etiquettes',
            },
            festival: {
                title: 'Festival Insights',
                subtopic: 'Shastric Significance, Vratas & Sacred Observances',
                description: 'Uncover the deep philosophical wisdom, scriptural origins, and authentic sadachara rules (dos & don’ts) for auspicious Vaishnava festivals.',
                badge: '100% Shastric Festival Wisdom',
                highlights: ['Dipavali Shastra Pramana', 'Rama & Krishna Lilas', 'Festival Dos & Don’ts'],
                actionLabel: 'Explore Festivals',
            },
            babyNames: {
                title: 'Vedic & Vaishnava Baby Names',
                subtopic: 'Sacred Names of Krishna, Vishnu, Radha & Lakshmi',
                description: 'Discover authentic transcendental names for newborn boys and girls derived from the Vishnu Sahasranama and Radha Sahasranama, with character prefix filters and spiritual meanings.',
                badge: '100% Shastric Divine Names',
                highlights: ['Vishnu & Krishna Names', 'Radha & Lakshmi Names', '1, 2 & 3 Letter Search'],
                actionLabel: 'Find Divine Names',
            },
        },
    },
    ta: {
        sectionBadge: 'நம்பகமான வேத வழிகாட்டல்',
        sectionTitle: 'தலைப்புப் பிரிவுகள் (Topic Categories)',
        sectionSubtitle: 'சாஸ்திர ஆதாரங்கள் மற்றும் ஸ்ரீல பிரபுபாதரின் நேரடி போதனைகளின் அடிப்படையில் அமைந்த முதன்மை தலைப்புப் பிரிவுகளை ஆராய்ந்து ஆழமான ஆன்மீக அறிவைப் பெறுங்கள்.',
        guaranteeBannerTitle: 'நம்பகத்தன்மைக்கான உறுதிமொழி',
        guaranteeBannerText: 'அனைத்துக் கட்டுரைகளும் ஆச்சாரியரான ஸ்ரீல அ.ச. பக்திவேதாந்த சுவாமி பிரபுபாதரின் அதிகாரப்பூர்வ போதனைகள் மற்றும் சாஸ்திர பிரமாணங்களின்படி தொகுக்கப்பட்டுள்ளன.',
        cards: {
            debate: {
                title: 'தத்துவ விவாதக் கட்டுரைகள் (Philosophical & Debate Topics)',
                subtopic: 'சாஸ்திர தர்க்கம் மற்றும் மெய்யறிவு விளக்கம்',
                description: 'நாத்திக வாதங்கள், மாயாவாதக் கருத்துக்கள் மற்றும் தத்துவ சந்தேகங்களை அசைக்க முடியாத சாஸ்திர பிரமாணங்கள் மற்றும் கூர்மையான தர்க்கத்தின் மூலம் தீர்க்கும் அதிகாரப்பூர்வ கட்டுரைகள்.',
                badge: '100% சாஸ்திரப் பிரமாணம்',
                highlights: ['சாஸ்திர தர்க்கம் (யுக்தி)', 'சந்தேகங்களுக்குத் தீர்வு', 'பகவானின் இருப்புக்கான ஆதாரங்கள்'],
                actionLabel: 'விவாதக் கட்டுரைகளை வாசிக்க',
            },
            stories: {
                title: 'திவ்ய லீலைகள் மற்றும் கதைகள் (Stories / Pastimes)',
                subtopic: 'பகவான் மற்றும் பக்தர்களின் திவ்ய சரிதங்கள்',
                description: 'ஸ்ரீமத் பாகவதம், மகாபாரதம் மற்றும் இராமாயணத்திலிருந்து பகவான் ஸ்ரீ கிருஷ்ணர் மற்றும் தூய பக்தர்களின் பக்தி நெறியூட்டும் தெய்வீக லீலைகளை சுவையுடன் அறிந்துகொள்ளுங்கள்.',
                badge: 'தூய பக்தி அமுதம்',
                highlights: ['கிருஷ்ணரின் லீலைகள்', 'ஆச்சார்யர்களின் வரலாறு', 'சாஸ்திர நீதிகள்'],
                actionLabel: 'திவ்ய கதைகளைப் படிக்க',
            },
            calendar: {
                title: 'வைஷ்ணவ நாள்காட்டி (Vaishnava Calendar)',
                subtopic: 'திதிகள், ஏகாதசி விரதம் மற்றும் பாரணை நேரங்கள்',
                description: 'புனிதமான ஏகாதசி விரத நாட்கள், துல்லியமான பாரணை நேரங்கள் மற்றும் பகவானின் அவதார வைபவங்களை நெறிமுறைகளோடு அறிந்துகொள்ள உதவும் அதிகாரப்பூர்வ நாள்காட்டி.',
                badge: 'துல்லியமான காலக் கணிப்பு',
                highlights: ['ஏகாதசி விரத விவரங்கள்', 'துல்லிய பாரணை நேரங்கள்', 'வைஷ்ணவ பண்டிகைகள்'],
                actionLabel: 'நாள்காட்டியைப் பார்க்க',
            },
            pooja: {
                title: 'பூஜை முறைகள் மற்றும் வழிபாட்டு நெறிமுறைகள் (Pooja Vidhis)',
                subtopic: 'பஞ்சராத்ர முறைப்படி விக்ரஹ வழிபாடு',
                description: 'இல்லத்தில் பகவானின் விக்ரஹங்களை ஆராதித்தல், துளசி பூஜை, நைவேத்தியம் சமர்ப்பிக்கும் மந்திரங்கள் மற்றும் ஜப தியானத்திற்கான முறையான செயல்முறை வழிகாட்டல்கள்.',
                badge: 'பஞ்சராத்ர பிரதீப நியதி',
                highlights: ['இல்ல ஆராதனை முறைகள்', 'போக சமர்ப்பண மந்திரங்கள்', 'துளசி ஆர்த்தி மற்றும் ஜபம்'],
                actionLabel: 'பூஜை முறைகளைக் கற்க',
            },
            diksha: {
                title: 'இஸ்கானில் தீட்சை முறை (Process of Diksha in ISKCON)',
                subtopic: 'ஸ்ரீல பிரபுபாதரின் நேரடி ஆவணங்கள் மற்றும் கட்டளைகள்',
                description: 'ஸ்ரீல பிரபுபாதர் கையொப்பமிட்ட ஜூலை 9 கட்டளை, அதிகாரப்பூர்வ ஆவணங்கள் மற்றும் இஸ்கானின் தீட்சை முறை குறித்த தெளிவான சாஸ்திர உண்மைத் தொகுப்பு.',
                badge: 'உறுதிசெய்யப்பட்ட ஆவணங்கள்',
                highlights: ['ஜூலை 9 ஆவணம்', 'பிரபுபாதரின் விருப்பம்', 'குரு பரம்பரை தொடர்ச்சி'],
                actionLabel: 'தீட்சை முறையை அறிய',
            },
            etiquette: {
                title: 'வைஷ்ணவ நெறிமுறைகள் & சதாசாரம் (Vaishnava Etiquettes)',
                subtopic: 'பக்திப் பண்பாடு, திவ்ய குணம் & ஆன்மீக வாழ்க்கை',
                description: 'விக்கிரக வழிபாடு, பக்தர்களிடையேயான உறவுகள், வாக்கு அடக்கம், இல்லற தர்மம் மற்றும் சங்கடங்களை எதிர்கொள்ளும் சாஸ்திர நெறிமுறைகள் அடங்கிய முழுமையான வழிகாட்டி (10 பிரிவுகள், 68 தலைப்புகள்).',
                badge: '100% சாஸ்திர சதாசாரம் (68 தலைப்புகள்)',
                highlights: ['ஆலய நெறிமுறைகள்', 'பக்தர் உறவு மரியாதை', 'தினசரி தினசர்யா விதி'],
                actionLabel: 'நெறிமுறைகளை அறிக',
            },
            festival: {
                title: 'பண்டிகைகளின் தாத்பரியம் (Festival Insights)',
                subtopic: 'சாஸ்திர தாத்பரியம், விரதங்கள் & புனித வைபவங்கள்',
                description: 'புராணங்கள் மற்றும் இதிகாசங்களின்படி புனித வைஷ்ணவ பண்டிகைகளின் ஆழ்ந்த சாஸ்திர தாத்பரியங்கள், திவ்ய லீலைகள் மற்றும் செய்ய வேண்டிய/கூடாத விரத நெறிமுறைகள்.',
                badge: '100% சாஸ்திரப் பூர்வ உண்மை',
                highlights: ['தீபாவளி சாஸ்திர பிரமாணம்', 'ராம & கிருஷ்ண லீலைகள்', 'விரத நெறிமுறைகள்'],
                actionLabel: 'பண்டிகைகளை அறிக',
            },
            babyNames: {
                title: 'குழந்தைகளுக்கான தெய்வீகப் பெயர்கள்',
                subtopic: 'ஸ்ரீ கிருஷ்ணர், விஷ்ணு, ராதா & லக்ஷ்மி திருநாமங்கள்',
                description: 'விஷ்ணு சஹஸ்ரநாமம், ராதா சஹஸ்ரநாமம் மற்றும் பாகவதத்திலிருந்து பிறந்த ஆண் மற்றும் பெண் குழந்தைகளுக்கான மங்களகரமான திருநாமங்கள், ஆன்மீக அர்த்தங்கள் மற்றும் எழுத்து வாரியான வடிகட்டிகள்.',
                badge: '100% சாஸ்திரத் திருநாமங்கள்',
                highlights: ['விஷ்ணு & கிருஷ்ணர் பெயர்கள்', 'ராதா & லக்ஷ்மி பெயர்கள்', '1, 2, 3 எழுத்து வடிகட்டி'],
                actionLabel: 'பெயர்களைத் தேடுக',
            },
        },
    },
    hi: {
        sectionBadge: 'प्रामाणिक वैदिक प्रवेशद्वार',
        sectionTitle: 'विषय श्रेणियाँ (Topic Categories)',
        sectionSubtitle: 'शास्त्र प्रमाण और श्रील प्रभुपाद के मूल उपदेशों पर आधारित प्रमुख अध्यायों का अन्वेषण करें और प्रामाणिक ज्ञान प्राप्त करें।',
        guaranteeBannerTitle: 'प्रामाणिकता की गारंटी',
        guaranteeBannerText: 'प्रत्येक विषय और अनुष्ठान प्रामाणिक गौड़ीय वैष्णव सिद्धांत और श्रील प्रभुपाद की शिक्षाओं के 100% अनुकूल है।',
        cards: {
            debate: {
                title: 'दार्शनिक एवं शास्त्रार्थ विषय',
                subtopic: 'वैदिक तर्क, सिद्धांत एवं शंका समाधान',
                description: 'नास्तिकता, मायावाद और दार्शनिक भ्रांतियों का वैदिक प्रमाणों एवं अकाट्य युक्ति के आधार पर निर्भीक समाधान।',
                badge: '100% शास्त्रीय सिद्धांत',
                highlights: ['वैदिक तर्क (युक्ति)', 'संशय निवारण', 'ईश्वर का वैज्ञानिक प्रमाण'],
                actionLabel: 'शास्त्रार्थ लेख पढ़ें',
            },
            stories: {
                title: 'पावन लीलाएँ एवं कथाएँ',
                subtopic: 'भगवान एवं शुद्ध भक्तों की दिव्य गाथाएँ',
                description: 'श्रीमद्भागवतम्, महाभारत और रामायण से भगवान श्री कृष्ण एवं उनके शुद्ध भक्तों की अमृतमयी दिव्य लीलाएँ।',
                badge: 'विशुद्ध भक्ति रस',
                highlights: ['श्री कृष्ण लीला', 'आचार्यों का जीवन चरित्र', 'पौराणिक अमृत'],
                actionLabel: 'कथाएँ पढ़ें',
            },
            calendar: {
                title: 'वैष्णव पंचांग एवं तिथियाँ',
                subtopic: 'एकादशी व्रत, पारण समय एवं पावन उत्सव',
                description: 'पवित्र एकादशी व्रत की सही तिथियाँ, सूर्योदय के अनुसार सटीक पारण समय और वैष्णव उत्सवों की पूर्ण तालिका।',
                badge: 'खगोलीय रूप से सत्यापित',
                highlights: ['एकादशी व्रत तिथियाँ', 'सटीक पारण समय', 'आचार्य प्राकट्य दिवस'],
                actionLabel: 'पंचांग देखें',
            },
            pooja: {
                title: 'पूजा विधि एवं नित्य अनुष्ठान',
                subtopic: 'पंचरात्रिक विग्रह सेवा एवं भक्ति नियम',
                description: 'घर पर भगवान के विग्रह की सेवा, भोग अर्पण मंत्र, तुलसी आरती एवं जप विधि की चरणबद्ध प्रामाणिक विधि।',
                badge: 'पंचरात्र प्रदीप मानक',
                highlights: ['दैनिक विग्रह सेवा', 'भोग अर्पण मंत्र', 'तुलसी व जप विधि'],
                actionLabel: 'विधि सीखें',
            },
            diksha: {
                title: 'इस्कॉन में दीक्षा की प्रणाली',
                subtopic: 'श्रील प्रभुपाद के हस्ताक्षरित निर्देश एवं सिद्धांत',
                description: 'श्रील प्रभुपाद के 9 जुलाई 1977 के आदेश, ऐतिहासिक पत्रों और संस्थागत दस्तावेजों का निष्पक्ष एवं प्रामाणिक अध्ययन।',
                badge: 'सत्यापित ऐतिहासिक साक्ष्य',
                highlights: ['9 जुलाई का निर्देश', 'प्रभुपाद की वसीयत', 'परंपरा की निरंतरता'],
                actionLabel: 'दीक्षा प्रणाली समझें',
            },
            etiquette: {
                title: 'वैष्णव सदाचार एवं शिष्टाचार',
                subtopic: 'भक्ति संस्कृति, दिव्य चरित्र एवं जीवन शैली',
                description: 'वैष्णव सदाचार के 10 मुख्य आयाम: विग्रह सेवा मर्यादा, भक्त संग शिष्टाचार, वाणी तपस्या, गृहस्थ धर्म एवं संकट निवारण के प्रामाणिक शास्त्रोक्त नियम (68 विषय)।',
                badge: '100% शास्त्रसम्मत सदाचार (68 विषय)',
                highlights: ['मंदिर एवं विग्रह मर्यादा', 'भक्त पारस्परिक संबंध', 'दैनिक दिनचर्या नियम'],
                actionLabel: 'सदाचार जानें',
            },
            festival: {
                title: 'उत्सव महिमा एवं तात्त्विक ज्ञान (Festival Insights)',
                subtopic: 'शास्त्रीय महत्त्व, व्रत विधान एवं पावन उत्सव',
                description: 'पुराणों एवं इतिहास के अनुसार पावन वैष्णव उत्सवों का गहरा दार्शनिक रहस्य, दिव्य कथाएँ एवं शास्त्रीय सदाचार नियम (क्या करें और क्या न करें)।',
                badge: '100% शास्त्रसम्मत उत्सव रहस्य',
                highlights: ['दीपावली शास्त्र प्रमाण', 'राम व कृष्ण लीलाएँ', 'उत्सव सदाचार नियम'],
                actionLabel: 'उत्सव महिमा जानें',
            },
            babyNames: {
                title: 'वैदिक एवं वैष्णव बाल नाम',
                subtopic: 'श्री कृष्ण, विष्णु, राधा एवं लक्ष्मी के पावन नाम',
                description: 'विष्णु सहस्रनाम, राधा सहस्रनाम और श्रीमद्भागवतम् से नवजात बालकों एवं बालिकाओं के लिए कल्याणकारी दिव्य नाम, उनके आध्यात्मिक अर्थ तथा अक्षराधारित फ़िल्टर।',
                badge: '100% शास्त्रसम्मत पावन नाम',
                highlights: ['विष्णु व कृष्ण नाम', 'राधा व लक्ष्मी नाम', '1, 2 व 3 अक्षर खोज'],
                actionLabel: 'दिव्य नाम खोजें',
            },
        },
    },
    kn: {
        sectionBadge: 'ಪ್ರಾಮಾಣಿಕ ವೈದಿಕ ಮಾರ್ಗದರ್ಶಿ',
        sectionTitle: 'ವಿಷಯ ವರ್ಗಗಳು (Topic Categories)',
        sectionSubtitle: 'ಶಾಸ್ತ್ರ ಪ್ರಮಾಣ ಮತ್ತು ಶ್ರೀಲ ಪ್ರಭುಪಾದರ ನೇರ ಮಾರ್ಗದರ್ಶನದ ಆಧಾರದ ಮೇಲೆ ಮುಖ್ಯ ವಿಭಾಗಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.',
        guaranteeBannerTitle: 'ಪ್ರಾಮಾಣಿಕತೆಯ ಭರವಸೆ',
        guaranteeBannerText: 'ಪ್ರತಿಯೊಂದು ವಿಷಯ ಮತ್ತು ವಿಧಾನವು ಗೌಡೀಯ ವೈಷ್ಣವ ಸಿದ್ಧಾಂತಕ್ಕೆ ಸಂಪೂರ್ಣವಾಗಿ ಬದ್ಧವಾಗಿದೆ.',
        cards: {
            debate: {
                title: 'ತತ್ತ್ವಶಾಸ್ತ್ರ ಮತ್ತು ಚರ್ಚಾ ಲೇಖನಗಳು',
                subtopic: 'ವೈದಿಕ ತರ್ಕ ಮತ್ತು ಶಾಸ್ತ್ರ ಸಿದ್ಧಾಂತ',
                description: 'ನಾಸ್ತಿಕತೆ ಮತ್ತು ಮಾಯಾವಾದದ ಸವಾಲುಗಳನ್ನು ಶಾಸ್ತ್ರೀಯ ತರ್ಕ ಮತ್ತು ಪ್ರಮಾಣಗಳೊಂದಿಗೆ ಪರಿಹರಿಸುವ ಅಧಿಕೃತ ಲೇಖನಗಳು.',
                badge: '100% ಶಾಸ್ತ್ರ ಪ್ರಮಾಣ',
                highlights: ['ವೈದಿಕ ತರ್ಕ (ಯುಕ್ತಿ)', 'ಸಂಶಯ ಪರಿಹಾರ', 'ದಾರ್ಶನಿಕ ಸಿದ್ಧಾಂತ'],
                actionLabel: 'ಚರ್ಚೆಗಳನ್ನು ಓದಿ',
            },
            stories: {
                title: 'ದಿವ್ಯ ಲೀಲೆಗಳು ಮತ್ತು ಕಥೆಗಳು',
                subtopic: 'ಭಗವಂತ ಮತ್ತು ಭಕ್ತರ ಪವಿತ್ರ ಚರಿತ್ರೆ',
                description: 'ಶ್ರೀಮದ್ಭಾಗವತ, ಮಹಾಭಾರತ ಮತ್ತು ರಾಮಾಯಣದಿಂದ ಭಗವಾನ್ ಶ್ರೀಕೃಷ್ಣನ ದಿವ್ಯ ಲೀಲೆಗಳು ಮತ್ತು ಭಕ್ತರ ಕಥೆಗಳು.',
                badge: 'ಪವಿತ್ರ ಭಕ್ತಿ ರಸ',
                highlights: ['ಕೃಷ್ಣನ ಲೀಲೆಗಳು', 'ಆಚಾರ್ಯರ ಜೀವನ ಚರಿತ್ರೆ', 'ಪೌರಾಣಿಕ ಕಥೆಗಳು'],
                actionLabel: 'ಕಥೆಗಳನ್ನು ಓದಿ',
            },
            calendar: {
                title: 'ವೈಷ್ಣವ ಕ್ಯಾಲೆಂಡರ್ ಮತ್ತು ತಿಥಿಗಳು',
                subtopic: 'ಏಕಾದಶಿ ವ್ರತಗಳು ಮತ್ತು ಪಾರಣ ಸಮಯ',
                description: 'ಪವಿತ್ರ ಏಕಾದಶಿ ವ್ರತದ ದಿನಾಂಕಗಳು, ನಿಖರವಾದ ಪಾರಣ ಸಮಯ ಮತ್ತು ವೈಷ್ಣವ ಹಬ್ಬಗಳ ಅಧಿಕೃತ ಮಾರ್ಗದರ್ಶಿ.',
                badge: 'ಖಗೋಳಶಾಸ್ತ್ರೀಯವಾಗಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
                highlights: ['ಏಕಾದಶಿ ದಿನಾಂಕಗಳು', 'ನಿಖರ ಪಾರಣ ಸಮಯ', 'ಆಚಾರ್ಯರ ಆವಿರ್ಭಾವ ದಿನಗಳು'],
                actionLabel: 'ಕ್ಯಾಲೆಂಡರ್ ವೀಕ್ಷಿಸಿ',
            },
            pooja: {
                title: 'ಪೂಜಾ ವಿಧಿಗಳು ಮತ್ತು ನಿತ್ಯ ನೇಮಗಳು',
                subtopic: 'ಪಾಂಚರಾತ್ರಿಕ ವಿಗ್ರಹ ಪೂಜೆ ಮತ್ತು ಜಪ ವಿಧಿ',
                description: 'ಮನೆಯಲ್ಲಿ ವಿಗ್ರಹ ಆರಾಧನೆ, ಭೋಗ ಅರ್ಪಣಾ ಮಂತ್ರಗಳು, ತುಳಸಿ ಆರತಿ ಮತ್ತು ಜಪ ಧ್ಯಾನದ ಹಂತ-ಹಂತದ ವಿಧಾನ.',
                badge: 'ಪಾಂಚರಾತ್ರ ಪ್ರದೀಪ ಪ್ರಮಾಣ',
                highlights: ['ನಿತ್ಯ ಮನೆ ಪೂಜೆ', 'ಭೋಗ ಸಮರ್ಪಣಾ ಮಂತ್ರ', 'ತುಳಸಿ & ಜಪ ವಿಧಿ'],
                actionLabel: 'ವಿಧಿಗಳನ್ನು ಕಲಿಯಿರಿ',
            },
            diksha: {
                title: 'ಇಸ್ಕಾನ್‌ನಲ್ಲಿ ದೀಕ್ಷಾ ಪ್ರಕ್ರಿಯೆ',
                subtopic: 'ಶ್ರೀಲ ಪ್ರಭುಪಾದರ ನೇರ ದಾಖಲೆಗಳು ಮತ್ತು ನಿರ್ದೇಶನಗಳು',
                description: 'ಜುಲೈ 9, 1977 ರ ಅಧಿಕೃತ ಪತ್ರ ಮತ್ತು ಪ್ರಭುಪಾದರ ನಿರ್ದೇಶನಗಳ ಆಧಾರದ ಮೇಲೆ ದೀಕ್ಷಾ ಪದ್ಧತಿಯ ನಿಷ್ಪಕ್ಷಪಾತ ವಿಶ್ಲೇಷಣೆ.',
                badge: 'ದೃಢೀಕೃತ ದಾಖಲೆಗಳು',
                highlights: ['ಜುಲೈ 9 ನಿರ್ದೇಶನ', 'ಪ್ರಭುಪಾದರ ಇಚ್ಛಾಪತ್ರ', 'ಗುರು ಪರಂಪರೆ ಮುಂದುವರಿಕೆ'],
                actionLabel: 'ದೀಕ್ಷಾ ಪ್ರಕ್ರಿಯೆ ತಿಳಿಯಿರಿ',
            },
            etiquette: {
                title: 'ವೈಷ್ಣವ ಸದಾಚಾರ ಮತ್ತು ಶಿಷ್ಟಾಚಾರ',
                subtopic: 'ಭಕ್ತಿ ಸಂಸ್ಕೃತಿ, ದೈವಿಕ ನಡಾವಳಿ & ಆಧ್ಯಾತ್ಮಿಕ ಜೀವನ',
                description: 'ದೇವತಾ ಪೂಜಾ ವಿಧಿ, ಭಕ್ತರ ಸಂಬಂಧಗಳು, ವಾಕ್ ತಪಸ್ಸು, ಗೃಹಸ್ಥ ಧರ್ಮ ಮತ್ತು ದೈನಂದಿನ ದಿನಚರ್ಯೆಯ ಸಮಗ್ರ ಶಾಸ್ತ್ರೀಯ ಮಾರ್ಗದರ್ಶಿ (10 ವಿಭಾಗಗಳು, 68 ವಿಷಯಗಳು).',
                badge: '100% ಶಾಸ್ತ್ರೀಯ ಸದಾಚಾರ (68 ಲೇಖನಗಳು)',
                highlights: ['ಮಂದಿರ ಮರ್ಯಾದೆ & ಸೇವೆ', 'ಭಕ್ತ ಸೌಹಾರ್ದ ಸಂಬಂಧ', 'ದೈನಂದಿನ ದಿನಚರ್ಯಾ ಪಾಲನೆ'],
                actionLabel: 'ಸದಾಚಾರ ನೋಡಿ',
            },
            festival: {
                title: 'ಹಬ್ಬಗಳ ತಾತ್ಪರ್ಯ (Festival Insights)',
                subtopic: 'ಶಾಸ್ತ್ರೀಯ ಮಹತ್ವ, ವ್ರತ ನಿಯಮಗಳು & ಪವಿತ್ರ ಉತ್ಸವಗಳು',
                description: 'ಪುರಾಣಗಳು ಮತ್ತು ಇತಿಹಾಸಗಳ ಪ್ರಕಾರ ವೈಷ್ಣವ ಹಬ್ಬಗಳ ಆಳವಾದ ತಾತ್ವಿಕ ಅರ್ಥ, ದಿವ್ಯ ಲೀಲೆಗಳು ಮತ್ತು ಆಚರಿಸಬೇಕಾದ ನಿಯಮಗಳು.',
                badge: '100% ಶಾಸ್ತ್ರ ಪ್ರಮಾಣದ ಉತ್ಸವ ಜ್ಞಾನ',
                highlights: ['ದೀಪಾವಳಿ ಶಾಸ್ತ್ರ ಪ್ರಮಾಣ', 'ರಾಮ & ಕೃಷ್ಣ ಲೀಲೆಗಳು', 'ವ್ರತ ನಿಯಮಗಳು'],
                actionLabel: 'ಹಬ್ಬಗಳ ಮಾಹಿತಿ ತಿಳಿಯಿರಿ',
            },
            babyNames: {
                title: 'ವೈದಿಕ ಮತ್ತು ವೈಷ್ಣವ ಶಿಶು ನಾಮಗಳು',
                subtopic: 'ಶ್ರೀ ಕೃಷ್ಣ, ವಿಷ್ಣು, ರಾಧಾ & ಲಕ್ಷ್ಮೀ ಪವಿತ್ರ ನಾಮಗಳು',
                description: 'ವಿಷ್ಣು ಸಹಸ್ರನಾಮ, ರಾಧಾ ಸಹಸ್ರನಾಮ ಮತ್ತು ಭಾಗವತದಿಂದ ನವಜಾತ ಗಂಡು ಮತ್ತು ಹೆಣ್ಣು ಮಕ್ಕಳಿಗೆ ಮಂಗಳಕರವಾದ ದಿವ್ಯ ನಾಮಗಳು, ಅವುಗಳ ಆಧ್ಯಾತ್ಮಿಕ ಅರ್ಥಗಳು ಮತ್ತು ಅಕ್ಷರ ಫಿಲ್ಟರ್‌ಗಳು.',
                badge: '100% ಶಾಸ್ತ್ರೋಕ್ತ ದಿವ್ಯ ನಾಮಗಳು',
                highlights: ['ವಿಷ್ಣು & ಕೃಷ್ಣ ನಾಮಗಳು', 'ರಾಧಾ & ಲಕ್ಷ್ಮೀ ನಾಮಗಳು', '1, 2 ಮತ್ತು 3 ಅಕ್ಷರ ಹುಡುಕಾಟ'],
                actionLabel: 'ದಿವ್ಯ ನಾಮಗಳನ್ನು ಹುಡುಕಿ',
            },
        },
    },
    te: {
        sectionBadge: 'ప్రామాణిక వైదిక మార్గదర్శకత్వం',
        sectionTitle: 'విషయ విభాగాలు (Topic Categories)',
        sectionSubtitle: 'శాస్త్ర ప్రమాణాలు మరియు శ్రీల ప్రభుపాదుల వారి ప్రామాణిక బోధనల ఆధారంగా ముఖ్య విభాగాలను అన్వేషించండి.',
        guaranteeBannerTitle: 'ప్రామాణికత హామీ',
        guaranteeBannerText: 'ప్రతి అంశం గౌడీయ వైష్ణవ సిద్ధాంతానికి మరియు శ్రీల ప్రభుపాదుల బోధనలకు నూటికి నూరు శాతం అనుకూలంగా ఉంటుంది.',
        cards: {
            debate: {
                title: 'తాత్విక మరియు సిద్ధాంత చర్చలు',
                subtopic: 'వైదిక తర్కం, సిద్ధాంతం & సంశయ నివృత్తి',
                description: 'నాస్తిక భావజాలం మరియు మాయావాదంపై తిరుగులేని వైదిక తర్కం మరియు శాస్త్ర ప్రమాణాల ద్వారా నిర్భయమైన వివరణలు.',
                badge: '100% శాస్త్రీయ సిద్ధాంతం',
                highlights: ['వైదిక తర్కం (యుక్తి)', 'సంశయ నివృత్తి', 'భగవంతుని ఉనికికి నిరూపణలు'],
                actionLabel: 'చర్చలను చదవండి',
            },
            stories: {
                title: 'దివ్య లీలలు మరియు కథలు',
                subtopic: 'భగవంతుడు మరియు భక్తుల పావన చరిత్రలు',
                description: 'శ్రీమద్భాగవతం, మహాభారతం మరియు రామాయణం నుండి శ్రీకృష్ణుని దివ్య లీలలు మరియు భక్తుల చరిత్రలు.',
                badge: 'విశుద్ధ భక్తి రసము',
                highlights: ['శ్రీకృష్ణ లీలలు', 'ఆచార్యుల జీవితాలు', 'పౌరాణిక నీతులు'],
                actionLabel: 'లీలలను చదవండి',
            },
            calendar: {
                title: 'వైష్ణవ క్యాలెండర్ మరియు తిథులు',
                subtopic: 'ఏకాదశి వ్రతాలు & ఖచ్చితమైన పారణ సమయాలు',
                description: 'పవిత్ర ఏకాదశి వ్రత దినాలు, ఖగోళ ఆధారిత పారణ సమయాలు మరియు పండుగల సమగ్ర జాబితా.',
                badge: 'ఖగోళశాస్త్ర ప్రామాణికం',
                highlights: ['ఏకాదశి తిథులు', 'ఖచ్చితమైన పారణ సమయాలు', 'ఆచార్యుల ఆవిర్భావ దినాలు'],
                actionLabel: 'క్యాలెండర్ చూడండి',
            },
            pooja: {
                title: 'పూజా విధానాలు & నిత్య నియమాలు',
                subtopic: 'పాంచరాత్రిక విగ్రహ సేవ & భక్తి విధానం',
                description: 'గృహ విగ్రహారాధన, భోగ సమర్పణ మంత్రాలు, తులసి హారతి మరియు జప ధ్యానం యొక్క సరళమైన విధానం.',
                badge: 'పాంచరాత్ర ప్రదీప ప్రమాణం',
                highlights: ['నిత్య గృహ సేవ', 'భోగ సమర్పణ మంత్రాలు', 'తులసి & జప విధులు'],
                actionLabel: 'విధులు నేర్చుకోండి',
            },
            diksha: {
                title: 'ఇస్కాన్‌లో దీక్షా ప్రక్రియ',
                subtopic: 'శ్రీల ప్రభుపాదుల వారి సంతకం చేసిన ఆదేశాలు',
                description: 'జూలై 9, 1977 నాటి అధికారిక పత్రం మరియు ప్రభుపాదుల ఆదేశాల ఆధారంగా దీక్షా విధానం యొక్క ప్రామాణిక విశ్లేషణ.',
                badge: 'ధృవీకరించబడిన ఆధారాలు',
                highlights: ['జూలై 9 ఆదేశాలు', 'ప్రభుపాదుల వీలునామా', 'గురు పరంపర కొనసాగింపు'],
                actionLabel: 'దీక్షా పద్ధతి తెలుసుకోండి',
            },
            etiquette: {
                title: 'వైష్ణవ సదాచారం మరియు ప్రవర్తనా నియమాలు',
                subtopic: 'భక్తి సంస్కృతి, దివ్య శీలము & జీవన విధానం',
                description: 'విగ్రహారాధన పద్ధతులు, భక్తుల సంబంధాలు, వాక్ తపస్సు, గృహస్థ ధర్మం మరియు సంక్షోభ నివారణపై ప్రామాణిక వైష్ణవ నియమావళి (10 విభాగాలు, 68 శీర్షికలు).',
                badge: '100% శాస్త్రీయ సదాచారం (68 వ్యాసాలు)',
                highlights: ['ఆలయ మర్యాదలు & సేవ', 'భక్తుల పరస్పర గౌరవం', 'రోజువారీ దినచర్యా విధానం'],
                actionLabel: 'సదాచారం తెలుసుకోండి',
            },
            festival: {
                title: 'పండుగల తాత్పర్యం (Festival Insights)',
                subtopic: 'శాస్త్రీయ ప్రాముఖ్యత, వ్రత నియమాలు & పవిత్ర ఉత్సవాలు',
                description: 'పురాణాలు మరియు ఇతిహాసాల ప్రకారం వైష్ణవ పండుగల గూఢ తాత్విక రహస్యాలు, దివ్య లీలలు మరియు ఆచరించవలసిన శాస్త్రీయ నియమాలు.',
                badge: '100% శాస్త్రీయ ఉత్సవ రహస్యం',
                highlights: ['దీపావళి శాస్త్ర ప్రమాణం', 'రామ & కృష్ణ లీలలు', 'వ్రత నియమావళి'],
                actionLabel: 'పండుగల వివరాలు చూడండి',
            },
            babyNames: {
                title: 'వైదిక మరియు వైష్ణవ శిశు నామాలు',
                subtopic: 'శ్రీ కృష్ణ, విష్ణు, రాధా & లక్ష్మీ దివ్య నామాలు',
                description: 'విష్ణు సహస్రనామం, రాధా సహస్రనామం మరియు శ్రీమద్భాగవతం నుండి నవజాత బాలురు మరియు బాలికలకు శుభప్రదమైన పవిత్ర నామాలు, వాటి ఆధ్యాత్మిక అర్థాలు మరియు అక్షర ఫిల్టర్లు.',
                badge: '100% శాస్త్రీయ దివ్య నామాలు',
                highlights: ['విష్ణు & కృష్ణ నామాలు', 'రాధా & లక్ష్మీ నామాలు', '1, 2 & 3 అక్షర శోధన'],
                actionLabel: 'నామాలను కనుగొనండి',
            },
        },
    },
    ml: {
        sectionBadge: 'വിശ്വാസ്യമായ വൈദിക മാർഗ്ഗനിർദ്ദേശം',
        sectionTitle: 'വിഷയ വിഭാഗങ്ങൾ (Topic Categories)',
        sectionSubtitle: 'ശാസ്ത്ര പ്രമാണങ്ങളുടെയും ശ്രീല പ്രഭുപാദരുടെ പ്രാമാണിക ഉപദേശങ്ങളുടെയും അടിസ്ഥാനത്തിലുള്ള പ്രധാന അധ്യായങ്ങൾ.',
        guaranteeBannerTitle: 'ആധികാരികതയുടെ ഉറപ്പ്',
        guaranteeBannerText: 'എല്ലാ വിഷയങ്ങളും ആധികാരിക ഗൗഡീയ വൈഷ്ണവ സിദ്ധാന്തത്തോടും ശ്രീല പ്രഭുപാദരുടെ ഉപദേശങ്ങളോടും 100% നീതി പുലർത്തുന്നു.',
        cards: {
            debate: {
                title: 'തത്ത്വചിന്താപരമായ സംവാദങ്ങൾ',
                subtopic: 'വൈദിക തർക്കവും സിദ്ധാന്ത വിശകലനവും',
                description: 'നിരീശ്വരവാദത്തിനും മായാവാദത്തിനുമെതിരെ വൈദിക യുക്തിയും പ്രമാണങ്ങളും അടിസ്ഥാനമാക്കിയുള്ള പ്രൗഢമായ ലേഖനങ്ങൾ.',
                badge: '100% ശാസ്ത്രീയ സിദ്ധാന്തം',
                highlights: ['വൈദിക തർക്കം (യുക്തി)', 'സംശയ നിവാരണം', 'ഈശ്വരന്റെ ശാസ്ത്രീയ തെളിവുകൾ'],
                actionLabel: 'സംവാദങ്ങൾ വായിക്കുക',
            },
            stories: {
                title: 'ദിവ്യ ലീലകളും കഥകളും',
                subtopic: 'ഭഗവാന്റെയും ഭക്തരുടെയും ചരിത്രങ്ങൾ',
                description: 'ശ്രീമദ്ഭാഗവതം, മഹാഭാരതം, രാമായണം എന്നിവയിൽ നിന്നുള്ള ഭഗവാൻ ശ്രീകൃഷ്ണന്റെയും പരിശുദ്ധ ഭക്തരുടെയും ലീലകൾ.',
                badge: 'വിശുദ്ധ ഭക്തിരസം',
                highlights: ['കൃഷ്ണ ലീലകൾ', 'ആചാര്യന്മാരുടെ ജീവചരിത്രം', 'പൗരാണിക കഥകൾ'],
                actionLabel: 'ലീലകൾ വായിക്കുക',
            },
            calendar: {
                title: 'വൈഷ്ണവ കലണ്ടറും തിഥികളും',
                subtopic: 'ഏകാദശി വ്രതങ്ങളും കൃത്യമായ പാരണ സമയവും',
                description: 'ഏകാദശി വ്രത ദിനങ്ങൾ, കൃത്യമായ പാരണ സമയം, വൈഷ്ണവ ഉത്സവങ്ങൾ എന്നിവ അടങ്ങിയ കലണ്ടർ.',
                badge: 'കൃത്യമായി ഗണിച്ചെടുത്തത്',
                highlights: ['ഏകാദശി തീയതികൾ', 'കൃത്യമായ പാരണ സമയം', 'ആചാര്യ ആവിർഭാവ ദിനങ്ങൾ'],
                actionLabel: 'കലണ്ടർ കാണുക',
            },
            pooja: {
                title: 'പൂജാ വിധികളും അനുഷ്ഠാനങ്ങളും',
                subtopic: 'പാഞ്ചരാത്രിക വിഗ്രഹ പൂജയും ജപ വിധിയും',
                description: 'ഭവനങ്ങളിലെ വിഗ്രഹ പൂജ, ഭോഗ സമർപ്പണ മന്ത്രങ്ങൾ, തുളസി ആരതി, ജപ ധ്യാനം എന്നിവയുടെ സമഗ്ര മാർഗ്ഗരേഖ.',
                badge: 'പാഞ്ചരാത്ര പ്രദീപ മാതൃക',
                highlights: ['നിത്യ പൂജാ ക്രമങ്ങൾ', 'ഭോഗ സമർപ്പണ മന്ത്രങ്ങൾ', 'തുളസി & ജപ വിധികൾ'],
                actionLabel: 'വിധികൾ പഠിക്കുക',
            },
            diksha: {
                title: 'ഇസ്‌കോണിലെ ദീക്ഷാ രീതി',
                subtopic: 'ശ്രീല പ്രഭുപാദരുടെ നേരിട്ടുള്ള രേഖകളും നിർദ്ദേശങ്ങളും',
                description: '1977 ജൂലൈ 9-ലെ കത്തും ശ്രീല പ്രഭുപാദരുടെ ഔദ്യോഗിക രേഖകളും ആസ്പദമാക്കിയുള്ള ശാസ്ത്രീയ പഠനം.',
                badge: 'സാക്ഷ്യപ്പെടുത്തിയ രേഖകൾ',
                highlights: ['ജൂലൈ 9 നിർദ്ദേശം', 'പ്രഭുപാദരുടെ വിൽപ്പത്രം', 'പരമ്പര തുടർച്ച'],
                actionLabel: 'ദീക്ഷാ രീതി അറിയുക',
            },
            etiquette: {
                title: 'വൈഷ്ണവ സദാചാരവും മര്യാദകളും',
                subtopic: 'ഭക്തി സംസ്കാരം, ആത്മീയ ഗുണങ്ങൾ & ജീവിതരീതി',
                description: 'ക്ഷേത്ര ആരാധനാ മര്യാദകൾ, ഭക്ത ബന്ധങ്ങൾ, വാക് തപസ്സ്, ഗൃഹസ്ഥ ധർമ്മം, പ്രതിസന്ധി കൈകാര്യം ചെയ്യൽ എന്നിവ സംബന്ധിച്ച സമഗ്ര ഗ്രന്ഥം (68 വിഷയങ്ങൾ).',
                badge: '100% ശാസ്ത്രീയ സദാചാരം (68 ലേഖനങ്ങൾ)',
                highlights: ['ക്ഷേത്ര മര്യാദകൾ', 'ഭക്ത സൗഹൃദ ബന്ധങ്ങൾ', 'ദൈനംദിന ദിനചര്യ ചട്ടങ്ങൾ'],
                actionLabel: 'സദാചാരം പഠിക്കുക',
            },
            festival: {
                title: 'ഉത്സവ തത്ത്വചിന്ത (Festival Insights)',
                subtopic: 'ശാസ്ത്രീയ പ്രാധാന്യം, വ്രതാനുഷ്ഠാനങ്ങൾ & പവിത്ര ദിനങ്ങൾ',
                description: 'പുരാണങ്ങളുടെയും ഇതിഹാസങ്ങളുടെയും വെളിച്ചത്തിൽ വൈഷ്ണവ ഉത്സവങ്ങളുടെ ആഴത്തിലുള്ള തത്ത്വചിന്ത, ദിവ്യ ലീലകൾ, ആചാര മര്യാദകൾ.',
                badge: '100% ശാസ്ത്രീയ ആഘോഷ വിജ്ഞാനം',
                highlights: ['ദീപാവലി ശാസ്ത്ര പ്രമാണം', 'രാമ & കൃഷ്ണ ലീലകൾ', 'വ്രത നിഷ്ഠകൾ'],
                actionLabel: 'ഉത്സവ വിശേഷങ്ങൾ അറിയുക',
            },
            babyNames: {
                title: 'വൈദിക വൈഷ്ണവ ശിശു നാമങ്ങൾ',
                subtopic: 'ശ്രീ കൃഷ്ണ, വിഷ്ണു, രാധാ & ലക്ഷ്മീ പുണ്യ നാമങ്ങൾ',
                description: 'വിഷ്ണു സഹസ്രനാമം, രാധാ സഹസ്രനാമം, ഭാഗവതം എന്നിവയിൽ നിന്നുള്ള നവജാത ശിശുക്കൾക്കുള്ള മംഗളകരമായ ദിവ്യ നാമങ്ങൾ, ആത്മീയ അർത്ഥങ്ങൾ, അക്ഷരാടിസ്ഥാനത്തിലുള്ള ഫിൽട്ടറുകൾ.',
                badge: '100% ശാസ്ത്രീയ ദിവ്യ നാമങ്ങൾ',
                highlights: ['വിഷ്ണു & കൃഷ്ണ നാമങ്ങൾ', 'രാധാ & ലക്ഷ്മീ നാമങ്ങൾ', '1, 2 & 3 അക്ഷര തിരച്ചിൽ'],
                actionLabel: 'നാമങ്ങൾ കണ്ടെത്തുക',
            },
        },
    },
    bn: {
        sectionBadge: 'প্রামাণিক বৈদিক প্রবেশদ্বার',
        sectionTitle: 'বিষয় বিভাগসমূহ (Topic Categories)',
        sectionSubtitle: 'শাস্ত্রীয় প্রমাণ এবং শ্রীল প্রভুপাদের মূল শিক্ষার ভিত্তিতে মৌলিক অধ্যায়সমূহ অন্বেষণ করুন।',
        guaranteeBannerTitle: 'প্রামাণিকতার নিশ্চয়তা',
        guaranteeBannerText: 'প্রতিটি বিষয় ও পূজা প্রণালী খাঁটি গৌড়ীয় বৈষ্ণব সিদ্ধান্তের সাথে ১০০% সামঞ্জস্যপূর্ণ।',
        cards: {
            debate: {
                title: 'দার্শনিক ও তত্ত্ব বিতর্ক বিষয়',
                subtopic: 'বৈদিক যুক্তি ও শাস্ত্রীয় সিদ্ধান্ত',
                description: 'অনস্বীকার্য বৈদিক যুক্তি (যুক্তি) এবং শাস্ত্রীয় প্রমাণ (শব্দপ্রমাণ) দ্বারা নাস্তিকতা ও দার্শনিক সন্দেহের নিরসন।',
                badge: '১০০% শাস্ত্রীয় সিদ্ধান্ত',
                highlights: ['বৈদিক যুক্তি (যুক্তি)', 'সন্দেহ নিরসন', 'ভগবানের অস্তিত্বের প্রমাণ'],
                actionLabel: 'বিতর্ক প্রবন্ধ পড়ুন',
            },
            stories: {
                title: 'লীলা ও পবিত্র ভক্তগাথা',
                subtopic: 'ভগবান ও শুদ্ধ ভক্তদের অপ্রাকৃত কথা',
                description: 'শ্রীমদ্ভাগবত, মহাভারত ও রামায়ণ থেকে ভগবান শ্রীকৃষ্ণের দিব্য লীলা ও মহান বৈষ্ণবদের ভক্তিময় জীবনী।',
                badge: 'বিশুদ্ধ ভক্তিরস অমৃত',
                highlights: ['শ্রীকৃষ্ণ লীলা', 'আচার্যদের মহিমা', 'পৌরাণিক অমৃতকথা'],
                actionLabel: 'লীলাকথা পাঠ করুন',
            },
            calendar: {
                title: 'বৈষ্ণব পঞ্জিকা ও তিথিসমূহ',
                subtopic: 'একাদশী ব্রত ও নির্ভুল পারণ সময়সূচি',
                description: 'পবিত্র একাদশী উপবাস, নির্ভুল স্থানীয় পারণ সময় এবং বৈষ্ণব উৎসবের দিনপঞ্জি।',
                badge: 'জ্যোতির্বিজ্ঞান নির্ভুল',
                highlights: ['একাদশী তিথি তালিকা', 'সঠিক পারণ সময়', 'আবির্ভাব তিথিসমূহ'],
                actionLabel: 'পঞ্জিকা দেখুন',
            },
            pooja: {
                title: 'পূজা বিধি ও নিত্য ধর্মানুষ্ঠান',
                subtopic: 'পঞ্চরাত্রিক শ্রীবিগ্রহ সেবা ও ভোগ নিবেদন',
                description: 'গৃহমন্দিরে বিগ্রহ সেবা, তুলসী আরতি, ভগবানকে ভোগ নিবেদনের বৈদিক মন্ত্র ও হরিনাম জপের নিয়মাবলী।',
                badge: 'পঞ্চরাত্র প্রদীপ মানদণ্ড',
                highlights: ['নিত্য বিগ্রহ সেবা', 'ভোগ নিবেদন মন্ত্র', 'তুলসী ও জপ বিধি'],
                actionLabel: 'বিধি শিখুন',
            },
            diksha: {
                title: 'ইসকনে দীক্ষা গ্রহণের প্রণালী',
                subtopic: 'শ্রীল প্রভুপাদের স্বাক্ষরিত নির্দেশ ও সমাধান',
                description: '৯ই জুলাই ১৯৭৭ সালের স্বাক্ষরিত নির্দেশনামা এবং শ্রীল প্রভুপাদের ঐতিহাসিক দলিলের প্রামাণিক বিশ্লেষণ।',
                badge: 'যাচাইকৃত ঐতিহাসিক দলিল',
                highlights: ['৯ই জুলাই নির্দেশ', 'প্রভুপাদের ইচ্ছাপত্র', 'পরম্পরার ধারাবাহিকতা'],
                actionLabel: 'দীক্ষা পদ্ধতি জানুন',
            },
            etiquette: {
                title: 'বৈষ্ণব সদাচার ও শিষ্টাচার',
                subtopic: 'ভক্তি সংস্কৃতি, দিব্য চরিত্র ও পারমার্থিক জীবন',
                description: 'বিগ্রহ সেবা বিধি, ভক্ত সঙ্গের শিষ্টাচার, বাক্য সংযম, গৃহস্থ ধর্ম ও সংকট প্রতিরোধের প্রামাণিক শাস্ত্রীয় নির্দেশিকা (১০টি বিভাগ, ৬৮টি নিবন্ধ)।',
                badge: '১০০% শাস্ত্রীয় সদাচার (৬৮টি নিবন্ধ)',
                highlights: ['মন্দির শিষ্টাচার ও সেবা', 'ভক্ত পারস্পরিক প্রীতি', 'দৈনন্দিন দিনচর্যা বিধি'],
                actionLabel: 'সদাচার জানুন',
            },
            festival: {
                title: 'উৎসব তত্ত্ব ও তাৎপর্য (Festival Insights)',
                subtopic: 'শাস্ত্রীয় তাৎপর্য, ব্রত বিধান ও পবিত্র মহোৎসব',
                description: 'পুরাণ ও ইতিহাস অনুসারে বৈষ্ণব মহোৎসবের গভীর দার্শনিক তত্ত্ব, অপ্রাকৃত লীলা এবং শাস্ত্রীয় করণীয় ও বর্জনীয় আচরণবিধি।',
                badge: '১০০% শাস্ত্রীয় উৎসব তত্ত্ব',
                highlights: ['দীপাবলি শাস্ত্র প্রমাণ', 'শ্রীরাম ও কৃষ্ণ লীলা', 'উৎসবের সদাচার বিধান'],
                actionLabel: 'উৎসবের তথ্য জানুন',
            },
            babyNames: {
                title: 'বৈদিক ও বৈষ্ণব শিশুর পবিত্র নাম',
                subtopic: 'শ্রীকৃষ্ণ, শ্রীবিষ্ণু, শ্রীমতী রাধারাণী ও লক্ষ্মীদেবীর অপ্রাকৃত নাম',
                description: 'বিষ্ণু সহস্রনাম, রাধা সহস্রনাম এবং শ্রীমদ্ভাগবত থেকে নবজাতক বালক ও বালিকাদের জন্য পরম কল্যাণময় পারমার্থিক নাম, তাদের শাস্ত্রীয় অর্থ ও আদ্যক্ষর ভিত্তিক ফিল্টার।',
                badge: '১০০% শাস্ত্রীয় পরম পবিত্র নাম',
                highlights: ['বিষ্ণু ও কৃষ্ণ নাম', 'রাধা ও লক্ষ্মী নাম', '১, ২ ও ৩ অক্ষর অনুসন্ধান'],
                actionLabel: 'পবিত্র নাম খুঁজুন',
            },
        },
    },
};

export default function TopicCategoriesSection() {
    const { locale } = useLanguage();
    const content = LOCALIZED_CONTENT[locale] || LOCALIZED_CONTENT.en;

    const cards: CategoryCardData[] = [
        {
            id: 'philosophical-debates',
            number: '01',
            title: content.cards.debate.title,
            subtopic: content.cards.debate.subtopic,
            description: content.cards.debate.description,
            href: '/debate',
            badge: content.cards.debate.badge,
            highlights: content.cards.debate.highlights,
            actionLabel: content.cards.debate.actionLabel,
            gradient: 'from-blue-500/[0.08] via-indigo-500/[0.03] to-sky-500/[0.06] dark:from-blue-900/30 dark:via-neutral-900/90 dark:to-indigo-900/20',
            borderHover: 'hover:border-blue-500/60 dark:hover:border-blue-400/50 hover:shadow-blue-500/10',
            badgeStyle: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/20',
            iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-500/25',
            iconColor: 'text-blue-500 dark:text-blue-400',
            IconComponent: Scale,
        },
        {
            id: 'stories-pastimes',
            number: '02',
            title: content.cards.stories.title,
            subtopic: content.cards.stories.subtopic,
            description: content.cards.stories.description,
            href: '/stories',
            badge: content.cards.stories.badge,
            highlights: content.cards.stories.highlights,
            actionLabel: content.cards.stories.actionLabel,
            gradient: 'from-amber-500/[0.08] via-yellow-500/[0.03] to-orange-500/[0.06] dark:from-amber-900/30 dark:via-neutral-900/90 dark:to-yellow-900/20',
            borderHover: 'hover:border-amber-500/60 dark:hover:border-amber-400/50 hover:shadow-amber-500/10',
            badgeStyle: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20',
            iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-amber-500/25',
            iconColor: 'text-amber-500 dark:text-amber-400',
            IconComponent: BookOpen,
        },
        {
            id: 'vaishnava-calendar',
            number: '03',
            title: content.cards.calendar.title,
            subtopic: content.cards.calendar.subtopic,
            description: content.cards.calendar.description,
            href: '/vaishnava-calendar',
            badge: content.cards.calendar.badge,
            highlights: content.cards.calendar.highlights,
            actionLabel: content.cards.calendar.actionLabel,
            gradient: 'from-emerald-500/[0.08] via-teal-500/[0.03] to-cyan-500/[0.06] dark:from-emerald-900/30 dark:via-neutral-900/90 dark:to-teal-900/20',
            borderHover: 'hover:border-emerald-500/60 dark:hover:border-emerald-400/50 hover:shadow-emerald-500/10',
            badgeStyle: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
            iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/25',
            iconColor: 'text-emerald-500 dark:text-emerald-400',
            IconComponent: Calendar,
        },
        {
            id: 'pooja-vidhis',
            number: '04',
            title: content.cards.pooja.title,
            subtopic: content.cards.pooja.subtopic,
            description: content.cards.pooja.description,
            href: '/pooja-vidhis',
            badge: content.cards.pooja.badge,
            highlights: content.cards.pooja.highlights,
            actionLabel: content.cards.pooja.actionLabel,
            gradient: 'from-orange-500/[0.08] via-amber-500/[0.03] to-red-500/[0.06] dark:from-orange-900/30 dark:via-neutral-900/90 dark:to-red-900/20',
            borderHover: 'hover:border-orange-500/60 dark:hover:border-orange-400/50 hover:shadow-orange-500/10',
            badgeStyle: 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/20',
            iconBg: 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-orange-500/25',
            iconColor: 'text-orange-500 dark:text-orange-400',
            IconComponent: Flame,
        },
        {
            id: 'diksha-process',
            number: '05',
            title: content.cards.diksha.title,
            subtopic: content.cards.diksha.subtopic,
            description: content.cards.diksha.description,
            href: '/ritvik-system',
            badge: content.cards.diksha.badge,
            highlights: content.cards.diksha.highlights,
            actionLabel: content.cards.diksha.actionLabel,
            gradient: 'from-purple-500/[0.08] via-indigo-500/[0.03] to-fuchsia-500/[0.06] dark:from-purple-900/30 dark:via-neutral-900/90 dark:to-indigo-900/20',
            borderHover: 'hover:border-purple-500/60 dark:hover:border-purple-400/50 hover:shadow-purple-500/10',
            badgeStyle: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/20',
            iconBg: 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-purple-500/25',
            iconColor: 'text-purple-500 dark:text-purple-400',
            IconComponent: ShieldCheck,
        },
        {
            id: 'vaishnava-etiquettes',
            number: '06',
            title: content.cards.etiquette.title,
            subtopic: content.cards.etiquette.subtopic,
            description: content.cards.etiquette.description,
            href: '/vaishnava-etiquettes',
            badge: content.cards.etiquette.badge,
            highlights: content.cards.etiquette.highlights,
            actionLabel: content.cards.etiquette.actionLabel,
            gradient: 'from-amber-600/[0.09] via-yellow-600/[0.04] to-rose-500/[0.06] dark:from-amber-950/40 dark:via-neutral-900/90 dark:to-orange-950/20',
            borderHover: 'hover:border-amber-600/70 dark:hover:border-amber-400/60 hover:shadow-amber-500/15',
            badgeStyle: 'bg-amber-600/15 text-amber-800 dark:text-amber-200 border-amber-600/25',
            iconBg: 'bg-gradient-to-br from-amber-600 via-orange-600 to-yellow-600 text-white shadow-amber-600/30',
            iconColor: 'text-amber-600 dark:text-amber-400',
            IconComponent: HeartHandshake,
        },
        {
            id: 'festival-insights',
            number: '07',
            title: content.cards.festival.title,
            subtopic: content.cards.festival.subtopic,
            description: content.cards.festival.description,
            href: '/festival-insights',
            badge: content.cards.festival.badge,
            highlights: content.cards.festival.highlights,
            actionLabel: content.cards.festival.actionLabel,
            gradient: 'from-rose-500/[0.08] via-amber-500/[0.03] to-orange-500/[0.06] dark:from-rose-950/40 dark:via-neutral-900/90 dark:to-amber-950/20',
            borderHover: 'hover:border-rose-500/60 dark:hover:border-rose-400/50 hover:shadow-rose-500/10',
            badgeStyle: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/20',
            iconBg: 'bg-gradient-to-br from-rose-500 via-amber-500 to-orange-500 text-white shadow-rose-500/25',
            iconColor: 'text-rose-500 dark:text-rose-400',
            IconComponent: Sparkles,
        },
        {
            id: 'baby-names',
            number: '08',
            title: content.cards.babyNames.title,
            subtopic: content.cards.babyNames.subtopic,
            description: content.cards.babyNames.description,
            href: '/baby-names',
            badge: content.cards.babyNames.badge,
            highlights: content.cards.babyNames.highlights,
            actionLabel: content.cards.babyNames.actionLabel,
            gradient: 'from-pink-500/[0.08] via-rose-500/[0.03] to-amber-500/[0.06] dark:from-pink-950/40 dark:via-neutral-900/90 dark:to-rose-950/20',
            borderHover: 'hover:border-pink-500/60 dark:hover:border-pink-400/50 hover:shadow-pink-500/10',
            badgeStyle: 'bg-pink-500/15 text-pink-700 dark:text-pink-300 border-pink-500/20',
            iconBg: 'bg-gradient-to-br from-pink-500 via-rose-500 to-amber-500 text-white shadow-pink-500/25',
            iconColor: 'text-pink-500 dark:text-pink-400',
            IconComponent: Baby,
        },
    ];

    return (
        <section
            id="topic-categories"
            aria-label="Topic Categories"
            className="w-full bg-background-light dark:bg-background-dark pt-4 pb-10 transition-colors duration-200"
        >
            <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-neutral-200/80 dark:border-neutral-800"
                >
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/15 dark:bg-amber-400/10 text-amber-700 dark:text-amber-400 font-bold uppercase tracking-[0.2em] text-[11px] rounded-full border border-amber-500/20 mb-2.5 shadow-sm">
                            <Compass size={13} className="text-amber-600 dark:text-amber-400" />
                            <span>{content.sectionBadge}</span>
                            <Sparkles size={11} className="text-amber-500" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-neutral-900 dark:text-white">
                            {content.sectionTitle}
                        </h2>
                        <p className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                            {content.sectionSubtitle}
                        </p>
                    </div>

                    {/* Authenticity Guarantee Pill */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 border border-emerald-500/25 shadow-sm text-xs font-bold text-emerald-800 dark:text-emerald-300 shrink-0 self-start md:self-end">
                        <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>100% Authentic Siddhanta Guaranteed</span>
                    </div>
                </motion.div>

                {/* Grid of Category Cards: 3 columns on large screens, 2 on medium, 1 on mobile — dynamic for all categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {cards.map((card, cardIdx) => {
                        const Icon = card.IconComponent;

                        return (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{
                                    duration: 0.5,
                                    delay: cardIdx * 0.08,
                                    ease: [0.21, 0.47, 0.32, 0.98],
                                }}
                                whileHover={{ y: -6, transition: { duration: 0.22, ease: 'easeOut' } }}
                                className="w-full flex flex-col"
                            >
                                <Link
                                    href={card.href}
                                    aria-label={`Navigate to ${card.title}`}
                                    className={`group relative flex-1 flex flex-col justify-between overflow-hidden rounded-2xl md:rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#1f1a12] bg-gradient-to-br ${card.gradient} border border-neutral-200/90 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300 ${card.borderHover}`}
                                >
                                {/* Top Glow Accent */}
                                <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-125" />

                                <div>
                                    {/* Card Header: Number Badge, Authenticity Badge & Icon */}
                                    <div className="flex items-center justify-between gap-3 mb-4">
                                        <div className="flex items-center gap-2">
                                            {/* Number Index */}
                                            <span className="text-xs font-black tracking-widest px-2.5 py-1 rounded-lg bg-neutral-900/5 dark:bg-white/10 text-neutral-600 dark:text-neutral-300 font-mono">
                                                {card.number}
                                            </span>

                                            {/* Authenticity Badge */}
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold rounded-full border ${card.badgeStyle}`}>
                                                <CheckCircle2 size={11} className="shrink-0" />
                                                <span className="truncate max-w-[150px] sm:max-w-none">{card.badge}</span>
                                            </span>
                                        </div>

                                        {/* Category Icon */}
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.iconBg} shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                            <Icon size={22} />
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white tracking-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                                        {card.title}
                                    </h3>

                                    {/* Subtopic with subtle gradient bar */}
                                    <div className="mt-1 mb-3 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                        <p className="text-xs sm:text-[13px] font-bold text-amber-700 dark:text-amber-300 tracking-wide line-clamp-1">
                                            {card.subtopic}
                                        </p>
                                    </div>

                                    {/* Description */}
                                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-5 line-clamp-3">
                                        {card.description}
                                    </p>

                                    {/* Subtopic Highlights / Pills */}
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6">
                                        {card.highlights.map((highlight, hIdx) => (
                                            <span
                                                key={hIdx}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-100/80 dark:bg-neutral-800/80 border border-neutral-200/60 dark:border-neutral-700/60 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 group-hover:bg-white dark:group-hover:bg-neutral-700 transition-colors"
                                            >
                                                <ScrollText size={10} className="text-amber-500 shrink-0" />
                                                <span>{highlight}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Bottom Action Navigation Bar */}
                                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                    <span className="flex items-center gap-1.5">
                                        <span>{card.actionLabel}</span>
                                    </span>
                                    <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 group-hover:translate-x-1 shadow-sm">
                                        <ArrowRight size={15} />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                        );
                    })}
                </div>

                {/* Footer Assurance Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-20px' }}
                    transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
                    className="mt-8 p-4 sm:p-5 rounded-2xl bg-amber-500/[0.06] dark:bg-neutral-900/60 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                            <Sparkles size={18} />
                        </div>
                        <div>
                            <h4 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white">
                                {content.guaranteeBannerTitle}
                            </h4>
                            <p className="text-[11px] sm:text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                                {content.guaranteeBannerText}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-bold text-amber-700 dark:text-amber-400 shrink-0">
                        <span>Srila Prabhupada Standard</span>
                        <CheckCircle2 size={13} className="text-emerald-500" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
