"use client";

import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { useLanguage } from "../providers/LanguageContext";
import { useState, useEffect } from "react";

interface Article {
    id: number;
    mainTopic: string;
    subTopic: string;
    article: string;
    slug: string;
    order: number;
}

interface FAQDetailProps {
    topic: string;
}

export default function FAQDetail({ topic }: FAQDetailProps) {
    const { locale } = useLanguage();
    const [content, setContent] = useState<any>(null);
    const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchArticleData = async () => {
            try {
                setLoading(true);
                setError(false);
                
                // Fetch the specific article by its slug
                const response = await fetch(`https://api.askharekrishna.com/api/v1/debate/articles/?slug=${topic}&language=${locale === 'en' ? 'en' : 'ta'}`);
                
                if (response.ok) {
                    const data = await response.json();
                    const article = data.results && data.results.length > 0 ? data.results[0] : null;
                    
                    if (article) {
                        setContent({
                            category: article.mainTopic,
                            title: article.subTopic,
                            description: `Exploring ${article.subTopic} with Vedic logic and transcendental wisdom.`,
                            icon: "menu_book",
                            questions: [
                                {
                                    question: article.subTopic,
                                    answer: article.article
                                }
                            ]
                        });

                        // Fetch related articles from the same category (mainTopic)
                        const relatedRes = await fetch(`https://api.askharekrishna.com/api/v1/debate/articles/?language=${locale === 'en' ? 'en' : 'ta'}`);
                        if (relatedRes.ok) {
                            const relatedData = await relatedRes.json();
                            const others = (relatedData.results || []).filter((a: Article) => 
                                a.mainTopic === article.mainTopic && a.slug !== article.slug
                            );
                            setRelatedArticles(others);
                        }
                    } else {
                        setError(true);
                    }
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Failed to fetch article detail:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchArticleData();
    }, [topic, locale]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark transition-colors duration-200">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
                        <p className="text-text-subtle dark:text-gray-400 font-medium">Loading Vedic wisdom...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !content) {
        return (
            <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark transition-colors duration-200">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
                    <div className="size-20 rounded-full bg-red-50 dark:bg-red-900/10 flex items-center justify-center text-red-500 mb-6 font-lexend">
                        <span className="material-symbols-outlined text-4xl">error</span>
                    </div>
                    <h2 className="text-2xl font-bold text-text-main dark:text-white mb-2">Vedic Article Not Found</h2>
                    <p className="text-text-subtle dark:text-gray-400 mb-8 max-w-md">Sorry, we couldn't find the philosophical discussion you were looking for.</p>
                    <Link href="/faqs" className="bg-primary hover:bg-yellow-500 text-[#1b170d] font-bold py-3 px-8 rounded-xl transition-all shadow-md">
                        Explore all Topics
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white min-h-screen flex flex-col antialiased transition-colors duration-200">
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-grow flex flex-col items-center relative">
                {/* Background decorative elements */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
                </div>
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>

                <div className="w-full max-w-[960px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 z-10">
                    {/* Breadcrumbs */}
                    <nav aria-label="Breadcrumb" className="flex mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide pb-2">
                        <ol className="inline-flex items-center space-x-2 md:space-x-3">
                            <li className="inline-flex items-center">
                                <Link href="/" className="inline-flex items-center text-sm font-medium text-text-subtle hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors">
                                    <span className="material-symbols-outlined !text-[18px] mr-2">home</span>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <span className="material-symbols-outlined !text-[16px] text-gray-400 mx-1">chevron_right</span>
                                    <Link href="/faqs" className="text-sm font-medium text-text-subtle hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors">FAQ</Link>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <span className="material-symbols-outlined !text-[16px] text-gray-400 mx-1">chevron_right</span>
                                    <span className="text-sm font-medium text-text-subtle dark:text-gray-400">{content.category}</span>
                                </div>
                            </li>
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <span className="material-symbols-outlined !text-[16px] text-gray-400 mx-1">chevron_right</span>
                                    <span className="text-sm font-bold text-text-main dark:text-white truncate max-w-[150px] sm:max-w-xs">{content.title}</span>
                                </div>
                            </li>
                        </ol>
                    </nav>

                    {/* Page Heading */}
                    <div className="mb-10 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <span className="inline-block px-3 py-1 mb-3 text-[10px] font-black tracking-widest text-primary uppercase bg-primary/10 rounded-full border border-primary/20">
                                    {content.category}
                                </span>
                                <h1 className="text-3xl md:text-5xl font-black text-text-main dark:text-white mb-4 leading-tight tracking-tight drop-shadow-sm">
                                    {content.title}
                                </h1>
                                <p className="text-text-subtle dark:text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">{content.description}</p>
                            </div>
                            <div className="hidden md:flex items-center justify-center size-20 rounded-2xl bg-primary/10 text-primary shadow-sm transform rotate-3 hover:rotate-0 transition-transform">
                                <span className="material-symbols-outlined !text-[44px]">{content.icon}</span>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Content Sections */}
                    <div className="flex flex-col gap-6">
                        {content.questions.map((item: any, index: number) => (
                            <div key={index} className="group bg-white dark:bg-[#231d13] rounded-3xl border border-[#e7dfcf] dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                                <div className="p-6 md:p-10">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="flex items-center justify-center size-10 rounded-xl bg-primary text-white shadow-lg shrink-0">
                                            <span className="material-symbols-outlined !text-[24px]">menu_book</span>
                                        </div>
                                        <h3 className="text-text-main dark:text-white text-xl md:text-2xl font-black leading-tight tracking-tight mt-1">
                                            {item.question}
                                        </h3>
                                    </div>
                                    
                                    <div className="prose prose-stone dark:prose-invert max-w-none">
                                        <p className="text-text-subtle dark:text-gray-300 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                                            {item.answer}
                                        </p>
                                    </div>

                                    {item.audio && (
                                        <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-6 flex items-center justify-between gap-4 mt-8 border border-primary/20">
                                            <div className="flex items-center gap-4">
                                                <div className="size-12 rounded-full bg-primary flex items-center justify-center text-white shadow-xl animate-pulse">
                                                    <span className="material-symbols-outlined">headphones</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-text-main dark:text-white leading-tight">{item.audio.title}</p>
                                                    <p className="text-xs text-text-subtle dark:text-gray-400 mt-1 font-medium">{item.audio.subtitle}</p>
                                                </div>
                                            </div>
                                            <button className="flex items-center justify-center size-12 bg-white dark:bg-[#332d21] text-primary hover:bg-primary hover:text-white rounded-full transition-all shadow-md group/play">
                                                <span className="material-symbols-outlined !text-[32px] group-hover:scale-110 transition-transform">play_circle</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Related Articles Carousel Section */}
                    {relatedArticles.length > 0 && (
                        <div className="mt-20">
                            <div className="flex items-center justify-between mb-8 px-2 border-l-4 border-primary pl-6">
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-black text-text-main dark:text-white tracking-tight">More in {content.category}</h2>
                                    <p className="text-text-subtle dark:text-gray-400 text-sm font-medium mt-1">Continue exploring related philosophical topics.</p>
                                </div>
                                <Link href="/faqs" className="hidden sm:flex text-primary hover:text-yellow-600 font-bold text-sm items-center gap-1 transition-colors">
                                    View All <span className="material-symbols-outlined !text-[20px]">arrow_forward</span>
                                </Link>
                            </div>
                            
                            <div className="relative group/carousel">
                                <div className="flex overflow-x-auto gap-6 pb-8 scrollbar-hide snap-x">
                                    {relatedArticles.map((article) => (
                                        <Link 
                                            key={article.id} 
                                            href={`/faqs/${article.slug}`}
                                            className="snap-start shrink-0 w-[280px] flex flex-col p-6 bg-white dark:bg-[#1a150c] border border-[#e7dfcf] dark:border-neutral-800 rounded-2xl hover:shadow-2xl hover:border-primary/50 transition-all duration-300 group/card"
                                        >
                                            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5 group-hover/card:bg-primary group-hover/card:text-white transition-all duration-300">
                                                <span className="material-symbols-outlined">menu_book</span>
                                            </div>
                                            <h4 className="font-bold text-text-main dark:text-white text-lg leading-tight mb-3 group-hover/card:text-primary transition-colors line-clamp-2">
                                                {article.subTopic}
                                            </h4>
                                            <p className="text-sm text-text-subtle dark:text-gray-400 line-clamp-3 mb-6 flex-grow leading-relaxed">
                                                {article.article}
                                            </p>
                                            <div className="flex items-center text-xs font-black text-primary uppercase tracking-wider opacity-60 group-hover/card:opacity-100 transition-opacity">
                                                <span>Read Article</span>
                                                <span className="material-symbols-outlined text-base ml-1 transform group-hover/card:translate-x-1 transition-transform">arrow_forward</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contact / Help CTA */}
                    <div className="mt-20 bg-gradient-to-br from-primary/10 to-transparent dark:from-primary/5 dark:to-transparent border border-primary/20 dark:border-primary/10 rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl md:text-3xl font-black text-text-main dark:text-white mb-3 tracking-tight">Still have questions?</h3>
                            <p className="text-text-subtle dark:text-gray-400 text-lg max-w-md font-medium leading-relaxed">Our community of devotees is happy to help clarify any doubts regarding philosophy or practice.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <button className="px-8 py-4 rounded-xl bg-primary hover:bg-yellow-500 text-[#1b170d] font-black transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:scale-105 active:scale-95">
                                <span className="material-symbols-outlined !text-[22px]">mail</span>
                                Ask a Devotee
                            </button>
                            <Link href="/faqs" className="px-8 py-4 rounded-xl bg-white dark:bg-[#332d21] border border-[#e7dfcf] dark:border-neutral-800 text-text-main dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-[#3e3729] transition-all flex items-center justify-center text-center">
                                View all Topics
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

