'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';
import { Search, X, ScrollText, Folder, Calendar, Video, BookOpen, ArrowRight } from 'lucide-react';

export interface Story {
  id: number;
  mainTopic: string;
  subTopic: string;
  article: string;
  slug: string;
}

export interface StoryTopicGroup {
  name: string;
  articleList: Story[];
}

export interface SearchableItem {
  id: string;
  title: string;
  category: string;
  url: string;
  type: 'story' | 'topic' | 'page';
  excerpt?: string;
}

interface NavbarSearchProps {
  topics: StoryTopicGroup[];
  locale: string;
  onNavigate?: () => void;
  className?: string;
  isMobile?: boolean;
}

export function NavbarSearch({
  topics,
  locale,
  onNavigate,
  className = '',
  isMobile = false,
}: NavbarSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Build searchable index from topics, stories, and key site sections
  const searchableItems = useMemo<SearchableItem[]>(() => {
    const items: SearchableItem[] = [];

    // Static site pages
    items.push({
      id: 'page-calendar',
      title: locale === 'ta' ? 'வைஷ்ணவ நாட்காட்டி' : 'Vaishnava Calendar',
      category: locale === 'ta' ? 'நாட்காட்டி' : 'Calendar',
      url: '/vaishnava-calendar',
      type: 'page',
      excerpt: locale === 'ta' ? 'முக்கிய வைஷ்ணவ திருநாட்கள் மற்றும் ஏகாதசி நாட்கள்' : 'Important Vaishnava festivals and Ekadashi dates',
    });

    if (locale === 'ta') {
      items.push({
        id: 'page-bgvideo',
        title: 'BG வீடியோ',
        category: 'பகவத் கீதை',
        url: '/bgvideo',
        type: 'page',
        excerpt: 'பகவத் கீதை எளிய விளக்க வீடியோ பதிவுகள்',
      });
    }

    // Process topics & stories
    if (Array.isArray(topics)) {
      topics.forEach((topic, topicIdx) => {
        // Add the topic itself
        items.push({
          id: `topic-${topicIdx}`,
          title: topic.name,
          category: locale === 'ta' ? 'தலைப்பு' : 'Topic',
          url: `/stories?topic=${encodeURIComponent(topic.name)}`,
          type: 'topic',
          excerpt: `${topic.articleList?.length || 0} ${locale === 'ta' ? 'கட்டுரைகள் உள்ளன' : 'articles available'}`,
        });

        // Add each story
        if (Array.isArray(topic.articleList)) {
          topic.articleList.forEach((story) => {
            const cleanExcerpt = story.article
              ? story.article.replace(/[#*`_\[\]()]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 110)
              : '';

            items.push({
              id: `story-${story.id}`,
              title: story.subTopic,
              category: topic.name,
              url: `/stories?topic=${encodeURIComponent(topic.name)}&story=${encodeURIComponent(story.slug || story.id.toString())}`,
              type: 'story',
              excerpt: cleanExcerpt,
            });
          });
        }
      });
    }

    return items;
  }, [topics, locale]);

  // Configure Fuse.js
  const fuse = useMemo(() => {
    return new Fuse(searchableItems, {
      keys: [
        { name: 'title', weight: 0.65 },
        { name: 'category', weight: 0.25 },
        { name: 'excerpt', weight: 0.1 },
      ],
      threshold: 0.35,
      minMatchCharLength: 2,
      ignoreLocation: true,
      includeScore: true,
    });
  }, [searchableItems]);

  // Perform search (Combining exact substring match + Fuse fuzzy search)
  const results = useMemo<SearchableItem[]>(() => {
    const trimmed = query.trim();
    if (!trimmed) return [];

    const lower = trimmed.toLowerCase();

    // 1. Direct substring matching (prioritized for regional scripts like Tamil)
    const exactMatches = searchableItems.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower) ||
        (item.excerpt && item.excerpt.toLowerCase().includes(lower))
    );

    // 2. Fuzzy matches from Fuse
    const fuzzyResults = fuse.search(trimmed).map((r) => r.item);

    // Combine with exact matches first and deduplicate
    const seen = new Set<string>();
    const combined: SearchableItem[] = [];

    for (const item of exactMatches) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        combined.push(item);
      }
    }

    for (const item of fuzzyResults) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        combined.push(item);
      }
    }

    return combined.slice(0, 8); // Max 8 results
  }, [query, searchableItems, fuse]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut listener (Escape to close)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = (url: string) => {
    setIsOpen(false);
    setQuery('');
    if (onNavigate) {
      onNavigate();
    }
    router.push(url);
  };

  const placeholderText =
    locale === 'ta'
      ? 'கட்டுரைகள், தலைப்புகளைத் தேடுக...'
      : 'Search articles, topics...';

  const getItemIcon = (type: SearchableItem['type']) => {
    switch (type) {
      case 'story':
        return <ScrollText className="size-4 text-primary shrink-0" />;
      case 'topic':
        return <Folder className="size-4 text-amber-500 shrink-0" />;
      case 'page':
        return <BookOpen className="size-4 text-emerald-500 shrink-0" />;
      default:
        return <Search className="size-4 text-text-muted shrink-0" />;
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input Box */}
      <div className="relative w-full flex items-center">
        <div className="absolute left-3.5 pointer-events-none flex items-center text-text-muted">
          <Search className="size-4 opacity-70" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholderText}
          aria-label={placeholderText}
          className="w-full pl-10 pr-9 py-2 text-xs md:text-sm bg-gray-100/90 dark:bg-[#1f1910] text-text-main dark:text-gray-100 placeholder:text-text-muted/70 rounded-xl border border-[#ede7dc] dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all duration-200 shadow-inner"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 p-0.5 rounded-full text-text-muted hover:text-text-main dark:hover:text-white transition-colors"
            aria-label="Clear search"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* Floating Results Dropdown */}
      {isOpen && query.trim().length > 0 && (
        <div
          className={`absolute left-0 right-0 top-full mt-2 w-full ${
            isMobile ? 'max-h-[60vh]' : 'min-w-[320px] md:min-w-[380px] max-h-[70vh]'
          } bg-white dark:bg-[#1a150c] border border-[#ede7dc] dark:border-neutral-800 rounded-2xl shadow-2xl overflow-y-auto z-[9999] animate-in fade-in slide-in-from-top-2 duration-150`}
        >
          {/* Header indicator */}
          <div className="px-4 py-2.5 bg-gray-50 dark:bg-[#221c10] border-b border-[#f3efe7] dark:border-neutral-800 flex items-center justify-between text-[11px] font-bold text-text-muted uppercase tracking-wider">
            <span>
              {locale === 'ta' ? 'தேடல் முடிவுகள்' : 'Search Results'}
            </span>
            <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full font-mono text-[10px]">
              {results.length}
            </span>
          </div>

          {/* Results List */}
          {results.length > 0 ? (
            <div className="p-2 divide-y divide-gray-100 dark:divide-neutral-800/60">
              {results.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.url)}
                  className="w-full text-left p-3 rounded-xl hover:bg-primary/10 dark:hover:bg-primary/15 transition-colors flex items-start gap-3 group cursor-pointer"
                >
                  <div className="mt-0.5 p-1.5 rounded-lg bg-gray-100 dark:bg-[#221c10] group-hover:bg-primary/20 transition-colors shrink-0">
                    {getItemIcon(item.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-black text-text-main dark:text-gray-100 group-hover:text-primary transition-colors line-clamp-1">
                        {item.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-text-muted dark:text-gray-400">
                      <span className="font-semibold text-primary/80">{item.category}</span>
                      {item.excerpt && (
                        <>
                          <span className="opacity-40">•</span>
                          <span className="line-clamp-1 opacity-80">{item.excerpt}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <ArrowRight className="size-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1 opacity-0 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-text-muted">
              <p className="font-semibold mb-1">
                {locale === 'ta' ? 'முடிவுகள் எதுவும் கிடைக்கவில்லை' : 'No results found'}
              </p>
              <p className="text-xs opacity-75">
                {locale === 'ta'
                  ? `"${query}" என்ற வார்த்தைக்கு பொருத்தமான கட்டுரைகள் இல்லை`
                  : `No matching articles found for "${query}"`}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
