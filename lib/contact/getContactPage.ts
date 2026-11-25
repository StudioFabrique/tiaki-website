
import "server-only"

import type { SiteLocale } from "@/lib/i18n/config"
import type { ContactPageContent } from "./types"

import { contactPageSchema } from "./schema"
import { getContactPageFallback } from "./fallback"
import { mergeWithFallback } from "./mergeWithFallback"

export async function getContactPage(
  locale: SiteLocale
): Promise<ContactPageContent> {
  const fallback = getContactPageFallback(locale)

  try {
    const baseURL = process.env.TIAKI_BACKOFFICE_URL

    if (!baseURL) {
      throw new Error("TIAKI_BACKOFFICE_URL is not configured")
    }

    const url = new URL("/api/globals/contact-page", baseURL)

    url.searchParams.set("locale", locale)
    url.searchParams.set("fallback-locale", "none")

    const response = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Contact page: ${response.status}`
      )
    }

    const data: unknown = await response.json()

    const result = contactPageSchema.safeParse(data)

    if (result.success) {
      return result.data
    }

    console.warn(
      `[ContactPage][${locale}] Invalid CMS content`,
      result.error.issues.map((issue) => issue.path.join("."))
    )

    const merged = mergeWithFallback(data, fallback)

    return contactPageSchema.parse(merged)
  } catch (error) {
    console.error(
      `[ContactPage][${locale}] Using local fallback`,
      error
    )

    return fallback
  }
}
