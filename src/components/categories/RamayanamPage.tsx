import Link from "next/link";
import { getDictionary } from "@/lib/dictionaries";

export default function RamayanamPage({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>> }) {
    const { ramayanam: r, common: c } = dictionary;

    const KANDAS = [
        {
            id: "01",
            title: r.kandas.bala.title,
            subtitle: r.kandas.bala.subtitle,
            icon: "child_care",
            sargas: 77,
            description: r.kandas.bala.description,
        },
        {
            id: "02",
            title: r.kandas.ayodhya.title,
            subtitle: r.kandas.ayodhya.subtitle,
            icon: "castle",
            sargas: 119,
            description: r.kandas.ayodhya.description,
        },
        {
            id: "03",
            title: r.kandas.aranya.title,
            subtitle: r.kandas.aranya.subtitle,
            icon: "forest",
            sargas: 75,
            description: r.kandas.aranya.description,
        },
        {
            id: "04",
            title: r.kandas.kishkindha.title,
            subtitle: r.kandas.kishkindha.subtitle,
            icon: "handshake",
            sargas: 67,
            description: r.kandas.kishkindha.description,
        },
        {
            id: "05",
            title: r.kandas.sundara.title,
            subtitle: r.kandas.sundara.subtitle,
            icon: "flight_takeoff",
            sargas: 68,
            description: r.kandas.sundara.description,
        },
        {
            id: "06",
            title: r.kandas.yuddha.title,
            subtitle: r.kandas.yuddha.subtitle,
            icon: "swords",
            sargas: 128,
            description: r.kandas.yuddha.description,
        },
        {
            id: "07",
            title: r.kandas.uttara.title,
            subtitle: r.kandas.uttara.subtitle,
            icon: "auto_stories",
            sargas: 111,
            description: r.kandas.uttara.description,
        },
    ];

    return (
        <>
            {/* Breadcrumb + Hero */}
            <section className="pt-8 pb-6">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8 space-y-6">

                    {/* Breadcrumb */}
                    <nav aria-label="Breadcrumb" className="text-sm text-text-muted">
                        <ol className="flex items-center space-x-2">
                            <li>
                                <Link href="/" className="hover:text-primary transition-colors">
                                    {c.home}
                                </Link>
                            </li>
                            <li className="text-gray-300">/</li>
                            <li className="text-text-main dark:text-white font-medium">
                                {r.title}
                            </li>
                        </ol>
                    </nav>

                    {/* Title */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="max-w-3xl">
                            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                                {r.title}
                            </h1>
                            <p className="text-lg text-text-muted dark:text-gray-300 max-w-2xl">
                                {r.description}
                            </p>
                        </div>

                        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold">
                            <span className="material-symbols-outlined">headphones</span>
                            {r.availableKandas.replace("{count}", "7")}
                        </div>
                    </div>
                </div>
            </section>

            {/* Kanda Cards */}
            <section className="pb-20">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {KANDAS.map((kanda) => (
                        <div
                            key={kanda.id}
                            className="group relative flex flex-col justify-between bg-white dark:bg-[#2a2418] p-6 rounded-2xl border border-transparent hover:border-primary/30 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />

                            <div className="relative z-10 space-y-4">
                                <div className="flex justify-between items-start">
                                    <span className="w-10 h-10 flex items-center justify-center rounded-full bg-background-light dark:bg-neutral-800 text-primary font-bold text-sm">
                                        {kanda.id}
                                    </span>
                                    <span className="material-symbols-outlined text-3xl text-primary/40 group-hover:text-primary transition-colors">
                                        {kanda.icon}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                                        {kanda.title}
                                    </h3>
                                    <p className="text-sm text-text-muted">{kanda.subtitle}</p>
                                </div>

                                <p className="text-sm text-text-main/80 dark:text-gray-300 line-clamp-3">
                                    {kanda.description}
                                </p>
                            </div>

                            <div className="relative z-10 mt-6 pt-4 border-t border-gray-100 dark:border-neutral-800 flex justify-between items-center">
                                <span className="text-xs font-semibold text-text-muted uppercase">
                                    {r.sargas.replace("{count}", kanda.sargas.toString())}
                                </span>
                                <button className="flex items-center gap-2 text-primary font-bold text-sm hover:translate-x-1 transition-transform">
                                    {r.listenNow}
                                    <span className="material-symbols-outlined text-base">
                                        play_circle
                                    </span>
                                </button>
                            </div>
                        </div>
                    ))}

                </div>
            </section>

            {/* CTA */}
            <section className="bg-white dark:bg-[#1a150c] border-y py-16 text-center">
                <div className="max-w-[1280px] mx-auto px-4">
                    <span className="material-symbols-outlined text-4xl text-primary mb-4">
                        diamond
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        {r.ctaTitle}
                    </h2>
                    <p className="text-text-muted max-w-2xl mx-auto mb-8">
                        {r.ctaQuote}
                    </p>
                    <button className="h-12 px-8 rounded-xl bg-primary hover:bg-yellow-500 font-bold shadow-lg shadow-primary/25">
                        {r.ctaButton}
                    </button>
                </div>
            </section>
        </>
    );
}
