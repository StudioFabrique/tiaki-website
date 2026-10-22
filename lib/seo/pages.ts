import type { RouteKey, SiteLocale } from "@/lib/i18n/config"

type SeoEntry = {
  title: string
  description: string
  indexable?: boolean
}

export const pageSeo = {
  resources: {
    fr: {
      title: "Ressources pour les aidant(e)s",
      description: "Découvrez des ressources et conseils pour accompagner un proche.",
    },
    es: {
      title: "Recursos para personas cuidadoras",
      description: "Descubre recursos y consejos para acompañar a un ser querido.",
    },
  },
  glossary: {
    fr: {
      title: "Glossaire des termes utiles aux aidant(e)s",
      description: "Comprenez les termes liés à l'accompagnement et à la santé.",
    },
    es: {
      title: "Glosario de términos para personas cuidadoras",
      description: "Comprende los términos relacionados con los cuidados y la salud.",
    },
  },

  terms: {
    fr: {
      title: "Conditions générales d'utilisation",
      description: "Consultez les conditions générales d'utilisation du site T-IA-KI et les informations relatives à l'utilisation de ses services.",
    },
    es: {
      title: "Condiciones de uso",
      description: "Consulta las condiciones de uso del sitio web T-IA-KI y la información relativa a la utilización de sus servicios.",
    },
  },

  legal: {
    fr: {
      title: "Mentions légales",
      description: "Consultez les mentions légales du site T-IA-KI, les informations sur son éditeur et les responsabilités relatives à sa publication.",
    },
    es: {
      title: "Aviso legal",
      description: "Consulta el aviso legal del sitio web T-IA-KI, la información sobre su titular y las responsabilidades relativas a su publicación.",
    },
  },
} satisfies Partial<Record<RouteKey, Record<SiteLocale, SeoEntry>>>


export function getPageSeo(
  route: RouteKey,
  locale: SiteLocale
): SeoEntry | undefined {
  const registry: Partial<
    Record<RouteKey, Record<SiteLocale, SeoEntry>>
  > = pageSeo;

  return registry[route]?.[locale];
}

export function isIndexablePage(
  route: RouteKey,
  locale: SiteLocale
): boolean {
  const seo = getPageSeo(route, locale);

  return seo !== undefined && seo.indexable !== false;
}
