import Link from "next/link";

const PARVAS = [
    {
        id: "01",
        title: "Adi Parva",
        subtitle: "Book of the Beginning",
        duration: "12 hrs 30 min",
        description:
            "The origins of the Kuru lineage, the birth of the Pandavas and Kauravas, and the growing animosity between the cousins leading to the burning of the lac house.",
    },
    {
        id: "02",
        title: "Sabha Parva",
        subtitle: "Book of the Assembly Hall",
        duration: "8 hrs 15 min",
        description:
            "The establishment of Indraprastha, the fateful game of dice, and the exile of the Pandavas into the forest for thirteen years.",
    },
    {
        id: "03",
        title: "Vana Parva",
        subtitle: "Book of the Forest",
        duration: "18 hrs 45 min",
        description:
            "Also known as Aranya Parva. The twelve years of exile in the forest, featuring many sub-stories including Nala and Damayanti, and Savitri and Satyavan.",
    },
    {
        id: "04",
        title: "Virata Parva",
        subtitle: "Book of Virata",
        duration: "6 hrs 20 min",
        description:
            "The thirteenth year of exile spent in disguise at the court of King Virata. The Pandavas successfully remain undetected.",
    },
    {
        id: "05",
        title: "Udyoga Parva",
        subtitle: "Book of Effort",
        duration: "9 hrs 10 min",
        description:
            "The period of preparation for war. Peace negotiations fail despite Lord Krishna's mission to the Kaurava court.",
    },
    {
        id: "06",
        title: "Bhishma Parva",
        subtitle: "Book of Bhishma",
        duration: "14 hrs 00 min",
        featured: true,
        description:
            "The first ten days of the great war. Contains the divine **Bhagavad Gita** spoken by Lord Krishna to Arjuna. Bhishma falls on a bed of arrows.",
    },
    {
        id: "07",
        title: "Drona Parva",
        subtitle: "Book of Drona",
        duration: "11 hrs 50 min",
        description:
            "Dronacharya commands the Kaurava army. This parva details the brutal war, the death of Abhimanyu, and the fall of Drona.",
    },
    {
        id: "08",
        title: "Karna Parva",
        subtitle: "Book of Karna",
        duration: "8 hrs 30 min",
        description:
            "Karna leads the Kaurava army for two days. The intense rivalry between Karna and Arjuna concludes with Karna's death.",
    },
    {
        id: "09",
        title: "Shalya Parva",
        subtitle: "Book of Shalya",
        duration: "5 hrs 45 min",
        description:
            "The final day of the war. Shalya commands and falls. Duryodhana is defeated by Bhima in a mace duel.",
    },
    {
        id: "10",
        title: "Sauptika Parva",
        subtitle: "Book of Sleeping Warriors",
        duration: "3 hrs 15 min",
        description:
            "Ashwatthama, Kripa, and Kritavarma attack the sleeping Pandava army at night, killing the sons of the Pandavas.",
    },
    {
        id: "11",
        title: "Stri Parva",
        subtitle: "Book of the Women",
        duration: "2 hrs 40 min",
        description:
            "The women of the Kuru and Pandava households lament the death of their husbands, sons, and kinsmen on the battlefield.",
    },
    {
        id: "12",
        title: "Shanti Parva",
        subtitle: "Book of Peace",
        duration: "22 hrs 15 min",
        featured: true,
        description:
            "The longest book. Bhishma, lying on his arrow bed, instructs Yudhishthira on the duties of a king, philosophy, and liberation (Moksha).",
    },
    {
        id: "13",
        title: "Anushasana Parva",
        subtitle: "Book of Instructions",
        duration: "15 hrs 20 min",
        description:
            "Final instructions from Bhishma. Contains the **Vishnu Sahasranama** (Thousand Names of Vishnu). Bhishma leaves his mortal body.",
    },
    {
        id: "14",
        title: "Ashvamedhika Parva",
        subtitle: "Book of the Horse Sacrifice",
        duration: "7 hrs 10 min",
        description:
            "Yudhishthira performs the Ashvamedha Yajna (Horse Sacrifice) to establish supremacy and atone for the war's sins.",
    },
    {
        id: "15",
        title: "Ashramavasika Parva",
        subtitle: "Book of the Hermitage",
        duration: "4 hrs 30 min",
        description:
            "Dhritarashtra, Gandhari, and Kunti leave the palace for the forest (Vanaprastha ashram) and eventually perish in a forest fire.",
    },
    {
        id: "16",
        title: "Mausala Parva",
        subtitle: "Book of the Clubs",
        duration: "3 hrs 50 min",
        description:
            "The fratricidal destruction of the Yadava clan through iron clubs. Lord Krishna ends his incarnation and returns to his abode.",
    },
    {
        id: "17",
        title: "Mahaprasthanika",
        subtitle: "Book of the Great Journey",
        duration: "1 hr 30 min",
        description:
            "The Pandavas renounce their kingdom and begin their final journey towards the Himalayas. Only Yudhishthira reaches the summit with a dog.",
    },
    {
        id: "18",
        title: "Svargarohana Parva",
        subtitle: "Book of the Ascent to Heaven",
        duration: "1 hr 15 min",
        description:
            "Yudhishthira enters heaven. He sees the Kauravas there and his brothers in hell (an illusion/test). Finally, all attain their spiritual abodes.",
    },
];

export default function MahabharatamPage() {
    return (
        <main className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="flex mb-6">
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                    <li className="inline-flex items-center">
                        <Link href="/" className="inline-flex items-center text-sm font-medium text-text-light hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                            Home
                        </Link>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <span className="material-symbols-outlined text-text-light text-sm mx-1">chevron_right</span>
                            <Link href="#" className="text-sm font-medium text-text-light hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                                Audio Books
                            </Link>
                        </div>
                    </li>
                    <li aria-current="page">
                        <div className="flex items-center">
                            <span className="material-symbols-outlined text-text-light text-sm mx-1">chevron_right</span>
                            <span className="text-sm font-medium text-text-main dark:text-white">Mahabharatam</span>
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
                        <span className="px-2 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded">Epic</span>
                        <span className="text-white/80 text-xs font-medium uppercase tracking-wider">• 18 Books</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 tracking-tight leading-tight">
                        Mahabharatam
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl leading-relaxed mb-6">
                        Dive into the timeless wisdom, divine pastimes, and the great war of
                        Kurukshetra. Explore the 18 Parvas that define Dharma.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-full transition-colors shadow-lg shadow-primary/30">
                            <span className="material-symbols-outlined filled">play_arrow</span>
                            Start Listening
                        </button>
                        <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-medium py-3 px-6 rounded-full transition-colors border border-white/30">
                            <span className="material-symbols-outlined">favorite</span>
                            Add to Library
                        </button>
                    </div>
                </div>
            </section>

            {/* Intro */}
            <section className="mb-10 text-center max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-text-main dark:text-white mb-4">
                    Explore the 18 Parvas
                </h2>
                <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    The Mahabharata is organized into eighteen books, known as Parvas. Each book unfolds a crucial phase of
                    the great epic, from the origins of the Kuru dynasty to the final ascent to heaven. Select a Parva below
                    to begin your journey.
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
                                Book {parva.id}
                            </span>
                            {parva.featured ? (
                                <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 px-2 py-0.5 rounded-full">
                                    <span className="material-symbols-outlined text-[12px]">star</span> Featured
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
                                Listen Now <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                            </button>
                        </div>
                    </article>
                ))}
            </section>
        </main>
    );
}
