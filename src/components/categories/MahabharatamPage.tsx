import Link from "next/link";
const PARVAS = [
    {
        id: "01",
        title: "Adi Parva",
        subtitle: "Book of the Beginning",
        duration: "12 hrs 30 min",
        description:
            "Origins of the Kuru dynasty, birth of the Pandavas and Kauravas, and the burning of the lac house.",
    },
    {
        id: "02",
        title: "Sabha Parva",
        subtitle: "Book of the Assembly Hall",
        duration: "8 hrs 15 min",
        description:
            "The game of dice, Draupadi’s humiliation, and the exile of the Pandavas.",
    },
    {
        id: "03",
        title: "Vana Parva",
        subtitle: "Book of the Forest",
        duration: "18 hrs 45 min",
        description:
            "Forest exile stories including Nala–Damayanti and Savitri–Satyavan.",
    },
    {
        id: "04",
        title: "Virata Parva",
        subtitle: "Book of Virata",
        duration: "6 hrs 20 min",
        description:
            "The Pandavas live incognito in King Virata’s court.",
    },
    {
        id: "05",
        title: "Udyoga Parva",
        subtitle: "Book of Effort",
        duration: "9 hrs 10 min",
        description:
            "Preparations for war and Krishna’s peace mission.",
    },
    {
        id: "06",
        title: "Bhishma Parva",
        subtitle: "Book of Bhishma",
        duration: "14 hrs",
        featured: true,
        description:
            "The first ten days of war and the Bhagavad Gita spoken by Krishna.",
    },
    {
        id: "12",
        title: "Shanti Parva",
        subtitle: "Book of Peace",
        duration: "22 hrs 15 min",
        featured: true,
        description:
            "Bhishma’s teachings on Dharma, governance, and Moksha.",
    },
    // (Add remaining Parvas similarly)
];

export default function MahabharatamPage() {
    return (
        <main className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="mb-6 text-sm">
                <ol className="flex items-center space-x-2 text-text-light">
                    <li>
                        <Link href="/" className="hover:text-primary">
                            Home
                        </Link>
                    </li>
                    <li>/</li>
                    <li>
                        <span className="font-medium text-text-main dark:text-white">
                            Mahabharatam
                        </span>
                    </li>
                </ol>
            </nav>

            {/* Hero Section */}
            <section className="relative w-full rounded-2xl overflow-hidden mb-12">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />

                <div
                    className="h-[300px] md:h-[400px] w-full bg-cover bg-center"
                    style={{
                        backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDqwfou2_b49zQTtQpQyoDdDpm4FiKzhWXYM2r17bje8vfE3E4w3zbUDBFq6bUbjfgJuB0becmJ3ghFGZJZ1W0tmQ5UBEOZ1lXIKKCOq35Y48NEOEiJdSgxjG-LUUdKVI-uKYDkkk0ZN-p5EqbbPcnF7voXVR1mrjYU-pA9ELI73RKvvR45FFlVUxtGCHRTn350sPUqfVQFdV2lQI8DNlpjiTJhYnZEcmOq-FReuYctZPyQE_TUhbd3NGfNKx9fSBced2rbH_zvenqb")',
                    }}
                />

                <div className="absolute bottom-0 left-0 z-20 p-6 md:p-10 max-w-4xl">
                    <span className="inline-block mb-2 px-2 py-1 bg-primary text-white text-xs font-bold uppercase rounded">
                        Epic • 18 Parvas
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-3">
                        Mahabharatam
                    </h1>
                    <p className="text-lg text-white/90 max-w-2xl mb-6">
                        Dive into the timeless wisdom, divine pastimes, and the great war of
                        Kurukshetra. Explore the 18 Parvas that define Dharma.
                    </p>
                    <div className="flex gap-4">
                        <button className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-full">
                            Start Listening
                        </button>
                        <button className="bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-full border border-white/30">
                            Add to Library
                        </button>
                    </div>
                </div>
            </section>

            {/* Intro */}
            <section className="mb-10 text-center max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    Explore the 18 Parvas
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                    The Mahabharata unfolds across eighteen books (Parvas), each revealing
                    a crucial phase of Dharma, devotion, conflict, and liberation.
                </p>
            </section>

            {/* Parva Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                {PARVAS.map((parva) => (
                    <article
                        key={parva.id}
                        className="group bg-card-light dark:bg-card-dark rounded-xl border p-5 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all flex flex-col"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <span className="text-xs font-bold text-primary uppercase bg-primary/10 px-2 py-1 rounded">
                                Book {parva.id}
                            </span>
                            {parva.featured && (
                                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                                    Featured
                                </span>
                            )}
                        </div>

                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                            {parva.title}
                        </h3>
                        <h4 className="text-sm italic text-text-light mb-3">
                            {parva.subtitle}
                        </h4>

                        <p className="text-sm text-gray-600 dark:text-gray-300 flex-grow line-clamp-3">
                            {parva.description}
                        </p>

                        <div className="pt-4 mt-4 border-t border-dashed flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                                🎧 {parva.duration}
                            </span>
                            <button className="text-primary font-bold text-sm group-hover:translate-x-1 transition-transform">
                                Listen Now →
                            </button>
                        </div>
                    </article>
                ))}
            </section>
        </main>
    );
}
