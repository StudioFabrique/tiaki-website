import { z } from "zod"
import { requiredText } from "../cms/validation"

export const faqSchema = z.object({
  id: z.union([z.number().int(), requiredText]),
  key: requiredText,
  question: requiredText,
  answer: requiredText,
  displayOrder: z.number().min(0),
  published: z.literal(true),
})

export const faqResponseSchema = z.object({
  docs: z.array(faqSchema),
})

export type FAQ = z.infer<typeof faqSchema>

export type FAQsResponse = z.infer<typeof faqResponseSchema>
