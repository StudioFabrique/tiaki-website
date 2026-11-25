
import type { z } from "zod"

import type {
  contactHeroSchema,
  contactFAQSchema,
  contactResourcesSchema,
  contactParticipationSchema,
  contactFormSchema,
  contactPageSchema,
} from "./schema"

export type ContactHeroContent =
  z.infer<typeof contactHeroSchema>

export type ContactFAQContent =
  z.infer<typeof contactFAQSchema>

export type ContactResourcesContent =
  z.infer<typeof contactResourcesSchema>

export type ContactParticipationContent =
  z.infer<typeof contactParticipationSchema>

export type ContactFormContent =
  z.infer<typeof contactFormSchema>

export type ContactPageContent =
  z.infer<typeof contactPageSchema>

export type ContactResourceTopic =
  ContactResourcesContent["topics"]["participation"]

export type ParticipationAudienceContent =
  ContactParticipationContent["audiences"]["caregivers"]

export type ParticipationActivityContent =
  ContactParticipationContent["activities"]["experience"]

export type ContactSubjectKey =
  keyof ContactFormContent["subjects"]

export type ContactProfileKey =
  keyof ContactFormContent["profiles"]

export type ContactDiscoveryKey =
  keyof ContactFormContent["discoveryOptions"]
