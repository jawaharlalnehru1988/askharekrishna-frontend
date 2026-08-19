import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import DebateArticleDetail from '@/components/categories/DebateArticleDetail';

const Layout = ({ children }: { children: React.ReactNode }) => (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-200">
        <Navbar />
        {children}
        <Footer />
    </div>
);

export default async function DebateArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    
    return (
        <Layout>
            <DebateArticleDetail slug={slug} />
        </Layout>
    );
}
