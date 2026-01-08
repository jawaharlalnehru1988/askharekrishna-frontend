import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { categories } from '@/lib/categories';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import MahabharatamPage from '@/components/categories/MahabharatamPage';
import RamayanamPage from '@/components/categories/RamayanamPage';

// Check if category exists
export function generateStaticParams() {
    return categories.map((category) => ({
        category: category,
    }));
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;

    if (!categories.includes(category)) {
        notFound();
    }

    const Layout = ({ children }: { children: React.ReactNode }) => (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-200">
            <Navbar />
            {children}
            <Footer />
        </div>
    );

    if (category === 'mahabharatam') {
        return (
            <Layout>
                <MahabharatamPage />
            </Layout>
        );
    }

    if (category === 'ramayanam') {
        return (
            <Layout>
                <RamayanamPage />
            </Layout>
        );
    }

    // Generic fallback for other categories
    const title = category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
    const description = `Explore the transcendental wisdom of ${title}.`;

    return (
        <Layout>
            <div className="w-full bg-background-light dark:bg-background-dark pt-8 pb-6">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    <div className="flex flex-col gap-6">
                        <nav aria-label="Breadcrumb" className="flex text-sm text-text-muted">
                            <ol className="flex items-center space-x-2">
                                <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                                <li><span className="text-gray-300 mx-1">/</span></li>
                                <li><span className="text-text-main dark:text-white font-medium capitalize">{category.replace('-', ' ')}</span></li>
                            </ol>
                        </nav>
                        <div className="max-w-3xl">
                            <h1 className="text-3xl md:text-5xl font-bold text-text-main dark:text-white leading-tight mb-4">
                                {title}
                            </h1>
                            <p className="text-lg text-text-muted dark:text-gray-300 leading-relaxed max-w-2xl">
                                {description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full bg-background-light dark:bg-background-dark pb-20">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#2a2418] rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-700">
                        <span className="material-symbols-outlined text-6xl text-text-muted/30 mb-4">construction</span>
                        <h3 className="text-xl font-bold text-text-main dark:text-white mb-2">Coming Soon</h3>
                        <p className="text-text-muted dark:text-gray-400 text-center max-w-md">
                            We are currently compiling the transcendental content for {title}. Please check back later.
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
