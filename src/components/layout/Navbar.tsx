'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../providers/LanguageContext';
import { useTheme } from '../providers/ThemeProvider';

import { LanguageSwitcher } from './LanguageSwitcher';
import { SubscriberFormModal } from '../subscribers/SubscriberFormModal';

import axios from 'axios';
import Image from 'next/image';
import { LogIn } from 'lucide-react';
import logo from '@/app/askharekrishnalogo.jpg';

interface Story {
  id: number;
  mainTopic: string;
  subTopic: string;
  article: string;
  slug: string;
}

interface StoryTopicGroup {
  name: string;
  articleList: Story[];
}

interface RoadmapItem {
  id: number;
  mainTopic: string;
  routerLink: string;
  intro: string;
}

const SUBSCRIBER_NAME_KEY = 'askharekrishna-subscriber-name';

export function Navbar() {
  const { dictionary, locale } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { navbar: t } = dictionary;
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStoriesOpen, setIsStoriesOpen] = useState(false);
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [topics, setTopics] = useState<StoryTopicGroup[]>([]);
  const [roadmaps, setRoadmaps] = useState<RoadmapItem[]>([]);
  const [subscriberInitial, setSubscriberInitial] = useState<string | null>(null);
  const [subscriberName, setSubscriberName] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const storiesDropdownRef = useRef<HTMLDivElement>(null);
  const coursesDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncSubscriberBadge = () => {
      const savedName = window.localStorage.getItem(SUBSCRIBER_NAME_KEY) || '';
      const trimmedName = savedName.trim();
      const firstLetter = trimmedName ? trimmedName.charAt(0).toUpperCase() : null;
      setSubscriberName(trimmedName);
      setSubscriberInitial(firstLetter);
    };

    syncSubscriberBadge();
    window.addEventListener('subscriber-updated', syncSubscriberBadge);
    window.addEventListener('storage', syncSubscriberBadge);

    return () => {
      window.removeEventListener('subscriber-updated', syncSubscriberBadge);
      window.removeEventListener('storage', syncSubscriberBadge);
    };
  }, []);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get(`https://api.askharekrishna.com/api/v1/stories/articles/?language=${locale}`);
        const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
        setTopics(data);
      } catch (err) {
        console.error('Navbar stories fetch failed:', err);
      }
    };
    fetchStories();
  }, [locale]);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const response = await axios.get('https://api.askharekrishna.com/api/course-roadmap/roadmaps/');
        const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
        setRoadmaps(data);
      } catch (err) {
        console.error('Navbar roadmaps fetch failed:', err);
      }
    };
    fetchRoadmaps();
  }, []);



  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (storiesDropdownRef.current && !storiesDropdownRef.current.contains(event.target as Node)) {
        setIsStoriesOpen(false);
      }
      if (coursesDropdownRef.current && !coursesDropdownRef.current.contains(event.target as Node)) {
        setIsCoursesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`sticky top-0 ${showLoginForm ? 'z-[10000]' : 'z-50'} w-full bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-[#f3efe7] dark:border-neutral-800 transition-colors duration-200`}>
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 cursor-pointer group shrink-0">
            <div className="size-14 transition-transform group-hover:scale-105 overflow-hidden rounded-full border-2 border-primary/10 shadow-sm">
              <Image 
                src={logo} 
                alt="Ask Hare Krishna" 
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 ml-8">
            <Link href="/" className="text-sm font-bold text-text-main dark:text-gray-200 hover:text-primary transition-colors cursor-pointer whitespace-nowrap">{t.home}</Link>

            {/* Courses Dropdown */}
            {roadmaps.length > 0 && (
              <div className="relative" ref={coursesDropdownRef}>
                <button
                  onClick={() => setIsCoursesOpen(!isCoursesOpen)}
                  className={`flex items-center gap-1 text-sm font-bold transition-colors cursor-pointer ${isCoursesOpen ? 'text-primary' : 'text-text-main dark:text-gray-200 hover:text-primary'}`}
                >
                  <span>Courses</span>
                  <span className="material-symbols-outlined text-lg transition-transform" style={{ transform: isCoursesOpen ? 'rotate(180deg)' : 'rotate(0)' }}>expand_more</span>
                </button>

                {isCoursesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-[#1a150c] border border-[#f3efe7] dark:border-neutral-800 rounded-xl shadow-xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 mb-2 border-b border-gray-100 dark:border-neutral-800">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Roadmaps</span>
                    </div>
                    {roadmaps.map((roadmap) => (
                      <Link
                        key={roadmap.id}
                        href={`/courses/${roadmap.routerLink}`}
                        onClick={() => setIsCoursesOpen(false)}
                        className="block px-4 py-2.5 text-sm font-bold text-text-main dark:text-gray-200 hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        {roadmap.mainTopic}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {topics.length > 0 ? (
              topics.length > 3 ? (
                <div className="relative" ref={storiesDropdownRef}>
                  <button
                    onClick={() => setIsStoriesOpen(!isStoriesOpen)}
                    className={`flex items-center gap-1 text-sm font-bold transition-colors cursor-pointer ${isStoriesOpen ? 'text-primary' : 'text-text-main dark:text-gray-200 hover:text-primary'}`}
                  >
                    <span>{t.stories}</span>
                    <span className="material-symbols-outlined text-lg transition-transform" style={{ transform: isStoriesOpen ? 'rotate(180deg)' : 'rotate(0)' }}>expand_more</span>
                  </button>

                  {isStoriesOpen && (
                    <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-[#1a150c] border border-[#f3efe7] dark:border-neutral-800 rounded-xl shadow-xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2 mb-2 border-b border-gray-100 dark:border-neutral-800">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Categories</span>
                      </div>
                      {topics.map((topic, i) => (
                        <div key={i} className="group/cat relative">
                          <Link
                            href={`/stories?topic=${encodeURIComponent(topic.name)}`}
                            onClick={() => setIsStoriesOpen(false)}
                            className="flex items-center justify-between px-4 py-2.5 text-sm font-bold text-text-main dark:text-gray-200 hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            <span>{topic.name}</span>
                            <span className="material-symbols-outlined text-lg opacity-40">chevron_right</span>
                          </Link>

                          {/* Subtopics nested menu (on hover) */}
                          <div className="absolute left-full top-[-12px] hidden group-hover/cat:block pt-3 pl-2">
                            <div className="w-64 bg-white dark:bg-[#1a150c] border border-[#f3efe7] dark:border-neutral-800 rounded-xl shadow-2xl py-3 max-h-[70vh] overflow-y-auto">
                              {topic.articleList.map((story) => (
                                <Link
                                  key={story.id}
                                  href={`/stories?topic=${encodeURIComponent(topic.name)}&story=${encodeURIComponent(story.slug || story.id.toString())}`}
                                  onClick={() => setIsStoriesOpen(false)}
                                  className="block px-4 py-2.5 text-xs font-semibold text-text-muted dark:text-gray-400 hover:bg-primary/5 hover:text-primary transition-colors border-l-2 border-transparent hover:border-primary"
                                >
                                  {story.subTopic}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                topics.map((topic, i) => (
                  <div key={i} className="relative group/cat" ref={i === 0 ? storiesDropdownRef : null}>
                    <Link
                      href={`/stories?topic=${encodeURIComponent(topic.name)}`}
                      className="text-sm font-bold text-text-main dark:text-gray-200 hover:text-primary transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
                    >
                      {topic.name}
                      <span className="material-symbols-outlined text-sm opacity-40">expand_more</span>
                    </Link>

                    {/* Nested Menu for Categories when they are primary links */}
                    <div className="absolute top-full left-0 pt-4 hidden group-hover/cat:block z-50">
                      <div className="w-64 bg-white dark:bg-[#1a150c] border border-[#f3efe7] dark:border-neutral-800 rounded-xl shadow-2xl py-3 max-h-[70vh] overflow-y-auto">
                        {topic.articleList.map((story, index) => (
                          <Link
                            key={`${story.id}-${index}`}
                            href={`/stories?topic=${encodeURIComponent(topic.name)}&story=${encodeURIComponent(story.slug || story.id.toString())}`}
                            className="block px-4 py-2.5 text-xs font-semibold text-text-muted dark:text-gray-400 hover:bg-primary/5 hover:text-primary transition-colors border-l-2 border-transparent hover:border-primary"
                          >
                            {story.subTopic}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )
            ) : (
              // Loading state - no hardcoded links as requested
              <div className="flex gap-4">
                {[1, 2, 3].map(i => <div key={i} className="h-4 w-24 bg-gray-100 dark:bg-neutral-800 rounded animate-pulse" />)}
              </div>
            )}
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {!subscriberInitial ? (
              <button
                type="button"
                onClick={() => setShowLoginForm(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-[#f3efe7] dark:border-neutral-800 bg-white dark:bg-[#1a150c] px-4 py-2 text-sm font-bold text-text-main dark:text-white hover:text-primary hover:border-primary/30 transition-all"
              >
                <LogIn size={16} />
                <span className="hidden sm:inline">{t.login}</span>
              </button>
            ) : null}

            {subscriberInitial ? (
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-bold text-primary hover:bg-primary/15 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">dashboard</span>
                <span>Dashboard</span>
              </Link>
            ) : null}

            {subscriberInitial ? (
              <div
                title={subscriberName}
                className="size-10 rounded-full bg-primary text-black font-black text-sm flex items-center justify-center border border-primary/30 shadow-sm cursor-default"
              >
                {subscriberInitial}
              </div>
            ) : null}

            <LanguageSwitcher />
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-[#1a150c] text-text-muted hover:text-primary transition-all duration-300 flex items-center justify-center border border-[#f3efe7] dark:border-neutral-800"
              aria-label="Toggle Theme"
            >
              <span className="material-symbols-outlined text-xl">
                {theme === 'light' ? 'dark_mode' : 'light_mode'}
              </span>
            </button>

          </div>
        </div>
      </div>

      <SubscriberFormModal
        open={showLoginForm}
        locale={locale}
        title={t.login}
        description={locale === 'ta' ? 'ஏற்கனவே பதிவு செய்திருந்தால் தொலைபேசி எண்ணை மட்டும் உள்ளிட்டு உங்கள் dashboard-ஐ திறக்கவும். அனைத்து பக்கங்களும் திறந்தவையாகவே இருக்கும்.' : 'If you are already subscribed, enter only your phone number to open your dashboard. All pages remain open.'}
        submitLabel={t.login}
        successMessage={locale === 'ta' ? 'உங்கள் dashboard தயாராக உள்ளது.' : 'Your dashboard is ready.'}
        continueLabel={locale === 'ta' ? 'தொடரவும்' : 'Continue'}
        mode="phone-login"
        onClose={() => setShowLoginForm(false)}
        onSuccess={() => {
          setShowLoginForm(false);
          router.push('/dashboard');
        }}
      />
    </header>
  );
}
