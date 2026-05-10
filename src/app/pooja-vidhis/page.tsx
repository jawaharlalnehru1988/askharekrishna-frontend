import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import PoojaVidhisSection from '@/components/categories/PoojaVidhisSection';
import { headers } from 'next/headers';
import { getDictionary, Locale } from '@/lib/dictionaries';

export default async function PoojaVidhisPage() {
    const headersList = await headers();
    const locale = (headersList.get('x-locale') as Locale) || 'en';
    const dictionary = await getDictionary(locale);

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-200">
            <Navbar />
            <main className="flex-grow">
                <PoojaVidhisSection isHomePage={false} />
            </main>
            <Footer />
        </div>
    );
}
