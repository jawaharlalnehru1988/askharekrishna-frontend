import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { headers } from 'next/headers';
import { ArrowLeft, CircleHelp } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Locale } from '@/lib/dictionaries';
import { ShareButtons } from '@/components/categories/ShareButtons';
import { PoojaVidhiQuiz } from '@/components/pooja-vidhis/PoojaVidhiQuiz';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.askharekrishna.com/api';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PoojaVidhiQuestionOption {
  id: number;
  order: number;
  option_text: string;
  is_correct: boolean;
}

interface PoojaVidhiQuestion {
  id: number;
  order: number;
  question_text: string;
  is_active: boolean;
  options: PoojaVidhiQuestionOption[];
}

interface PoojaVidhiArticle {
  id: number;
  mainTopic: string;
  subTopic: string;
  article: string;
  slug: string;
  order: number;
  language: string;
  audioPath: string | null;
  articleImage: string | null;
  created_at: string;
  updated_at: string;
  questions?: PoojaVidhiQuestion[];
}

export default async function PoojaVidhiQuizOnlyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const headersList = await headers();
  const hostHeader = headersList.get('host') || headersList.get('x-forwarded-host') || '';
  const derivedLocale = hostHeader.startsWith('tamil.') || hostHeader.startsWith('ta.') ? 'ta' : 'en';
  const locale = (headersList.get('x-locale') as Locale) || derivedLocale;

  let matchedArticle: PoojaVidhiArticle | null = null;
  try {
    const res = await fetch(`${API_BASE_URL}/v1/pooja_vidhis/articles/${id}/`, { cache: 'no-store' });
    if (res.ok) {
      matchedArticle = await res.json();
    }
  } catch (e) {
    console.error('Error fetching article quiz', e);
  }

  if (!matchedArticle) {
    return notFound();
  }

  const host = headersList.get('host') || 'askharekrishna.com';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const quizUrl = `${protocol}://${host}/pooja-vidhis/${id}/quiz`;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-200">
      <Navbar />
      <main className="flex-grow py-20 px-4 md:px-8 max-w-[1000px] mx-auto w-full">
        <Link
          href={`/pooja-vidhis/${id}`}
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-bold mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          {locale === 'ta' ? 'கட்டுரைக்கு திரும்பு' : 'Back to Article'}
        </Link>

        <div className="bg-white dark:bg-[#1a160f] rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-neutral-800">
          <div className="p-6 md:p-8 border-b border-gray-100 dark:border-neutral-800">
            <div className="flex items-start gap-4">
              <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <CircleHelp size={26} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-text-main dark:text-white">
                  {locale === 'ta' ? 'பூஜை விதி வினாடி வினா' : 'Pooja Vidhi Quiz'}
                </h1>
                <p className="text-sm md:text-base text-text-muted dark:text-gray-300 mt-2">
                  {matchedArticle.subTopic}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-10">
            <PoojaVidhiQuiz
              articleId={matchedArticle.id}
              articleTitle={matchedArticle.subTopic}
              locale={locale}
              questions={matchedArticle.questions ?? []}
              quizType="pooja_vidhi"
            />

            <div className="mt-16 pt-10 border-t border-gray-100 dark:border-neutral-800 text-center">
              <p className="text-sm font-bold text-text-muted mb-6 uppercase tracking-[0.3em]">
                {locale === 'ta' ? 'இந்த வினாடி வினாவைப் பகிரவும்' : 'Share This Quiz'}
              </p>
              <ShareButtons
                articleUrl={quizUrl}
                subTopic={matchedArticle.subTopic}
                messagePrefix={locale === 'ta' ? 'இந்த வினாடி வினாவை முயற்சி செய்யுங்கள்:' : 'Try this devotional quiz:'}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
