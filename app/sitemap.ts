
import type { MetadataRoute } from "next";

import {
  getLocalizedPath,
  locales,
  type RouteKey,
} from "@/lib/i18n/config";

import {
  pageSeo,
  isIndexablePage,
} from "@/lib/seo/pages";

const baseUrl = "https://www.mytiaki.eu";

const sitemapRoutes: RouteKey[] = [
  "home",
  ...(Object.keys(pageSeo) as RouteKey[]),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapRoutes.flatMap((route) => {
    const activeLocales = locales.filter(
      (locale) =>
        route === "home" || isIndexablePage(route, locale)
    );

    return activeLocales.map((locale) => ({
      url: `${baseUrl}${getLocalizedPath(route, locale)}`,

      alternates: {
        languages: Object.fromEntries(
          activeLocales.map((lang) => [
            lang,
            `${baseUrl}${getLocalizedPath(route, lang)}`,
          ])
        ),
      },
    }));
  });
}
