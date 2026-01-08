'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="w-full bg-white dark:bg-[#1a150c] border-t border-[#f3efe7] dark:border-neutral-800 py-12">
            <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row justify-between gap-10">
                    <div className="flex flex-col gap-4 max-w-sm">
                        <div className="flex items-center gap-3 text-text-main dark:text-white">
                            <div className="size-6 text-primary">
                                <span className="material-symbols-outlined text-2xl">temple_hindu</span>
                            </div>
                            <h2 className="text-lg font-bold">askharekrishna.com</h2>
                        </div>
                        <p className="text-text-muted text-sm leading-relaxed">
                            Connecting hearts to the divine through the power of transcendental sound. A project dedicated to preserving and sharing Vedic wisdom.
                        </p>
                    </div>
                    <div className="flex gap-16 flex-wrap">
                        <div className="flex flex-col gap-3">
                            <h4 className="font-bold text-text-main dark:text-white text-sm uppercase tracking-wider">Content</h4>
                            <Link href="#" className="text-text-muted hover:text-primary text-sm transition-colors">Audio Books</Link>
                            <Link href="#" className="text-text-muted hover:text-primary text-sm transition-colors">Lectures</Link>
                            <Link href="#" className="text-text-muted hover:text-primary text-sm transition-colors">Kirtans</Link>
                            <Link href="#" className="text-text-muted hover:text-primary text-sm transition-colors">Playlists</Link>
                        </div>
                        <div className="flex flex-col gap-3">
                            <h4 className="font-bold text-text-main dark:text-white text-sm uppercase tracking-wider">Support</h4>
                            <Link href="#" className="text-text-muted hover:text-primary text-sm transition-colors">Contact Us</Link>
                            <Link href="#" className="text-text-muted hover:text-primary text-sm transition-colors">Donate</Link>
                            <Link href="#" className="text-text-muted hover:text-primary text-sm transition-colors">FAQ</Link>
                            <Link href="#" className="text-text-muted hover:text-primary text-sm transition-colors">Privacy Policy</Link>
                        </div>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-gray-100 dark:border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-muted">
                    <p>&copy; {new Date().getFullYear()} Ask Hare Krishna. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link href="#" className="hover:text-primary transition-colors">Instagram</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Twitter</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Facebook</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
