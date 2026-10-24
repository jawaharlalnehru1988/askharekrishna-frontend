"use client";

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { 
    BookOpen, 
    Search, 
    ChevronDown, 
    ChevronUp, 
    Loader2, 
    ArrowRight, 
    Sparkles, 
    Layers,
    FileText,
    HelpCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLanguage } from '../providers/LanguageContext';
import { getRitvikIntro } from '@/data/ritvikIntro';

interface RitvikSectionItem {
    id: number;
    section_number: number;
    slug: string;
    order: number;
    title: string;
    description: string;
    questionsCount: number;
}

interface RitvikQuestionItem {
    id: number;
    question_code: string;
    slug: string;
    order: number;
    section_number: number;
    section_title: string;
    question: string;
    summary: string;
}

export default function RitvikCatalog() {
    const { locale } = useLanguage();
    const currentLang = locale === 'ta' ? 'ta' : 'en';

    const [sections, setSections] = useState<RitvikSectionItem[]>([]);
    const [questions, setQuestions] = useState<RitvikQuestionItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSection, setSelectedSection] = useState<number | null>(null);
    const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});

    const intro = getRitvikIntro(currentLang);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        const fetchData = async () => {
            try {
                const [secRes, qRes] = await Promise.all([
                    axios.get(`https://api.askharekrishna.com/api/v1/ritvik/sections/?language=${currentLang}`),
                    axios.get(`https://api.askharekrishna.com/api/v1/ritvik/questions/?language=${currentLang}`)
                ]);

                if (isMounted) {
                    const secList: RitvikSectionItem[] = Array.isArray(secRes.data) ? secRes.data : (secRes.data.results || []);
                    const qList: RitvikQuestionItem[] = Array.isArray(qRes.data) ? qRes.data : (qRes.data.results || []);
                    
                    // Sort sections so Section 0 is always first
                    const sortedSecList = [...secList].sort((a, b) => a.section_number - b.section_number);
                    setSections(sortedSecList);
                    setQuestions(qList);

                    // Expand first 2 sections (Section 0 and Section 1) by default
                    const initialExpanded: Record<number, boolean> = {};
                    sortedSecList.forEach((s: RitvikSectionItem, idx: number) => {
                        initialExpanded[s.section_number] = idx < 2;
                    });
                    setExpandedSections(initialExpanded);
                }
            } catch (err) {
                console.error('Failed to load Ritvik data', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();
        return () => { isMounted = false; };
    }, [currentLang]);

    const toggleSection = (sectionNum: number) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionNum]: !prev[sectionNum]
        }));
    };

    // Filter questions by search and selected section
    const filteredQuestions = useMemo(() => {
        return questions.filter(q => {
            const matchesSection = selectedSection === null || q.section_number === selectedSection;
            const query = searchQuery.toLowerCase().trim();
            const matchesQuery = !query || 
                q.question.toLowerCase().includes(query) ||
                q.question_code.toLowerCase().includes(query) ||
                q.summary.toLowerCase().includes(query) ||
                q.section_title.toLowerCase().includes(query);
            return matchesSection && matchesQuery;
        });
    }, [questions, selectedSection, searchQuery]);

    // Group filtered questions by section
    const questionsBySection = useMemo(() => {
        const map: Record<number, RitvikQuestionItem[]> = {};
        filteredQuestions.forEach(q => {
            if (!map[q.section_number]) {
                map[q.section_number] = [];
            }
            map[q.section_number].push(q);
        });
        return map;
    }, [filteredQuestions]);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            {/* Hero Header */}
            <div className="text-center max-w-3xl mx-auto mb-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-black tracking-widest uppercase bg-primary/10 text-primary rounded-full mb-4">
                    <BookOpen className="w-3.5 h-3.5" />
                    {currentLang === 'ta' ? 'அகில உலக கிருஷ்ண பக்தியுணர்வு இயக்கம்' : 'International Society for Krishna Consciousness'}
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-main dark:text-white tracking-tight leading-tight mb-4">
                    {currentLang === 'ta' ? 'இஸ்கானில் தீட்சை முறை' : 'THE PROCESS OF DIKSHA IN ISKCON'}
                </h1>
                <p className="text-base sm:text-lg text-text-muted dark:text-gray-300 font-medium leading-relaxed">
                    {intro.subtitle}
                </p>
                <p className="text-xs font-semibold text-primary/80 mt-2">
                    {intro.author}
                </p>
            </div>

            {/* Dedicated Introduction Section (Always Expanded) */}
            <div className="mb-12 bg-white dark:bg-[#1a150c] rounded-2xl border border-primary/20 shadow-sm overflow-hidden transition-all">
                <div className="p-5 md:p-6 border-b border-gray-100 dark:border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                        <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-text-main dark:text-white">
                                {currentLang === 'ta' ? 'இப்பகுதிக்கான அறிமுகம்' : 'Introduction to this Portal'}
                            </h2>
                            <p className="text-xs text-text-muted mt-0.5">
                                {currentLang === 'ta' 
                                    ? 'தீட்சையின் ஆன்மீக முக்கியத்துவம் மற்றும் அடிப்படை நெறிமுறைகள்' 
                                    : 'Spiritual importance of Diksha and foundational principles'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-8 bg-amber-50/20 dark:bg-black/20">
                    <div className="prose prose-base dark:prose-invert max-w-none text-text-main dark:text-gray-200 leading-relaxed font-sans">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {intro.content}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>

            {/* Search Bar & Section Filters */}
            <div className="mb-10 space-y-4">
                <div className="relative max-w-2xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={currentLang === 'ta' ? 'கேள்விகள், தலைப்புகள் அல்லது எண்களைத் தேடுங்கள் (எ.கா. Q0.1, Q1.1, தீட்சை)...' : 'Search questions, topics, or numbers (e.g. Q0.1, Q1.1, diksha)...'}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#1a150c] text-text-main dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-sm"
                    />
                </div>

                {/* Section Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start md:justify-center">
                    <button
                        onClick={() => setSelectedSection(null)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                            selectedSection === null
                                ? 'bg-primary text-white shadow-sm'
                                : 'bg-gray-100 dark:bg-neutral-800 text-text-muted hover:bg-gray-200'
                        }`}
                    >
                        {currentLang === 'ta' ? 'அனைத்து பிரிவுகளும்' : 'All Sections'} ({questions.length})
                    </button>
                    {sections.map(s => {
                        const isSectionZero = s.section_number === 0;
                        const label = isSectionZero 
                            ? (currentLang === 'ta' ? 'முன்னுரை (பிரிவு 0)' : 'Intro (Section 0)')
                            : (currentLang === 'ta' ? `பிரிவு ${s.section_number}` : `Section ${s.section_number}`);

                        return (
                            <button
                                key={s.section_number}
                                onClick={() => setSelectedSection(selectedSection === s.section_number ? null : s.section_number)}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                                    selectedSection === s.section_number
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'bg-gray-100 dark:bg-neutral-800 text-text-muted hover:bg-gray-200'
                                }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Loading Indicator */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-xs font-semibold text-text-muted">Loading Questions...</p>
                </div>
            ) : filteredQuestions.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-lg font-bold text-text-muted">
                        {currentLang === 'ta' ? 'பொருத்தமான கேள்விகள் எதுவும் கிடைக்கவில்லை.' : 'No questions found matching your search.'}
                    </p>
                </div>
            ) : (
                /* Sections Accordion & Question Cards */
                <div className="space-y-6">
                    {sections
                        .filter(s => selectedSection === null || s.section_number === selectedSection)
                        .map(sec => {
                            const secQuestions = questionsBySection[sec.section_number] || [];
                            if (searchQuery && secQuestions.length === 0) return null;
                            const isExpanded = searchQuery ? true : (expandedSections[sec.section_number] ?? true);

                            return (
                                <div
                                    key={sec.section_number}
                                    className="bg-white dark:bg-[#1a150c] rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-sm overflow-hidden"
                                >
                                    {/* Section Header */}
                                    <button
                                        onClick={() => toggleSection(sec.section_number)}
                                        className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-gray-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer border-b border-gray-100 dark:border-neutral-800"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="size-8 rounded-lg bg-primary/10 text-primary font-black text-xs flex items-center justify-center shrink-0">
                                                {sec.section_number === 0 ? '0' : sec.section_number}
                                            </span>
                                            <div>
                                                <h3 className="text-base sm:text-lg font-bold text-text-main dark:text-white">
                                                    {sec.title}
                                                </h3>
                                                <span className="text-xs text-text-muted">
                                                    {secQuestions.length} {currentLang === 'ta' ? 'கேள்விகள்' : 'Questions'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-text-muted">
                                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </div>
                                    </button>

                                    {/* Question Cards Grid */}
                                    {isExpanded && (
                                        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-gray-50/50 dark:bg-black/20">
                                            {secQuestions.map(q => (
                                                <Link
                                                    key={q.slug}
                                                    href={`/ritvik-system/${q.slug}`}
                                                    className="group flex flex-col justify-between p-4 rounded-xl bg-white dark:bg-[#1a150c] border border-gray-200 dark:border-neutral-800 hover:border-primary hover:shadow-md transition-all"
                                                >
                                                    <div>
                                                        <div className="flex items-center justify-between gap-2 mb-2">
                                                            <span className="text-xs font-mono font-black text-primary bg-primary/10 px-2 py-0.5 rounded">
                                                                {q.question_code}
                                                            </span>
                                                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                                        </div>
                                                        <h4 className="text-sm font-bold text-text-main dark:text-white group-hover:text-primary transition-colors line-clamp-2 mb-1.5">
                                                            {q.question}
                                                        </h4>
                                                        {q.summary && (
                                                            <p className="text-xs text-text-muted dark:text-gray-400 line-clamp-2 leading-relaxed">
                                                                {q.summary}
                                                            </p>
                                                        )}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                </div>
            )}
        </div>
    );
}
