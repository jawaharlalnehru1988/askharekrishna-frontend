import type { Metadata } from "next";
import { Manrope, Noto_Sans, Inter, Lexend } from "next/font/google";
import "./globals.css";

import { headers } from "next/headers";
import { LanguageProvider } from "@/components/providers/LanguageContext";
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
  title: "Ask Hare Krishna - Devotional Audio",
  description: "Authentic spiritual audio books and transcendental vibrations for your daily devotional life.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const locale = (headersList.get("x-locale") as Locale) || "en";
  const dictionary = await getDictionary(locale);

  return (
    <html lang={locale} className={`${manrope.variable} ${notoSans.variable} ${inter.variable} ${lexend.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <LanguageProvider locale={locale} dictionary={dictionary}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
