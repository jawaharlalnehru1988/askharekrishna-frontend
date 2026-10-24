"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { BookOpen, Calendar } from 'lucide-react';
import { useLanguage } from '../providers/LanguageContext';
import { Locale } from '@/lib/dictionaries';

interface HomeHeroProps {
    h: any;
}

const LOCALIZED_DATA: Record<Locale, {
    prabhupadaName: string;
    prabhupadaRole: string;
    radhaKrishnaName: string;
    radhaKrishnaRole: string;
    calendarLabel: string;
}> = {
    en: {
        prabhupadaName: 'Srila Prabhupada',
        prabhupadaRole: 'Founder-Acharya',
        radhaKrishnaName: 'Sri Sri Radha Krishna',
        radhaKrishnaRole: 'Supreme Divine Couple',
        calendarLabel: 'Vaishnava Calendar',
    },
    ta: {
        prabhupadaName: 'ஸ்ரீல பிரபுபாதர்',
        prabhupadaRole: 'இஸ்கான் ஸ்தாபக ஆச்சார்யர்',
        radhaKrishnaName: 'ஸ்ரீ ஸ்ரீ ராதா கிருஷ்ணர்',
        radhaKrishnaRole: 'முழுமுதற் கடவுள்',
        calendarLabel: 'வைஷ்ணவ நாள்காட்டி',
    },
    hi: {
        prabhupadaName: 'श्रील प्रभुपाद',
        prabhupadaRole: 'संस्थापक-आचार्य',
        radhaKrishnaName: 'श्री श्री राधा कृष्ण',
        radhaKrishnaRole: 'परम पुरुषोत्तम भगवान',
        calendarLabel: 'वैष्णव कैलेंडर',
    },
    kn: {
        prabhupadaName: 'ಶ್ರೀಲ ಪ್ರಭುಪಾದ',
        prabhupadaRole: 'ಸಂಸ್ಥಾಪಕ-ಆಚಾರ್ಯ',
        radhaKrishnaName: 'ಶ್ರೀ ಶ್ರೀ ರಾಧಾ ಕೃಷ್ಣ',
        radhaKrishnaRole: 'ಪರಮ ದೇವತೆಗಳು',
        calendarLabel: 'ವೈಷ್ಣವ ಕ್ಯಾಲೆಂಡರ್',
    },
    te: {
        prabhupadaName: 'శ్రీల ప్రభుపాద',
        prabhupadaRole: 'సంస్థాపక-ఆచార్య',
        radhaKrishnaName: 'శ్రీ శ్రీ రాధా కృష్ణ',
        radhaKrishnaRole: 'పరమ దైవ దంపతులు',
        calendarLabel: 'వైష్ణవ క్యాలెండర్',
    },
    ml: {
        prabhupadaName: 'ശ്രീല പ്രഭുപാദർ',
        prabhupadaRole: 'സ്ഥാപക-ആചാര്യൻ',
        radhaKrishnaName: 'ശ്രീ ശ്രീ രാധാ കൃഷ്ണ',
        radhaKrishnaRole: 'പരമ ദിവ്യ ദമ്പതികൾ',
        calendarLabel: 'വൈഷ്ണവ കലണ്ടർ',
    },
    bn: {
        prabhupadaName: 'শ্রীল প্রভুপাদ',
        prabhupadaRole: 'প্রতিষ্ঠাতা-আচার্য',
        radhaKrishnaName: 'শ্রী শ্রী রাধা কৃষ্ণ',
        radhaKrishnaRole: 'পরমেশ্বর ভগবান যুগল',
        calendarLabel: 'বৈষ্ণব পঞ্জিকা',
    },
};

