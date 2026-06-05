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
    const host = input.host || siteMetadata.defaultHost;
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    const canonicalUrl = `${baseUrl}${input.path}`;
    const image = input.imageUrl || `${baseUrl}${siteMetadata.defaultImage}`;

    return {
        metadataBase: new URL(baseUrl),
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
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: input.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: input.title,
            description: input.description,
            images: [image],
        },
    };
}
