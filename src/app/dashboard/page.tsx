'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { ArrowRight, BookOpen, Loader2, Search, ShieldCheck, Trophy } from 'lucide-react';

import { useLanguage } from '@/components/providers/LanguageContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.askharekrishna.com/api';
const SUBSCRIBER_PHONE_KEY = 'askharekrishna-subscriber-phone';

interface SubscriberProfile {
  name: string;
  phone_number: string;
  language: string;
  place: string;
  created_at: string;
}

interface SubscriberQuizAttempt {
  id: number;
  article_id: number;
  article_title: string;
  quiz_type: 'pooja_vidhi' | 'story';
  score: number;
  total_questions: number;
  attempt_number: number;
  created_at: string;
}

interface DashboardPayload {
  subscriber: SubscriberProfile;
  attempts: SubscriberQuizAttempt[];
}

interface QuizSuggestionItem {
  id: number;
  title: string;
  href: string;
  type: 'pooja_vidhi' | 'story';
}

interface CategoryArticle {
  id: number;
  subTopic: string;
  slug?: string;
  questions?: Array<{ id: number }>;
}

interface GroupedCategory {
  articleList: CategoryArticle[];
}

export default function DashboardPage() {
  const { locale } = useLanguage();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [quizSuggestions, setQuizSuggestions] = useState<QuizSuggestionItem[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const attempts = useMemo(() => dashboard?.attempts || [], [dashboard]);
  const attemptedQuizKeys = useMemo(
    () => new Set(attempts.map((attempt) => `${attempt.quiz_type}:${attempt.article_id}`)),
    [attempts],
  );
  const shouldShowQuizSuggestions = !dashboard || attempts.length === 0;
  const totalAttempts = attempts.length;
  const totalQuestionsAnswered = useMemo(
    () => attempts.reduce((sum, attempt) => sum + attempt.total_questions, 0),
    [attempts],
  );
  const totalPointsGained = useMemo(
    () => attempts.reduce((sum, attempt) => sum + attempt.score, 0),
    [attempts],
  );
  const bestScore = useMemo(() => {
    if (!attempts.length) return null;
    return attempts.reduce((best, attempt) => {
      const currentPercent = attempt.total_questions ? attempt.score / attempt.total_questions : 0;
      const bestPercent = best.total_questions ? best.score / best.total_questions : 0;
      return currentPercent > bestPercent ? attempt : best;
    }, attempts[0]);
  }, [attempts]);
  const visibleQuizSuggestions = useMemo(
    () => quizSuggestions.filter((quiz) => !attemptedQuizKeys.has(`${quiz.type}:${quiz.id}`)).slice(0, 8),
    [attemptedQuizKeys, quizSuggestions],
  );
  const groupedQuizSuggestions = useMemo(
    () => ({
      pooja_vidhi: visibleQuizSuggestions.filter((quiz) => quiz.type === 'pooja_vidhi'),
      story: visibleQuizSuggestions.filter((quiz) => quiz.type === 'story'),
    }),
    [visibleQuizSuggestions],
  );

  const loadDashboard = useCallback(async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/subscriber-dashboard/`, {
        params: { phone_number: trimmed },
      });
      setDashboard(response.data as DashboardPayload);
    } catch (requestError) {
      console.error('Dashboard load failed:', requestError);
      setDashboard(null);
      setError(locale === 'ta'
        ? 'உங்கள் dashboard தரவுகளை பெற முடியவில்லை. தயவுசெய்து சரியான தொலைபேசி எண்ணை உள்ளிடவும்.'
        : 'Could not load your dashboard. Please enter the same phone number you used while subscribing.');
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedPhone = window.localStorage.getItem(SUBSCRIBER_PHONE_KEY) || '';
    if (savedPhone) {
      setPhoneNumber(savedPhone);
      loadDashboard(savedPhone);
    }
  }, [loadDashboard]);

  useEffect(() => {
    const fetchQuizSuggestions = async () => {
      setLoadingSuggestions(true);
      try {
        const [poojaResponse, storiesResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/v1/pooja_vidhis/articles/`, { params: { language: locale } }),
          axios.get(`${API_BASE_URL}/v1/stories/articles/`, { params: { language: locale } }),
        ]);

        const poojaGroups: GroupedCategory[] = Array.isArray(poojaResponse.data)
          ? poojaResponse.data
          : (poojaResponse.data.results || []);
        const storyGroups: GroupedCategory[] = Array.isArray(storiesResponse.data)
          ? storiesResponse.data
          : (storiesResponse.data.results || []);

        const poojaSuggestions: QuizSuggestionItem[] = poojaGroups
          .flatMap((group) => group.articleList || [])
          .filter((article) => (article.questions || []).length > 0)
          .slice(0, 4)
          .map((article) => ({
            id: article.id,
            title: article.subTopic,
            href: `/pooja-vidhis/${article.id}/quiz`,
            type: 'pooja_vidhi',
          }));

        const storySuggestions: QuizSuggestionItem[] = storyGroups
          .flatMap((group) => group.articleList || [])
          .filter((article) => (article.questions || []).length > 0)
          .slice(0, 4)
          .map((article) => ({
            id: article.id,
            title: article.subTopic,
            href: `/stories/${article.id}`,
            type: 'story',
          }));

        setQuizSuggestions([...poojaSuggestions, ...storySuggestions]);
      } catch (suggestionError) {
        console.error('Quiz suggestions load failed:', suggestionError);
        setQuizSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    fetchQuizSuggestions();
  }, [locale]);

  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark text-text-main dark:text-white">
      <section className="border-b border-[#f3efe7] dark:border-neutral-800 bg-gradient-to-br from-primary/10 via-transparent to-transparent dark:from-primary/15">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-14">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 dark:bg-black/20 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-primary">
              <ShieldCheck size={14} />
              {locale === 'ta' ? 'தனிப்பட்ட score dashboard' : 'Personal score dashboard'}
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              {locale === 'ta' ? 'உங்கள் quiz மதிப்பெண்கள் மற்றும் முயற்சிகள்' : 'Your quiz scores and attempts'}
            </h1>
            <p className="text-base md:text-lg text-text-muted dark:text-gray-300 leading-relaxed">
              {locale === 'ta'
                ? 'இந்த பக்கம் public ஆகவே உள்ளது. உள்நுழைவு உங்கள் சொந்த quiz history-ஐ மட்டும் காட்ட உதவும்; மற்ற எல்லா பக்கங்களும் எந்த தடையும் இல்லாமல் திறந்திருக்கும்.'
                : 'This page is public. Logging in only helps you view your own quiz history; every other page remains open to everyone.'}
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-[#f3efe7] dark:border-neutral-800 bg-white dark:bg-[#1a160f] shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Search size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-black">{locale === 'ta' ? 'உங்கள் dashboard-ஐ திறக்கவும்' : 'Open your dashboard'}</h2>
                <p className="text-sm text-text-muted dark:text-gray-400">
                  {locale === 'ta'
                    ? 'உங்கள் சந்தா போது பயன்படுத்திய அதே தொலைபேசி எண்ணை உள்ளிடவும்.'
                    : 'Enter the same phone number you used when subscribing.'}
                </p>
              </div>
            </div>

            <form
              className="flex flex-col sm:flex-row gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                loadDashboard(phoneNumber);
              }}
            >
              <input
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                className="flex-1 rounded-2xl border border-gray-200 dark:border-neutral-800 bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder={locale === 'ta' ? 'தொலைபேசி எண்' : 'Phone number'}
                inputMode="tel"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 font-black text-black transition-all disabled:opacity-60"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {locale === 'ta' ? 'Dashboard Load செய்யவும்' : 'Load dashboard'}
              </button>
            </form>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm font-medium">
                {error}
              </div>
            )}
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl border border-[#f3efe7] dark:border-neutral-800 bg-white dark:bg-[#1a160f] shadow-sm p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-primary font-black mb-2">{locale === 'ta' ? 'மொத்த முயற்சிகள்' : 'Total attempts'}</p>
                  <p className="text-3xl font-black">{totalAttempts}</p>
                </div>
                <Trophy className="text-primary" size={28} />
              </div>
            </div>

            <div className="rounded-3xl border border-[#f3efe7] dark:border-neutral-800 bg-white dark:bg-[#1a160f] shadow-sm p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-primary font-black mb-2">{locale === 'ta' ? 'சிறந்த score' : 'Best score'}</p>
              {bestScore ? (
                <>
                  <p className="text-2xl font-black">{bestScore.score}/{bestScore.total_questions}</p>
                  <p className="text-sm text-text-muted dark:text-gray-400 mt-1">
                    {bestScore.article_title}
                  </p>
                </>
              ) : (
                <p className="text-sm text-text-muted dark:text-gray-400">{locale === 'ta' ? 'இன்னும் score இல்லை.' : 'No scores yet.'}</p>
              )}
            </div>

            <div className="rounded-3xl border border-[#f3efe7] dark:border-neutral-800 bg-white dark:bg-[#1a160f] shadow-sm p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-primary font-black mb-2">{locale === 'ta' ? 'மொத்த புள்ளிகள்' : 'Total Points Summary'}</p>
              <p className="text-2xl font-black">
                {locale === 'ta'
                  ? `${totalQuestionsAnswered} கேள்விகள், ${totalPointsGained} சரியான பதில்கள் (புள்ளிகள் ${totalPointsGained})`
                  : `${totalQuestionsAnswered} questions, ${totalPointsGained} right answers (points ${totalPointsGained})`}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {dashboard ? (
            <div className="rounded-3xl border border-[#f3efe7] dark:border-neutral-800 bg-white dark:bg-[#1a160f] shadow-sm p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-primary font-black mb-2">{locale === 'ta' ? 'உறுப்பினர் விவரங்கள்' : 'Subscriber details'}</p>
                  <h2 className="text-2xl font-black">{dashboard.subscriber.name}</h2>
                  <p className="text-sm text-text-muted dark:text-gray-400 mt-1">
                    {dashboard.subscriber.phone_number} • {dashboard.subscriber.place}
                  </p>
                </div>
                <div className="text-sm text-text-muted dark:text-gray-400">
                  <p>{locale === 'ta' ? 'பதிவு மொழி' : 'Registered language'}: {dashboard.subscriber.language}</p>
                  <p>{locale === 'ta' ? 'சேர்ந்த நாள்' : 'Joined'}: {new Date(dashboard.subscriber.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="grid gap-4">
            {dashboard && attempts.length ? attempts.map((attempt) => (
                <article key={attempt.id} className="rounded-3xl border border-[#f3efe7] dark:border-neutral-800 bg-white dark:bg-[#1a160f] shadow-sm p-5 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-primary font-black mb-2">
                          {attempt.quiz_type === 'story' ? (locale === 'ta' ? 'Story Quiz' : 'Story Quiz') : (locale === 'ta' ? 'Pooja Vidhi Quiz' : 'Pooja Vidhi Quiz')}
                        </p>
                        <h3 className="text-lg md:text-xl font-black leading-relaxed">{attempt.article_title}</h3>
                        <p className="text-sm text-text-muted dark:text-gray-400 mt-1">
                          {locale === 'ta' ? 'முயற்சி' : 'Attempt'} #{attempt.attempt_number} • {new Date(attempt.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-3">
                      <div className="inline-flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 font-black text-primary">
                        <span className="text-sm uppercase tracking-[0.2em]">{locale === 'ta' ? 'புள்ளிகள்' : 'Points'}</span>
                        <span>{attempt.score}/{attempt.total_questions}</span>
                      </div>
                      <Link
                        href={attempt.quiz_type === 'pooja_vidhi' ? `/pooja-vidhis/${attempt.article_id}/quiz` : `/stories/${attempt.article_id}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-primary/20 px-4 py-2 text-sm font-black text-primary hover:bg-primary/10 transition-all"
                      >
                        <span>{locale === 'ta' ? 'Quiz மீண்டும் முயற்சி' : 'Retry Quiz'}</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </article>
            )) : shouldShowQuizSuggestions ? (
              <div className="rounded-3xl border border-dashed border-gray-200 dark:border-neutral-800 bg-white/60 dark:bg-[#1a160f]/60 p-8 text-center">
                  <p className="text-lg font-bold">
                    {locale === 'ta' ? 'இப்போது ஒரு quiz attempt செய்யும் நேரம்!' : 'This is the perfect time to attempt your first quiz!'}
                  </p>
                  <p className="mt-2 text-sm text-text-muted dark:text-gray-400">
                    {locale === 'ta'
                      ? 'கீழே உள்ள quiz-களை முயற்சி செய்யுங்கள். உங்கள் score உயரும்போது, ஸ்ரீ கிருஷ்ணரிடம் உங்கள் பக்தியும் ஆழமாக வளரும்.'
                      : 'Attempt quizzes from the list below. As your score grows, your devotion to Lord Krishna also grows deeper.'}
                  </p>
              </div>
            ) : null}
          </div>

          <div className="rounded-3xl border border-[#f3efe7] dark:border-neutral-800 bg-white dark:bg-[#1a160f] shadow-sm p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-primary font-black mb-2">
                  {locale === 'ta' ? 'உங்கள் score-ஐ உயர்த்துங்கள்' : 'Increase Your Score'}
                </p>
                <h3 className="text-2xl font-black">
                  {locale === 'ta' ? 'மேலும் quiz-களை முயற்சி செய்யுங்கள்' : 'Try More Quizzes'}
                </h3>
                <p className="mt-2 text-sm text-text-muted dark:text-gray-400 max-w-3xl">
                  {locale === 'ta'
                    ? 'ஒவ்வொரு சரியான பதிலும் பக்தியை மேலும் ஆழப்படுத்தும். கீழே உள்ள Stories மற்றும் Pooja Vidhis quiz-களில் தொடர்ந்து முயற்சி செய்யுங்கள்.'
                    : 'Each right answer is a step deeper into devotion. Continue with these Stories and Pooja Vidhis quizzes to grow your score and devotion to Lord Krishna.'}
                </p>
              </div>
            </div>

            {loadingSuggestions ? (
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-text-muted dark:text-gray-400">
                <Loader2 size={16} className="animate-spin" />
                {locale === 'ta' ? 'Quiz பட்டியல் ஏற்றப்படுகிறது...' : 'Loading quiz list...'}
              </div>
            ) : visibleQuizSuggestions.length ? (
              <div className="mt-6 space-y-6">
                {groupedQuizSuggestions.pooja_vidhi.length ? (
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.25em] text-primary font-black">
                      {locale === 'ta' ? 'பூஜை விதி Quiz-கள்' : 'Pooja Vidhi Quizzes'}
                    </p>
                    <div className="grid gap-3">
                      {groupedQuizSuggestions.pooja_vidhi.map((quiz) => (
                        <Link
                          key={`${quiz.type}-${quiz.id}`}
                          href={quiz.href}
                          className="group flex items-center justify-between rounded-2xl border border-[#f3efe7] dark:border-neutral-800 bg-white dark:bg-[#1a160f] px-4 py-3 hover:border-primary/40 hover:bg-primary/5 transition-all"
                        >
                          <div>
                            <p className="text-sm font-black text-text-main dark:text-white group-hover:text-primary transition-colors">
                              {quiz.title}
                            </p>
                            <p className="text-xs text-text-muted dark:text-gray-400 mt-1 uppercase tracking-[0.2em] font-bold">
                              {locale === 'ta' ? 'பூஜை விதி Quiz' : 'Pooja Vidhi Quiz'}
                            </p>
                          </div>
                          <ArrowRight size={16} className="text-primary group-hover:translate-x-1 transition-transform" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}

                {groupedQuizSuggestions.story.length ? (
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.25em] text-primary font-black">
                      {locale === 'ta' ? 'Story Quiz-கள்' : 'Story Quizzes'}
                    </p>
                    <div className="grid gap-3">
                      {groupedQuizSuggestions.story.map((quiz) => (
                        <Link
                          key={`${quiz.type}-${quiz.id}`}
                          href={quiz.href}
                          className="group flex items-center justify-between rounded-2xl border border-[#f3efe7] dark:border-neutral-800 bg-white dark:bg-[#1a160f] px-4 py-3 hover:border-primary/40 hover:bg-primary/5 transition-all"
                        >
                          <div>
                            <p className="text-sm font-black text-text-main dark:text-white group-hover:text-primary transition-colors">
                              {quiz.title}
                            </p>
                            <p className="text-xs text-text-muted dark:text-gray-400 mt-1 uppercase tracking-[0.2em] font-bold">
                              {locale === 'ta' ? 'Story Quiz' : 'Story Quiz'}
                            </p>
                          </div>
                          <ArrowRight size={16} className="text-primary group-hover:translate-x-1 transition-transform" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/pooja-vidhis" className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 font-black text-black">
                  {locale === 'ta' ? 'Quiz உள்ள பூஜை விதிகள்' : 'Quiz-enabled Pooja Vidhis'}
                  <ArrowRight size={16} />
                </Link>
                <Link href="/stories" className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 dark:border-neutral-800 px-5 py-3 font-black text-text-main dark:text-white">
                  {locale === 'ta' ? 'Story Quiz-கள்' : 'Story quizzes'}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
