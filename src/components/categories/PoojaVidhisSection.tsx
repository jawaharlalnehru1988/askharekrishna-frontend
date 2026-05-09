"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    ArrowRight, 
    Loader2, 
    ScrollText,
    Calendar,
    Share2,
    X
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLanguage } from '../providers/LanguageContext';

interface PoojaVidhiArticle {
    id: number;
    mainTopic: string;
    subTopic: string;
    article: string;
    slug: string;
    order: number;
    language: string;
    audioPath: string | null;
    articleImage: string;
    created_at: string;
    updated_at: string;
}

const PoojaVidhisSection = () => {
    const { locale, dictionary } = useLanguage();
    const { poojaVidhis: p } = dictionary;
    const [articles, setArticles] = useState<PoojaVidhiArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedArticle, setSelectedArticle] = useState<PoojaVidhiArticle | null>(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://api.askharekrishna.com/api/v1/pooja_vidhis/articles/');
                const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
                console.log('Pooja Vidhis fetched:', data.length, 'articles found');
                console.log('Current locale:', locale);
                setArticles(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching pooja vidhis:', err);
                setError('Failed to load Pooja Vidhis.');
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const handleWhatsAppShare = (article: PoojaVidhiArticle) => {
        const message = `Check out this Pooja Vidhi article: *${article.subTopic}*\n\nRead here: ${window.location.href}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const filteredArticles = articles.filter(article => article.language === locale);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-background-light dark:bg-background-dark">
                <Loader2 size={40} className="text-primary animate-spin mb-4" />
                <p className="text-text-muted animate-pulse font-medium">
                    {locale === 'ta' ? 'பூஜை முறைகளை ஏற்றுகிறது...' : 'Loading Pooja Vidhis...'}
                </p>
            </div>
        );
    }

    if (error || filteredArticles.length === 0) {
        return null;
    }

    return (
        <section className="py-20 bg-gradient-to-b from-[#fdfbf7] to-background-light dark:from-[#2a2418] dark:to-background-dark border-y border-[#f3efe7] dark:border-neutral-800/50">
            <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                <div className="mb-12 text-center">
                    <span className="inline-block mb-3 text-primary font-bold uppercase tracking-[0.2em] text-xs">
                        {p?.badge || (locale === 'ta' ? 'தினசரி வழிபாடுகள்' : 'Daily Rituals')}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-text-main dark:text-white">
                        {p?.title || (locale === 'ta' ? 'பூஜை விதிமுறைகள் மற்றும் முறைகள்' : 'Pooja Vidhis & Procedures')}
                    </h2>
                    <p className="max-w-2xl mx-auto text-lg text-text-muted dark:text-gray-400 leading-relaxed">
                        {p?.description || (locale === 'ta' ? 'தினசரி பக்தி செயல்பாடுகளைச் செய்வதற்கான முறையான வழிகளை ஆராயுங்கள்.' : 'Explore the systematic ways to perform daily devotional activities.')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredArticles.map((article) => (
                        <div 
                            key={article.id}
                            className="group flex flex-col bg-white dark:bg-[#2a2418] rounded-2xl border border-[#f3efe7] dark:border-neutral-800 hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                            onClick={() => setSelectedArticle(article)}
                        >
                            <div className="relative h-56 w-full overflow-hidden">
                                <img 
                                    src={article.articleImage} 
                                    alt={article.subTopic}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                <div className="absolute bottom-4 left-4">
                                    <div className="bg-primary/90 p-2 rounded-lg text-white backdrop-blur-sm shadow-lg">
                                        <ScrollText size={20} />
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded uppercase tracking-wider">
                                        {article.mainTopic}
                                    </span>
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                                        {new Date(article.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                    {article.subTopic}
                                </h3>
                                <div className="mt-auto pt-5 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between">
                                    <span className="text-sm font-bold text-primary flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                                        {locale === 'ta' ? 'விதிமுறையை வாசிக்க' : 'Read Procedure'} <ArrowRight size={16} />
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleWhatsAppShare(article);
                                            }}
                                            className="p-2 text-text-muted hover:text-[#25D366] hover:bg-[#25D366]/10 rounded-full transition-all"
                                            title="Share on WhatsApp"
                                        >
                                            <Share2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for Article View */}
            {selectedArticle && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#1a160f] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-neutral-800">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                    <ScrollText size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-text-main dark:text-white line-clamp-1">{selectedArticle.subTopic}</h4>
                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{selectedArticle.mainTopic}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedArticle(null)}
                                className="size-10 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-grow overflow-y-auto p-6 md:p-10 custom-scrollbar">
                            <div className="relative h-64 md:h-96 w-full rounded-2xl overflow-hidden mb-10 shadow-lg">
                                <img 
                                    src={selectedArticle.articleImage} 
                                    alt={selectedArticle.subTopic}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            </div>

                            <div className="prose prose-stone dark:prose-invert max-w-none 
                                prose-headings:font-black prose-headings:tracking-tight
                                prose-h1:text-4xl prose-h1:mb-8
                                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                                prose-p:text-lg prose-p:leading-relaxed prose-p:text-text-main dark:prose-p:text-gray-300
                                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic
                                prose-strong:text-primary prose-strong:font-bold">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {selectedArticle.article}
                                </ReactMarkdown>
                            </div>
                            
                            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-neutral-800 text-center">
                                <p className="text-sm font-bold text-text-muted mb-6 uppercase tracking-[0.3em]">
                                    {locale === 'ta' ? 'விதிமுறையின் முடிவு' : 'End of Procedure'}
                                </p>
                                <button 
                                    onClick={() => handleWhatsAppShare(selectedArticle)}
                                    className="inline-flex items-center gap-3 px-10 py-4 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-2xl font-black transition-all shadow-xl hover:shadow-[#25D366]/20 active:scale-95 group"
                                >
                                    <svg className="size-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    {locale === 'ta' ? 'வாட்ஸ்அப்பில் பகிரவும்' : 'Share on WhatsApp'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default PoojaVidhisSection;
