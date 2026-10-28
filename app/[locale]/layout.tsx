// Police
import "./../globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

import { notFound } from "next/navigation";

import { AccessibilityProvider } from "@/components/accessibility/AccessibilityProvider";
import { SkipToContent } from "@/components/accessibility/SkipToContent";
import { AccessibilityWidget } from "@/components/accessibility/AccessibilityWidget";

import { RouteAwareLocalizedShell } from "@/components/layout/RouteAwareLocalizedShell";

import accessibilityFr from "@/content/fr/accessibility.json";
import accessibilityEs from "@/content/es/accessibility.json";

import {
  isSiteLocale,
  locales,
} from "@/lib/i18n/config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
  }));
}


export async function generateMetadata({ // récupère la langue courante depuis les paramètres de la route
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isSiteLocale(locale)) {
    notFound();
  }

  const isFrench = locale === "fr";

  return {
    metadataBase: new URL("https://www.mytiaki.eu"),

    title: {
      default: isFrench //définit le titre par défaut pour chaque langue
        ? "T-IA-KI — Une plateforme pour les aidant(e)s"
        : "T-IA-KI — Una plataforma para personas cuidadoras",
      template: "%s | T-IA-KI", // permettra plus tard de générer automatiquement des titres tels que Ressources
    },

    description: isFrench //fournit une description adaptée au français ou à l'espagnol
      ? "T-IA-KI est un projet franco-espagnol dédié au soutien des aidant(e)s. Découvrez des ressources et des informations pour accompagner vos proches."
      : "T-IA-KI es un proyecto franco-español dedicado al apoyo de las personas cuidadoras. Descubre recursos e información para acompañar a tus seres queridos.",

    icons: { // conserve les icônes du site.
      icon: "/images/logos/tiaki-icon.svg",
      shortcut: "/images/logos/tiaki-icon.svg",
      apple: "/images/logos/tiaki-icon.svg",
    },
  };
}


export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isSiteLocale(locale)) {
    notFound();
  }

  const accessibilityContent =
    locale === "fr"
      ? accessibilityFr
      : accessibilityEs;

 
return (
  <html lang={locale} className={inter.variable}>
    <body>
      <AccessibilityProvider>
        <SkipToContent
          label={accessibilityContent.skipToContent}
        />

        <AccessibilityWidget
          content={accessibilityContent}
        />

        <RouteAwareLocalizedShell locale={locale}>
          {children}
        </RouteAwareLocalizedShell>
      </AccessibilityProvider>

      <Analytics />
    </body>
  </html>
);

}



// // #ffffff
// // #9fdaba
// // #52bd82
// // #259a5a
// // #1d7746
// // #155633
// // #0d341f
// // #bccfeb
// // #8eabd6
// // #7289ab
// // #586984
// // #404c60
// // #272e3a
// // #f9c481
// // #f1931d
// // #c07617
// // #955b12
// // #6b420d
// // #422808