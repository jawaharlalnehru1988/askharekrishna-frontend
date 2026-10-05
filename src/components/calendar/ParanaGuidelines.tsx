'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Sunrise, BookOpen, X, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Locale } from '@/lib/dictionaries';
import { EkadashiGuideModal } from './EkadashiGuideModal';

interface ParanaGuidelinesProps {
    locale: Locale;
    breakFastWindow?: string | null;
    breakFastDate?: string | null;
    breakFastDayOfWeek?: string | null;
    isEkadashi?: boolean;
}

const PARANA_CONTENT: Record<string, {
    sectionTitle: string;
    timingLabel: string;
    subLabel: string;
    readBtnLabel: string;
    clickToRead: string;
    modalSubtitle: string;
    closeBtn: string;
    content: string;
}> = {
    en: {
        sectionTitle: "Rules & Spiritual Injunctions for Breaking the Fast (Parana)",
        timingLabel: "Parana (Break Fast) Window",
        subLabel: "Following Day (Dvadashi) Parana",
        readBtnLabel: "Read Parana Rules & Pastime",
        clickToRead: "Click to Read",
        modalSubtitle: "Scriptural Injunctions & Pastime of Maharaja Ambarisha",
        closeBtn: "Close",
        content: `
#### 1. What is Parana?
**Parana** refers to the sacred act of breaking an Ekadashi fast at the scripturally calculated auspicious time on Dvadashi (the twelfth lunar day). According to the injunctions of *Hari-bhakti-vilasa* by Srila Sanatana Gosvami, an Ekadashi fast must be broken after local sunrise on Dvadashi, strictly within the calculated astronomical window. Breaking the fast either too early or too late diminishes the transcendental benefit of the vrata.

---

#### 2. Sacred Pastime from Srimad-Bhagavatam: Maharaja Ambarisha and Durvasa Muni
The paramount importance of breaking the fast within the Dvadashi window is illuminated in the pastime of the great Vaishnava King **Maharaja Ambarisha**. Having strictly observed the Ekadashi vrata for an entire year, Maharaja Ambarisha was preparing to break his fast on Dvadashi morning when the powerful mystic sage **Durvasa Muni** arrived as his honored guest.

The king respectfully invited Durvasa Muni to accept lunch prasadam. The sage accepted and went to bathe in the holy Yamuna River. However, the Dvadashi tithi was rapidly concluding. If Maharaja Ambarisha did not break his fast within the prescribed moment, his sacred vrata would be broken; yet if he ate before his guest, he would commit an offense to an exalted sage.

Consulting learned Vaishnava brahmanas, Maharaja Ambarisha drank only a few drops of **sacred Caranamrita (sanctified water from Bhagavan Sri Krishna's lotus feet)**. By drinking water, the fast was technically broken according to sastric injunction, yet he did not formally eat before his guest, upholding flawless Vaishnava etiquette.

---

#### 3. How to Observe Parana
1. **Morning Devotions:** Rise during Brahma-muhurta, bathe, perform deity worship, and chant the Hare Krishna Maha-Mantra.
2. **Honor Bhagavan's Prasadam:** Break the fast by honoring **Krishna-Mahaprasadam** containing grains that have been lovingly prepared and offered to the Lord.
3. **Chant Prasadam Prayers:** Sing *Sarira Avidya-Jal* with deep gratitude, remembering Srila Prabhupada's instructions that honoring prasadam is pure devotional service.
`
    },
    ta: {
        sectionTitle: "ஏகாதசி விரத முடிவு (பாரணை) விதிமுறைகளும் ஆன்மீக முக்கியத்துவமும்",
        timingLabel: "பார்ணை நேரம் (Break Fast Window)",
        subLabel: "அடுத்த நாள் (துவாதசி) உபவாசம் முடித்தல்",
        readBtnLabel: "பாரணை விதிகள் & சரித்திரம்",
        clickToRead: "படிக்க கிளிக் செய்யவும்",
        modalSubtitle: "சாஸ்திர விதிகள் மற்றும் அம்பரீஷ மகாராஜரின் சரித்திரம்",
        closeBtn: "மூடுக",
        content: `
#### 1. பாரணை என்றால் என்ன?
ஏகாதசி விரதத்தை சாஸ்திர விதிகளின்படி குறிப்பிட்ட சுப முகூர்த்தத்தில் பூர்த்தி செய்து உணவேற்பது **'பாரணை' (Parana)** எனப்படும். துவாதசி திதியன்று, சூரியோதயத்திற்குப் பிறகு, துவாதசி முடிவதற்குள் அல்லது ஹரிவாசரம் கழிந்த பிறகு நிர்ணயிக்கப்பட்ட நேரத்திற்குள் பாரணை செய்வது மிகவும் அவசியமாகும். 

சாஸ்திரத்தின்படி, குறிப்பிட்ட நேரத்திற்குள் பாரணை செய்யாவிட்டால் ஏகாதசி விரதத்தின் முழுப் பலனையும் இழக்க நேரிடும் என்று ஸ்ரீல சனாதன கோஸ்வாமி *ஹரி-பக்தி-விலாசம்* நூலில் குறிப்பிடுகிறார்.

---

#### 2. ஸ்ரீமத் பாகவதத்திலிருந்து திவ்ய சரித்திரம்: அம்பரீஷ மகாராஜரின் பக்தி
ஒன்பதாவது ஸ்கந்தத்தில் விவரிக்கப்பட்டுள்ளபடி, மாமன்னர் அம்பரீஷர் தமது ராணியுடன் ஓராண்டு காலம் ஏகாதசி விரதத்தை தீவிர நிஷ்டையுடன் அனுசரித்து வந்தார். விரத முடிவின் போது துர்வாச முனிவர் அங்கு வருகை தந்தார். மன்னர் அவரை விருந்துண்ண அழைத்தார். முனிவர் யமுனையில் நீராடச் சென்றார். ஆனால் துவாதசி திதி முடிவடைய மிகக் குறைந்த நேரமே எஞ்சியிருந்தது.

துவாதசி முடிவதற்குள் விரதத்தை முடிக்காவிட்டால் விரத பங்கம் ஏற்படும்; முனிவர் வருவதற்கு முன் உணவருந்தினால் அதிதி அவமரியாதை ஏற்படும். இந்த இக்கட்டான சூழலில், அம்பரீஷ மன்னர் பக்தர்களின் வழிகாட்டுதலின்படி, சிறிதளவு **பகவானின் பாத தீர்த்தமான சரணாமிர்தத்தை** மட்டும் பருகி, சாஸ்திர விதிகளையும் காத்து முனிவரின் மரியாதையையும் பாதுகாத்தார்!

---

#### 3. பாரணை செய்யும் முறை
1. **காலையில் நீராடி தூய ஆடை அணிதல்:** அதிகாலையில் எழுந்து நீராடி, மங்கள ஆரத்தியில் பங்கேற்று பகவானைத் தியானிக்க வேண்டும்.
2. **பகவான் ஸ்ரீ கிருஷ்ணருக்கு நெய்வேத்தியம்:** பகவானுக்கு அர்ப்பணிக்கப்பட்ட தானிய மகாபிரசாதத்தைக் கொண்டு விரதத்தை முடிக்க வேண்டும்.
3. **மகாபிரசாதத்தை கௌரவித்தல்:** *‘சரீர அவித்யா-ஜால்... மகா-பிரசாதே கோவிந்தே’* என்ற பிரசாதப் பிரார்த்தனையைப் பாடி, ஸ்ரீல பிரபுபாதரின் உபதேசங்களின்படி பக்தி சிரத்தையுடன் பிரசாதத்தை ஏற்க வேண்டும்.
`
    },
    hi: {
        sectionTitle: "एकादशी व्रत पारण के नियम एवं आध्यात्मिक महत्व",
        timingLabel: "पारण समय (Break Fast Window)",
        subLabel: "अगले दिन (द्वादशी) व्रत समाप्ति",
        readBtnLabel: "पारण नियम एवं पावन प्रसंग",
        clickToRead: "पढ़ने के लिए क्लिक करें",
        modalSubtitle: "शास्त्रोक्त नियम एवं महाराज अम्बरीष का पावन प्रसंग",
        closeBtn: "बंद करें",
        content: `
#### 1. पारण क्या है?
एकादशी व्रत को शास्त्रों के नियमानुसार द्वादशी तिथि के शुभ मुहूर्त में पूरा करके अन्न ग्रहण करने को **'पारण' (Parana)** कहा जाता है। श्रील सनातन गोस्वामी द्वारा रचित *हरि-भक्ति-विलास* के अनुसार, द्वादशी के दिन स्थानीय सूर्योदय के बाद और निर्धारित मुहूर्त के भीतर पारण करना अत्यंत अनिवार्य है। समय से पूर्व अथवा समय बीत जाने के बाद पारण करने से एकादशी व्रत का पूर्ण आध्यात्मिक फल प्राप्त नहीं होता।

---

#### 2. श्रीमद्भागवतम् से पावन प्रसंग: महाराज अम्बरीष और दुर्वासा मुनि
द्वादशी के शुभ मुहूर्त में पारण करने के महत्व को महान वैष्णव राजा **महाराज अम्बरीष** के दिव्य चरित्र से समझा जा सकता है। उन्होंने पूरे एक वर्ष तक एकादशी व्रत का निष्ठापूर्वक पालन किया। द्वादशी की प्रातः जब वे पारण करने वाले थे, तब परम तपस्वी **दुर्वासा मुनि** उनके अतिथि बनकर पधारे।

राजा ने दुर्वासा मुनि को आदरपूर्वक प्रसाद ग्रहण करने का निमंत्रण दिया। मुनिराज यमुना स्नान के लिए चले गए, परंतु द्वादशी तिथि समाप्त होने में बहुत कम समय शेष था। यदि महाराज निर्धारित समय में पारण न करते तो व्रत भंग हो जाता, और यदि अतिथि से पहले भोजन करते तो वैष्णव अपराध होता।

विद्वान वैष्णव ब्राह्मणों के परामर्श से महाराज अम्बरीष ने केवल कुछ बूंद **भगवान श्रीकृष्ण के चरणकमलों का पावन चरणामृत** ग्रहण किया। जल ग्रहण करने से शास्त्रानुसार पारण भी हो गया और उन्होंने अन्न न खाकर दुर्वासा मुनि के प्रति उचित शिष्टाचार का भी पालन किया।

---

#### 3. पारण करने की विधि
1. **प्रातः कालीन भक्ति:** ब्रह्म-मुहूर्त में उठें, स्नान करें, मंगल आरती में भाग लें और हरे कृष्ण महामंत्र का जप करें।
2. **भगवान के प्रसाद से पारण:** भगवान श्रीकृष्ण को प्रेमपूर्वक अर्पित किए गए शुद्ध अन्न-महाप्रसाद को ग्रहण करके व्रत खोलें।
3. **प्रसाद-प्रार्थना:** *'शरीर अविद्या-जाल... महाप्रसादे गोविन्दे'* प्रार्थना गाते हुए श्रील प्रभुपाद के उपदेशों के अनुसार श्रद्धापूर्वक महाप्रसाद का सम्मान करें।
`
    },
    kn: {
        sectionTitle: "ಏಕಾದಶಿ ವ್ರತ ಪಾರಣೆ ನಿಯಮಗಳು ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಮಹತ್ವ",
        timingLabel: "ಪಾರಣೆ ಸಮಯ (Break Fast Window)",
        subLabel: "ಮರುದಿನ (ದ್ವಾದಶಿ) ವ್ರತ ಮುಕ್ತಾಯ",
        readBtnLabel: "ಪಾರಣೆ ನಿಯಮಗಳು ಮತ್ತು ಲೀಲೆ",
        clickToRead: "ಓದಲು ಕ್ಲಿಕ್ ಮಾಡಿ",
        modalSubtitle: "ಶಾಸ್ತ್ರೋಕ್ತ ನಿಯಮಗಳು ಮತ್ತು ಮಹಾರಾಜ ಅಂಬರೀಷರ ಲೀಲೆ",
        closeBtn: "ಮುಚ್ಚಿ",
        content: `
#### 1. ಪಾರಣೆ ಎಂದರೇನು?
ಏಕಾದಶಿ ವ್ರತವನ್ನು ಶಾಸ್ತ್ರೋಕ್ತವಾಗಿ ದ್ವಾದಶಿಯ ಶುಭ ಮುಹೂರ್ತದಲ್ಲಿ ಮುಕ್ತಾಯಗೊಳಿಸಿ ಪ್ರಸಾದ ಸ್ವೀಕರಿಸುವುದನ್ನು **'ಪಾರಣೆ' (Parana)** ಎನ್ನಲಾಗುತ್ತದೆ. ಶ್ರೀಲ ಸನಾತನ ಗೋಸ್ವಾಮಿಗಳ *ಹರಿ-ಭಕ್ತಿ-ವಿಲಾಸ* ಗ್ರಂಥದ ಪ್ರಕಾರ, ದ್ವಾದಶಿಯ ಸೂರ್ಯೋದಯದ ನಂತರ ನಿಗದಿತ ಸಮಯದೊಳಗೇ ಪಾರಣೆ ಮಾಡುವುದು ಅತ್ಯಗತ್ಯ. ಸಮಯಕ್ಕಿಂತ ಮುಂಚೆ ಅಥವಾ ಸಮಯ ಮೀರಿದ ನಂತರ ಪಾರಣೆ ಮಾಡಿದರೆ ಏಕಾದಶಿ ವ್ರತದ ಪೂರ್ಣ ಫಲ ಲಭಿಸುವುದಿಲ್ಲ.

---

#### 2. ಶ್ರೀಮದ್ಭಾಗವತದ ದಿವ್ಯ ಲೀಲೆ: ಮಹಾರಾಜ ಅಂಬರೀಷ ಮತ್ತು ದುರ್ವಾಸ ಮುನಿ
ದ್ವಾದಶಿ ಮುಹೂರ್ತದಲ್ಲಿ ಪಾರಣೆ ಮಾಡುವ ಮಹತ್ವವನ್ನು ಮಹಾನ್ ವೈಷ್ಣವ ರಾಜ **ಮಹಾರಾಜ ಅಂಬರೀಷರ** ಚರಿತ್ರೆಯಿಂದ ತಿಳಿಯಬಹುದು. ಅವರು ಒಂದು ವರ್ಷ ಪೂರ್ಣ ಭಕ್ತಿಯಿಂದ ಏಕಾದಶಿ ವ್ರತವನ್ನು ಆಚರಿಸಿದರು. ದ್ವಾದಶಿಯ ದಿನ ಪಾರಣೆ ಸಿದ್ಧತೆಯಲ್ಲಿದ್ದಾಗ, ತಪಸ್ವಿ **ದುರ್ವಾಸ ಮುನಿಗಳು** ಅತಿಥಿಯಾಗಿ ಆಗಮಿಸಿದರು.

ರಾಜರು ಮುನಿಗಳನ್ನು ಪ್ರಸಾದ ಸ್ವೀಕರಿಸಲು ಆಹ್ವಾನಿಸಿದರು. ಮುನಿಗಳು ಯಮುನಾ ನದಿಯಲ್ಲಿ ಸ್ನಾನಕ್ಕೆ ತೆರಳಿದರು. ಆದರೆ ದ್ವಾದಶಿ ತಿಥಿ ಮುಕ್ತಾಯವಾಗಲು ಕೆಲವೇ ಕ್ಷಣಗಳಿದ್ದವು. ಸರಿಯಾದ ಸಮಯಕ್ಕೆ ಪಾರಣೆ ಮಾಡದಿದ್ದರೆ ವ್ರತ ಭಂಗವಾಗುತ್ತಿತ್ತು; ಮುನಿಗಳಿಗಿಂತ ಮುಂಚೆ ತಿಂದರೆ ಅತಿಥಿ ಅಪರಾಧವಾಗುತ್ತಿತ್ತು.

ಪಂಡಿತ ವೈಷ್ಣವರ ಮಾರ್ಗದರ್ಶನದಂತೆ, ಮಹಾರಾಜ ಅಂಬರೀಷರು ಕೇವಲ ಕೆಲ ಹನಿ **ಭಗವಾನ್ ಶ್ರೀಕೃಷ್ಣನ ಪವಿತ್ರ ಚರಣಾಮೃತವನ್ನು** ಮಾತ್ರ ಸ್ವೀಕರಿಸಿ, ಶಾಸ್ತ್ರ ನಿಯಮದಂತೆ ಪಾರಣೆಯನ್ನೂ ನೆರವೇರಿಸಿ ಮುನಿಗಳ ಗೌರವವನ್ನೂ ಕಾಪಾಡಿದರು.

---

#### 3. ಪಾರಣೆ ಆಚರಿಸುವ ವಿಧಾನ
1. **ಪ್ರಾತಃಕಾಲದ ಭಕ್ತಿ:** ಬ್ರಹ್ಮ-ಮುಹೂರ್ತದಲ್ಲಿ ಎದ್ದು ಸ್ನಾನ ಮಾಡಿ, ಮಂಗಳಾರತಿಯಲ್ಲಿ ಪಾಲ್ಗೊಂಡು ಹರೇ ಕೃಷ್ಣ ಮಹಾಮಂತ್ರವನ್ನು ಜಪಿಸಿ.
2. **ಭಗವಂತನ ಮಹಾಪ್ರಸಾದ:** ಭಗವಾನ್ ಶ್ರೀಕೃಷ್ಣನಿಗೆ ಭಕ್ತಿಯಿಂದ ಸಮರ್ಪಿಸಿದ ಧಾನ್ಯಯುಕ್ತ ಮಹಾಪ್ರಸಾದದಿಂದ ವ್ರತವನ್ನು ಮುಕ್ತಾಯಗೊಳಿಸಿ.
3. **ಪ್ರಸಾದ ಪ್ರಾರ್ಥನೆ:** *'ಶರೀರ ಅವಿದ್ಯಾ-ಜಾಲ... ಮಹಾಪ್ರಸಾದೇ ಗೋವಿಂದೇ'* ಪ್ರಾರ್ಥನೆಯನ್ನು ಭಕ್ತಿಯಿಂದ ಹಾಡಿ, ಶ್ರೀಲ ಪ್ರಭುಪಾದರ ಮಾರ್ಗದರ್ಶನದಂತೆ ಪ್ರಸಾದವನ್ನು ಗೌರವಿಸಿ.
`
    },
    te: {
        sectionTitle: "ఏకాదశి వ్రత పారణ నియమాలు మరియు ఆధ్యాత్మిక ప్రాముఖ్యత",
        timingLabel: "పారణ సమయం (Break Fast Window)",
        subLabel: "మరుసటి రోజు (ద్వాదశి) ఉపవాస విరమణ",
        readBtnLabel: "పారణ నియమాలు & లీల",
        clickToRead: "చదవడానికి క్లిక్ చేయండి",
        modalSubtitle: "శాస్త్రోక్త నియమాలు మరియు అంబరీష మహారాజు దివ్య చరిత్ర",
        closeBtn: "మూసివేయి",
        content: `
#### 1. పారణ అంటే ఏమిటి?
ఏకాదశి వ్రతాన్ని శాస్త్రోక్తంగా ద్వాదశి తిథి యొక్క శుభ ముహూర్తంలో పూర్తి చేసి ప్రసాదాన్ని స్వీకరించడాన్ని **'పారణ' (Parana)** అంటారు. శ్రీల సనాతన గోస్వామి రచించిన *హరి-భక్తి-విలాసం* ప్రకారం, ద్వాదశి రోజున సూర్యోదయం తర్వాత నిర్ణీత కాల వ్యవధిలోనే పారణ చేయడం అత్యంత ఆవశ్యకం. సమయం కంటే ముందే లేదా సమయం దాటిన తర్వాత పారణ చేస్తే వ్రతానికి సంపూర్ణ ఫలం లభించదు.

---

#### 2. శ్రీమద్భాగవత పవిత్ర లీల: మహారాజ అంబరీషుడు మరియు దుర్వాస ముని
ద్వాదశి ముహూర్తంలో పారణ చేయడం ఎంత ముఖ్యమో గొప్ప వైష్ణవ చక్రవర్తి **మహారాజ అంబరీషుని** చరిత్ర ద్వారా స్పష్టమవుతుంది. ఆయన ఏడాది పొడవునా ఏకాదశి వ్రతాన్ని నిష్ఠతో ఆచరించారు. ద్వాదశి ఉదయం పారణకు సిద్ధమవుతున్న సమయంలో **దుర్వాస ముని** అతిథిగా వచ్చారు.

రాజు ఆయనను ప్రసాదం స్వీకరించాల్సిందిగా ప్రార్థించారు. ముని యమునా నదిలో స్నానానికి వెళ్లారు. కానీ ద్వాదశి తిథి ముగియడానికి సమయం చాలా తక్కువగా ఉంది. నిర్ణీత సమయంలో పారణ చేయకపోతే వ్రతం భంగమవుతుంది; అతిథి కంటే ముందే తింటే వైష్ణవ అపరాధం జరుగుతుంది.

జ్ఞానులైన వైష్ణవ బ్రాహ్మణుల సలహాతో అంబరీష మహారాజు కేవలం కొన్ని చుక్కల **భగవాన్ శ్రీకృష్ణుని పవిత్ర చరణామృతాన్ని** మాత్రమే స్వీకరించి, శాస్త్రోక్తంగా వ్రతాన్ని పరిరక్షిస్తూనే ముని గౌరవాన్ని కూడా కాపాడారు.

---

#### 3. పారణ చేసే విధానం
1. **ప్రాతఃకాల భక్తి సాధన:** బ్రహ్మముహూర్తంలో నిద్రలేచి స్నానమాచరించి, మంగళ ఆరతిలో పాల్గొని హరే కృష్ణ మహామంత్రాన్ని జపించాలి.
2. **భగవానుని మహాప్రసాదం:** భగవాన్ శ్రీకృష్ణునికి సమర్పించిన ధాన్యములతో కూడిన పవిత్ర మహాప్రసాదాన్ని స్వీకరించి ఉపవాసాన్ని విరమించాలి.
3. **ప్రసాద ప్రార్థన:** *'శరీర అవిద్యా-జాల్... మహాప్రసాదే గోవిందే'* ప్రార్థనను గానం చేస్తూ, శ్రీల ప్రభుపాదుల ఉపదేశాల ప్రకారం భక్తిశ్రద్ధలతో ప్రసాదాన్ని గౌరవించాలి.
`
    },
    ml: {
        sectionTitle: "ഏകാദശി വ്രത പാരണ നിയമങ്ങളും ആത്മീയ പ്രാധാന്യവും",
        timingLabel: "പാരണ സമയം (Break Fast Window)",
        subLabel: "അടുത്ത ദിവസം (ദ്വാദശി) വ്രതാവസാനം",
        readBtnLabel: "പാരണ നിയമങ്ങളും ചരിത്രവും",
        clickToRead: "വായിക്കാൻ ക്ലിക്ക് ചെയ്യുക",
        modalSubtitle: "ശാസ്ത്രീയ നിയമങ്ങളും അംബരീഷ മഹാരാജാവിന്റെ ചരിത്രവും",
        closeBtn: "അടയ്ക്കുക",
        content: `
#### 1. എന്താണ് പാരണ?
ഏകാദശി വ്രതം ശാസ്ത്രവിധിപ്രകാരം ദ്വാദശി തിഥിയിലെ ശുഭമുഹൂർത്തത്തിൽ പൂർത്തിയാക്കി ഭക്ഷണം കഴിക്കുന്നതിനെയാണ് **'പാരണ' (Parana)** എന്ന് പറയുന്നത്. ശ്രീല സനാതന ഗോസ്വാമിയുടെ *ഹരി-ഭക്തി-വിലാസം* അനുസരിച്ച്, ദ്വാദശി ദിനത്തിലെ സൂര്യോദയത്തിനു ശേഷം നിശ്ചിത സമയപരിധിക്കുള്ളിൽ തന്നെ പാരണ ചെയ്യേണ്ടത് അത്യന്താപേക്ഷിതമാണ്. നിശ്ചിത സമയത്തിന് മുൻപോ ശേഷമോ പാരണ ചെയ്താൽ വ്രതത്തിന്റെ പൂർണ്ണ ആത്മീയഫലം ലഭിക്കുകയില്ല.

---

#### 2. ശ്രീമദ്ഭാഗവതത്തിലെ പവിത്ര ചരിത്രം: അംബരീഷ മഹാരാജാവും ദുർവാസാവ് മുനിയും
ദ്വാദശി മുഹൂർത്തത്തിൽ തന്നെ വ്രതം അവസാനിപ്പിക്കേണ്ടതിന്റെ പ്രാധാന്യം വെളിപ്പെടുത്തുന്നതാണ് മഹാനായ വൈഷ്ണവ രാജാവ് **അംബരീഷ മഹാരാജാവിന്റെ** ചരിത്രം. ഒരു വർഷം മുഴുവൻ ഏകാദശി വ്രതം അനുഷ്ഠിച്ച രാജാവ് ദ്വാദശി പ്രഭാതത്തിൽ പാരണയ്ക്ക് തയ്യാറെടുക്കുമ്പോൾ **ദുർവാസാവ് മുനി** അവിടെ അതിഥിയായി എത്തിച്ചേർന്നു.

രാജാവ് മുനിയെ പ്രസാദം സ്വീകരിക്കാൻ ക്ഷണിച്ചു. മുനി യമുനയിൽ സ്നാനത്തിനായി പോയി. എന്നാൽ ദ്വാദശി തിഥി അവസാനിക്കാൻ വളരെ കുറച്ചു സമയം മാത്രമേ ഉണ്ടായിരുന്നുള്ളൂ. കൃത്യസമയത്ത് പാരണ ചെയ്തില്ലെങ്കിൽ വ്രതം ലംഘിക്കപ്പെടും; മുനിക്ക് മുൻപേ ആഹാരം കഴിച്ചാൽ അതിഥി അപരാധമാകും.

പണ്ഡിതരായ വൈഷ്ണവരുടെ ഉപദേശപ്രകാരം, അംബരീഷ മഹാരാജാവ് ഏതാനും തുള്ളി **ഭഗവാൻ ശ്രീകൃഷ്ണന്റെ പാദതീർത്ഥമായ ചരണാമൃതം** മാത്രം സേവിച്ചു. ജലം സേവിച്ചതിലൂടെ ശാസ്ത്രവിധിപ്രകാരം വ്രതം മുറിയുകയും ചെയ്തു, മുനിയെ അപമാനിക്കാതെ വൈഷ്ണവ മര്യാദ കാത്തുസൂക്ഷിക്കുകയും ചെയ്തു.

---

#### 3. പാരണ അനുഷ്ഠിക്കേണ്ട വിധം
1. **പ്രഭാത ഭക്തിസാധന:** ബ്രഹ്മമുഹൂർത്തത്തിൽ ഉണർന്ന് സ്നാനം ചെയ്ത്, മംഗള ആരതിയിൽ പങ്കെടുത്ത് ഹരേ കൃഷ്ണ മഹാമന്ത്രം ജപിക്കുക.
2. **ഭഗവാന്റെ മഹാപ്രസാദം:** ഭഗവാൻ ശ്രീകൃഷ്ണന് ഭക്തിയോടെ സമർപ്പിച്ച ധാന്യങ്ങൾ അടങ്ങിയ മഹാപ്രസാദം കഴിച്ച് വ്രതം അവസാനിപ്പിക്കുക.
3. **പ്രസാദ പ്രാർത്ഥന:** *'ശരീര അവിദ്യാ-ജാൽ... മഹാപ്രസാദേ ഗോവിന്ദേ'* പ്രാർത്ഥന ആലപിച്ച്, ശ്രീല പ്രഭുപാദരുടെ ഉപദേശപ്രകാരം ഭക്തിയോടെ പ്രസാദത്തെ ആദരിക്കുക.
`
    }
};

