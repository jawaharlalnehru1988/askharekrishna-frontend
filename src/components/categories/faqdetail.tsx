"use client";

import Link from "next/link";
import { useState } from "react";

const QUESTIONS = [
    {
        question: "Why do bad things happen to good people?",
        answer: "According to the law of karma, every action has a reaction. Suffering is often the result of past actions, either in this life or previous ones. However, it is not merely punishment; it serves as an opportunity for spiritual growth, learning, and detachment from the temporary material world.",
        audio: {
            title: "Listen to Srila Prabhupada explain Karma",
            subtitle: "From lecture on Bhagavad-gita 2.13 • 4 min listen"
        }
    },
    {
        question: "Is there scientific proof of the soul?",
        answer: "While material science deals with matter, the soul is anti-material or spiritual. Its presence is inferred through consciousness, which cannot be explained solely by chemical reactions. The difference between a living body and a dead body is the presence of the soul. Vedic science offers methods like yoga and meditation to directly perceive the self beyond the body."
    },
    {
        question: "If God exists, why is He invisible?",
        answer: "God is not invisible; rather, our eyes are not qualified to see Him in His spiritual form. Just as we cannot see microbes without a microscope or radio waves without a receiver, we need spiritual vision (prema-chakshu) developed through devotion to perceive Krishna. However, He is visible through His energies, His deity form (archa-vigraha), and His holy name."
    },
    {
        question: "What is the Vedic perspective on evolution?",
        answer: "The Vedas accept evolution of consciousness, not just bodies. The soul transmigrates through 8.4 million species of life, evolving from aquatics to plants, animals, and finally humans. The human form is the peak of this evolution because it offers the unique ability to inquire about the Absolute Truth and attain liberation."
    },
    {
        question: "Is religion just a crutch for the weak?",
        answer: "True spirituality requires immense strength to control the senses, conquer the ego, and act selflessly in a world driven by exploitation. It is an act of courage to seek truth beyond comfortable illusions. While some may use religion for comfort, the path of Bhakti (devotion) is a rigorous science of self-realization practiced by great intellectuals and warriors throughout history."
    }
];

const BOOKS = [
    {
        title: "Science of Self Realization",
        author: "A.C. Bhaktivedanta Swami",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBR8gCtsunEl7_bx1zhRsAv2QXDAkJ2fbs6b9aYbVbsa6EuYqsHrhCEKSnaQgmqIvSjuD0tu7Y72uG1jHTLmvyL-K_MLc0nFFsPt8wc9ggqwzETkMl4Aufn3my1TeUEz4uMdSgLNzau6_xoW2R2pYk2ee9HRUujvLz3Nt0tTbrRLOw6sMM0WREIaDwASEQuHfmJKFxvWoAC7zBmtTh4TPtzsm34rLTfWtxJx7B1r8cJEbX4Y-lm6HNcK0TJ31ZlWAaMJ3N0VuV3Zujj"
    },
    {
        title: "Life Comes from Life",
        author: "A.C. Bhaktivedanta Swami",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_svfOrLZzmk9aQGEpDpfhqLDBs9DCQJBVxgChZShOTzwI7A3dU8xiJCI6KPFiHWGkbSOoyVVAoI7urB1uyWB4SoB-luirckuodcBmBORcw7Uu1hxcZP_B15ZbRQYp49Y14HxNeSi0LQ5ZRN60MezJ5wQB-zQMFCgOUzL8lbLIsC1DjI-yxYZhlQvS3vl5zfEJ4KugyueiCKjnY0LkCoFCVUlvhBHv_EXZsYypzHkV5gm6hdP3t0Nbu5mgIG9h23aZ22mYI5Ct_se4"
    },
    {
        title: "Perfect Questions",
        author: "A.C. Bhaktivedanta Swami",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBS8kc_bLBfkhh-3XVp5JS74dPKJF_UhCoS4D64F-Iek5cFCbXAwq8_OgKtiJ7Kms6hS3PYgryjL7YzkKemXrOK0GN0H81M4cfGL564JqFc7F3_0MKBzYq0k4-h-XTKogSXajjRWdh5Jl1pRvYGSPnJl8BJAOH1FBxtVEolcwDZBCzrSxR9kRS5GwB_4nSRydqsYPZJiXMCJG4Mlhxj6lQF4Rzk-dI_Xq898f1zBpBAhG6h1GPUHIMXU6hgExd8CXH4_1Zget8AtRsO"
    },
    {
        title: "Beyond Birth & Death",
        author: "A.C. Bhaktivedanta Swami",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOwN7eXITMWaS_OqIylFL9nNO3Qef0Hm-5TF7kO2oUVCQy05GnqtvJscaB3e2YgwT5q_C6UBxmZbDVN5t2BAf_da_ZRi-h5CyHbk0QZtGLvs7jwVFvIdXSm1HbIOgZ2XSqi-n8OeNHDkBSJeJBVsRsPFkGEbXw3DD8F6BM-COZt08L-X-IqpiBctcii2AUPahD95n2B_Dfv8EXYEFJX6oARrk32JGKhB6OklVDtZPcltBC_9WpJf-YjFGklBouiURjJ-bt00FEYeX_"
    }
];

