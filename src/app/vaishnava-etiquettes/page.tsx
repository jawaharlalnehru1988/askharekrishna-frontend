import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import VaishnavaEtiquettesSection from '@/components/categories/VaishnavaEtiquettesSection';

export const metadata: Metadata = {
    title: 'Vaishnava Etiquettes & Sadācāra | AskHareKrishna',
    description: 'Explore authentic Vaishnava etiquettes across 10 essential dimensions: deity worship decorum, relationship ethics, speech control, domestic harmony, and daily sadācāra guideposts.',
    openGraph: {
        title: 'Vaishnava Etiquettes & Sadācāra | AskHareKrishna',
        description: 'Explore authentic Vaishnava etiquettes across 10 essential dimensions: deity worship decorum, relationship ethics, speech control, domestic harmony, and daily sadācāra guideposts.',
        url: 'https://askharekrishna.com/vaishnava-etiquettes',
        siteName: 'AskHareKrishna',
        type: 'website',
    },
};

export default function VaishnavaEtiquettesPage() {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-200">
            <Navbar />
            <main className="flex-1">
                <VaishnavaEtiquettesSection />
            </main>
            <Footer />
        </div>
    );
}
