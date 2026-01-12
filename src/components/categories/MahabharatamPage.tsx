import Link from "next/link";
import { getDictionary } from "@/lib/dictionaries";

export default function MahabharatamPage({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>> }) {
    const { mahabharatam: m, common: c } = dictionary;

    const PARVAS = [
        {
            id: "01",
            title: m.parvas.p01.title,
            subtitle: m.parvas.p01.subtitle,
            duration: "12 hrs 30 min",
            description: m.parvas.p01.description,
        },
        {
            id: "02",
            title: m.parvas.p02.title,
            subtitle: m.parvas.p02.subtitle,
            duration: "8 hrs 15 min",
            description: m.parvas.p02.description,
        },
        {
            id: "03",
            title: m.parvas.p03.title,
            subtitle: m.parvas.p03.subtitle,
            duration: "18 hrs 45 min",
            description: m.parvas.p03.description,
        },
        {
            id: "04",
            title: m.parvas.p04.title,
            subtitle: m.parvas.p04.subtitle,
            duration: "6 hrs 20 min",
            description: m.parvas.p04.description,
        },
        {
            id: "05",
            title: m.parvas.p05.title,
            subtitle: m.parvas.p05.subtitle,
            duration: "9 hrs 10 min",
            description: m.parvas.p05.description,
        },
        {
            id: "06",
            title: m.parvas.p06.title,
            subtitle: m.parvas.p06.subtitle,
            duration: "14 hrs 00 min",
            featured: true,
            description: m.parvas.p06.description,
        },
        {
            id: "07",
            title: m.parvas.p07.title,
            subtitle: m.parvas.p07.subtitle,
            duration: "11 hrs 50 min",
            description: m.parvas.p07.description,
        },
        {
            id: "08",
            title: m.parvas.p08.title,
            subtitle: m.parvas.p08.subtitle,
            duration: "8 hrs 30 min",
            description: m.parvas.p08.description,
        },
        {
            id: "09",
            title: m.parvas.p09.title,
            subtitle: m.parvas.p09.subtitle,
            duration: "5 hrs 45 min",
            description: m.parvas.p09.description,
        },
        {
            id: "10",
            title: m.parvas.p10.title,
            subtitle: m.parvas.p10.subtitle,
            duration: "3 hrs 15 min",
            description: m.parvas.p10.description,
        },
        {
            id: "11",
            title: m.parvas.p11.title,
            subtitle: m.parvas.p11.subtitle,
            duration: "2 hrs 40 min",
            description: m.parvas.p11.description,
        },
        {
            id: "12",
            title: m.parvas.p12.title,
            subtitle: m.parvas.p12.subtitle,
            duration: "22 hrs 15 min",
            featured: true,
            description: m.parvas.p12.description,
        },
        {
            id: "13",
            title: m.parvas.p13.title,
            subtitle: m.parvas.p13.subtitle,
            duration: "15 hrs 20 min",
            description: m.parvas.p13.description,
        },
        {
            id: "14",
            title: m.parvas.p14.title,
            subtitle: m.parvas.p14.subtitle,
            duration: "7 hrs 10 min",
            description: m.parvas.p14.description,
        },
        {
            id: "15",
            title: m.parvas.p15.title,
            subtitle: m.parvas.p15.subtitle,
            duration: "4 hrs 30 min",
            description: m.parvas.p15.description,
        },
        {
            id: "16",
            title: m.parvas.p16.title,
            subtitle: m.parvas.p16.subtitle,
            duration: "3 hrs 50 min",
            description: m.parvas.p16.description,
        },
        {
            id: "17",
            title: m.parvas.p17.title,
            subtitle: m.parvas.p17.subtitle,
            duration: "1 hr 30 min",
            description: m.parvas.p17.description,
        },
        {
            id: "18",
            title: m.parvas.p18.title,
            subtitle: m.parvas.p18.subtitle,
            duration: "1 hr 15 min",
            description: m.parvas.p18.description,
        },
    ];

    return (
        <main className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="flex mb-6">
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                    <li className="inline-flex items-center">
                        <Link href="/" className="inline-flex items-center text-sm font-medium text-text-light hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                            {c.home}
                        </Link>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <span className="material-symbols-outlined text-text-light text-sm mx-1">chevron_right</span>
                            <Link href="#" className="text-sm font-medium text-text-light hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                                {m.introText.split(' ')[0]} {/* Placeholder for category title if needed, but let's just stick to m.title or similar */}
                                Audio Books
                            </Link>
                        </div>
                    </li>
                    <li aria-current="page">
                        <div className="flex items-center">
                            <span className="material-symbols-outlined text-text-light text-sm mx-1">chevron_right</span>
                            <span className="text-sm font-medium text-text-main dark:text-white">{m.title}</span>
                        </div>
                    </li>
                </ol>
            </nav>

            {/* Hero Section */}
            <section className="relative w-full rounded-2xl overflow-hidden mb-12 group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />

                <div
                    className="h-[300px] md:h-[400px] w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{
                        backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDqwfou2_b49zQTtQpQyoDdDpm4FiKzhWXYM2r17bje8vfE3E4w3zbUDBFq6bUbjfgJuB0becmJ3ghFGZJZ1W0tmQ5UBEOZ1lXIKKCOq35Y48NEOEiJdSgxjG-LUUdKVI-uKYDkkk0ZN-p5EqbbPcnF7voXVR1mrjYU-pA9ELI73RKvvR45FFlVUxtGCHRTn350sPUqfVQFdV2lQI8DNlpjiTJhYnZEcmOq-FReuYctZPyQE_TUhbd3NGfNKx9fSBced2rbH_zvenqb")',
                    }}
                />

                <div className="absolute bottom-0 left-0 z-20 p-6 md:p-10 w-full max-w-4xl">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded">{m.epic}</span>
                        <span className="text-white/80 text-xs font-medium uppercase tracking-wider">• {m.parvasCount}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 tracking-tight leading-tight">
                        {m.title}
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl leading-relaxed mb-6">
                        {m.description}
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-full transition-colors shadow-lg shadow-primary/30">
                            <span className="material-symbols-outlined filled">play_arrow</span>
                            {m.startListening}
                        </button>
                        <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-medium py-3 px-6 rounded-full transition-colors border border-white/30">
                            <span className="material-symbols-outlined">favorite</span>
                            {m.addToLibrary}
                        </button>
                    </div>
                </div>
            </section>

            {/* Intro */}
            <section className="mb-10 text-center max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-text-main dark:text-white mb-4">
                    {m.exploreParvas}
                </h2>
                <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    {m.introText}
                </p>
            </section>

            {/* Parva Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-20">
                {PARVAS.map((parva) => (
                    <article
                        key={parva.id}
                        className={`group bg-card-light dark:bg-card-dark rounded-xl border border-[#f3efe7] dark:border-[#332d22] p-5 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col h-full relative overflow-hidden ${parva.featured ? 'ring-1 ring-primary/20' : ''}`}
                    >
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary/0 group-hover:bg-primary transition-all duration-300"></div>

                        <div className="flex justify-between items-start mb-3">
                            <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded">
                                {m.bookLabel.replace("{id}", parva.id)}
                            </span>
                            {parva.featured ? (
                                <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 px-2 py-0.5 rounded-full">
                                    <span className="material-symbols-outlined text-[12px]">star</span> {m.featured}
                                </span>
                            ) : (
                                <button className="text-gray-400 hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">bookmark_add</span>
                                </button>
                            )}
                        </div>

                        <h3 className="text-xl font-bold text-text-main dark:text-white mb-1 group-hover:text-primary transition-colors">
                            {parva.title}
                        </h3>
                        <h4 className="text-sm font-medium text-text-light dark:text-primary/80 mb-3 italic">
                            {parva.subtitle}
                        </h4>

                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 flex-grow leading-relaxed line-clamp-3">
                            {parva.description}
                        </p>

                        <div className="pt-4 border-t border-dashed border-[#f3efe7] dark:border-[#332d22] flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <span className="material-symbols-outlined text-[16px]">headphones</span>
                                <span>{parva.duration}</span>
                            </div>
                            <button className="flex items-center gap-1.5 text-sm font-bold text-primary group-hover:translate-x-1 transition-transform">
                                {m.listenNow} <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                            </button>
                        </div>
                    </article>
                ))}
            </section>
        </main>
    );
}
