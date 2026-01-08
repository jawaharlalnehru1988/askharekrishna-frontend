import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

interface Category {
  title: string;
  description: string;
  backgroundImage: string;
  icon: string;
  href: string;
}

export default function Home() {
  const categories: Category[] = [
    {
      title: "Ramayanam",
      description: "The epic journey of Lord Rama, the ideal king and human.",
      backgroundImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBG4uEV64C0LcJb-XH2WvsmJb0Uc4X6zle6L7An012uyfAqEGLiuJs9ufdiNIpdROVSemIlIVaWoaB_QCC8Sy7LrYB58Xxf0Eocpse0ST-3PwiitT9jyhTUwIGWxNMqP_OltpCdhVCaMxeS5JKVGXid01jXSPxHP8CsFcya2vbtszHvIzx9wux7CU9g0om_hFoTGmBXtb3NymJArJFG1OxLxBZmzfD_t6PS8PB4S0CC-CcTOwiGpGN11gW0aoKD6lhqMusshJNCGZDo",
      icon: "history_edu",
      href: "/ramayanam"
    },
    {
      title: "Mahabharatam",
      description: "The history of Greater India and the Kurukshetra war.",
      backgroundImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBeuBgGhjAJ1wr4d92FRI2aiPdgT3mlgP2o0NnGeKpw-GXxx9fO58GR8rgvJsWmGsEqDZcCJXVCyppcxUYKmHgzwOhz6HxLnZEwuTtYDOnVZxEVlBW266xnsEDOg9eDJEKgIhrugMsgQhvgxXUoX3TuRitu8jfMv26WxyECVq4oFRKgFwONyHp8jxtetFVY2d0Lfvdy6Op3usKlSHqg9mKNsmWKKQKLwVmMZf5rzZolHckZDHhPsbycx4IhCI5ts5dQ0V5enO4fBngo",
      icon: "swords",
      href: "/mahabharatam"
    },
    {
      title: "Puranams",
      description: "Ancient histories of the universe and divine avatars.",
      backgroundImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhY_NhYKWePf34oB7wsKgQDF5IjaU3WgdzzbrjTS3ns1F6W8yWb0hQZCj98d_vYe02FNG6CA5T-LktpHeVuKwjEpHPEZtpocboX-DLIeS3_BqL3PbkrKqU2FSdrslrYXtD9NjwtQTHnutwd5klsS35nQ4WPe5Z9BZ4yDSAAv2c_YB2YXWEBOAqrn-Z5dn9drBhxOA1MgWtI52f9jLA8n8rSZQgSNl5ZHggjBUZF3j460L_EJMsB4p7OMLRdwxdFmlPYg99hEdZ9BbX",
      icon: "auto_stories",
      href: "/puranams"
    },
    {
      title: "Prabhupada Teachings",
      description: "Lectures by His Divine Grace A.C. Bhaktivedanta Swami.",
      backgroundImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqagQBWf03w4QT0Y1w3AG0j_30Ydxn9QjiUuZ55plevNKGswiaLCmWRN4JoCV6YOzUDHAxK7uioOop3fFGouh0DKsKiByK-pDA21hxpxrpPnIBsCNR4YeSbtXDslhM4-U4ANdGvIr2NSWEl3NTHiVCBJfxjd7rXPsbXc9uwvMsZQPhJnkitU4JBhJrbilmyOLBc_FRZ5XZSNkMHbso-xgyCvglAZTZ-sZ4zvevBAoet8SIHzg-bgSPe0qLCYYIHqbqtbSZl6k6vBBC",
      icon: "record_voice_over",
      // Note: "Prabhupada Teachings" doesn't have a direct match in categories.ts list which has "prabhupada" in reference.html nav?
      // Wait, list in categories.ts is: ["ramayanam", "mahabharatam", "puranams", "bhagavad-gita", "kirtans", "faqs"]
      // "Prabhupada Teachings" is missing from categories.ts list provided by user?
      // User list: ["ramayanam", "mahabharatam", "puranams", "bhagavad-gita", "kirtans", "faqs"]
      // Step 72 user request: export const categories = [ "ramayanam", "mahabharatam", "puranams", "bhagavad-gita", "kirtans", "faqs" ];
      // It seems "Prabhupada Teachings" card (index 3 in page.tsx) doesn't have a corresponding route in the user's provided list!
      // I will leave it as "#" or map it to something if I can, but strict interpretation says it's not supported yet.
      // Actually, looking at reference.html nav: Ramayanam, Mahabharatam, Puranams, Prabhupada, Bhagavad Gita, Kirtans.
      // So "Prabhupada" is likely the intent. But it's NOT in `categories.ts`.
      // I will set it to "#" or "/prabhupada" but be aware it might 404.
      // Let's stick to the generated list. The user list does NOT include prabhupada.
      href: "#"
    },
    {
      title: "Bhagavad Gita",
      description: "The divine song of God. The manual for life.",
      backgroundImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDexfP40TDoAgtsOXQCcrayS_Zf7CrpEh2HdiPY2KbNl0aL6coVMhkQLDuK4EosMWBU8CRWnf-A6VCnf3DeA971-t6mAE_wucJIM4KEOq_Y7C5eBKqGJ5z9nBsXkSS-J_rYrjmzr4t2te_k8URBZ29M-5nRz3Z1JXYa_h376kGBH3pEoeoFnRpHCJ5gQeYwVNeuecDSz2NVrhS25X6ZZC2_uDU6wX-vGgYagLevRoW5mA7bliFIXlPH0zkSDv81Uj7a3FvbFgJ9EdvQ",
      icon: "menu_book",
      href: "/bhagavad-gita"
    },
    {
      title: "Kirtans",
      description: "Soul-stirring musical chants and mantras.",
      backgroundImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDuLxzN2FrC7fs6qqMzdJGHNdrip8M7xKg0zbMbdMobw-SG9kF66YXZZxnQGo1iuO_sH7FOVRox1ZS44ek08EOMfU5xZBXlPs3G5Zbm9nta75iloH-mMtA6MNuMsd48dcodsk3vurqdRbAf6HH6CJNPpQkqVTYKILQYNvYx5NuJsJS5Jiyu2NuxQHlChNw9diYM5Gym5McUA0ZciPsAQWdGOihySd7HzkVRPhpWD5SpNo9UUc1uZrDBBfJePDD6bBlGx6uTRaBPAYBA",
      icon: "music_note",
      href: "/kirtans"
    },
    {
      title: "FAQs",
      description: "Answers to common spiritual questions.",
      backgroundImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvlbYHGCImbGkMwcIWICH_KxMlKHIsbuhY1Zxdg-ysbxgtcZ3QUZDyWEMkNuiGA8kst0BZVZeTCNQOppyP9bow31DYx-Cv7fOfXhSPPjwmBg2NZCwuZ5MbtoSPBZX9JO3A1CmYe7HJaxE44hQfbc1ZQr1DSsZ-Jj14kkVRNEdVPxmBLjkSH37P4_VRcnc6URTM2DhbXpoHg-3ADRtduTV6bviEbLPF5vjEva_sszoljkBln0v5T9Ps1_O4WepidQMNvt77n__zifMT",
      icon: "live_help",
      href: "/faqs"
    }
  ];


  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-200">
      <Navbar />

      {/* Hero Section */}
      <div className="w-full bg-background-light dark:bg-background-dark">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-10">
          <div
            className="relative overflow-hidden rounded-2xl md:rounded-3xl min-h-[500px] flex items-center justify-center text-center p-8 shadow-lg bg-cover bg-center"
            style={{
              backgroundImage: "linear-gradient(rgba(34, 28, 16, 0.3), rgba(34, 28, 16, 0.7)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuDPIsGRXR8PvbkG6ZAq3c64SP-oypwcu2SkvwWLXcTrTFPFOOAM48KeD4X8Ma2JdiIX2imkVBKtAnUSowQvzRPu-Ei3QRq4OBtsUwQ0jQ3eZmgAO_QWDrdgfEvGODnZgXmi62iu9e2SO-9JjzxkNumScIJ_bEwVreheEkt7xDU9MJz4WbRnAEFVqHfpQxVQzNl25SdkIoeMH2BLmjdhSZiwVAUlzVZyJCitjgcLqlDwxPEsgA1juXU-kKE3HNbjLzL9bp1FUaoxNy6K')"
            }}
          >
            <div className="relative z-10 flex flex-col items-center gap-6 max-w-3xl animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-medium tracking-wider uppercase mb-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Live Kirtan Available
              </div>
              <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight drop-shadow-md">
                Listen. Reflect.<br /> <span className="text-primary">Connect with Krishna.</span>
              </h1>
              <p className="text-gray-100 text-lg md:text-xl font-medium leading-relaxed max-w-2xl drop-shadow">
                Authentic spiritual audio books and transcendental vibrations for your daily devotional life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center">
                <button className="flex items-center justify-center rounded-xl h-12 md:h-14 px-8 bg-primary hover:bg-yellow-500 text-[#1b170d] text-base font-bold tracking-wide transition-all hover:scale-105 shadow-lg shadow-primary/25 cursor-pointer">
                  <span className="material-symbols-outlined mr-2">play_circle</span>
                  Start Listening
                </button>
                <button className="flex items-center justify-center rounded-xl h-12 md:h-14 px-8 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white text-base font-bold tracking-wide transition-all cursor-pointer">
                  Explore Library
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Header */}
      <div className="w-full bg-background-light dark:bg-background-dark pt-8 pb-4">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 flex justify-between items-end">
          <div>
            <h2 className="text-text-main dark:text-white text-2xl md:text-3xl font-bold leading-tight tracking-tight">Audio Categories</h2>
            <p className="text-text-muted dark:text-gray-400 mt-2">Explore our collection of transcendental literature.</p>
          </div>
          <Link href="#" className="hidden sm:flex text-primary hover:text-yellow-600 font-bold text-sm items-center gap-1">
            View All <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="w-full bg-background-light dark:bg-background-dark pb-20">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {categories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="group flex flex-col gap-4 p-4 rounded-2xl bg-white dark:bg-[#2a2418] border border-transparent hover:border-primary/30 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
              >
                <div className="w-full aspect-[4/3] bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden relative">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url('${category.backgroundImage}')` }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <span className="material-symbols-outlined text-3xl mb-1 text-primary">
                      {category.icon}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-text-main dark:text-white text-lg font-bold group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-text-muted dark:text-gray-400 text-sm mt-1 line-clamp-2">
                    {category.description}
                  </p>
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
