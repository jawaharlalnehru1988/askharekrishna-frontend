"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Gavel, ArrowLeft, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLanguage } from '../providers/LanguageContext';
import Link from 'next/link';

interface DebateArticle {
    subTopic: string;
    article: string;
    slug: string;
    articleImage?: string;
}

interface DebateCategory {
    name: string;
    image: string | null;
    articleList: DebateArticle[];
}

export default function DebateArticleDetail({ slug }: { slug: string }) {
    const { locale } = useLanguage();
    const [article, setArticle] = useState<DebateArticle | null>(null);
    const [categoryName, setCategoryName] = useState<string>('');
    const [categoryImage, setCategoryImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`https://api.askharekrishna.com/api/v1/debate/articles/?language=${locale}&slug=${slug}`);
                const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
                
                let foundArticle = null;
                let foundCatName = '';
                let foundCatImage = null;

                for (const cat of data) {
                    if (cat.articleList && cat.articleList.length > 0) {
                        const match = cat.articleList.find((a: any) => a.slug === slug);
                        if (match) {
                            foundArticle = match;
                            foundCatName = cat.name || '';
                            foundCatImage = cat.image || null;
                            break;
                        }
                    }
                }

                setArticle(foundArticle);
                setCategoryName(foundCatName);
                setCategoryImage(foundCatImage);
            } catch (err) {
                console.error('Error fetching debate article:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [locale, slug]);

    const handleWhatsAppShare = () => {
        if (!article) return;
        const message = `Check out this Debate article: *${article.subTopic}*\n\nRead here: ${window.location.href}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-background-light dark:bg-background-dark">
                <Loader2 size={40} className="text-primary animate-spin mb-4" />
                <p className="text-text-muted animate-pulse font-medium">
                    {locale === 'ta' ? 'கட்டுரையை ஏற்றுகிறது...' : 'Loading Article...'}
                </p>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-background-light dark:bg-background-dark text-center px-4">
                <Gavel size={48} className="text-text-muted mb-4" />
                <h3 className="text-2xl font-bold text-text-main dark:text-white mb-2">
                    {locale === 'ta' ? 'கட்டுரை கிடைக்கவில்லை' : 'Article Not Found'}
                </h3>
                <Link href="/debate" className="text-primary hover:underline font-bold mt-4">
                    {locale === 'ta' ? 'விவாதங்களுக்கு திரும்பவும்' : 'Back to Debates'}
                </Link>
            </div>
        );
    }

    return (
        <section className="bg-background-light dark:bg-background-dark min-h-screen pt-12 pb-24">
            <div className="max-w-4xl mx-auto px-4 md:px-8">
                {/* Back button and Category breadcrumb */}
                <div className="mb-8 flex items-center gap-4">
                    <Link href={`/debate?category=${encodeURIComponent(categoryName)}`} className="inline-flex items-center text-text-muted hover:text-primary transition-colors">
                        <ArrowLeft size={20} className="mr-2" />
                        {locale === 'ta' ? 'திரும்புக' : 'Back'}
                    </Link>
                    <span className="text-gray-300 dark:text-gray-700">|</span>
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">{categoryName}</span>
                </div>

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-black text-text-main dark:text-white leading-tight mb-6">
                        {article.subTopic}
                    </h1>
                </div>

                {/* Hero Image */}
                <div className="relative h-64 md:h-[400px] w-full rounded-3xl overflow-hidden mb-12 shadow-2xl">
                    <img 
                        src={article.articleImage || categoryImage || 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=1200'} 
                        alt={article.subTopic}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-6 left-6 flex items-center gap-3">
                        <div className="size-12 rounded-xl bg-primary/90 text-white flex items-center justify-center backdrop-blur-sm shadow-lg">
                            <Gavel size={28} />
                        </div>
                    </div>
                </div>

                {/* Article Content */}
                <div className="prose prose-stone dark:prose-invert max-w-none 
                    prose-headings:font-black prose-headings:tracking-tight
                    prose-h1:text-4xl prose-h1:mb-8
                    prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                    prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                    prose-p:text-lg prose-p:leading-relaxed prose-p:text-text-main dark:prose-p:text-gray-300
                    prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic
                    prose-strong:text-primary prose-strong:font-bold prose-img:rounded-2xl prose-img:shadow-lg">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {article.article}
                    </ReactMarkdown>
                </div>
                
                {/* Share Section */}
                <div className="mt-16 pt-10 border-t border-gray-200 dark:border-neutral-800 text-center">
                    <p className="text-sm font-bold text-text-muted mb-6 uppercase tracking-[0.3em]">
                        {locale === 'ta' ? 'இந்த விவாதத்தைப் பகிரவும்' : 'Share this Debate'}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button 
                            onClick={handleWhatsAppShare}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-2xl font-black transition-all shadow-xl hover:shadow-[#25D366]/20 active:scale-95 group"
                        >
                            <svg className="size-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            WhatsApp
                        </button>
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                alert(locale === 'ta' ? 'இணைப்பு நகலெடுக்கப்பட்டது!' : 'Link copied to clipboard!');
                            }}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-text-main dark:text-white rounded-2xl font-black transition-all active:scale-95 group"
                        >
                            <Share2 size={20} className="group-hover:rotate-12 transition-transform" />
                            {locale === 'ta' ? 'இணைப்பை நகலெடு' : 'Copy Link'}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
