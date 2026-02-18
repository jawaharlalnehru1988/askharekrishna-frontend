import React from 'react';
import DevotionalStories from '@/components/categories/StoriesPage';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { headers } from 'next/headers';

export default async function StoriesPage() {
    const headersList = await headers();
    const locale = (headersList.get("x-locale") as Locale) || "en";
    const dictionary = await getDictionary(locale);

    return <DevotionalStories dictionary={dictionary} />;
}
