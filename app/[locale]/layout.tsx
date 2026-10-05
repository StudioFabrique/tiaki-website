import { notFound } from "next/navigation";

import { AccessibilityProvider } from "@/components/accessibility/AccessibilityProvider";
import { SkipToContent } from "@/components/accessibility/SkipToContent";

import accessibilityFr from "@/content/fr/accessibility.json";
import accessibilityEs from "@/content/es/accessibility.json";

import {
  isSiteLocale,
  locales,
} from "@/lib/i18n/config";

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
    <AccessibilityProvider>
      <SkipToContent
        label={accessibilityContent.skipToContent}
      />

      {children}
    </AccessibilityProvider>
  );
}