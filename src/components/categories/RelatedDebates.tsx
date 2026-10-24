"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Gavel, ArrowRight, Headphones, Sparkles, BookOpen } from 'lucide-react';
import { useLanguage } from '../providers/LanguageContext';

export interface RelatedArticle {
    id: number;
    subTopic: string;
    mainTopic?: string;
    slug: string;
    articleImage?: string | null;
    audioPath?: string | null;
}

interface RelatedDebatesProps {
    currentSlug: string;
    categoryId?: number | null;
    categoryName?: string;
    categoryImage?: string | null;
}

const ensureAbsoluteUrl = (path: string | null | undefined): string => {
    if (!path) return '';
    if (path.includes('127.0.0.1') || path.includes('localhost')) {
        return path.replace(/^https?:\/\/[^/]+/, 'https://api.askharekrishna.com');
    }
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const clean = path.startsWith('/') ? path : `/${path}`;
    if (!clean.startsWith('/media/')) {
        return `https://api.askharekrishna.com/media${clean}`;
    }
    return `https://api.askharekrishna.com${clean}`;
};

const labels: Record<string, {
    title: string;
    subtitle: (catName: string) => string;
    readMore: string;
    audio: string;
    viewAllCat: (catName: string) => string;
}> = {
    ta: {
        title: 'தொடர்புடைய விவாதங்கள் & ஆன்மீகக் கேள்விகள்',
        subtitle: (cat) => cat ? `"${cat}" தலைப்பில் மேலும் சில முக்கிய விவாதங்கள்:` : 'மேலும் சில முக்கிய தத்துவ விவாதங்கள்:',
        readMore: 'விவாதத்தைப் படியுங்கள்',
        audio: 'ஒலி வடிவம் உண்டு',
        viewAllCat: (cat) => `"${cat}" அனைத்து விவாதங்களையும் காண்க`,
    },
    en: {
        title: 'Related Debates & Inquiries',
        subtitle: (cat) => cat ? `Explore more questions in "${cat}":` : 'Explore more philosophical inquiries:',
        readMore: 'Read Debate',
        audio: 'Audio Available',
        viewAllCat: (cat) => `View all debates in "${cat}"`,
    },
    hi: {
        title: 'संबंधित वाद-विवाद एवं आध्यात्मिक प्रश्न',
        subtitle: (cat) => cat ? `"${cat}" श्रेणी के अन्य महत्वपूर्ण प्रश्न:` : 'अन्य महत्वपूर्ण दार्शनिक प्रश्न:',
        readMore: 'वाद-विवाद पढ़ें',
        audio: 'ऑडियो उपलब्ध',
        viewAllCat: (cat) => `"${cat}" के सभी वाद-विवाद देखें`,
    },
    te: {
        title: 'సంబంధిత చర్చలు & ఆధ్యాత్మిక ప్రశ్నలు',
        subtitle: (cat) => cat ? `"${cat}" విభాగంలోని మరిన్ని ప్రశ్నలు:` : 'మరిన్ని తాత్విక ప్రశ్నలు:',
        readMore: 'చర్చను చదవండి',
        audio: 'ఆడియో అందుబాటులో ఉంది',
        viewAllCat: (cat) => `"${cat}" లోని అన్ని చర్చలను చూడండి`,
    },
    kn: {
        title: 'ಸಂಬಂಧಿತ ಚರ್ಚೆಗಳು & ಆಧ್ಯಾತ್ಮಿಕ ಪ್ರಶ್ನೆಗಳು',
        subtitle: (cat) => cat ? `"${cat}" ವಿಭಾಗದ ಇತರ ಪ್ರಮುಖ ಪ್ರಶ್ನೆಗಳು:` : 'ಇತರ ಪ್ರಮುಖ ಪ್ರಶ್ನೆಗಳು:',
        readMore: 'ಚರ್ಚೆಯನ್ನು ಓದಿ',
        audio: 'ಆಡಿಯೋ ಲಭ್ಯವಿದೆ',
        viewAllCat: (cat) => `"${cat}" ನ ಎಲ್ಲಾ ಚರ್ಚೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ`,
    },
    ml: {
        title: 'ബന്ധപ്പെട്ട സംവാദങ്ങളും ആത്മീയ ചോദ്യങ്ങളും',
        subtitle: (cat) => cat ? `"${cat}" വിഭാഗത്തിലെ മറ്റ് പ്രധാന ചോദ്യങ്ങൾ:` : 'മറ്റ് പ്രധാന ചോദ്യങ്ങൾ:',
        readMore: 'സംവാദം വായിക്കുക',
        audio: 'ഓഡിയോ ലഭ്യമാണ്',
        viewAllCat: (cat) => `"${cat}" ലെ എല്ലാ സംവാദങ്ങളും കാണുക`,
    },
    bn: {
        title: 'সম্পর্কিত বিতর্ক ও আধ্যাত্মিক প্রশ্নাবলী',
        subtitle: (cat) => cat ? `"${cat}" বিভাগের অন্যান্য গুরুত্বপূর্ণ প্রশ্ন:` : 'অন্যান্য গুরুত্বপূর্ণ প্রশ্নাবলী:',
        readMore: 'বিতর্কটি পড়ুন',
        audio: 'অডিও উপলব্ধ',
        viewAllCat: (cat) => `"${cat}" এর সমস্ত বিতর্ক দেখুন`,
    },
};

