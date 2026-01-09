import React from 'react';
import { notFound } from 'next/navigation';
import FAQDetail from '@/components/categories/FaqDetailPage';

// Define valid FAQ topics
const validTopics = [
    'atheists',
    'interfaith',
    'young-generations',
    'devotees',
    'demigod-worship',
    'app-support'
];

export function generateStaticParams() {
    // Only generate params for FAQ category with valid topics
    return validTopics.map((topic) => ({
        category: 'faqs',
        topic: topic,
    }));
}

export default async function FAQTopicPage({
    params
}: {
    params: Promise<{ category: string; topic: string }>
}) {
    const { category, topic } = await params;

    // Only allow this route for 'faqs' category
    if (category !== 'faqs') {
        notFound();
    }

    // Validate topic
    if (!validTopics.includes(topic)) {
        notFound();
    }

    return <FAQDetail topic={topic} />;
}
