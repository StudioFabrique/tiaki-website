import Image from "next/image"

import type { SiteLocale } from "@/lib/i18n/config"
import { Users, Lightbulb, Presentation } from "lucide-react"
import { contactResourceTopics } from "@/lib/contact/resources"

type ContactResourcesProps = {
  locale: SiteLocale
}

export function ContactResources({ locale }: ContactResourcesProps) {
  const isFrench = locale === "fr"

  return (
    <aside
      aria-labelledby="contact-resources-title"
      className="flex w-full flex-col rounded-2xl border border-border bg-muted/40 p-5 sm:p-8"
    >
      <h2
        id="contact-resources-title"
        className="font-heading text-2xl leading-snug font-bold text-foreground"
      >
        {isFrench
          ? "Comment pouvons-nous vous aider ?"
          : "¿Cómo podemos ayudarte?"}
      </h2>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {isFrench
          ? "Vous souhaitez participer au projet, partager une idée ou découvrir T·IA·KI ? Voici plusieurs possibilités d'échanger avec notre équipe."
          : "¿Quieres participar en el proyecto, compartir una idea o descubrir T·IA·KI? Estas son algunas formas de intercambiar ideas con nuestro equipo."}
      </p>

      <div className="mt-6">
        <ul className="space-y-3">
          {contactResourceTopics[locale].map((item) => (
            <li
              key={item.id}
              className="flex items-start gap-3 rounded-xl border border-border bg-background p-4"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
                {item.id === "participation" && (
                  <Users aria-hidden="true" className="size-5" />
                )}

                {item.id === "suggestion" && (
                  <Lightbulb aria-hidden="true" className="size-5" />
                )}

                {item.id === "demo" && (
                  <Presentation aria-hidden="true" className="size-5" />
                )}
              </span>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-foreground">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Pictogramme décoratif T-IA-KI */}
<div className="mt-auto flex justify-center pt-10">
  <Image
    src="/images/pictos/picto-9-orange.png"
    alt=""
    aria-hidden="true"
    data-a11y-decorative-image
    width={679}
    height={679}
    className="h-auto w-36 object-contain sm:w-44 lg:w-100"
  />
</div>
    </aside>
  )
}
