import React, { Suspense } from 'react';
import DevotionalStories from '@/components/categories/StoriesPage';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { headers } from 'next/headers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default async function StoriesPage() {
    const headersList = await headers();
    const locale = (headersList.get("x-locale") as Locale) || "en";
    const dictionary = await getDictionary(locale);

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-200">
            <Navbar />
            <Suspense fallback={<div className="flex-grow flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
                <DevotionalStories dictionary={dictionary} />
            </Suspense>
            <Footer />
        </div>
    );
}
