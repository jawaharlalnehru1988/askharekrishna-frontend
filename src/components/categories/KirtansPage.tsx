"use client";

import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";

const KIRTAN_COLLECTIONS = [
    {
        title: "Prabhupada Kirtan",
        description: "Original recordings of Srila Prabhupada leading kirtans around the world. Pure potency.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqagQBWf03w4QT0Y1w3AG0j_30Ydxn9QjiUuZ55plevNKGswiaLCmWRN4JoCV6YOzUDHAxK7uioOop3fFGouh0DKsKiByK-pDA21hxpxrpPnIBsCNR4YeSbtXDslhM4-U4ANdGvIr2NSWEl3NTHiVCBJfxjd7rXPsbXc9uwvMsZQPhJnkitU4JBhJrbilmyOLBc_FRZ5XZSNkMHbso-xgyCvglAZTZ-sZ4zvevBAoet8SIHzg-bgSPe0qLCYYIHqbqtbSZl6k6vBBC",
        icon: "mic_external_on",
        href: "#"
    },
    {
        title: "Raga Based Kirtan",
        description: "Classical renditions of the Mahamantra set to traditional Indian Ragas for deep meditation.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDuLxzN2FrC7fs6qqMzdJGHNdrip8M7xKg0zbMbdMobw-SG9kF66YXZZxnQGo1iuO_sH7FOVRox1ZS44ek08EOMfU5xZBXlPs3G5Zbm9nta75iloH-mMtA6MNuMsd48dcodsk3vurqdRbAf6HH6CJNPpQkqVTYKILQYNvYx5NuJsJS5Jiyu2NuxQHlChNw9diYM5Gym5McUA0ZciPsAQWdGOihySd7HzkVRPhpWD5SpNo9UUc1uZrDBBfJePDD6bBlGx6uTRaBPAYBA",
        icon: "piano",
        href: "#"
    },
    {
        title: "Vaishnava Songs",
        description: "Prayers and bhajans written by the previous Acharyas like Bhaktivinoda Thakura.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBG4uEV64C0LcJb-XH2WvsmJb0Uc4X6zle6L7An012uyfAqEGLiuJs9ufdiNIpdROVSemIlIVaWoaB_QCC8Sy7LrYB58Xxf0Eocpse0ST-3PwiitT9jyhTUwIGWxNMqP_OltpCdhVCaMxeS5JKVGXid01jXSPxHP8CsFcya2vbtszHvIzx9wux7CU9g0om_hFoTGmBXtb3NymJArJFG1OxLxBZmzfD_t6PS8PB4S0CC-CcTOwiGpGN11gW0aoKD6lhqMusshJNCGZDo",
        icon: "lyrics",
        href: "#"
    },
    {
        title: "Devotees Kirtan",
        description: "Ecstatic kirtans led by modern day senior devotees and kirtaniyas worldwide.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhY_NhYKWePf34oB7wsKgQDF5IjaU3WgdzzbrjTS3ns1F6W8yWb0hQZCj98d_vYe02FNG6CA5T-LktpHeVuKwjEpHPEZtpocboX-DLIeS3_BqL3PbkrKqU2FSdrslrYXtD9NjwtQTHnutwd5klsS35nQ4WPe5Z9BZ4yDSAAv2c_YB2YXWEBOAqrn-Z5dn9drBhxOA1MgWtI52f9jLA8n8rSZQgSNl5ZHggjBUZF3j460L_EJMsB4p7OMLRdwxdFmlPYg99hEdZ9BbX",
        icon: "groups",
        href: "#"
    },
    {
        title: "Other Kirtans",
        description: "A diverse collection of various melodies and styles from around the globe.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDexfP40TDoAgtsOXQCcrayS_Zf7CrpEh2HdiPY2KbNl0aL6coVMhkQLDuK4EosMWBU8CRWnf-A6VCnf3DeA971-t6mAE_wucJIM4KEOq_Y7C5eBKqGJ5z9nBsXkSS-J_rYrjmzr4t2te_k8URBZ29M-5nRz3Z1JXYa_h376kGBH3pEoeoFnRpHCJ5gQeYwVNeuecDSz2NVrhS25X6ZZC2_uDU6wX-vGgYagLevRoW5mA7bliFIXlPH0zkSDv81Uj7a3FvbFgJ9EdvQ",
        icon: "library_music",
        href: "#"
    },
    {
        title: "Stotras",
        description: "Sanskrit prayers, shlokas, and invocations for auspiciousness and peace.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvlbYHGCImbGkMwcIWICH_KxMlKHIsbuhY1Zxdg-ysbxgtcZ3QUZDyWEMkNuiGA8kst0BZVZeTCNQOppyP9bow31DYx-Cv7fOfXhSPPjwmBg2NZCwuZ5MbtoSPBZX9JO3A1CmYe7HJaxE44hQfbc1ZQr1DSsZ-Jj14kkVRNEdVPxmBLjkSH37P4_VRcnc6URTM2DhbXpoHg-3ADRtduTV6bviEbLPF5vjEva_sszoljkBln0v5T9Ps1_O4WepidQMNvt77n__zifMT",
        icon: "self_improvement",
        href: "#"
    }
];

