"use client";

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { CheckCircle2, Loader2, Lock, ShieldAlert, X } from 'lucide-react';
import { Locale } from '@/lib/dictionaries';

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

interface PoojaVidhiQuizProps {
  articleId: number;
  articleTitle: string;
  locale: Locale;
  questions: PoojaVidhiQuestion[];
  quizType?: 'pooja_vidhi' | 'story';
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.askharekrishna.com/api';

const STORAGE_PREFIX = 'askharekrishna-pooja-subscriber';
const SUBSCRIBER_PHONE_KEY = 'askharekrishna-subscriber-phone';
const SUBSCRIBER_NAME_KEY = 'askharekrishna-subscriber-name';

export const PoojaVidhiQuiz = ({ articleId, articleTitle, locale, questions, quizType = 'pooja_vidhi' }: PoojaVidhiQuizProps) => {
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [showSubscriberForm, setShowSubscriberForm] = useState(false);
  const [subscriberSaved, setSubscriberSaved] = useState(false);
  const [submittingSubscriber, setSubmittingSubscriber] = useState(false);
  const [submittingScore, setSubmittingScore] = useState(false);
  const [subscriberError, setSubscriberError] = useState<string | null>(null);
  const [subscriberSuccess, setSubscriberSuccess] = useState<string | null>(null);
  const [scoreError, setScoreError] = useState<string | null>(null);
  const [scoreSuccess, setScoreSuccess] = useState<string | null>(null);
  const [hasSubmittedScore, setHasSubmittedScore] = useState(false);
  const [subscriberForm, setSubscriberForm] = useState({
    name: '',
    phone_number: '',
    place: '',
  });

  const storageKey = useMemo(() => `${STORAGE_PREFIX}:${articleId}`, [articleId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(storageKey);
    setSubscriberSaved(stored === '1');
    const savedPhone = window.localStorage.getItem(SUBSCRIBER_PHONE_KEY);
    const savedName = window.localStorage.getItem(SUBSCRIBER_NAME_KEY);
    if (savedPhone) {
      setSubscriberForm((current) => ({
        ...current,
        phone_number: savedPhone,
      }));
    }
    if (savedName) {
      setSubscriberForm((current) => ({
        ...current,
        name: savedName,
      }));
    }
  }, [storageKey]);

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(responses).length;
  const allAnswered = totalQuestions > 0 && answeredCount === totalQuestions;
  const score = questions.reduce((total, question) => {
    const answeredOptionId = responses[question.id];
    if (!answeredOptionId) return total;
    const answeredOption = question.options.find((option) => option.id === answeredOptionId);
    return answeredOption?.is_correct ? total + 1 : total;
  }, 0);
  const hasPerfectScore = allAnswered && score === totalQuestions;

  const handleAnswer = (questionId: number, optionId: number) => {
    if (responses[questionId]) return;

    setResponses((current) => ({
      ...current,
      [questionId]: optionId,
    }));

    if (!subscriberSaved) {
      setShowSubscriberForm(true);
    }
  };

  const handleSubscriberSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubscriberError(null);
    setSubscriberSuccess(null);
    setSubmittingSubscriber(true);

    try {
      const payload = {
        ...subscriberForm,
        language: locale,
      };

      await axios.post(`${API_BASE_URL}/subscribers/`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(storageKey, '1');
        window.localStorage.setItem(SUBSCRIBER_PHONE_KEY, subscriberForm.phone_number);
        window.localStorage.setItem(SUBSCRIBER_NAME_KEY, subscriberForm.name.trim());
        window.dispatchEvent(new Event('subscriber-updated'));
      }

      setSubscriberSaved(true);
      setSubscriberSuccess(
        locale === 'ta'
          ? 'நன்றி. உங்கள் பதிவு சேமிக்கப்பட்டது.'
          : 'Thank you. Your subscription has been saved.',
      );
    } catch (error) {
      console.error('Subscriber save failed:', error);
      setSubscriberError(
        locale === 'ta'
          ? 'பதிவு செய்ய முடியவில்லை. மீண்டும் முயற்சிக்கவும்.'
          : 'Failed to subscribe. Please try again.',
      );
    } finally {
      setSubmittingSubscriber(false);
    }
  };

