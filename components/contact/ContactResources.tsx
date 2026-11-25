import Image from "next/image"

import type { ContactResourcesContent } from "@/lib/contact/types"
import { Users, Lightbulb, Presentation } from "lucide-react"

type ContactResourcesProps = {
  content: ContactResourcesContent
}

export function ContactResources({ content }: ContactResourcesProps) {
  const topics = (["participation", "suggestion", "demo"] as const).map(
    (id) => ({
      id,
      ...content.topics[id],
    })
  )

  return (
    <aside
      aria-labelledby="contact-resources-title"
      className="flex w-full flex-col rounded-2xl border border-border bg-muted/40 p-5 sm:p-8"
    >
      <h2
        id="contact-resources-title"
        className="font-heading text-2xl leading-snug font-bold text-foreground"
      >
        {content.title}
      </h2>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {content.description}
      </p>

      <div className="mt-6">
        <ul className="space-y-3">
          {topics.map((item) => (
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
          alt="pictogram de personnne travaillant sur ordinateur"
          aria-hidden="true"
          data-a11y-decorative-image
          width={679}
          height={679}
          className="h-auto w-36 object-contain sm:w-44 lg:w-30"
        />
      </div>
    </aside>
  )
}
