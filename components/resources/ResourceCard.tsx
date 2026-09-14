import Link from "next/link"
import {
  BadgeCheck,
  CalendarCheck,
  ExternalLink,
  Languages,
  MapPin,
  Users,
} from "lucide-react"
import { getResourcesUI, getResourceTerritoryById, } from "@/lib/content/resources"
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

  /**
 * Récupère les noms localisés des territoires
 * associés à la ressource.
 *
 * Exemple :
 * "fr-64" → "Pyrénées-Atlantiques"
 * "es-eus" → "Pays basque" / "Euskadi"
 */
  const territoryLabels =
    resource.territoryIds
      ?.map((territoryId) => {
        const territory =
          getResourceTerritoryById(territoryId)

        return territory?.labels[locale]
      })
      .filter(
        (label): label is string =>
          Boolean(label)
      ) ?? []

  /**
   * Texte principal affiché dans la carte.
   *
   * Les ressources nationales n'ont pas besoin
   * de territoryIds.
   */
  const territoryLabel =
    resource.scope === "national"
      ? content.scopes.national
      : territoryLabels.length > 0
        ? territoryLabels.join(" · ")
        : content.scopes[resource.scope]

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
  <article className="flex h-full flex-col rounded-[1.5rem] border border-foreground/10 bg-background p-6 transition-[background-color,box-shadow] duration-200 hover:bg-tiaki-orange/10 hover:shadow-md sm:p-7">
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

      {/* =========================================================
    RESOURCE METADATA

    Informations pratiques permettant de comprendre :
    - où la ressource est disponible
    - à qui elle s'adresse
    - quand elle a été vérifiée
   ========================================================= */}

      <div className="mt-6 border-t border-foreground/10 pt-5">
        <div className="grid gap-5 sm:grid-cols-3">

          {/* -----------Territory------ */}
          <div>
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.08em] text-foreground/40">
              {content.card.territory}
            </p>

            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <span className="inline-flex min-h-8 items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm font-medium text-foreground/70">
                <MapPin
                  aria-hidden="true"
                  className="size-4 shrink-0"
                />

                {territoryLabel}
              </span>

              {/* Le niveau administratif n'est affiché séparément que pour les ressources territoriales. */}
              {resource.scope !== "national" && (
                <span className="inline-flex min-h-8 items-center rounded-full border border-foreground/10 px-3 py-1.5 text-xs font-medium text-foreground/55">
                  {content.scopes[resource.scope]}
                </span>
              )}
            </div>
          </div>


          {/* ------Beneficiary------------------------- */}
          <div>
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.08em] text-foreground/40">
              {content.card.beneficiary}
            </p>

            <div className="mt-2.5">
              <span className="inline-flex min-h-8 items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm font-medium text-foreground/70">
                <Users
                  aria-hidden="true"
                  className="size-4 shrink-0"
                />

                {content.beneficiaries[resource.beneficiary]}
              </span>
            </div>
          </div>


          {/* -----  Verification date  ------------ */}
          {resource.lastVerified && (
            <div>
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.08em] text-foreground/40">
                {content.card.verified}
              </p>

              <div className="mt-2.5">
                <span className="inline-flex min-h-8 items-center gap-2 text-sm font-medium text-foreground/60">
                  <CalendarCheck
                    aria-hidden="true"
                    className="size-4 shrink-0 text-foreground/40"
                  />

                  {formatVerifiedDate(
                    resource.lastVerified,
                    locale
                  )}
                </span>
              </div>
            </div>
          )}

        </div>
      </div>
      {/* --------------------Resource link---------------------------- */}
      <div className="mt-auto pt-7">
        <Link
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 font-heading text-sm font-semibold text-background transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {content.card.visit}

          <ExternalLink
            aria-hidden="true"
            className="size-4"
          />
        </Link>
      </div>
    </article>
  )
}
