import { enFestivalArticles } from './festival_translations/en';
import { taFestivalArticles } from './festival_translations/ta';
import { hiFestivalArticles } from './festival_translations/hi';
import { teFestivalArticles } from './festival_translations/te';
import { knFestivalArticles } from './festival_translations/kn';
import { mlFestivalArticles } from './festival_translations/ml';
import { bnFestivalArticles } from './festival_translations/bn';

export interface FestivalArticleTranslation {
    title: string;
    subTopic: string;
    excerpt: string;
    highlights: string[];
    article: string;
    festivalName?: string;
    readTime?: string;
    scripturePramana?: string;
}

export interface FestivalArticleItem {
    id: number;
    slug: string;
    order: number;
    festival: string;
    festivalTamil: string;
    readTime: string;
    readTimeTamil: string;
    scripturePramana: string;
    scripturePramanaTamil: string;
    imageUrl: string;
    imageAlt: string;
    translations: Record<string, FestivalArticleTranslation>;
}

export const FESTIVAL_ARTICLES: FestivalArticleItem[] = [
    {
        id: 1,
        slug: 'meaning-of-dipavali-as-per-shastra',
        order: 1,
        festival: 'Dipavali',
        festivalTamil: 'தீபாவளி',
        readTime: '6 min read',
        readTimeTamil: '6 நிமிட வாசிப்பு',
        scripturePramana: 'Padma Purana (Uttara-khanda), Skanda Purana, Hari-bhakti-vilasa',
        scripturePramanaTamil: 'பத்ம புராணம் (உத்தர காண்டம்), ஸ்கந்த புராணம், ஹரி பக்தி விலாசம்',
        imageUrl: '/images/festival-insights/dipavali-meaning-shastra.jpg',
        imageAlt: 'Dipavali Dipa-Dana to Sri Sri Radha-Damodara in sacred Kartika month',
        translations: {
            en: enFestivalArticles['meaning-of-dipavali-as-per-shastra'],
            ta: taFestivalArticles['meaning-of-dipavali-as-per-shastra'],
            hi: hiFestivalArticles['meaning-of-dipavali-as-per-shastra'],
            te: teFestivalArticles['meaning-of-dipavali-as-per-shastra'],
            kn: knFestivalArticles['meaning-of-dipavali-as-per-shastra'],
            ml: mlFestivalArticles['meaning-of-dipavali-as-per-shastra'],
            bn: bnFestivalArticles['meaning-of-dipavali-as-per-shastra'],
        },
    },
    {
        id: 2,
        slug: 'dos-and-donts-on-dipavali',
        order: 2,
        festival: 'Dipavali',
        festivalTamil: 'தீபாவளி',
        readTime: '7 min read',
        readTimeTamil: '7 நிமிட வாசிப்பு',
        scripturePramana: 'Srimad-Bhagavatam (Canto 1, Chapter 17), Hari-bhakti-vilasa, Padma Purana',
        scripturePramanaTamil: 'ஸ்ரீமத் பாகவதம் (ஸ்கந்தம் 1, அத்தியாயம் 17), ஹரி பக்தி விலாசம், பத்ம புராணம்',
        imageUrl: '/images/festival-insights/dipavali-dos-and-donts.jpg',
        imageAlt: 'Authentic Vaishnava Sadachara on Dipavali with Damodarashtakam and Krishna Prasadam',
        translations: {
            en: enFestivalArticles['dos-and-donts-on-dipavali'],
            ta: taFestivalArticles['dos-and-donts-on-dipavali'],
            hi: hiFestivalArticles['dos-and-donts-on-dipavali'],
            te: teFestivalArticles['dos-and-donts-on-dipavali'],
            kn: knFestivalArticles['dos-and-donts-on-dipavali'],
            ml: mlFestivalArticles['dos-and-donts-on-dipavali'],
            bn: bnFestivalArticles['dos-and-donts-on-dipavali'],
        },
    },
    {
        id: 3,
        slug: 'dipavali-return-of-lord-rama-ayodhya',
        order: 3,
        festival: 'Dipavali',
        festivalTamil: 'தீபாவளி',
        readTime: '8 min read',
        readTimeTamil: '8 நிமிட வாசிப்பு',
        scripturePramana: 'Valmiki Ramayana (Yuddha-kanda), Skanda Purana, Padma Purana',
        scripturePramanaTamil: 'வால்மீகி இராமாயணம் (யுத்த காண்டம்), ஸ்கந்த புராணம், பத்ம புராணம்',
        imageUrl: '/images/festival-insights/dipavali-return-of-lord-rama.jpg',
        imageAlt: 'Lord Sri Ramachandra returning to Ayodhya on Pushpaka Vimana illuminated by millions of lamps',
        translations: {
            en: enFestivalArticles['dipavali-return-of-lord-rama-ayodhya'],
            ta: taFestivalArticles['dipavali-return-of-lord-rama-ayodhya'],
            hi: hiFestivalArticles['dipavali-return-of-lord-rama-ayodhya'],
            te: teFestivalArticles['dipavali-return-of-lord-rama-ayodhya'],
            kn: knFestivalArticles['dipavali-return-of-lord-rama-ayodhya'],
            ml: mlFestivalArticles['dipavali-return-of-lord-rama-ayodhya'],
            bn: bnFestivalArticles['dipavali-return-of-lord-rama-ayodhya'],
        },
    },
    {
        id: 4,
        slug: 'dipavali-narakasura-bhaumasura-vadha',
        order: 4,
        festival: 'Dipavali',
        festivalTamil: 'தீபாவளி',
        readTime: '8 min read',
        readTimeTamil: '8 நிமிட வாசிப்பு',
        scripturePramana: 'Srimad-Bhagavatam (Canto 10, Chapter 59), Vishnu Purana',
        scripturePramanaTamil: 'ஸ்ரீமத் பாகவதம் (ஸ்கந்தம் 10, அத்தியாயம் 59), விஷ்ணு புராணம்',
        imageUrl: '/images/festival-insights/dipavali-narakasura-bhaumasura-vadha.jpg',
        imageAlt: 'Lord Sri Krishna and Queen Satyabhama on Garuda delivering Narakasura on Naraka Chaturdashi',
        translations: {
            en: enFestivalArticles['dipavali-narakasura-bhaumasura-vadha'],
            ta: taFestivalArticles['dipavali-narakasura-bhaumasura-vadha'],
            hi: hiFestivalArticles['dipavali-narakasura-bhaumasura-vadha'],
            te: teFestivalArticles['dipavali-narakasura-bhaumasura-vadha'],
            kn: knFestivalArticles['dipavali-narakasura-bhaumasura-vadha'],
            ml: mlFestivalArticles['dipavali-narakasura-bhaumasura-vadha'],
            bn: bnFestivalArticles['dipavali-narakasura-bhaumasura-vadha'],
        },
    },
    {
        id: 5,
        slug: 'twelve-months-and-equivalent-vishnu-names',
        order: 5,
        festival: 'Vaishnava Calendar',
        festivalTamil: 'வைஷ்ணவ நாட்காட்டி',
        readTime: '8 min read',
        readTimeTamil: '8 நிமிட வாசிப்பு',
        scripturePramana: 'Padma Purana, Hari-bhakti-vilasa (1.31), Sri Navadvipa Panjika',
        scripturePramanaTamil: 'பத்ம புராணம், ஹரி பக்தி விலாசம் (1.31), ஸ்ரீ நவதீப பஞ்சாங்கம்',
        imageUrl: '/images/festival-insights/vedic-months-vishnu-names.jpg',
        imageAlt: 'The Twelve Sacred Months and Corresponding Vishnu Names in the Vaishnava Calendar',
        translations: {
            en: enFestivalArticles['twelve-months-and-equivalent-vishnu-names'],
            ta: taFestivalArticles['twelve-months-and-equivalent-vishnu-names'],
            hi: hiFestivalArticles['twelve-months-and-equivalent-vishnu-names'],
            te: teFestivalArticles['twelve-months-and-equivalent-vishnu-names'],
            kn: knFestivalArticles['twelve-months-and-equivalent-vishnu-names'],
            ml: mlFestivalArticles['twelve-months-and-equivalent-vishnu-names'],
            bn: bnFestivalArticles['twelve-months-and-equivalent-vishnu-names'],
        },
    },
];

export function getFestivalArticleBySlug(slugOrId: string): FestivalArticleItem | undefined {
    if (!slugOrId) return undefined;
    const clean = slugOrId.trim();
    return FESTIVAL_ARTICLES.find(
        (article) =>
            article.slug === clean ||
            article.id.toString() === clean ||
            article.order.toString() === clean
    );
}

