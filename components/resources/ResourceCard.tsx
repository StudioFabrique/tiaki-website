import Link from "next/link"
import { BadgeCheck, ExternalLink, Languages, MapPin } from "lucide-react"

import { getResourcesUI } from "@/lib/content/resources"
import type { SiteLocale } from "@/lib/i18n/config"
import type { Resource } from "@/lib/resources/types"

type ResourceCardProps = {
  resource: Resource
  locale: SiteLocale
  showTranslationStatus?: boolean
}

function formatVerifiedDate(date: string, locale: SiteLocale) {
  const [year, month, day] = date.split("-").map(Number)

  if (!year || !month || !day) {
    return date
  }

  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)))
}

export function ResourceCard({
  resource,
  locale,
  showTranslationStatus = false,
}: ResourceCardProps) {
  const content = getResourcesUI(locale)

  const localizedContent =
    resource.content[locale] ?? resource.content[resource.sourceLanguage]

  if (!localizedContent) {
    return null
  }

  const isTranslation =
    locale !== resource.sourceLanguage && Boolean(resource.content[locale])

  const translationStatus = isTranslation
    ? resource.translationStatus[locale]
    : undefined

  const visibleTopics = resource.topics.slice(0, 2)

  const remainingTopics = Math.max(
    resource.topics.length - visibleTopics.length,
    0
  )

  return (
    <article className="flex h-full flex-col rounded-[1.5rem] border border-foreground/10 bg-background p-6 transition-shadow duration-200 hover:shadow-md sm:p-7">
      {/* Type + official status */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-tiaki-blue/25 px-3 py-1.5 font-heading text-xs font-semibold">
          {content.kinds[resource.kind]}
        </span>

        {resource.official && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-tiaki-green/10 px-3 py-1.5 font-heading text-xs font-semibold text-tiaki-green">
            <BadgeCheck aria-hidden="true" className="size-3.5" />

            {content.card.official}
          </span>
        )}

        {showTranslationStatus &&
          translationStatus &&
          translationStatus !== "original" && (
            <span
              className={[
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5",
                "font-heading text-xs font-semibold",
                translationStatus === "reviewed"
                  ? "bg-tiaki-green/10 text-tiaki-green"
                  : "bg-tiaki-orange/15 text-foreground/70",
              ].join(" ")}
            >
              <Languages aria-hidden="true" className="size-3.5" />

              {content.translation[translationStatus]}
            </span>
          )}
      </div>

      {/* Main information */}
      <div className="mt-6">
        <h2 className="font-heading text-2xl leading-tight font-semibold tracking-[-0.025em]">
          {localizedContent.title}
        </h2>

        {resource.organization && (
          <p className="mt-2 font-heading text-sm font-semibold text-foreground/50">
            {resource.organization}
          </p>
        )}

        <p className="mt-5 leading-7 text-foreground/65">
          {localizedContent.description}
        </p>
      </div>

      {/* Topics */}
{visibleTopics.length > 0 && (
  <div
    className="mt-6 flex flex-wrap items-center gap-2"
    aria-label={content.filters.title}
  >
    {visibleTopics.map((topic) => (
      <span
        key={topic}
        className="inline-flex min-h-7 items-center whitespace-nowrap rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground/65"
      >
        {content.topics[topic]}
      </span>
    ))}

    {remainingTopics > 0 && (
      <details className="contents">
        <summary className="inline-flex min-h-7 cursor-pointer list-none items-center whitespace-nowrap rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground/55 transition-colors hover:bg-muted/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
          +{remainingTopics}
        </summary>

        <div className="contents">
          {resource.topics
            .slice(visibleTopics.length)
            .map((topic) => (
              <span
                key={topic}
                className="inline-flex min-h-7 items-center whitespace-nowrap rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground/65"
              >
                {content.topics[topic]}
              </span>
            ))}
        </div>
      </details>
    )}
  </div>
)}
    </article>
  )
}