export default function KirtansPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-200">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-[#f3efe7] dark:border-neutral-800 transition-colors duration-200">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    <div className="flex items-center justify-between h-20">
                        <Link href="/" className="flex items-center gap-3 text-text-main dark:text-white cursor-pointer group">
                            <div className="size-8 text-primary transition-transform group-hover:scale-110">
                                <span className="material-symbols-outlined text-3xl">temple_hindu</span>
                            </div>
                            <h1 className="text-xl font-bold leading-tight tracking-tight">askharekrishna.com</h1>
                        </Link>

                        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
                            {/* Mega Menu Trigger */}
                            <div className="relative group h-20 flex items-center">
                                <Link href="/ramayanam" className="text-sm font-bold text-text-main dark:text-gray-200 hover:text-primary transition-colors flex items-center gap-1 cursor-pointer">
                                    Ramayanam <span className="material-symbols-outlined text-lg">expand_more</span>
                                </Link>
                                <div className="absolute top-full left-0 w-48 bg-white dark:bg-[#2a2418] shadow-xl rounded-b-xl border border-neutral-100 dark:border-neutral-800 p-2 opacity-0 invisible transform -translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                                    <Link className="block px-4 py-2 text-sm text-text-main dark:text-gray-200 hover:bg-background-light dark:hover:bg-neutral-800 rounded-lg" href="#">Bala Kanda</Link>
                                    <Link className="block px-4 py-2 text-sm text-text-main dark:text-gray-200 hover:bg-background-light dark:hover:bg-neutral-800 rounded-lg" href="#">Ayodhya Kanda</Link>
                                    <Link className="block px-4 py-2 text-sm text-text-main dark:text-gray-200 hover:bg-background-light dark:hover:bg-neutral-800 rounded-lg" href="#">Aranya Kanda</Link>
                                </div>
                            </div>

                            <Link href="/mahabharatam" className="text-sm font-bold text-text-main dark:text-gray-200 hover:text-primary transition-colors cursor-pointer">Mahabharatam</Link>
                            <Link href="/puranams" className="text-sm font-bold text-text-main dark:text-gray-200 hover:text-primary transition-colors cursor-pointer">Puranams</Link>
                            <Link href="/prabhupada" className="text-sm font-bold text-text-main dark:text-gray-200 hover:text-primary transition-colors cursor-pointer">Prabhupada</Link>
                            <Link href="/bhagavad-gita" className="text-sm font-bold text-text-main dark:text-gray-200 hover:text-primary transition-colors cursor-pointer">Bhagavad Gita</Link>
                            <Link href="/kirtans" className="text-sm font-bold text-primary transition-colors cursor-pointer">Kirtans</Link>
                        </nav>

                        <div className="flex items-center gap-3">
                            <button className="hidden md:flex p-2 text-text-main dark:text-white hover:text-primary">
                                <span className="material-symbols-outlined">search</span>
                            </button>
                            <button className="flex items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-primary hover:bg-yellow-500 text-[#1b170d] text-sm font-bold tracking-wide transition-colors shadow-sm">
                                <span className="truncate">Log In</span>
                            </button>
                            <button className="lg:hidden p-2 text-text-main dark:text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                <span className="material-symbols-outlined">menu</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="w-full bg-background-light dark:bg-background-dark">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-10">
                    <div className="relative overflow-hidden rounded-2xl md:rounded-3xl min-h-[400px] flex items-center justify-center text-center p-8 shadow-lg"
                        style={{
                            backgroundImage: `linear-gradient(rgba(34, 28, 16, 0.4), rgba(34, 28, 16, 0.8)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuDPIsGRXR8PvbkG6ZAq3c64SP-oypwcu2SkvwWLXcTrTFPFOOAM48KeD4X8Ma2JdiIX2imkVBKtAnUSowQvzRPu-Ei3QRq4OBtsUwQ0jQ3eZmgAO_QWDrdgfEvGODnZgXmi62iu9e2SO-9JjzxkNumScIJ_bEwVreheEkt7xDU9MJz4WbRnAEFVqHfpQxVQzNl25SdkIoeMH2BLmjdhSZiwVAUlzVZyJCitjgcLqlDwxPEsgA1juXU-kKE3HNbjLzL9bp1FUaoxNy6K')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}>
                        <div className="relative z-10 flex flex-col items-center gap-6 max-w-4xl animate-fade-in-up">
                            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight drop-shadow-md">
                                Transcendental <span className="text-primary">Vibrations</span>
                            </h1>
                            <p className="text-gray-100 text-lg md:text-xl font-medium leading-relaxed max-w-2xl drop-shadow">
                                Cleanse the dust from the mirror of the mind with our curated collection of soul-stirring kirtans and mantras.
                            </p>
                            <div className="flex gap-4 mt-2">
                                <span className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium">
                                    <span className="material-symbols-outlined text-base">headphones</span>
                                    1000+ Tracks
                                </span>
                                <span className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium">
                                    <span className="material-symbols-outlined text-base">favorite</span>
                                    Curated Daily
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Headline */}
            <div className="w-full bg-background-light dark:bg-background-dark pt-8 pb-6">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8 flex justify-between items-end">
                    <div>
                        <h2 className="text-text-main dark:text-white text-2xl md:text-3xl font-bold leading-tight tracking-tight">
                            Kirtan Collections
                        </h2>
                        <p className="text-text-muted dark:text-gray-400 mt-2">
                            Select a category to start listening to the holy names.
                        </p>
                    </div>
                </div>
            </div>

            {/* Topic Grid */}
            <div className="w-full bg-background-light dark:bg-background-dark pb-24">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {KIRTAN_COLLECTIONS.map((collection, index) => (
                            <Link key={index} href={collection.href} className="group relative flex flex-col rounded-2xl bg-white dark:bg-[#2a2418] border border-transparent hover:border-primary/30 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden">
                                <div className="w-full aspect-[16/9] bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                        style={{ backgroundImage: `url('${collection.image}')` }}>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity">
                                    </div>
                                    <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm rounded-full p-2 text-primary border border-white/10">
                                        <span className="material-symbols-outlined text-xl">{collection.icon}</span>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col gap-3 flex-grow">
                                    <h3 className="text-text-main dark:text-white text-xl font-bold group-hover:text-primary transition-colors">
                                        {collection.title}
                                    </h3>
                                    <p className="text-text-muted dark:text-gray-400 text-sm leading-relaxed mb-4">
                                        {collection.description}
                                    </p>
                                    <div className="mt-auto flex items-center gap-2 text-primary font-bold text-sm tracking-wide uppercase group-hover:translate-x-2 transition-transform duration-300">
                                        <span className="material-symbols-outlined">play_circle</span>
                                        Listen Now
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
