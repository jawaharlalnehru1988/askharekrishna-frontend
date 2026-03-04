import React from 'react';

interface OtherSite {
    id: number;
    webUrl: string;
    purpose: string;
    featuresAvailable: string;
    created_at: string;
    updated_at: string;
}

const themeClasses: Record<string, { bg: string; border: string; text: string; lightBg: string; shadow: string; glow: string }> = {
    primary: {
        bg: 'bg-primary/10',
        border: 'border-primary/20',
        text: 'text-primary',
        lightBg: 'bg-primary/5',
        shadow: 'hover:shadow-primary/20',
        glow: 'group-hover:bg-primary/20'
    }
};

async function getOtherSites(): Promise<OtherSite[]> {
    try {
        const response = await fetch('https://api.askharekrishna.com/api/ourOtherSites/', {
            next: { revalidate: 3600 }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch sites');
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching other sites:', error);
        return [];
    }
}

export default async function OtherWebsites() {
    const sites = await getOtherSites();

    if (sites.length === 0) return null;

    const mappedWebsites = sites.map((site) => {
        let host = '';
        try {
            host = new URL(site.webUrl).hostname;
        } catch (e) {
            host = site.webUrl;
        }

        // Clean up host to get a names
        const nameFallback = host
            .replace(/^https?:\/\//, '')
            .replace(/^www\./, '')
            .split('.')[0]
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        // Use a single primary theme for all as requested
        const colors = themeClasses.primary;

        return {
            id: site.id,
            url: site.webUrl,
            name: nameFallback,
            description: site.purpose,
            tag: site.featuresAvailable.split(';')[0].trim() || 'Portal',
            icon: 'language', // Default icon for all
            colors: colors
        };
    });

    return (
        <section className="py-24 bg-[#FCFAFA] dark:bg-slate-950 overflow-hidden relative">
            {/* Background Decorative Element */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-5 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-saffron rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-gold mb-4 block">Our Digital Network</span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
                        Connect with our <span className="text-saffron italic font-display">Spiritual Ecosystem</span>
                    </h2>
                    <div className="h-2 w-24 bg-gradient-to-r from-saffron to-gold mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {mappedWebsites.map((site) => (
                        <a
                            key={site.id}
                            href={site.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group relative p-1 rounded-[2.8rem] transition-all duration-700 hover:-translate-y-3 flex flex-col`}
                        >
                            {/* Animated Gradient Border */}
                            <div className={`absolute inset-0 rounded-[2.8rem] bg-gradient-to-br ${site.colors.bg.replace('bg-', 'from-').replace('/10', '/30')} to-transparent opacity-100 group-hover:opacity-100 transition-opacity duration-500`}></div>

                            <div className={`${site.colors.lightBg} border ${site.colors.border} dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2.6rem] h-full flex flex-col relative overflow-hidden transition-all duration-500 group-hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] ${site.colors.shadow}`}>

                                {/* Background Gradient Glow */}
                                <div className={`absolute -right-16 -top-16 w-48 h-48 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity duration-700 ${site.colors.bg}`}></div>
                                <div className={`absolute -left-16 -bottom-16 w-48 h-48 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 ${site.colors.bg}`}></div>

                                {/* Decorative Background Icon */}
                                <div className={`absolute -right-6 -bottom-6 opacity-[0.08] group-hover:opacity-[0.2] transition-all duration-700 group-hover:scale-125 group-hover:-rotate-12 ${site.colors.text}`}>
                                    <span className="material-symbols-outlined text-[11rem]">{site.icon}</span>
                                </div>

                                <div className="relative z-10 flex-grow">
                                    <div className="flex justify-between items-start mb-10">
                                        <div className={`w-16 h-16 rounded-2xl ${site.colors.bg.replace('/10', '/20')} ${site.colors.text} flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-current/30 duration-500 ring-4 ring-white dark:ring-slate-800`}>
                                            <span className="material-symbols-outlined text-4xl">{site.icon}</span>
                                        </div>
                                        <div className={`${site.colors.text} ${site.colors.bg.replace('/10', '/20')} backdrop-blur-md px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-current/10 shadow-sm`}>
                                            {site.tag}
                                        </div>
                                    </div>

                                    <h3 className={`text-2xl font-black mb-4 transition-colors duration-300 ${site.colors.text}`}>
                                        {site.name}
                                    </h3>
                                    {/* Readable dark color for description */}
                                    <p className="leading-relaxed mb-8 font-semibold opacity-90 text-lg text-slate-700 dark:text-slate-300">
                                        {site.description}
                                    </p>
                                </div>

                                <div className={`mt-auto flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-primary to-amber-500 shadow-md transition-all duration-500 group-hover:from-amber-500 group-hover:to-primary group-hover:shadow-xl group-hover:scale-[1.02]`}>
                                    <span className="text-sm font-black text-white">Explore Service</span>
                                    <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-primary text-white">
                                        <span className="material-symbols-outlined text-sm font-bold">arrow_outward</span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
