import React, { Suspense } from 'react';
import DevotionalStories from '@/components/categories/StoriesPage';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { headers } from 'next/headers';

export default async function StoriesPage() {
    const headersList = await headers();
    const locale = (headersList.get("x-locale") as Locale) || "en";
    const dictionary = await getDictionary(locale);

    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
            <DevotionalStories dictionary={dictionary} />
        </Suspense>
    );
}
