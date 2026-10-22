
import type { Metadata } from "next";

import {
  getLocalizedPath,
  locales,
  type RouteKey,
  type SiteLocale,
} from "@/lib/i18n/config";

import { isIndexablePage } from "@/lib/seo/pages";

export function getSeoAlternates(
  route: RouteKey,
  locale: SiteLocale
): NonNullable<Metadata["alternates"]> {
  const activeLocales = locales.filter(
    (lang) =>
      route === "home" || isIndexablePage(route, lang)
  );

  return {
    canonical: getLocalizedPath(route, locale),

    languages: Object.fromEntries(
      activeLocales.map((lang) => [
        lang,
        getLocalizedPath(route, lang),
      ])
    ),
  };
}
