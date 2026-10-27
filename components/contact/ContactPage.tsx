import { ContactHero } from "@/components/contact/ContactHero"
import { ContactForm } from "@/components/contact/ContactForm"
import { Container } from "@/components/layout/Container"
import { getContactUI } from "@/lib/contact/contact"
import type { SiteLocale } from "@/lib/i18n/config"

type ContactPageProps = {
  locale: SiteLocale
}

export function ContactPage({ locale }: ContactPageProps) {
  const content = getContactUI(locale)

  return (
    <>
      <ContactHero
        title={content.hero.title}
        description={content.hero.description}
      />

      <section aria-labelledby="contact-form-title" className="pb-16 sm:pb-24">
        <Container>
          <div className="mx-auto w-full max-w-2xl rounded-2xl border border-border bg-background p-5 sm:p-8">
            <h2
              id="contact-form-title"
              className="mb-8 font-heading text-2xl font-bold text-foreground sm:text-3xl"
            >
              {locale === "fr"
                ? "Envoyez-nous un message"
                : "Envíanos un mensaje"}
            </h2>

            <ContactForm locale={locale} />
          </div>
        </Container>
      </section>
    </>
  )
}
