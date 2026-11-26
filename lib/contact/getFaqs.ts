import "server-only"

import type { SiteLocale } from "@/lib/i18n/config"

import { fetchCms } from "@/lib/cms/client"
import { cmsRegistry } from "@/lib/cms/registry"

import { faqResponseSchema, type FAQ } from "./faqSchema"
import { getFaqFallback } from "./faqFallback"

export type { FAQ } from "./faqSchema"
export type FaqLocale = SiteLocale

export async function getFaqs(locale: FaqLocale): Promise<FAQ[]> {
  try {
    const { endpoint, schema, query } = cmsRegistry.faqs

    const data = await fetchCms(endpoint, {
      locale,
      query,
    })

    return schema.parse(data).docs
  } catch (error) {
    console.error(`[FAQs][${locale}] Using local fallback`, error)

    return getFaqFallback(locale)
  }
}
