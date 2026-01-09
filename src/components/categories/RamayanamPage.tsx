import Link from "next/link";

const KANDAS = [
    {
        id: "01",
        title: "Bala Kanda",
        subtitle: "Childhood & Beginnings",
        icon: "child_care",
        sargas: 77,
        description:
            "The birth of Lord Rama, his education under Sage Vashistha, and his divine marriage to Sita Devi.",
    },
    {
        id: "02",
        title: "Ayodhya Kanda",
        subtitle: "Life in Ayodhya & Exile",
        icon: "castle",
        sargas: 119,
        description:
            "Kaikeyi’s boons, Rama’s exile, and Bharata placing Rama’s sandals on the throne.",
    },
    {
        id: "03",
        title: "Aranya Kanda",
        subtitle: "Forest Life",
        icon: "forest",
        sargas: 75,
        description:
            "Life in the forest, Surpanakha episode, golden deer, and Sita’s abduction.",
    },
    {
        id: "04",
        title: "Kishkindha Kanda",
        subtitle: "Alliance with Sugriva",
        icon: "handshake",
        sargas: 67,
        description:
            "Meeting Hanuman, Sugriva’s coronation, and the search for Sita Devi.",
    },
    {
        id: "05",
        title: "Sundara Kanda",
        subtitle: "Hanuman’s Journey",
        icon: "flight_takeoff",
        sargas: 68,
        description:
            "Hanuman’s leap to Lanka, discovery of Sita, and burning of Lanka.",
    },
    {
        id: "06",
        title: "Yuddha Kanda",
        subtitle: "War with Ravana",
        icon: "swords",
        sargas: 128,
        description:
            "The great war, defeat of Ravana, and return to Ayodhya.",
    },
    {
        id: "07",
        title: "Uttara Kanda",
        subtitle: "Post-war Life",
        icon: "auto_stories",
        sargas: 111,
        description:
            "Rama Rajya, Lava & Kusha, and divine departure.",
    },
];

export default function RamayanamPage() {
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
                                    Home
                                </Link>
                            </li>
                            <li className="text-gray-300">/</li>
                            <li className="text-text-main dark:text-white font-medium">
                                Ramayanam
                            </li>
                        </ol>
                    </nav>

                    {/* Title */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="max-w-3xl">
                            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                                Sri Ramayanam
                            </h1>
                            <p className="text-lg text-text-muted dark:text-gray-300 max-w-2xl">
                                Dive into the eternal epic of duty, devotion, and righteousness.
                                Listen to the sacred Kandas that chronicle the divine journey of
                                Lord Rama, Sita Devi, Lakshmana, and Hanuman.
                            </p>
                        </div>

                        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold">
                            <span className="material-symbols-outlined">headphones</span>
                            7 Kandas available
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
                                    {kanda.sargas} Sargas
                                </span>
                                <button className="flex items-center gap-2 text-primary font-bold text-sm hover:translate-x-1 transition-transform">
                                    Listen Now
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
                        Immerse Yourself in Rama-lila
                    </h2>
                    <p className="text-text-muted max-w-2xl mx-auto mb-8">
                        “Hearing Sri Rama’s pastimes purifies the heart and awakens love for God.”
                    </p>
                    <button className="h-12 px-8 rounded-xl bg-primary hover:bg-yellow-500 font-bold shadow-lg shadow-primary/25">
                        Start with Bala Kanda
                    </button>
                </div>
            </section>
        </>
    );
}
