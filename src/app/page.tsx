import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { headers } from 'next/headers';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { HomeHero } from '@/components/home/HomeHero';
import { StoriesCarousel } from '@/components/home/StoriesCarousel';
import { DebateCarousel } from '@/components/home/DebateCarousel';
import OtherWebsites from '@/components/categories/OtherWebsites';
import PoojaVidhisSection from '@/components/categories/PoojaVidhisSection';
import { FEATURE_FLAGS } from '@/lib/feature-flags';

export default async function Home() {
  const headersList = await headers();
  const locale = (headersList.get('x-locale') as Locale) || 'en';
  const dictionary = await getDictionary(locale);
  const { home: h } = dictionary;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-200">
      <Navbar />

      <HomeHero h={h} />

      <StoriesCarousel h={h} />

      <PoojaVidhisSection />

      {FEATURE_FLAGS.DEBATE_SECTION && <DebateCarousel h={h} />}

      <OtherWebsites />

      <Footer />
    </div>
  );
}
