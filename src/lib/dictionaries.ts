export type Locale = 'en' | 'ta' | 'hi';

const dictionaries = {
    en: () => import('@/messages/en.json').then((module) => module.default),
    ta: () => import('@/messages/ta.json').then((module) => module.default),
    hi: () => import('@/messages/hi.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
