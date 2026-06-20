import React, { Suspense } from 'react';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { headers } from 'next/headers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import CourseDetails from '@/components/courses/CourseDetails';
import { notFound } from 'next/navigation';

export const revalidate = 60; // Revalidate every 60 seconds

async function getCourseData(course: string) {
  try {
    const res = await fetch(`https://api.askharekrishna.com/api/course-roadmap/roadmaps/${course}/`, {
      next: { revalidate: 60 }
    });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch course');
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching course data:', error);
    return null;
  }
}

export default async function CoursePage({ params }: { params: Promise<{ course: string }> }) {
  const resolvedParams = await params;
  const headersList = await headers();
  const locale = (headersList.get("x-locale") as Locale) || "en";
  const dictionary = await getDictionary(locale);
  
  const courseData = await getCourseData(resolvedParams.course);
  
  if (!courseData) {
    notFound();
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-200">
      <Navbar />
      <Suspense fallback={<div className="flex-grow flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
        <CourseDetails roadmap={courseData} />
      </Suspense>
      <Footer />
    </div>
  );
}
