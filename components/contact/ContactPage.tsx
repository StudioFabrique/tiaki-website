import type { SiteLocale } from "@/lib/i18n/config"
import { Separator } from "@/components/ui/separator"

import { getContactUI } from "@/lib/contact/contact"

import { Container } from "@/components/layout/Container"
import { ContactHero } from "@/components/contact/ContactHero"
import { ContactForm } from "@/components/contact/ContactForm"
import { ContactFAQ } from "@/components/contact/ContactFAQ"
import { ContactResources } from "@/components/contact/ContactResources"

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

      <section className="pb-16 sm:pb-24">
        <Container>
          <div className="grid items-stretch gap-6 lg:grid-cols-3">
            {/* Colonne gauche : FAQ + formulaire */}
            <div className="min-w-0 rounded-2xl border border-border bg-background p-5 sm:p-8 lg:col-span-2">
              {/* FAQ */}
              <ContactFAQ locale={locale} />

              {/* Formulaire */}
              <section aria-labelledby="contact-form-title" className="mt-10">
                <Separator
                  orientation="horizontal"
                  className="my-8 h-px w-full bg-border"
                />
                <ContactForm locale={locale} />
              </section>
            </div>

            {/* Colonne droite : informations utiles */}
            <ContactResources locale={locale} />
          </div>
        </Container>
      </section>
    </>
  )
}
