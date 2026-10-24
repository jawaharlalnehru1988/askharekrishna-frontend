import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export const dynamic = 'force-dynamic';

const ALLOWED_HOSTS = [
    'api.askharekrishna.com',
    'askharekrishna.com',
    'www.askharekrishna.com',
    'localhost',
    '127.0.0.1',
    'images.unsplash.com',
];

function isHostAllowed(hostname: string): boolean {
    if (ALLOWED_HOSTS.includes(hostname)) return true;
    if (hostname.endsWith('.askharekrishna.com')) return true;
    if (hostname.endsWith('.googleusercontent.com')) return true;
    return false;
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new NextResponse('Missing url parameter', { status: 400 });
    }

    try {
        let fetchUrl = imageUrl;
        if (fetchUrl.startsWith('/')) {
            fetchUrl = `https://askharekrishna.com${fetchUrl}`;
        }

        const parsed = new URL(fetchUrl);
        if (!isHostAllowed(parsed.hostname)) {
            return new NextResponse('Host not allowed', { status: 403 });
        }

        // If request points to api.askharekrishna.com, we can fetch internally from 127.0.0.1:8000 if needed,
        // or directly via HTTPS
        const res = await fetch(fetchUrl, {
            headers: {
                'User-Agent': 'AskHareKrishna-OG-Optimizer/1.0',
            },
            next: { revalidate: 604800 }, // 7 days cache
        });

        if (!res.ok) {
            return new NextResponse(`Failed to fetch image: ${res.statusText}`, { status: res.status });
        }

        const arrayBuffer = await res.arrayBuffer();
        const inputBuffer = Buffer.from(arrayBuffer);

        // Standard Social / WhatsApp Preview dimensions: 1200x630, 1.91:1 ratio
        // WhatsApp strictly requires file size to be under 300KB
        const optimizedBuffer = await sharp(inputBuffer)
            .resize(1200, 630, {
                fit: 'cover',
                position: 'center',
            })
            .jpeg({
                quality: 80,
                progressive: true,
                mozjpeg: true,
            })
            .toBuffer();

        return new Response(new Uint8Array(optimizedBuffer), {
            status: 200,
            headers: {
                'Content-Type': 'image/jpeg',
                'Content-Length': optimizedBuffer.length.toString(),
                'Cache-Control': 'public, max-age=31536000, immutable',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (err: any) {
        console.error('OG image optimization error:', err);
        return new NextResponse(`Error processing image: ${err?.message || 'unknown'}`, { status: 500 });
    }
}
