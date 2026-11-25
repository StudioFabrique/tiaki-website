
import "server-only"

import type { SiteLocale } from "@/lib/i18n/config"

import { faqResponseSchema, type FAQ } from "./faqSchema"

import fallbackFR from "./faq-fallback.fr.json"
import fallbackES from "./faq-fallback.es.json"

const fallbackFaqs = {
  fr: faqResponseSchema.parse(fallbackFR).docs,
  es: faqResponseSchema.parse(fallbackES).docs,
} satisfies Record<SiteLocale, FAQ[]>

export function getFaqFallback(locale: SiteLocale): FAQ[] {
  return fallbackFaqs[locale]
}
