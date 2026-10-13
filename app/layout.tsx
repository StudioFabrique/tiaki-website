import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "T-IA-KI",
  description: "Une plateforme pour les aidant(e)s",

   icons: {
    icon: "/images/logos/tiaki-icon.svg",
    shortcut: "/images/logos/tiaki-icon.svg",
    apple: "/images/logos/tiaki-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body>
        {children}
        <Analytics />
        </body>
    </html>
  );
}

// #ffffff
// #9fdaba
// #52bd82
// #259a5a
// #1d7746
// #155633
// #0d341f
// #bccfeb
// #8eabd6
// #7289ab
// #586984
// #404c60
// #272e3a
// #f9c481
// #f1931d
// #c07617
// #955b12
// #6b420d
// #422808