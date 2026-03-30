'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { useLanguage } from '../providers/LanguageContext';

import { LanguageSwitcher } from './LanguageSwitcher';

interface Story {
  id: number;
  mainTopic: string;
  subTopic: string;
  article: string;
  slug: string;
}

export function Navbar() {
  const { dictionary, locale } = useLanguage();
  const { navbar: t, common: c } = dictionary;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStoriesOpen, setIsStoriesOpen] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const storiesDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch(`https://api.askharekrishna.com/api/v1/stories/articles/?language=${locale === 'en' ? 'en' : 'ta'}`);
        if (response.ok) {
          const data = await response.json();
          setStories(data);
        }
      } catch (err) {
        console.error('Navbar stories fetch failed:', err);
      }
    };
    fetchStories();
  }, [locale]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(stories.map(s => s.mainTopic)));
    return unique.map(name => ({
      name,
      items: stories.filter(s => s.mainTopic === name)
    }));
  }, [stories]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (storiesDropdownRef.current && !storiesDropdownRef.current.contains(event.target as Node)) {
        setIsStoriesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-[#f3efe7] dark:border-neutral-800 transition-colors duration-200">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 text-text-main dark:text-white cursor-pointer group shrink-0">
            <div className="size-8 text-primary transition-transform group-hover:scale-110">
              <span className="material-symbols-outlined text-3xl">temple_hindu</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 ml-8">
            <Link href="/" className="text-sm font-bold text-text-main dark:text-gray-200 hover:text-primary transition-colors cursor-pointer whitespace-nowrap">{t.home}</Link>

            {categories.length > 0 ? (
              categories.length > 3 ? (
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
                      {categories.map((cat, i) => (
                        <div key={i} className="group/cat relative">
                          <Link
                            href={`/stories?category=${encodeURIComponent(cat.name)}`}
                            onClick={() => setIsStoriesOpen(false)}
                            className="flex items-center justify-between px-4 py-2.5 text-sm font-bold text-text-main dark:text-gray-200 hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            <span>{cat.name}</span>
                            <span className="material-symbols-outlined text-lg opacity-40">chevron_right</span>
                          </Link>

                          {/* Subtopics nested menu (on hover) */}
                          <div className="absolute left-full top-[-12px] hidden group-hover/cat:block pt-3 pl-2">
                            <div className="w-64 bg-white dark:bg-[#1a150c] border border-[#f3efe7] dark:border-neutral-800 rounded-xl shadow-2xl py-3 max-h-[70vh] overflow-y-auto">
                              {cat.items.map((story) => (
                                <Link
                                  key={story.id}
                                  href={`/stories?category=${encodeURIComponent(cat.name)}&story=${encodeURIComponent(story.slug || story.id.toString())}`}
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
                categories.map((cat, i) => (
                  <div key={i} className="relative group/cat" ref={i === 0 ? storiesDropdownRef : null}>
                    <Link
                      href={`/stories?category=${encodeURIComponent(cat.name)}`}
                      className="text-sm font-bold text-text-main dark:text-gray-200 hover:text-primary transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
                    >
                      {cat.name}
                      <span className="material-symbols-outlined text-sm opacity-40">expand_more</span>
                    </Link>

                    {/* Nested Menu for Categories when they are primary links */}
                    <div className="absolute top-full left-0 pt-4 hidden group-hover/cat:block z-50">
                      <div className="w-64 bg-white dark:bg-[#1a150c] border border-[#f3efe7] dark:border-neutral-800 rounded-xl shadow-2xl py-3 max-h-[70vh] overflow-y-auto">
                        {cat.items.map((story) => (
                          <Link
                            key={story.id}
                            href={`/stories?category=${encodeURIComponent(cat.name)}&story=${encodeURIComponent(story.slug || story.id.toString())}`}
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
            <LanguageSwitcher />
            <button className="hidden md:flex p-2 text-text-main dark:text-white hover:text-primary transition-colors">
              <span className="material-symbols-outlined">search</span>
            </button>
            <Button className="flex items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-primary hover:bg-yellow-500 text-[#1b170d] text-sm font-bold tracking-wide transition-colors shadow-sm whitespace-nowrap">
              <span className="truncate">{c.login}</span>
            </Button>
            <button className="lg:hidden p-2 text-text-main dark:text-white">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
