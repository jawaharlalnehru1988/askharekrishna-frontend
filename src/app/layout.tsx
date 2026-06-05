import type { Metadata } from "next";
import { Manrope, Noto_Sans, Inter, Lexend } from "next/font/google";
import "./globals.css";

import { headers } from "next/headers";
import { LanguageProvider } from "@/components/providers/LanguageContext";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { getDictionary, Locale } from "@/lib/dictionaries";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://askharekrishna.com'),
  title: "Ask Hare Krishna - Devotional Articles / Audio",
  description: "Authentic spiritual audio books and transcendental vibrations for your daily devotional life.",
  icons: {
    icon: "/askharekrishnalogo.jpg",
    apple: "/askharekrishnalogo.jpg",
  },
  openGraph: {
    title: "Ask Hare Krishna - Devotional Articles / Audio",
    description: "Authentic spiritual audio books and transcendental vibrations for your daily devotional life.",
    images: [
      {
        url: "/askharekrishnalogo.jpg",
        width: 1200,
        height: 630,
        alt: "Ask Hare Krishna Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ask Hare Krishna - Devotional Articles / Audio",
    description: "Authentic spiritual audio books and transcendental vibrations for your daily devotional life.",
    images: ["/askharekrishnalogo.jpg"],
  },
};

import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const locale = (headersList.get("x-locale") as Locale) || "en";
  const dictionary = await getDictionary(locale);

  return (
    <html lang={locale} className={`dark ${manrope.variable} ${notoSans.variable} ${inter.variable} ${lexend.variable}`} suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{
          __html: `
          (function() {
            try {
              var theme = localStorage.getItem('theme');
              if (!theme || (theme !== 'light' && theme !== 'dark')) {
                theme = 'dark';
              }
              document.documentElement.classList.toggle('dark', theme === 'dark');
              document.documentElement.style.colorScheme = theme;
            } catch (e) {}
          })();
        ` }} />
      </head>
      <body className="antialiased">
        <LanguageProvider locale={locale} dictionary={dictionary}>
          <ThemeProvider>
            {children}
            <WhatsAppButton />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
