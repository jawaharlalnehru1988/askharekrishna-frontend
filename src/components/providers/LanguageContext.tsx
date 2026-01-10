'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { Locale } from '@/lib/dictionaries';

interface LanguageContextType {
    locale: Locale;
    dictionary: any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
    children,
    locale,
    dictionary
}: {
    children: ReactNode;
    locale: Locale;
    dictionary: any;
}) {
    return (
        <LanguageContext.Provider value={{ locale, dictionary }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
