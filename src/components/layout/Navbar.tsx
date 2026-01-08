'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-[#f3efe7] dark:border-neutral-800 transition-colors duration-200">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 text-text-main dark:text-white cursor-pointer group">
            <div className="size-8 text-primary transition-transform group-hover:scale-110">
              <span className="material-symbols-outlined text-3xl">temple_hindu</span>
            </div>
            <h1 className="text-xl font-bold leading-tight tracking-tight">askharekrishna.com</h1>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            <div className="relative group mega-menu-trigger h-20 flex items-center">
              <Link href="#" className="text-sm font-bold text-text-main dark:text-gray-200 hover:text-primary transition-colors flex items-center gap-1 cursor-pointer">
                Ramayanam <span className="material-symbols-outlined text-lg">expand_more</span>
              </Link>
              <div className="mega-menu absolute top-full left-0 w-48 bg-white dark:bg-[#2a2418] shadow-xl rounded-b-xl border border-neutral-100 dark:border-neutral-800 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform -translate-y-2 group-hover:translate-y-0 transition-all duration-200">
                <Link href="#" className="block px-4 py-2 text-sm text-text-main dark:text-gray-200 hover:bg-background-light dark:hover:bg-neutral-800 rounded-lg">Bala Kanda</Link>
                <Link href="#" className="block px-4 py-2 text-sm text-text-main dark:text-gray-200 hover:bg-background-light dark:hover:bg-neutral-800 rounded-lg">Ayodhya Kanda</Link>
                <Link href="#" className="block px-4 py-2 text-sm text-text-main dark:text-gray-200 hover:bg-background-light dark:hover:bg-neutral-800 rounded-lg">Aranya Kanda</Link>
              </div>
            </div>
            <Link href="#" className="text-sm font-bold text-text-main dark:text-gray-200 hover:text-primary transition-colors cursor-pointer">Mahabharatam</Link>
            <Link href="#" className="text-sm font-bold text-text-main dark:text-gray-200 hover:text-primary transition-colors cursor-pointer">Puranams</Link>
            <Link href="#" className="text-sm font-bold text-text-main dark:text-gray-200 hover:text-primary transition-colors cursor-pointer">Prabhupada</Link>
            <Link href="#" className="text-sm font-bold text-text-main dark:text-gray-200 hover:text-primary transition-colors cursor-pointer">Bhagavad Gita</Link>
            <Link href="#" className="text-sm font-bold text-text-main dark:text-gray-200 hover:text-primary transition-colors cursor-pointer">Kirtans</Link>
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            <button className="hidden md:flex p-2 text-text-main dark:text-white hover:text-primary">
              <span className="material-symbols-outlined">search</span>
            </button>
            <Button className="flex items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-primary hover:bg-yellow-500 text-[#1b170d] text-sm font-bold tracking-wide transition-colors shadow-sm">
              <span className="truncate">Log In</span>
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