export function RelatedDebates({ currentSlug, categoryId, categoryName, categoryImage }: RelatedDebatesProps) {
    const { locale } = useLanguage();
    const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
    const [loading, setLoading] = useState(true);

    const t = labels[locale] || labels.en;

    useEffect(() => {
        let isMounted = true;

        const fetchRelated = async () => {
            try {
                setLoading(true);

                let fetchedList: RelatedArticle[] = [];

                // 1. Fetch articles from the current category in the current locale
                if (categoryId) {
                    const res = await axios.get(
                        `https://api.askharekrishna.com/api/v1/debate/articles/?language=${locale}&translations__debateCategory=${categoryId}`
                    );
                    const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
                    const targetCategory = data.find((c: any) => c.id === categoryId) || data[0];
                    if (targetCategory && targetCategory.articleList) {
                        fetchedList = targetCategory.articleList.filter(
                            (a: any) => a.slug && a.slug !== currentSlug && a.id?.toString() !== currentSlug && a.subTopic && a.subTopic.trim()
                        );
                    }
                }

                // 2. If fewer than 3 and locale is not 'en', supplement with articles from the SAME category in English
                if (fetchedList.length < 3 && categoryId && locale !== 'en') {
                    const enRes = await axios.get(
                        `https://api.askharekrishna.com/api/v1/debate/articles/?language=en&translations__debateCategory=${categoryId}`
                    );
                    const enData = Array.isArray(enRes.data) ? enRes.data : (enRes.data.results || []);
                    const targetEnCategory = enData.find((c: any) => c.id === categoryId) || enData[0];
                    if (targetEnCategory && targetEnCategory.articleList) {
                        const enArticles = targetEnCategory.articleList.filter(
                            (a: any) => a.slug && a.slug !== currentSlug && a.id?.toString() !== currentSlug && !fetchedList.some((item) => item.slug === a.slug || item.id === a.id)
                        );
                        fetchedList = [...fetchedList, ...enArticles];
                    }
                }

                // 3. Only if the same category has absolutely 0 other articles, fallback to general catalog
                if (fetchedList.length === 0) {
                    const fallbackRes = await axios.get(
                        `https://api.askharekrishna.com/api/v1/debate/articles/?language=${locale}`
                    );
                    const allData = Array.isArray(fallbackRes.data) ? fallbackRes.data : (fallbackRes.data.results || []);
                    for (const cat of allData) {
                        if (cat.articleList) {
                            for (const a of cat.articleList) {
                                if (
                                    a.slug &&
                                    a.slug !== currentSlug &&
                                    a.id?.toString() !== currentSlug &&
                                    a.subTopic &&
                                    !fetchedList.some((item) => item.slug === a.slug || item.id === a.id)
                                ) {
                                    fetchedList.push(a);
                                    if (fetchedList.length >= 3) break;
                                }
                            }
                        }
                        if (fetchedList.length >= 3) break;
                    }
                }

                // Prioritize articles closest in sequence/theme to the current article
                const currentId = parseInt(currentSlug, 10);
                if (!isNaN(currentId)) {
                    fetchedList.sort((a, b) => Math.abs(a.id - currentId) - Math.abs(b.id - currentId));
                }

                if (isMounted) {
                    // Pick top 3 related articles from the same category
                    setRelatedArticles(fetchedList.slice(0, 3));
                }
            } catch (err) {
                console.error('Error fetching related debates:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchRelated();

        return () => {
            isMounted = false;
        };
    }, [currentSlug, categoryId, locale]);

    if (!loading && relatedArticles.length === 0) {
        return null;
    }

    return (
        <section className="mt-16 pt-10 border-t border-gray-200 dark:border-neutral-800 no-print">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                        <Sparkles size={14} />
                        <span>{t.title}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-text-main dark:text-white tracking-tight">
                        {t.subtitle(categoryName || '')}
                    </h3>
                </div>

                {categoryName && (
                    <Link
                        href={`/debate?category=${encodeURIComponent(categoryName)}&lang=${locale}`}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:text-primary-dark transition-colors group cursor-pointer"
                    >
                        <span>{t.viewAllCat(categoryName)}</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                )}
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading
                    ? Array.from({ length: 3 }).map((_, i) => (
                          <div
                              key={`skeleton-${i}`}
                              className="rounded-2xl bg-white dark:bg-[#2a2418] border border-[#e7dfcf] dark:border-neutral-800 p-5 shadow-sm animate-pulse flex flex-col"
                          >
                              <div className="h-44 w-full bg-gray-200 dark:bg-neutral-800 rounded-xl mb-4" />
                              <div className="h-5 bg-gray-200 dark:bg-neutral-800 rounded w-3/4 mb-2" />
                              <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-1/2 mb-4" />
                              <div className="h-8 bg-gray-200 dark:bg-neutral-800 rounded-lg w-full mt-auto" />
                          </div>
                      ))
                    : relatedArticles.map((item) => {
                          const imgUrl = ensureAbsoluteUrl(item.articleImage || categoryImage);
                          return (
                              <article
                                  key={item.slug}
                                  className="group rounded-2xl bg-white dark:bg-[#2a2418] border border-[#e7dfcf] dark:border-neutral-800 hover:border-primary/50 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col transform hover:-translate-y-1"
                              >
                                  {/* Thumbnail Link */}
                                  <Link
                                      href={`/debate/${item.id || item.slug}?lang=${locale}`}
                                      className="relative h-44 w-full overflow-hidden bg-neutral-900 block cursor-pointer group/img"
                                  >
                                      {imgUrl ? (
                                          <img
                                              src={imgUrl}
                                              alt={item.subTopic}
                                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                              loading="lazy"
                                          />
                                      ) : (
                                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                                              <Gavel size={36} />
                                          </div>
                                      )}
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                      {/* Audio / Topic Badges */}
                                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                                          {categoryName ? (
                                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-amber-300 text-[11px] font-semibold border border-white/10 line-clamp-1">
                                                  <BookOpen size={11} />
                                                  <span>{categoryName}</span>
                                              </span>
                                          ) : null}

                                          {item.audioPath ? (
                                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/80 backdrop-blur-md text-white text-[10px] font-bold">
                                                  <Headphones size={11} />
                                                  <span>{t.audio}</span>
                                              </span>
                                          ) : null}
                                      </div>
                                  </Link>

                                  {/* Body */}
                                  <div className="p-5 flex flex-col flex-grow">
                                      <Link href={`/debate/${item.id || item.slug}?lang=${locale}`} className="group-hover:text-primary transition-colors">
                                          <h4 className="text-base font-bold text-text-main dark:text-white line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                                              {item.subTopic}
                                          </h4>
                                      </Link>

                                      {/* Action Footer */}
                                      <div className="mt-5 pt-4 border-t border-[#f3efe7] dark:border-neutral-800/80 flex items-center justify-between mt-auto">
                                          <Link
                                              href={`/debate/${item.id || item.slug}?lang=${locale}`}
                                              className="inline-flex items-center text-xs font-bold text-primary group-hover:text-primary-dark transition-colors gap-1.5"
                                          >
                                              <span>{t.readMore}</span>
                                              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                          </Link>
                                      </div>
                                  </div>
                              </article>
                          );
                      })}
            </div>
        </section>
    );
}
