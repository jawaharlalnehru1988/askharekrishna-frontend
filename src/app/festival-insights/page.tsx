import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import FestivalInsightsSection from '@/components/categories/FestivalInsightsSection';

export const metadata: Metadata = {
    metadataBase: new URL('https://askharekrishna.com'),
    title: 'Festival Insights — Shastric Significance, Vratas & Sacred Observances | AskHareKrishna',
    description: 'Explore authentic scriptural insights, historical lilas, and essential sadachara rules (dos & don’ts) for sacred Vaishnava and Vedic festivals according to the Puranas and Itihasas.',
    alternates: {
        canonical: '/festival-insights',
    },
    openGraph: {
        title: 'Festival Insights — Shastric Significance & Observances | AskHareKrishna',
        description: 'Explore authentic scriptural insights, historical lilas, and essential sadachara rules (dos & don’ts) for sacred Vaishnava and Vedic festivals according to the Puranas and Itihasas.',
        url: 'https://askharekrishna.com/festival-insights',
        siteName: 'Ask Hare Krishna',
        type: 'website',
        images: [
            {
                url: 'https://askharekrishna.com/api/og?url=https%3A%2F%2Faskharekrishna.com%2Fimages%2Ffestival-insights%2Fdipavali-meaning-shastra.jpg',
                secureUrl: 'https://askharekrishna.com/api/og?url=https%3A%2F%2Faskharekrishna.com%2Fimages%2Ffestival-insights%2Fdipavali-meaning-shastra.jpg',
                width: 1200,
                height: 630,
                type: 'image/jpeg',
                alt: 'Festival Insights — AskHareKrishna',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Festival Insights — Shastric Significance & Observances | AskHareKrishna',
        description: 'Explore authentic scriptural insights, historical lilas, and essential sadachara rules (dos & don’ts) for sacred Vaishnava and Vedic festivals according to the Puranas and Itihasas.',
        images: ['https://askharekrishna.com/api/og?url=https%3A%2F%2Faskharekrishna.com%2Fimages%2Ffestival-insights%2Fdipavali-meaning-shastra.jpg'],
    },
};

export default function FestivalInsightsPage() {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-200">
            <Navbar />
            <main className="flex-1">
                <FestivalInsightsSection />
            </main>
            <Footer />
        </div>
    );
}

