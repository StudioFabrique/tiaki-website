
import { z } from "zod"

const requiredText = z.string().trim().min(1)

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
