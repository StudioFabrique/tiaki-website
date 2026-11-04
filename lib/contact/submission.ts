
import type { ContactFormValues } from "@/lib/contact/validation"

export type ContactSubmissionPayload = ContactFormValues & {
  profile: string | null
  discoverySource: string | null
}
