'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { useLanguage } from '../providers/LanguageContext';

import { LanguageSwitcher } from './LanguageSwitcher';

export function Navbar() {
  const { dictionary } = useLanguage();
  const { navbar: t, common: c } = dictionary;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
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
            <h1 className="text-xl font-bold leading-tight tracking-tight">askharekrishna.com</h1>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 ml-8">
            <Link href="/ramayanam" className="text-sm font-bold text-text-main dark:text-gray-200 hover:text-primary transition-colors cursor-pointer whitespace-nowrap">{t.ramayanam}</Link>
            <Link href="/mahabharatam" className="text-sm font-bold text-text-main dark:text-gray-200 hover:text-primary transition-colors cursor-pointer whitespace-nowrap">{t.mahabharatam}</Link>
            <Link href="/puranams" className="text-sm font-bold text-text-main dark:text-gray-200 hover:text-primary transition-colors cursor-pointer whitespace-nowrap">{t.puranams}</Link>

            {/* Dropdown Menu for more items */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`flex items-center gap-1 text-sm font-bold transition-colors cursor-pointer ${isMenuOpen ? 'text-primary' : 'text-text-main dark:text-gray-200 hover:text-primary'}`}
              >
                <span className="material-symbols-outlined text-xl">menu</span>
              </button>

              {isMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-[#1a150c] border border-[#f3efe7] dark:border-neutral-800 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link href="/prabhupada" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2.5 text-sm font-medium text-text-main dark:text-gray-200 hover:bg-primary/10 hover:text-primary transition-colors">
                    {t.prabhupada}
                  </Link>
                  <Link href="/bhagavad-gita" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2.5 text-sm font-medium text-text-main dark:text-gray-200 hover:bg-primary/10 hover:text-primary transition-colors">
                    {t.bhagavadGita}
                  </Link>
                  <Link href="/stories" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2.5 text-sm font-medium text-text-main dark:text-gray-200 hover:bg-primary/10 hover:text-primary transition-colors">
                    {t.stories}
                  </Link>
                  <Link href="/kirtans" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2.5 text-sm font-medium text-text-main dark:text-gray-200 hover:bg-primary/10 hover:text-primary transition-colors">
                    {t.kirtans}
                  </Link>
                </div>
              )}
            </div>
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
