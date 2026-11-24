import "server-only"

import type { SiteLocale } from "@/lib/i18n/config"

import type { ContactPageContent } from "./types"

export async function getContactPage(
  locale: SiteLocale
): Promise<ContactPageContent> {
  const baseURL = process.env.TIAKI_BACKOFFICE_URL

  if (!baseURL) {
    throw new Error("TIAKI_BACKOFFICE_URL is not configured")
  }

  const url = new URL("/api/globals/contact-page", baseURL)

  url.searchParams.set("locale", locale)
  url.searchParams.set("fallback-locale", "none")

  const response = await fetch(url, {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Contact page: ${response.status}`
    )
  }

  return response.json()
}
