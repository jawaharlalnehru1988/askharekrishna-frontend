import type { Metadata } from 'next';

export const siteMetadata = {
    title: 'Ask Hare Krishna',
    description: 'Spiritual wisdom found in audio.',
    defaultHost: 'askharekrishna.com',
    defaultImage: '/askharekrishnalogo.jpg',
};

type ArticleMetadataInput = {
    host: string;
    path: string;
    title: string;
    description: string;
    imageUrl?: string | null;
};

export function toPlainExcerpt(value: string, maxLength = 180): string {
    if (!value) return '';
    const plain = value
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/!\[[^\]]*\]\([^\)]*\)/g, ' ')
        .replace(/\[([^\]]+)\]\([^\)]*\)/g, '$1')
        .replace(/[#>*_~\-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    if (plain.length <= maxLength) return plain;
    return `${plain.slice(0, maxLength - 1).trim()}...`;
}

export function toAbsoluteMediaUrl(path?: string | null): string | null {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const clean = path.startsWith('/') ? path : `/${path}`;
    return `https://api.askharekrishna.com${clean}`;
}

export function buildArticleMetadata(input: ArticleMetadataInput): Metadata {
    const rawHost = input.host || siteMetadata.defaultHost;
    // Always use public domain askharekrishna.com for Open Graph canonical and image URLs
    // to prevent local internal proxy addresses (like 127.0.0.1:3002) from leaking into metadata
    const host = (rawHost.includes('127.0.0.1') || rawHost.includes('localhost') || !rawHost) ? 'askharekrishna.com' : rawHost;
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    const canonicalUrl = `${baseUrl}${input.path}`;

    // Route article image through /api/og optimizer to ensure image is < 300KB JPEG (1200x630)
    // which is strictly required for WhatsApp link preview thumbnail cards
    let ogImageUrl: string;
    if (input.imageUrl) {
        const fullImageUrl = input.imageUrl.startsWith('/') ? `https://askharekrishna.com${input.imageUrl}` : input.imageUrl;
        ogImageUrl = `https://askharekrishna.com/api/og?url=${encodeURIComponent(fullImageUrl)}`;
    } else {
        ogImageUrl = `https://askharekrishna.com${siteMetadata.defaultImage}`;
    }

    return {
        metadataBase: new URL(`https://askharekrishna.com`),
        title: input.title,
        description: input.description,
        alternates: {
            canonical: input.path,
        },
        openGraph: {
            title: input.title,
            description: input.description,
            type: 'article',
            url: canonicalUrl,
            images: [
                {
                    url: ogImageUrl,
                    secureUrl: ogImageUrl,
                    width: 1200,
                    height: 630,
                    type: 'image/jpeg',
                    alt: input.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: input.title,
            description: input.description,
            images: [ogImageUrl],
        },
    };
}