export const HomeHero: React.FC<HomeHeroProps> = ({ h }) => {
    const { locale } = useLanguage();
    const loc = (LOCALIZED_DATA[locale] ? locale : 'en') as Locale;
    const {
        prabhupadaName,
        prabhupadaRole,
        radhaKrishnaName,
        radhaKrishnaRole,
        calendarLabel
    } = LOCALIZED_DATA[loc];

    return (
        <div className="w-full bg-background-light dark:bg-background-dark py-3 sm:py-6">
            <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                <div
                    className="relative overflow-hidden rounded-2xl md:rounded-3xl min-h-[500px] p-6 sm:p-8 lg:p-10 shadow-2xl border border-amber-500/20 bg-cover bg-center flex items-center"
                    style={{
                        backgroundImage: "radial-gradient(ellipse at center, rgba(38, 29, 14, 0.78) 0%, rgba(20, 15, 8, 0.94) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuDPIsGRXR8PvbkG6ZAq3c64SP-oypwcu2SkvwWLXcTrTFPFOOAM48KeD4X8Ma2JdiIX2imkVBKtAnUSowQvzRPu-Ei3QRq4OBtsUwQ0jQ3eZmgAO_QWDrdgfEvGODnZgXmi62iu9e2SO-9JjzxkNumScIJ_bEwVreheEkt7xDU9MJz4WbRnAEFVqHfpQxVQzNl25SdkIoeMH2BLmjdhSZiwVAUlzVZyJCitjgcLqlDwxPEsgA1juXU-kKE3HNbjLzL9bp1FUaoxNy6K')"
                    }}
                >
                    {/* Subtle warm glow highlights with continuous ambient breathing */}
                    <motion.div
                        animate={{
                            scale: [1, 1.15, 1],
                            opacity: [0.15, 0.35, 0.15],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className="absolute -top-24 -left-24 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"
                    />
                    <motion.div
                        animate={{
                            scale: [1.15, 1, 1.15],
                            opacity: [0.15, 0.35, 0.15],
                        }}
                        transition={{
                            duration: 6.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className="absolute -bottom-24 -right-24 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl pointer-events-none"
                    />

                    <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        
                        {/* 1. Left Card: His Divine Grace Srila Prabhupada */}
                        <motion.div
                            initial={{ opacity: 0, x: -35 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.65, ease: [0.21, 0.47, 0.32, 0.98] }}
                            className="hidden lg:flex lg:col-span-3 flex-col items-center relative"
                        >
                            {/* Ambient Effulgence Halo */}
                            <motion.div
                                animate={{
                                    scale: [0.95, 1.05, 0.95],
                                    opacity: [0.25, 0.5, 0.25],
                                }}
                                transition={{
                                    duration: 4.5,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                                className="absolute -inset-1 bg-gradient-to-r from-amber-400/30 to-yellow-500/30 rounded-3xl blur-xl pointer-events-none"
                            />
                            <div className="group relative w-full max-w-[240px] aspect-[4/5] rounded-2xl overflow-hidden border-2 border-amber-400/40 hover:border-amber-400 shadow-2xl shadow-black/60 transition-all duration-300 hover:scale-[1.03] ring-1 ring-amber-400/30">
                                <Image
                                    src="/srila-prabhupada.png"
                                    alt="His Divine Grace A.C. Bhaktivedanta Swami Srila Prabhupada"
                                    fill
                                    unoptimized
                                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 1024px) 100vw, 240px"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent"></div>
                                <div className="absolute bottom-3 left-3 right-3 text-center">
                                    <motion.span
                                        animate={{ y: [-2, 2, -2] }}
                                        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
                                        className="inline-block px-2 py-0.5 rounded-full bg-amber-500/30 backdrop-blur-md border border-amber-400/40 text-[10px] font-semibold text-amber-200 uppercase tracking-widest mb-1 shadow-sm"
                                    >
                                        {prabhupadaRole}
                                    </motion.span>
                                    <h3 className="text-white font-bold text-sm tracking-wide drop-shadow">
                                        {prabhupadaName}
                                    </h3>
                                </div>
                            </div>
                        </motion.div>

                        {/* 2. Center Column: Main Headline, Description & Calls-to-action */}
                        <motion.div
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                            className="lg:col-span-6 flex flex-col items-center text-center gap-5 sm:gap-6"
                        >
                            {h?.hero?.liveKirtan && (
                                <motion.div
                                    animate={{ y: [-3, 3, -3] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/30 text-amber-200 text-xs font-semibold tracking-wider uppercase shadow-inner"
                                >
                                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                                    {h.hero.liveKirtan}
                                </motion.div>
                            )}

                            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight drop-shadow-md">
                                {h?.hero?.title || (locale === 'en' ? "Read. Reflect." : "")}
                                {Boolean(h?.hero?.subtitle || (locale === 'en' ? "Connect with Krishna." : "")) && (
                                    <>
                                        <br />
                                        <span className="bg-gradient-to-r from-amber-300 via-amber-400 via-yellow-200 to-amber-300 bg-clip-text text-transparent animate-shimmer-text">
                                            {h?.hero?.subtitle || (locale === 'en' ? "Connect with Krishna." : "")}
                                        </span>
                                    </>
                                )}
                            </h1>

                            <p className="max-w-xl text-sm sm:text-base md:text-lg font-medium leading-relaxed text-amber-100/90 drop-shadow">
                                {h?.hero?.description}
                            </p>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                                <Link
                                    href="/stories"
                                    className="group relative overflow-hidden inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-sm shadow-lg shadow-amber-950/40 hover:scale-105 active:scale-95 transition-all duration-200"
                                >
                                    {/* Continuous subtle diagonal light shine */}
                                    <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none animate-button-shine" />
                                    <BookOpen className="size-4 relative z-10" />
                                    <span className="relative z-10">{h?.hero?.startListening || "Start Reading"}</span>
                                </Link>
                                <Link
                                    href="/vaishnava-calendar"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/20 hover:border-amber-400/50 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md"
                                >
                                    <Calendar className="size-4 text-amber-300" />
                                    <span>{calendarLabel}</span>
                                </Link>
                            </div>

                            {/* Mobile / Tablet Dual Deity & Acharya Cards */}
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-md mt-3 lg:hidden">
                                {/* Srila Prabhupada Mobile Card */}
                                <div className="group relative aspect-[4/5] rounded-xl overflow-hidden border border-amber-400/40 shadow-xl">
                                    <Image
                                        src="/srila-prabhupada.png"
                                        alt="Srila Prabhupada"
                                        fill
                                        unoptimized
                                        className="object-cover object-top"
                                        sizes="50vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>
                                    <div className="absolute bottom-2 left-1 right-1 text-center">
                                        <span className="block text-[9px] font-semibold text-amber-300 uppercase tracking-wider">
                                            {prabhupadaRole}
                                        </span>
                                        <h4 className="text-white font-bold text-xs truncate">
                                            {prabhupadaName}
                                        </h4>
                                    </div>
                                </div>

                                {/* Sri Sri Radha Krishna Mobile Card */}
                                <div className="group relative aspect-[4/5] rounded-xl overflow-hidden border border-amber-400/40 shadow-xl">
                                    <Image
                                        src="/radha-krishna.jpg"
                                        alt="Sri Sri Radha Krishna"
                                        fill
                                        unoptimized
                                        className="object-cover object-center"
                                        sizes="50vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>
                                    <div className="absolute bottom-2 left-1 right-1 text-center">
                                        <span className="block text-[9px] font-semibold text-amber-300 uppercase tracking-wider">
                                            {radhaKrishnaRole}
                                        </span>
                                        <h4 className="text-white font-bold text-xs truncate">
                                            {radhaKrishnaName}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* 3. Right Card: Sri Sri Radha Krishna */}
                        <motion.div
                            initial={{ opacity: 0, x: 35 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.65, delay: 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
                            className="hidden lg:flex lg:col-span-3 flex-col items-center relative"
                        >
                            {/* Ambient Effulgence Halo */}
                            <motion.div
                                animate={{
                                    scale: [1.05, 0.95, 1.05],
                                    opacity: [0.5, 0.25, 0.5],
                                }}
                                transition={{
                                    duration: 4.5,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                                className="absolute -inset-1 bg-gradient-to-r from-yellow-400/30 to-amber-500/30 rounded-3xl blur-xl pointer-events-none"
                            />
                            <div className="group relative w-full max-w-[240px] aspect-[4/5] rounded-2xl overflow-hidden border-2 border-amber-400/40 hover:border-amber-400 shadow-2xl shadow-black/60 transition-all duration-300 hover:scale-[1.03] ring-1 ring-amber-400/30">
                                <Image
                                    src="/radha-krishna.jpg"
                                    alt="Sri Sri Radha Krishna"
                                    fill
                                    unoptimized
                                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 1024px) 100vw, 240px"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent"></div>
                                <div className="absolute bottom-3 left-3 right-3 text-center">
                                    <motion.span
                                        animate={{ y: [-2, 2, -2] }}
                                        transition={{ duration: 3.8, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
                                        className="inline-block px-2 py-0.5 rounded-full bg-amber-500/30 backdrop-blur-md border border-amber-400/40 text-[10px] font-semibold text-amber-200 uppercase tracking-widest mb-1 shadow-sm"
                                    >
                                        {radhaKrishnaRole}
                                    </motion.span>
                                    <h3 className="text-white font-bold text-sm tracking-wide drop-shadow">
                                        {radhaKrishnaName}
                                    </h3>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </div>
    );
};
