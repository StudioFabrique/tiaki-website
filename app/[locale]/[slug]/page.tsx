// SEO
import type { Metadata } from "next"
import {
  getPageSeo,
  isIndexablePage,
} from "@/lib/seo/pages";
import { getSeoAlternates } from "@/lib/seo/metadata"

// PAGES
import { notFound } from "next/navigation"
import { ComingSoonPage } from "@/components/layout/ComingSoonPage"
import { ResourcesPage } from "@/components/resources/ResourcesPage"
import { GlossaryPage } from "@/components/glossary/GlossaryPage"
import { LegalNoticePage } from "@/components/legal/LegalNoticePage"
import { TermsPage } from "@/components/legal/TermsPage"

import {
  getRouteKeyFromSlug,
  isSiteLocale
} from "@/lib/i18n/config"

type LocalizedPageProps = {
  params: Promise<{
    locale: string
    slug: string
  }>

  searchParams: Promise<{
    country?: string
  }>
}

// la fonction generateMetadata() a trois responsabilités :
// 1. Identifier la page et sa langue.
// 2. Récupérer son titre et sa description depuis pageSeo.
// 3. Générer ses URL canoniques et ses variantes linguistiques grâce à getSeoAlternates().

export async function generateMetadata({
  params,
}: LocalizedPageProps): Promise<Metadata> {
  const { locale, slug } = await params

  if (!isSiteLocale(locale)) notFound()

  const routeKey = getRouteKeyFromSlug(locale, slug)

  if (!routeKey) notFound()

const seo = getPageSeo(routeKey, locale);


if (!seo || !isIndexablePage(routeKey, locale)) {
  return {
    ...(seo && {
      title: seo.title,
      description: seo.description,
    }),
    robots: {
      index: false,
      follow: true,
    },
  };
}

  return {
    title: seo.title,
    description: seo.description,
    alternates: getSeoAlternates(routeKey, locale),
  }
}

export default async function LocalizedPage({
  params,
  searchParams,
}: LocalizedPageProps) {
  const { locale, slug } = await params
  const { country } = await searchParams

  // Validate locale
  if (!isSiteLocale(locale)) {
    notFound()
  }

  // Identify current route
  const routeKey = getRouteKeyFromSlug(locale, slug)

  if (!routeKey) {
    notFound()
  }

  // Resources
  if (routeKey === "resources") {
    return <ResourcesPage locale={locale} country={country} />
  }

  // Glossary
  if (routeKey === "glossary") {
    return <GlossaryPage locale={locale} />
  }

  // Terms and conditions
  if (routeKey === "terms") {
    return <TermsPage locale={locale} />
  }

  // Legal notice
  if (routeKey === "legal") {
    return <LegalNoticePage locale={locale} />
  }

  // Pages under development
  return <ComingSoonPage locale={locale} route={routeKey} />
}
