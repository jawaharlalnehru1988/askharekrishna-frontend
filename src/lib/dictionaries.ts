export type Locale = 'en' | 'ta' | 'hi' | 'kn' | 'te' | 'ml';

const dictionaries = {
    en: () => import('@/messages/en.json').then((module) => module.default),
    ta: () => import('@/messages/ta.json').then((module) => module.default),
    hi: () => import('@/messages/hi.json').then((module) => module.default),
    kn: () => import('@/messages/kn.json').then((module) => module.default),
    te: () => import('@/messages/te.json').then((module) => module.default),
    ml: () => import('@/messages/ml.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