export function ParanaGuidelines({
    locale,
    breakFastWindow,
    breakFastDate,
    breakFastDayOfWeek,
    isEkadashi,
}: ParanaGuidelinesProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!breakFastWindow && !isEkadashi) {
        return null;
    }

    const langData = PARANA_CONTENT[locale] || PARANA_CONTENT.en;

    const formatDate = (dateStr: string) => {
        try {
            const dateObj = new Date(dateStr);
            const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
            return dateObj.toLocaleDateString(locale === 'ta' ? 'ta-IN' : 'en-US', options);
        } catch {
            return dateStr;
        }
    };

    // Body scroll locking when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isModalOpen]);

    // ESC key support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isModalOpen) {
                setIsModalOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isModalOpen]);

    return (
        <section className="mt-12 pt-8 border-t border-amber-500/20">
            {/* How to Follow Ekadashi Guide (Popup Modal) */}
            <EkadashiGuideModal locale={locale} />

            {/* Header / Timing Card: Entire Card is Clickable */}
            <div 
                onClick={() => setIsModalOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsModalOpen(true);
                    }
                }}
                className="p-6 md:p-8 bg-gradient-to-br from-amber-500/15 via-amber-500/10 to-amber-500/5 border-2 border-amber-500/30 hover:border-amber-500/70 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group active:scale-[0.99] select-none"
            >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                        <div className="size-14 rounded-2xl bg-amber-500 text-black flex items-center justify-center shrink-0 shadow-lg font-black group-hover:scale-105 transition-transform">
                            <Clock size={28} />
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <div className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                                    <Sunrise size={16} />
                                    <span>{langData.timingLabel}</span>
                                </div>

                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 font-extrabold text-[11px] border border-amber-500/25 group-hover:bg-amber-500 group-hover:text-black transition-colors">
                                    <span>👉 {langData.clickToRead}</span>
                                </span>
                            </div>

                            <div className="text-xl md:text-2xl font-black mt-1 text-text-main dark:text-white">
                                {breakFastDate ? `${formatDate(breakFastDate)} (${breakFastDayOfWeek}) — ` : ''}
                                {breakFastWindow ? (
                                    <>
                                        <span className="text-amber-600 dark:text-amber-400">{breakFastWindow}</span> (LT)
                                    </>
                                ) : (
                                    <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                                        Following Dvadashi morning
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
                        <span className="bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold text-xs px-3.5 py-2 rounded-xl border border-amber-500/30">
                            {langData.subLabel}
                        </span>

                        <div className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 group-hover:bg-amber-400 text-black font-black text-xs shadow-md transition-all pointer-events-none">
                            <BookOpen size={16} className="group-hover:scale-110 transition-transform" />
                            <span>{langData.readBtnLabel}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Parana Rules & Pastime Modal Dialog */}
            {isModalOpen && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div 
                        className="relative flex flex-col w-full max-w-4xl max-h-[90vh] bg-surface-light dark:bg-[#181510] text-text-main dark:text-white rounded-3xl shadow-2xl border border-amber-500/30 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="p-5 md:p-6 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between gap-4 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                                    <BookOpen size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg md:text-xl font-black text-text-main dark:text-white leading-snug">
                                        {langData.sectionTitle}
                                    </h3>
                                    <p className="text-xs font-semibold text-text-muted mt-0.5">
                                        {langData.modalSubtitle}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                                aria-label="Close dialog"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 md:p-10 overflow-y-auto flex-grow space-y-6">
                            <div className="prose prose-stone dark:prose-invert max-w-none 
                                prose-headings:font-black prose-headings:tracking-tight
                                prose-h4:text-lg prose-h4:text-amber-600 dark:prose-h4:text-amber-400 prose-h4:mt-6 prose-h4:mb-2
                                prose-p:text-base prose-p:leading-relaxed prose-p:text-text-main dark:prose-p:text-gray-300
                                prose-li:text-base prose-li:leading-relaxed
                                prose-strong:text-amber-700 dark:prose-strong:text-amber-300 prose-strong:font-bold">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {langData.content}
                                </ReactMarkdown>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 md:p-5 border-t border-gray-200 dark:border-neutral-800 flex justify-end bg-surface-light dark:bg-[#14110b] shrink-0">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-colors cursor-pointer"
                            >
                                {langData.closeBtn}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
