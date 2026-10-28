import type { SiteLocale } from "@/lib/i18n/config"
import { contactFaq } from "@/lib/contact/faq"

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

type ContactFAQProps = {
  locale: SiteLocale
}

export function ContactFAQ({ locale }: ContactFAQProps) {
  const isFrench = locale === "fr"

  return (
    <section aria-labelledby="contact-faq-title" className="w-full">
      <h2
        id="contact-faq-title"
        className="mb-6 font-heading text-2xl font-bold text-foreground sm:text-3xl"
      >
        {isFrench ? "Questions fréquentes" : "Preguntas frecuentes"}
      </h2>

      <Accordion className="rounded-2xl border border-border bg-background px-5 sm:px-8">
        {contactFaq[locale].map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="py-5 text-base">
              {item.question}
            </AccordionTrigger>

            <AccordionContent className="pb-5 text-base leading-7 text-muted-foreground">
              <p>{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
