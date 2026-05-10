"use client";

import React from 'react';

interface HomeHeroProps {
    h: any;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ h }) => {
    return (
        <div className="w-full bg-background-light dark:bg-background-dark">
            <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-10">
                <div
                    className="relative overflow-hidden rounded-2xl md:rounded-3xl min-h-[500px] flex items-center justify-center text-center p-8 shadow-lg bg-cover bg-center"
                    style={{
                        backgroundImage: "linear-gradient(rgba(34, 28, 16, 0.3), rgba(34, 28, 16, 0.7)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuDPIsGRXR8PvbkG6ZAq3c64SP-oypwcu2SkvwWLXcTrTFPFOOAM48KeD4X8Ma2JdiIX2imkVBKtAnUSowQvzRPu-Ei3QRq4OBtsUwQ0jQ3eZmgAO_QWDrdgfEvGODnZgXmi62iu9e2SO-9JjzxkNumScIJ_bEwVreheEkt7xDU9MJz4WbRnAEFVqHfpQxVQzNl25SdkIoeMH2BLmjdhSZiwVAUlzVZyJCitjgcLqlDwxPEsgA1juXU-kKE3HNbjLzL9bp1FUaoxNy6K')"
                    }}
                >
                    <div className="relative z-10 flex flex-col items-center gap-6 max-w-3xl animate-fade-in-up">
                        {h.hero.liveKirtan && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-medium tracking-wider uppercase mb-2">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                {h.hero.liveKirtan}
                            </div>
                        )}
                        <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight drop-shadow-md">
                            {h.hero.title}<br /> <span className="text-primary">{h.hero.subtitle}</span>
                        </h1>
                        <p className="max-w-2xl text-lg font-medium leading-relaxed text-gray-100 md:text-xl drop-shadow">
                            {h.hero.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