  const handleScoreSubmit = async () => {
    if (!allAnswered) return;

    const phoneNumber = subscriberForm.phone_number || (typeof window !== 'undefined' ? window.localStorage.getItem(SUBSCRIBER_PHONE_KEY) : null);
    if (!phoneNumber) {
      setScoreError(locale === 'ta' ? 'முதலில் பதிவு செய்யவும்.' : 'Please subscribe first before submitting your score.');
      setShowSubscriberForm(true);
      return;
    }

    setSubmittingScore(true);
    setScoreError(null);
    setScoreSuccess(null);

    try {
      const payload = {
        phone_number: phoneNumber,
        article_id: articleId,
        article_title: articleTitle,
        quiz_type: quizType,
        score,
        total_questions: totalQuestions,
      };

      const response = await axios.post(`${API_BASE_URL}/subscriber-quiz-attempts/`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseSubscriberName = response.data?.subscriber_name;
      if (typeof window !== 'undefined' && responseSubscriberName) {
        window.localStorage.setItem(SUBSCRIBER_NAME_KEY, String(responseSubscriberName).trim());
        window.dispatchEvent(new Event('subscriber-updated'));
      }

      const attemptNumber = response.data?.attempt_number;
      setHasSubmittedScore(true);
      setScoreSuccess(
        locale === 'ta'
          ? `மதிப்பெண் சேமிக்கப்பட்டது: ${score}/${totalQuestions}${attemptNumber ? ` (முயற்சி #${attemptNumber})` : ''}. அருமை! உங்கள் பக்தி முயற்சி பாராட்டுக்குரியது.`
          : `Score saved: ${score}/${totalQuestions}${attemptNumber ? ` (Attempt #${attemptNumber})` : ''}. Wonderful effort and devotion!`,
      );
    } catch (error) {
      console.error('Score save failed:', error);
      setScoreError(
        locale === 'ta'
          ? 'மதிப்பெண் சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.'
          : 'Failed to save score. Please try again.',
      );
    } finally {
      setSubmittingScore(false);
    }
  };

  const handleRetest = () => {
    setResponses({});
    setHasSubmittedScore(false);
    setScoreError(null);
    setScoreSuccess(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <ShieldAlert size={20} />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-text-main dark:text-white">
            {locale === 'ta' ? 'சிறு வினா தொகுப்பு' : 'MCQ Quiz'}
          </h2>
          <p className="text-sm text-text-muted dark:text-gray-400">
            {locale === 'ta'
              ? 'ஒரு விடையைத் தேர்ந்தெடுக்கும்போது, தொடர உதவ உங்கள் தகவலைப் பதிவு செய்யலாம்.'
              : 'Answer a question and we will prompt you to subscribe so you can continue.'}
          </p>
        </div>
      </div>

      {questions && questions.length > 0 ? (
        <div className="space-y-6">
          {questions.map((question) => {
          const answeredOptionId = responses[question.id];
          const answeredOption = question.options.find((option) => option.id === answeredOptionId);

          return (
            <div key={question.id} className="rounded-3xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-[#1a160f] shadow-sm p-5 md:p-6">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-2">
                    {locale === 'ta' ? `கேள்வி ${question.order}` : `Question ${question.order}`}
                  </p>
                  <h3 className="text-lg md:text-xl font-bold text-text-main dark:text-white leading-relaxed">
                    {question.question_text}
                  </h3>
                </div>
                {answeredOption && (
                  <div className={`shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-bold ${question.options.find((option) => option.id === answeredOptionId)?.is_correct ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
                    <CheckCircle2 size={16} />
                    {question.options.find((option) => option.id === answeredOptionId)?.is_correct
                      ? (locale === 'ta' ? 'சரி' : 'Correct')
                      : (locale === 'ta' ? 'தவறு' : 'Wrong')}
                  </div>
                )}
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {question.options.map((option) => {
                  const isSelected = answeredOptionId === option.id;
                  const isCorrect = option.is_correct;
                  const showFeedback = answeredOptionId !== undefined;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleAnswer(question.id, option.id)}
                      className={`text-left rounded-2xl border px-4 py-4 transition-all duration-200 ${isSelected
                          ? isCorrect
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                            : 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-300'
                          : showFeedback && isCorrect
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                            : 'border-gray-200 dark:border-neutral-800 hover:border-primary/40 hover:bg-primary/5 text-text-main dark:text-white'
                        }`}
                      disabled={Boolean(answeredOptionId)}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`size-8 rounded-full flex items-center justify-center text-sm font-black ${isSelected && isCorrect ? 'bg-emerald-500 text-white' : isSelected && !isCorrect ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-neutral-800 text-text-muted dark:text-gray-400'}`}>
                          {option.order}
                        </span>
                        <span className="text-base leading-relaxed font-medium">{option.option_text}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {answeredOptionId && (
                <div className="mt-4 text-sm font-medium text-text-muted dark:text-gray-400">
                  {question.options.find((option) => option.id === answeredOptionId)?.is_correct
                    ? (locale === 'ta' ? 'நல்ல தேர்வு.' : 'Nice choice.')
                    : (locale === 'ta' ? 'மீண்டும் முயற்சிக்க அடுத்த கேள்விக்கு செல்லலாம்.' : 'Try the next question.')}
                </div>
              )}
            </div>
          );
          })}

          <div className="rounded-3xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-[#1a160f] shadow-sm p-5 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-2">
                  {locale === 'ta' ? 'வினாடி வினா முடிவு' : 'Quiz Result'}
                </p>
                <p className="text-lg font-bold text-text-main dark:text-white">
                  {locale === 'ta'
                    ? `பதில் அளித்தவை: ${answeredCount}/${totalQuestions}`
                    : `Answered: ${answeredCount}/${totalQuestions}`}
                </p>
                {allAnswered ? (
                  <p className="text-sm text-text-muted dark:text-gray-400 mt-1">
                    {locale === 'ta' ? `மதிப்பெண்: ${score}/${totalQuestions}` : `Score: ${score}/${totalQuestions}`}
                  </p>
                ) : (
                  <p className="text-sm text-text-muted dark:text-gray-400 mt-1">
                    {locale === 'ta' ? 'அனைத்து கேள்விகளுக்கும் பதில் அளித்ததும் Submit பொத்தானை அழுத்தவும்.' : 'Answer all questions to enable Submit.'}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  disabled={!allAnswered || submittingScore || hasSubmittedScore}
                  onClick={handleScoreSubmit}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 font-black text-black transition-all disabled:opacity-50"
                >
                  {submittingScore && <Loader2 size={16} className="animate-spin" />}
                  {locale === 'ta' ? 'மதிப்பெண் Submit செய்யவும்' : 'Submit Score'}
                </button>
                {hasSubmittedScore && !hasPerfectScore ? (
                  <button
                    type="button"
                    onClick={handleRetest}
                    className="inline-flex items-center justify-center rounded-2xl border border-gray-200 dark:border-neutral-800 px-6 py-3 font-black text-text-main dark:text-white transition-all"
                  >
                    {locale === 'ta' ? 'மீண்டும் முயற்சி' : 'Retry'}
                  </button>
                ) : null}
              </div>
            </div>

            {scoreError && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm font-medium">
                {scoreError}
              </div>
            )}

            {scoreSuccess && (
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-3 text-sm font-medium">
                {scoreSuccess}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-gray-200 dark:border-neutral-800 bg-white/60 dark:bg-[#1a160f]/60 p-8 text-center">
          <p className="text-lg font-bold text-text-main dark:text-white">
            {locale === 'ta' ? 'இந்தக் கட்டுரைக்கு MCQs இன்னும் சேர்க்கப்படவில்லை.' : 'No MCQs have been added for this article yet.'}
          </p>
          <p className="mt-2 text-sm text-text-muted dark:text-gray-400">
            {locale === 'ta'
              ? 'MCQs சேர்க்கப்பட்டதும், அவை இங்கே கட்டுரையின் முடிவில் தோன்றும்.'
              : 'Once MCQs are added, they will appear here at the end of the article.'}
          </p>
        </div>
      )}

      {showSubscriberForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
          <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-[#1a160f] border border-gray-100 dark:border-neutral-800 shadow-2xl p-6 md:p-8 relative">
            <button
              type="button"
              onClick={() => setShowSubscriberForm(false)}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-text-muted"
              aria-label="Close subscription form"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Lock size={20} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-text-main dark:text-white">
                  {locale === 'ta' ? 'தொடர பதிவு செய்யுங்கள்' : 'Subscribe to continue'}
                </h3>
                <p className="text-sm text-text-muted dark:text-gray-400">
                  {locale === 'ta'
                    ? `"${articleTitle}"` 
                    : `For "${articleTitle}"`}
                </p>
              </div>
            </div>

            {subscriberSuccess ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-4 text-sm font-medium">
                  {subscriberSuccess}
                </div>
                <button
                  type="button"
                  onClick={() => setShowSubscriberForm(false)}
                  className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 font-black text-black transition-all"
                >
                  {locale === 'ta' ? 'தொடரவும்' : 'Continue'}
                </button>
              </div>
            ) : (
              <form className="grid gap-4" onSubmit={handleSubscriberSubmit}>
                <div>
                  <label className="block text-sm font-bold text-text-main dark:text-white mb-2">{locale === 'ta' ? 'பெயர்' : 'Name'}</label>
                  <input
                    value={subscriberForm.name}
                    onChange={(e) => setSubscriberForm((current) => ({ ...current, name: e.target.value }))}
                    className="w-full rounded-2xl border border-gray-200 dark:border-neutral-800 bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder={locale === 'ta' ? 'உங்கள் பெயர்' : 'Your name'}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-text-main dark:text-white mb-2">{locale === 'ta' ? 'தொலைபேசி எண்' : 'Phone Number'}</label>
                  <input
                    value={subscriberForm.phone_number}
                    onChange={(e) => setSubscriberForm((current) => ({ ...current, phone_number: e.target.value }))}
                    className="w-full rounded-2xl border border-gray-200 dark:border-neutral-800 bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder={locale === 'ta' ? 'உங்கள் தொலைபேசி எண்' : 'Your phone number'}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-text-main dark:text-white mb-2">{locale === 'ta' ? 'இடம்' : 'Place'}</label>
                  <input
                    value={subscriberForm.place}
                    onChange={(e) => setSubscriberForm((current) => ({ ...current, place: e.target.value }))}
                    className="w-full rounded-2xl border border-gray-200 dark:border-neutral-800 bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder={locale === 'ta' ? 'உங்கள் ஊர்' : 'Your place'}
                    required
                  />
                </div>

                {subscriberError && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm font-medium">
                    {subscriberError}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submittingSubscriber}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 font-black text-black transition-all disabled:opacity-60"
                  >
                    {submittingSubscriber && <Loader2 size={16} className="animate-spin" />}
                    {locale === 'ta' ? 'பதிவு செய்யுங்கள்' : 'Subscribe'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSubscriberForm(false)}
                    className="inline-flex items-center justify-center rounded-2xl border border-gray-200 dark:border-neutral-800 px-6 py-3 font-black text-text-main dark:text-white transition-all"
                  >
                    {locale === 'ta' ? 'பின்னர்' : 'Later'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
