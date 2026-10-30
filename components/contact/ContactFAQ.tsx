import type { SiteLocale } from "@/lib/i18n/config"
import { contactFaq } from "@/lib/contact/faq"
import { Container } from "@/components/layout/Container"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

// type ContactFAQProps = {
//   locale: SiteLocale
// }

export function ContactFAQ({ locale }: { locale: SiteLocale }) {
  const questions = contactFaq[locale]
  const midpoint = Math.ceil(questions.length / 2)

  const columns = [questions.slice(0, midpoint), questions.slice(midpoint)]

  return (
    <section aria-labelledby="contact-faq-title" className="pb-16 sm:pb-24">
      <Container>
        <div className="grid gap-8 rounded-3xl border border-border bg-background p-6 sm:p-8 lg:grid-cols-3 lg:gap-10 lg:p-10">
          {/* Colonne 1 : titre et introduction */}
          <div className="max-w-sm">
            <h2
              id="contact-faq-title"
              className="font-heading text-2xl font-bold text-foreground sm:text-3xl"
            >
              {locale === "fr"
                ? "Questions fréquentes"
                : "Preguntas frecuentes"}
            </h2>

            <p className="mt-4 text-base leading-7 text-muted-foreground">
              {locale === "fr"
                ? "Vous vous posez des questions sur T-IA-KI ? Retrouvez ici les réponses aux interrogations les plus fréquentes concernant le projet, la plateforme et les possibilités de participation."
                : "¿Tienes preguntas sobre T-IA-KI? Encuentra aquí respuestas a las preguntas más frecuentes sobre el proyecto, la plataforma y las posibilidades de participación."}
            </p>
          </div>

          {/* Colonnes 2 et 3 : questions */}
          <div className="min-w-0 lg:col-span-2">
            <div className="grid gap-3 md:grid-cols-2 md:gap-4">
              {columns.map((column, index) => (
                <Accordion key={index} className="flex min-w-0 flex-col gap-3">
                  {column.map((item) => (
                    <AccordionItem
                      key={item.id}
                      value={item.id}

                      className="rounded-xl border border-border bg-background px-4 transition-colors duration-200 focus-within:border-primary/60 hover:border-primary/40 motion-reduce:transition-none"
                    >
                      <AccordionTrigger className="text-left font-heading text-sm font-semibold text-foreground">
                        {item.question}
                      </AccordionTrigger>

                      <AccordionContent>
                        <p className="pb-4 text-sm leading-6 text-muted-foreground">
                          {item.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
