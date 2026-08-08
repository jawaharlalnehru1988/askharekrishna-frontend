import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import UpcomingEventsSection from '@/components/home/UpcomingEventsSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vaishnava Calendar & Upcoming Devotional Events | Ask Hare Krishna',
  description: 'Explore upcoming Ekadashi dates, fasting rules, appearance days of Lord Krishna avatars and Acharyas on Ask Hare Krishna.',
};

export default function VaishnavaCalendarPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-200">
      <Navbar />

      <main className="flex-grow">
        <UpcomingEventsSection isHomePage={false} />
      </main>

      <Footer />
    </div>
  );
}