export default function FAQDetail() {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white min-h-screen flex flex-col antialiased">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-[#f3efe7] dark:border-[#3a3428]">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
                        {/* Logo & Brand */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="size-8 text-primary flex items-center justify-center">
                                <span className="material-symbols-outlined !text-[32px]">spa</span>
                            </div>
                            <h1 className="text-[#1b170d] dark:text-white text-lg font-bold leading-tight tracking-tight hidden sm:block">
                                Hare Krishna Audio
                            </h1>
                        </div>
                        {/* Desktop Nav Links */}
                        <nav className="hidden md:flex items-center gap-8">
                            <Link href="#" className="text-[#1b170d] dark:text-gray-200 text-sm font-medium hover:text-primary transition-colors">Home</Link>
                            <Link href="#" className="text-[#1b170d] dark:text-gray-200 text-sm font-medium hover:text-primary transition-colors">Audiobooks</Link>
                            <Link href="#" className="text-[#1b170d] dark:text-gray-200 text-sm font-medium hover:text-primary transition-colors">Lectures</Link>
                            <Link href="#" className="text-primary text-sm font-semibold">FAQ</Link>
                        </nav>
                        {/* Search & Profile */}
                        <div className="flex items-center gap-4 flex-1 md:flex-none justify-end">
                            <div className="relative hidden sm:block w-full max-w-[240px]">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-subtle">
                                    <span className="material-symbols-outlined !text-[20px]">search</span>
                                </div>
                                <input
                                    className="block w-full pl-10 pr-3 py-2 border-none rounded-xl bg-[#f3efe7] dark:bg-[#332d21] text-sm placeholder-text-subtle focus:ring-2 focus:ring-primary/50 text-[#1b170d] dark:text-white"
                                    placeholder="Search wisdom..." type="text"
                                />
                            </div>
                            <div className="size-10 rounded-full bg-cover bg-center border-2 border-primary/20 cursor-pointer hover:border-primary transition-colors"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDNCFnviEE618sGXKLgL2DOyc9Xeq4ZOmhxmOslXDIbE0qwo0ZuXzheyq1GlfdH9ne5B1aqwbvM7tD5-wkkP1r74ZExG0NLeP6S6HwZsU8he5UUhmhJfT0Gk1Mv2I0dXA3BcUPxf6kSVdJyGW65aNaLum5ZDU7wi0LiQCDSiDTQ8PXpdJKbZuF7w07og_aFxdmelQkM3K6PVWF8sA174t6pmrjPqrtaJlR6kywAiyZ9Cm5Tap3sJOP8Z9d9DIHVR7xXueezVgyyAe6m")' }}>
                            </div>
                            {/* Mobile Menu Button */}
                            <button className="md:hidden text-[#1b170d] dark:text-white">
                                <span className="material-symbols-outlined">menu</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow flex flex-col items-center relative">
                {/* Background decorative elements */}
                <div className="absolute inset-0 bg-pattern pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>

                <div className="w-full max-w-[960px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 z-10">
                    {/* Breadcrumbs */}
                    <nav aria-label="Breadcrumb" className="flex mb-8">
                        <ol className="inline-flex items-center space-x-2 md:space-x-3">
                            <li className="inline-flex items-center">
                                <Link href="#" className="inline-flex items-center text-sm font-medium text-text-subtle hover:text-primary dark:text-gray-400 dark:hover:text-white">
                                    <span className="material-symbols-outlined !text-[18px] mr-2">home</span>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <span className="material-symbols-outlined !text-[16px] text-gray-400 mx-1">chevron_right</span>
                                    <Link href="#" className="text-sm font-medium text-text-subtle hover:text-primary dark:text-gray-400 dark:hover:text-white">FAQ</Link>
                                </div>
                            </li>
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <span className="material-symbols-outlined !text-[16px] text-gray-400 mx-1">chevron_right</span>
                                    <span className="text-sm font-medium text-text-main dark:text-gray-200">Questions from Atheists</span>
                                </div>
                            </li>
                        </ol>
                    </nav>

                    {/* Page Heading */}
                    <div className="mb-10 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <span className="text-primary font-medium tracking-wide uppercase text-xs mb-2 block">Faith &amp; Logic</span>
                                <h1 className="text-3xl md:text-4xl font-bold text-text-main dark:text-white mb-3">Questions from Atheists</h1>
                                <p className="text-text-subtle dark:text-gray-400 text-lg max-w-2xl">Common inquiries regarding faith, logic, scientific perspectives, and the nature of the soul.</p>
                            </div>
                            <div className="hidden md:flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary">
                                <span className="material-symbols-outlined !text-[32px]">psychology_alt</span>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Accordion List */}
                    <div className="flex flex-col gap-4">
                        {QUESTIONS.map((item, index) => (
                            <details key={index} className="group bg-white dark:bg-[#2a2418] rounded-xl border border-[#e7dfcf] dark:border-[#3a3428] shadow-sm hover:shadow-md transition-all duration-300" open={index === 0}>
                                <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 sm:p-6 select-none list-none">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary group-open:bg-primary group-open:text-white transition-colors duration-300 shrink-0">
                                            <span className="material-symbols-outlined !text-[20px]">help</span>
                                        </span>
                                        <h3 className="text-text-main dark:text-gray-100 text-base sm:text-lg font-medium leading-snug group-hover:text-primary transition-colors">
                                            {item.question}
                                        </h3>
                                    </div>
                                    <span className="material-symbols-outlined text-text-subtle group-open:rotate-180 transition-transform duration-300">expand_more</span>
                                </summary>
                                <div className="px-6 pb-6 pt-0 sm:pl-[76px]">
                                    <div className="prose prose-stone dark:prose-invert max-w-none">
                                        <p className="text-text-subtle dark:text-gray-400 leading-relaxed mb-4">
                                            {item.answer}
                                        </p>
                                        {item.audio && (
                                            <div className="bg-primary-light dark:bg-[#3a3020] rounded-lg p-4 flex items-start gap-3 mt-4">
                                                <span className="material-symbols-outlined text-primary mt-1">headphones</span>
                                                <div>
                                                    <p className="text-sm font-medium text-text-main dark:text-gray-200">{item.audio.title}</p>
                                                    <p className="text-xs text-text-subtle dark:text-gray-400 mt-1">{item.audio.subtitle}</p>
                                                </div>
                                                <button className="ml-auto text-primary hover:bg-primary/10 rounded-full p-2 transition-colors">
                                                    <span className="material-symbols-outlined !text-[24px]">play_circle</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </details>
                        ))}
                    </div>

                    {/* Related Books Carousel Section */}
                    <div className="mt-16">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-text-main dark:text-white">Related Audiobooks</h2>
                            <Link href="#" className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1">
                                View All <span className="material-symbols-outlined !text-[16px]">arrow_forward</span>
                            </Link>
                        </div>
                        <div className="relative group/carousel">
                            <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x">
                                {BOOKS.map((book, index) => (
                                    <div key={index} className="snap-start shrink-0 w-44 md:w-48 flex flex-col gap-3 group/card cursor-pointer">
                                        <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden shadow-md group-hover/card:shadow-xl transition-all duration-300">
                                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover/card:scale-105"
                                                style={{ backgroundImage: `url('${book.image}')` }}>
                                            </div>
                                            <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/10 transition-colors"></div>
                                            <div className="absolute bottom-2 right-2 size-8 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover/card:opacity-100 transform translate-y-2 group-hover/card:translate-y-0 transition-all duration-300">
                                                <span className="material-symbols-outlined text-white !text-[20px]">play_arrow</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-text-main dark:text-white text-base leading-tight mb-1 group-hover/card:text-primary transition-colors">{book.title}</h4>
                                            <p className="text-xs text-text-subtle dark:text-gray-400">{book.author}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact / Help CTA */}
                    <div className="mt-16 bg-gradient-to-r from-[#fcf7ed] to-white dark:from-[#2a2418] dark:to-[#221c10] border border-[#e7dfcf] dark:border-[#3a3428] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                        <div className="text-center md:text-left">
                            <h3 className="text-xl font-bold text-text-main dark:text-white mb-2">Still have questions?</h3>
                            <p className="text-text-subtle dark:text-gray-400 max-w-md">Our community of devotees is happy to help clarify any doubts regarding philosophy or practice.</p>
                        </div>
                        <div className="flex gap-4">
                            <button className="px-6 py-3 rounded-lg bg-primary hover:bg-yellow-500 text-white font-medium transition-colors shadow-sm flex items-center gap-2">
                                <span className="material-symbols-outlined !text-[20px]">mail</span>
                                Ask a Devotee
                            </button>
                            <button className="px-6 py-3 rounded-lg bg-white dark:bg-[#332d21] border border-[#e7dfcf] dark:border-[#3a3428] text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-[#3e3729] font-medium transition-colors">
                                View all Topics
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="bg-white dark:bg-[#1a150c] border-t border-[#f3efe7] dark:border-[#2a2418] py-12 mt-auto">
                <div className="max-w-[960px] mx-auto px-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-6 text-primary">
                        <span className="material-symbols-outlined">spa</span>
                        <span className="font-bold text-text-main dark:text-white text-lg">Hare Krishna Audio</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-8 mb-8">
                        <Link href="#" className="text-text-subtle dark:text-gray-400 hover:text-primary text-sm font-medium">About Us</Link>
                        <Link href="#" className="text-text-subtle dark:text-gray-400 hover:text-primary text-sm font-medium">Donations</Link>
                        <Link href="#" className="text-text-subtle dark:text-gray-400 hover:text-primary text-sm font-medium">Temples Near You</Link>
                        <Link href="#" className="text-text-subtle dark:text-gray-400 hover:text-primary text-sm font-medium">Contact</Link>
                    </div>
                    <p className="text-xs text-gray-400">© 2024 Hare Krishna Audio. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
