
import type { ZodType } from "zod"

import { contactPageSchema } from "../contact/schema"
import { faqResponseSchema } from "../contact/faqSchema"

export type CmsContentDefinition = {
  endpoint: `/api/${string}`
  schema: ZodType
  query?: Record<string, string>
  snapshotPaths: Record<"fr" | "es", string>
}

export const cmsRegistry = {
  contact: {
    endpoint: "/api/globals/contact-page",
    schema: contactPageSchema,
    snapshotPaths: {
      fr: "lib/contact/fallback.fr.json",
      es: "lib/contact/fallback.es.json",
    },
  },

  faqs: {
    endpoint: "/api/faqs",
    schema: faqResponseSchema,
    query: {
      "where[published][equals]": "true",
      sort: "displayOrder",
      limit: "100",
    },
    snapshotPaths: {
      fr: "lib/contact/faq-fallback.fr.json",
      es: "lib/contact/faq-fallback.es.json",
    },
  },
} satisfies Record<string, CmsContentDefinition>

export type CmsContentKey = keyof typeof cmsRegistry
