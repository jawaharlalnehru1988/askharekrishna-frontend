import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import BabyNamesSection from '@/components/categories/BabyNamesSection';

export const metadata: Metadata = {
    title: 'Vedic & Vaishnava Baby Names — 100% Shastric Divine Names | AskHareKrishna',
    description: 'Explore authentic Vedic and Vaishnava baby names for newborn boys and girls derived from the Vishnu Sahasranama and Radha Sahasranama, with character prefix filters and spiritual meanings.',
    openGraph: {
        title: 'Vedic & Vaishnava Baby Names — 100% Shastric Divine Names | AskHareKrishna',
        description: 'Explore authentic Vedic and Vaishnava baby names for newborn boys and girls derived from the Vishnu Sahasranama and Radha Sahasranama, with character prefix filters and spiritual meanings.',
        url: 'https://askharekrishna.com/baby-names',
        siteName: 'AskHareKrishna',
        type: 'website',
    },
};

export default function BabyNamesPage() {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-200">
            <Navbar />
            <main className="flex-1">
                <BabyNamesSection />
            </main>
            <Footer />
        </div>
    );
}

