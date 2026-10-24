import introData from './ritvik_intro.json';

export interface RitvikIntroContent {
  title: string;
  subtitle: string;
  author: string;
  content: string;
}

export const RITVIK_INTRO: Record<string, RitvikIntroContent> = {
  en: introData.en,
  ta: introData.ta,
};

export function getRitvikIntro(locale: string): RitvikIntroContent {
  return RITVIK_INTRO[locale] || RITVIK_INTRO.en;
}
