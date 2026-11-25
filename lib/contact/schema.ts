
import { z } from "zod"

const requiredText = z.string().trim().min(1)

export const contactHeroSchema = z.object({
  title: requiredText,
  description: requiredText,
})

export const contactFAQSchema = contactHeroSchema

export const contactResourcesSchema = z.object({
  title: requiredText,
  description: requiredText,
  topics: z.object({
    participation: contactHeroSchema,
    suggestion: contactHeroSchema,
    demo: contactHeroSchema,
  }),
})


const participationAudienceSchema = contactHeroSchema.extend({
  compactTitle: requiredText,
})

export const contactParticipationSchema = z.object({
  title: requiredText,
  description: requiredText,
  audiencesAriaLabel: requiredText,

  audiences: z.object({
    caregivers: participationAudienceSchema,
    professionals: participationAudienceSchema,
    organizations: participationAudienceSchema,
  }),

  activitiesTitle: requiredText,

  activities: z.object({
    experience: contactHeroSchema,
    workshops: contactHeroSchema,
    testing: contactHeroSchema,
    collaboration: contactHeroSchema,
  }),
})


export const contactFormSchema = z.object({
  title: requiredText,

  labels: z.object({
    fullName: requiredText,
    email: requiredText,
    profile: requiredText,
    subject: requiredText,
    message: requiredText,
    discoverySource: requiredText,
    required: requiredText,
    optional: requiredText,
  }),

  placeholders: z.object({
    profile: requiredText,
    subject: requiredText,
    message: requiredText,
    discoverySource: requiredText,
  }),

  subjects: z.object({
    general: requiredText,
    platform: requiredText,
    resources: requiredText,
    content: requiredText,
    participation: requiredText,
    demo: requiredText,
    partnership: requiredText,
    technical: requiredText,
    other: requiredText,
  }),

  profiles: z.object({
    caregiver: requiredText,
    professional: requiredText,
    association: requiredText,
    institution: requiredText,
    other: requiredText,
  }),

  discoveryOptions: z.object({
    google: requiredText,
    searchEngine: requiredText,
    linkedin: requiredText,
    socialMedia: requiredText,
    advertisement: requiredText,
    wordOfMouth: requiredText,
    event: requiredText,
    organization: requiredText,
    other: requiredText,
  }),

  hints: z.object({
    message: requiredText,
    discoverySource: requiredText,
  }),

  messages: z.object({
    validationSuccess: requiredText,
    submissionUnavailable: requiredText,
  }),

  privacyLabel: requiredText,
  submitLabel: requiredText,
})

export const contactPageSchema = z.object({
  hero: contactHeroSchema,
  faqSection: contactFAQSchema,
  contactForm: contactFormSchema,
  resources: contactResourcesSchema,
  participation: contactParticipationSchema,
})