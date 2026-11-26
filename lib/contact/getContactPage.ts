
import "server-only"

import type { SiteLocale } from "@/lib/i18n/config"
import type { ContactPageContent } from "./types"

import { fetchCms } from "@/lib/cms/client"
import { cmsRegistry } from "@/lib/cms/registry"
import { mergeWithFallback } from "@/lib/cms/mergeWithFallback"

import { getContactPageFallback } from "./fallback"

export async function getContactPage(
  locale: SiteLocale,
): Promise<ContactPageContent> {
  const fallback = getContactPageFallback(locale)
  const { endpoint, schema } = cmsRegistry.contact

  try {
    const data = await fetchCms(endpoint, { locale })

    const result = schema.safeParse(data)

    if (result.success) {
      return result.data
    }

    console.warn(
      `[ContactPage][${locale}] Invalid CMS content`,
      result.error.issues.map((issue) => issue.path.join(".")),
    )

    const merged = mergeWithFallback(data, fallback)

    return schema.parse(merged)
  } catch (error) {
    console.error(
      `[ContactPage][${locale}] Using local fallback`,
      error,
    )

    return fallback
  }
}
