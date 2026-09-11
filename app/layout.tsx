import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "T-IA-KI",
  description: "Une plateforme pour les aidant.e.s",

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
      <body>{children}</body>
    </html>
  );
}