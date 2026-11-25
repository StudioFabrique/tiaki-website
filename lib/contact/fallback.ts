
import "server-only"

import type { SiteLocale } from "@/lib/i18n/config"
import type { ContactPageContent } from "./types"

import { contactPageSchema } from "./schema"

import fallbackFR from "./fallback.fr.json"
import fallbackES from "./fallback.es.json"

const fallbackContent = {
  fr: contactPageSchema.parse(fallbackFR),
  es: contactPageSchema.parse(fallbackES),
} satisfies Record<SiteLocale, ContactPageContent>

export function getContactPageFallback(
  locale: SiteLocale
): ContactPageContent {
  return fallbackContent[locale]
}
