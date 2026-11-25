
import "server-only"

import type { SiteLocale } from "@/lib/i18n/config"

import { faqResponseSchema, type FAQ } from "./faqSchema"
import { getFaqFallback } from "./faqFallback"

export type { FAQ } from "./faqSchema"
export type FaqLocale = SiteLocale

export async function getFaqs(locale: FaqLocale): Promise<FAQ[]> {
  try {
    const baseURL = process.env.TIAKI_BACKOFFICE_URL

    if (!baseURL) {
      throw new Error("TIAKI_BACKOFFICE_URL is not configured")
    }

    const url = new URL("/api/faqs", baseURL)

    url.searchParams.set("locale", locale)
    url.searchParams.set("fallback-locale", "none")
    url.searchParams.set("where[published][equals]", "true")
    url.searchParams.set("sort", "displayOrder")
    url.searchParams.set("limit", "100")

    const response = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch FAQs: ${response.status}`)
    }

    const data: unknown = await response.json()

    return faqResponseSchema.parse(data).docs

  } catch (error) {
    console.error(
      `[FAQs][${locale}] Using local fallback`,
      error
    )

    return getFaqFallback(locale)
  }
}
