'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { Loader2, Lock, X } from 'lucide-react';

import { Locale } from '@/lib/dictionaries';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.askharekrishna.com/api';

const SUBSCRIBER_PHONE_KEY = 'askharekrishna-subscriber-phone';
const SUBSCRIBER_NAME_KEY = 'askharekrishna-subscriber-name';

interface SubscriberFormModalProps {
  open: boolean;
  locale: Locale;
  title: string;
  description: string;
  submitLabel: string;
  successMessage: string;
  continueLabel: string;
  onClose: () => void;
  onSuccess?: () => void;
  persistKey?: string;
  mode?: 'subscribe' | 'phone-login';
}

export function SubscriberFormModal({
  open,
  locale,
  title,
  description,
  submitLabel,
  successMessage,
  continueLabel,
  onClose,
  onSuccess,
  persistKey,
  mode = 'subscribe',
}: SubscriberFormModalProps) {
  const [mounted, setMounted] = useState(false);
  const [subscriberForm, setSubscriberForm] = useState({
    name: '',
    phone_number: '',
    place: '',
  });
  const [activeMode, setActiveMode] = useState<'subscribe' | 'phone-login'>(mode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const resolvedSubmitLabel = (submitLabel || '').trim() || (locale === 'ta' ? 'உள்நுழைய' : 'Log In');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || typeof window === 'undefined') return;

    const savedPhone = window.localStorage.getItem(SUBSCRIBER_PHONE_KEY);
    const savedName = window.localStorage.getItem(SUBSCRIBER_NAME_KEY);
    const savedPersisted = persistKey ? window.localStorage.getItem(persistKey) === '1' : false;

    setSubscriberForm((current) => ({
      ...current,
      phone_number: savedPhone || current.phone_number,
      name: savedName || current.name,
    }));
    setSuccess(savedPersisted);
    setError(null);
    setActiveMode(mode);
  }, [open, persistKey]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

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
        window.localStorage.setItem(SUBSCRIBER_PHONE_KEY, subscriberForm.phone_number);
        window.localStorage.setItem(SUBSCRIBER_NAME_KEY, subscriberForm.name.trim());
        if (persistKey) {
          window.localStorage.setItem(persistKey, '1');
        }
        window.dispatchEvent(new Event('subscriber-updated'));
      }

      onSuccess?.();
      setSuccess(true);
    } catch (submitError) {
      console.error('Subscriber save failed:', submitError);
      setError(
        locale === 'ta'
          ? 'இலவச சந்தா பதிவு செய்ய முடியவில்லை. மீண்டும் முயற்சிக்கவும்.'
          : 'Failed to save your details. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhoneLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const phoneNumber = subscriberForm.phone_number.trim();
      const response = await axios.get(`${API_BASE_URL}/subscriber-dashboard/`, {
        params: {
          phone_number: phoneNumber,
        },
      });

      const subscriber = response.data?.subscriber;

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(SUBSCRIBER_PHONE_KEY, phoneNumber);
        if (subscriber?.name) {
          window.localStorage.setItem(SUBSCRIBER_NAME_KEY, String(subscriber.name).trim());
        }
        window.dispatchEvent(new Event('subscriber-updated'));
      }

      if (onSuccess) {
        onSuccess();
      } else {
        setSuccess(true);
      }
    } catch (loginError) {
      console.error('Subscriber login failed:', loginError);
      setError(
        locale === 'ta'
          ? 'இந்த எண்ணில் பதிவு காணவில்லை. புதிய சந்தாதாரராக பதிவு செய்யவும்.'
          : 'No subscriber found with this phone number. Please register as a new subscriber.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[2147483647] flex items-start sm:items-center justify-center overflow-y-auto bg-black/60 px-4 py-4 sm:py-8">
      <div className="relative my-auto w-full max-w-xl max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] overflow-y-auto rounded-3xl bg-white dark:bg-[#1a160f] border border-gray-100 dark:border-neutral-800 shadow-2xl p-6 md:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-text-muted"
          aria-label="Close subscriber form"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <Lock size={20} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-text-main dark:text-white">{title}</h3>
            <p className="text-sm text-text-muted dark:text-gray-400">{description}</p>
          </div>
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-4 text-sm font-medium">
              {successMessage}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 font-black text-black transition-all"
            >
              {continueLabel}
            </button>
          </div>
        ) : activeMode === 'phone-login' ? (
          <form className="grid gap-4" onSubmit={handlePhoneLogin}>
            <div>
              <label className="block text-sm font-bold text-text-main dark:text-white mb-2">
                {locale === 'ta' ? 'தொலைபேசி எண்' : 'Phone Number'}
              </label>
              <input
                value={subscriberForm.phone_number}
                onChange={(e) => setSubscriberForm((current) => ({ ...current, phone_number: e.target.value }))}
                className="w-full rounded-2xl border border-gray-200 dark:border-neutral-800 bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder={locale === 'ta' ? 'உங்கள் தொலைபேசி எண்' : 'Your phone number'}
                required
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm font-medium">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-w-[140px] items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 font-black text-black transition-all disabled:opacity-60"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {resolvedSubmitLabel}
              </button>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setActiveMode('subscribe');
                }}
                className="inline-flex items-center justify-center rounded-2xl border border-gray-200 dark:border-neutral-800 px-6 py-3 font-black text-text-main dark:text-white transition-all"
              >
                {locale === 'ta' ? 'புதிய சந்தாதாரர்?' : 'New subscriber?'}
              </button>
            </div>
          </form>
        ) : (
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-bold text-text-main dark:text-white mb-2">
                {locale === 'ta' ? 'பெயர்' : 'Name'}
              </label>
              <input
                value={subscriberForm.name}
                onChange={(e) => setSubscriberForm((current) => ({ ...current, name: e.target.value }))}
                className="w-full rounded-2xl border border-gray-200 dark:border-neutral-800 bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder={locale === 'ta' ? 'உங்கள் பெயர்' : 'Your name'}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-text-main dark:text-white mb-2">
                {locale === 'ta' ? 'தொலைபேசி எண்' : 'Phone Number'}
              </label>
              <input
                value={subscriberForm.phone_number}
                onChange={(e) => setSubscriberForm((current) => ({ ...current, phone_number: e.target.value }))}
                className="w-full rounded-2xl border border-gray-200 dark:border-neutral-800 bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder={locale === 'ta' ? 'உங்கள் தொலைபேசி எண்' : 'Your phone number'}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-text-main dark:text-white mb-2">
                {locale === 'ta' ? 'இடம்' : 'Place'}
              </label>
              <input
                value={subscriberForm.place}
                onChange={(e) => setSubscriberForm((current) => ({ ...current, place: e.target.value }))}
                className="w-full rounded-2xl border border-gray-200 dark:border-neutral-800 bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder={locale === 'ta' ? 'உங்கள் ஊர்' : 'Your place'}
                required
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm font-medium">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-w-[140px] items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 font-black text-black transition-all disabled:opacity-60"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {resolvedSubmitLabel}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-2xl border border-gray-200 dark:border-neutral-800 px-6 py-3 font-black text-text-main dark:text-white transition-all"
              >
                {locale === 'ta' ? 'பின்னர்' : 'Later'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}