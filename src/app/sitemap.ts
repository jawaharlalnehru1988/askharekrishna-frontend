import type { MetadataRoute } from 'next';
import { FESTIVAL_ARTICLES } from '@/data/festivalInsightsData';

const BASE_URL = 'https://askharekrishna.com';
const API_BASE = 'https://api.askharekrishna.com';
const LOCALES = ['en', 'ta', 'hi', 'te', 'kn', 'ml', 'bn'] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/debate`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.95,
        },
        {
            url: `${BASE_URL}/bhagavad-gita`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/festival-insights`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.88,
        },
        {
            url: `${BASE_URL}/stories`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.85,
        },
        {
            url: `${BASE_URL}/vaishnava-calendar`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.85,
        },
        {
            url: `${BASE_URL}/pooja-vidhis`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/ritvik-system`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/courses`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ];

    const debateRoutes: MetadataRoute.Sitemap = [];
    try {
        const response = await fetch(`${API_BASE}/api/v1/debate/articles/?language=en`, {
            next: { revalidate: 3600 },
        });
        if (response.ok) {
            const data = await response.json();
            const categories = Array.isArray(data) ? data : (data.results || []);
            const seenSlugs = new Set<string>();

            for (const cat of categories) {
                if (cat.articleList && Array.isArray(cat.articleList)) {
                    for (const art of cat.articleList) {
                        const debateKey = (art.id || art.slug)?.toString();
                        if (debateKey && !seenSlugs.has(debateKey)) {
                            seenSlugs.add(debateKey);

                            const languagesMap: Record<string, string> = {};
                            for (const lang of LOCALES) {
                                languagesMap[lang] = `${BASE_URL}/debate/${debateKey}?lang=${lang}`;
                            }

                            debateRoutes.push({
                                url: `${BASE_URL}/debate/${debateKey}`,
                                lastModified: new Date(),
                                changeFrequency: 'weekly',
                                priority: 0.85,
                                alternates: {
                                    languages: languagesMap,
                                },
                            });
                        }
                    }
                }
            }
        }
    } catch (err) {
        console.error('Failed to generate debate sitemap:', err);
    }

    const festivalRoutes: MetadataRoute.Sitemap = FESTIVAL_ARTICLES.map((art) => {
        const languagesMap: Record<string, string> = {};
        for (const lang of LOCALES) {
            languagesMap[lang] = `${BASE_URL}/festival-insights/${art.id}?lang=${lang}`;
        }
        return {
            url: `${BASE_URL}/festival-insights/${art.id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.85,
            alternates: {
                languages: languagesMap,
            },
        };
    });

    return [...staticRoutes, ...debateRoutes, ...festivalRoutes];
}
