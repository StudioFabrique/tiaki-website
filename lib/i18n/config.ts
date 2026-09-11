export const locales = ["fr", "es"] as const;

export type SiteLocale = (typeof locales)[number];

export const defaultLocale: SiteLocale = "fr";

export const routes = {
  home: {
    fr: "",
    es: "",
  },
  platform: {
    fr: "plateforme",
    es: "plataforma",
  },
  about: {
    fr: "a-propos",
    es: "sobre-tiaki",
  },
  contact: {
    fr: "contact",
    es: "contacto",
  },
} as const;

export type RouteKey = keyof typeof routes;

export function isSiteLocale(value: string): value is SiteLocale {
  return locales.includes(value as SiteLocale);
}

export function getLocalizedPath(
  route: RouteKey,
  locale: SiteLocale
) {
  const slug = routes[route][locale];

  return slug ? `/${locale}/${slug}` : `/${locale}`;
}

export function getRouteKeyFromSlug(
  locale: SiteLocale,
  slug: string
): RouteKey | null {
  for (const routeKey of Object.keys(routes) as RouteKey[]) {
    if (routes[routeKey][locale] === slug) {
      return routeKey;
    }
  }

  return null;
}