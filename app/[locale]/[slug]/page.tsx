
import { notFound } from "next/navigation"

import { ComingSoonPage } from "@/components/layout/ComingSoonPage"
import { ResourcesPage } from "@/components/resources/ResourcesPage"

import { GlossaryPage } from "@/components/glossary/GlossaryPage"
import { LegalNoticePage } from "@/components/legal/LegalNoticePage"
import { TermsPage } from "@/components/legal/TermsPage"

import {
  getRouteKeyFromSlug,
  isSiteLocale,
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
    return (
      <ResourcesPage
        locale={locale}
        country={country}
      />
    )
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
  return (
    <ComingSoonPage
      locale={locale}
      route={routeKey}
    />
  )
}
