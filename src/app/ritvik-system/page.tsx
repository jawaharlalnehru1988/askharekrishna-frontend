import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import RitvikCatalog from '@/components/categories/RitvikCatalog';

export const metadata: Metadata = {
    title: 'The Process of Diksha in ISKCON | இஸ்கானில் தீட்சை முறை | Ask Hare Krishna',
    description: 'Systematic Proofs, Shastric Siddhanta & Complete Resolution of the Initiation Controversy by Srila Prabhupada.',
};

export default function RitvikSystemPage() {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-200">
            <Navbar />
            <main className="flex-1">
                <RitvikCatalog />
            </main>
            <Footer />
        </div>
    );
}
