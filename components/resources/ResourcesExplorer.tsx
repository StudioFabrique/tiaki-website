"use client"
import {
  BadgeEuro,
  BriefcaseBusiness,
  HeartPulse,
  Scale,
  Search,
  SearchX,
  SlidersHorizontal,
  TimerReset,
} from "lucide-react"

import { Container } from "@/components/layout/Container";
import { ResourceCard } from "@/components/resources/ResourceCard"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"

import { getResourcesUI, getResourcesByCountry } from "@/lib/content/resources"
import type { SiteLocale } from "@/lib/i18n/config"

import type {
  ResourceBeneficiary,
  ResourceCountry,
  ResourceKind,
  ResourceScope,
  ResourceTopic,
} from "@/lib/resources/types"

import { cn } from "@/lib/utils"

type ResourcesExplorerProps = {
  locale: SiteLocale
  defaultCountry: ResourceCountry
}

// Besoin fréquets
const frequentTopics: {
  topic: ResourceTopic
  icon: typeof BadgeEuro
}[] = [
  {
    topic: "financial-support",
    icon: BadgeEuro,
  },
  {
    topic: "rights-procedures",
    icon: Scale,
  },
  {
    topic: "respite",
    icon: TimerReset,
  },
  {
    topic: "caregiver-health",
    icon: HeartPulse,
  },
  {
    topic: "work-leave",
    icon: BriefcaseBusiness,
  },
]
// Ajoute les options disponibles
const resourceKinds: ResourceKind[] = [
  "financial-aid",
  "service",
  "institution",
  "association",
  "guide",
  "training",
  "directory",
  "tool",
  "legal-information",
]

const beneficiaries: ResourceBeneficiary[] = [
  "caregiver",
  "cared-person",
  "both",
]

const scopes: ResourceScope[] = [
  "national",
  "regional",
  "departmental",
  "provincial",
  "local",
]

export function ResourcesExplorer({
  locale,
  defaultCountry,
}: ResourcesExplorerProps) {
  const content = getResourcesUI(locale)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const countryParam = searchParams.get("country")

  const initialCountry: ResourceCountry =
    countryParam === "france" || countryParam === "spain"
      ? countryParam
      : defaultCountry

  const [country, setCountry] = useState<ResourceCountry>(initialCountry)
  const [search, setSearch] = useState("")
  const [selectedTopic, setSelectedTopic] = useState<ResourceTopic | null>(null)
  const [showAllFilters, setShowAllFilters] = useState(false)
  const [selectedKind, setSelectedKind] = useState<ResourceKind | null>(null)
  const [selectedBeneficiary, setSelectedBeneficiary] =
    useState<ResourceBeneficiary | null>(null)
  const [selectedScope, setSelectedScope] = useState<ResourceScope | null>(null)

  const resources = getResourcesByCountry(country)

  const filteredResources = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLocaleLowerCase(locale)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")

    return resources.filter((resource) => {
      const localizedContent = resource.content[locale]

      /*
       * Search
       */
      const searchableText = [
        localizedContent.title,
        localizedContent.description,
        resource.organization,
        resource.officialName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase(locale)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")

      const matchesSearch =
        !normalizedSearch || searchableText.includes(normalizedSearch)

      /*
       * Frequent need / topic
       */
      const matchesTopic =
        !selectedTopic || resource.topics.includes(selectedTopic)

      /*
       * Resource kind
       */
      const matchesKind = !selectedKind || resource.kind === selectedKind

      /*
       * Beneficiary
       *
       * A resource for "both" should also appear
       * when searching for caregiver or cared-person.
       */
      const matchesBeneficiary =
        !selectedBeneficiary ||
        resource.beneficiary === selectedBeneficiary ||
        (selectedBeneficiary !== "both" && resource.beneficiary === "both")

      /*
       * Territorial scope
       */
      const matchesScope = !selectedScope || resource.scope === selectedScope

      return (
        matchesSearch &&
        matchesTopic &&
        matchesKind &&
        matchesBeneficiary &&
        matchesScope
      )
    })
  }, [
    resources,
    search,
    locale,
    selectedTopic,
    selectedKind,
    selectedBeneficiary,
    selectedScope,
  ])

  function changeCountry(nextCountry: ResourceCountry) {
    setCountry(nextCountry)

    const params = new URLSearchParams(searchParams.toString())

    params.set("country", nextCountry)

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    })
  }
  function resetFilters() {
    setSearch("")
    setSelectedTopic(null)
    setSelectedKind(null)
    setSelectedBeneficiary(null)
    setSelectedScope(null)
  }
  return (
  <section className="py-8 sm:py-10 lg:py-12">
    <Container>
      {/* Search & filters */}
      <div className="rounded-[2rem] border border-foreground/10 bg-background p-6 sm:p-8 lg:p-10">
      {/* Country */}
      <fieldset>
        <legend className="font-heading text-3xl font-bold  text-primary font-semibold">
          {content.countrySelector.title}
        </legend>

        <p className="mt-2 text-sm leading-6 text-foreground/55">
          {content.countrySelector.description}
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => changeCountry("france")}
            aria-pressed={country === "france"}
            className={cn(
              "min-h-12 rounded-full border px-6 font-heading text-sm font-semibold",
              "transition-colors",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
              country === "france"
                ? "border-foreground bg-foreground text-background"
                : "border-foreground/15 bg-background text-foreground hover:bg-muted"
            )}
          >
            🇫🇷 {content.countrySelector.france}
          </button>

          <button
            type="button"
            onClick={() => changeCountry("spain")}
            aria-pressed={country === "spain"}
            className={cn(
              "min-h-12 rounded-full border px-6 font-heading text-sm font-semibold",
              "transition-colors",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
              country === "spain"
                ? "border-foreground bg-foreground text-background"
                : "border-foreground/15 bg-background text-foreground hover:bg-muted"
            )}
          >
            🇪🇸 {content.countrySelector.spain}
          </button>
        </div>
      </fieldset>

      {/* Search */}
      <div className="mt-8">
        <label htmlFor="resource-search" className="sr-only">
          {content.hero.searchPlaceholder}
        </label>

        <div className="relative max-w-3xl">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-foreground/40"
          />

          <input
            id="resource-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={content.hero.searchPlaceholder}
            autoComplete="off"
            className="h-14 w-full rounded-full border border-foreground/10 bg-background pr-5 pl-14 text-base transition-shadow outline-none placeholder:text-foreground/35 focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      {/* besoin fréquents */}
      <div className="mt-8 border-t border-foreground/10 pt-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-heading text-base font-semibold">
            {content.filters.frequentNeeds}
          </h2>

          {selectedTopic && (
            <button
              type="button"
              onClick={() => setSelectedTopic(null)}
              className="text-sm font-medium text-foreground/50 underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {content.filters.clear}
            </button>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {frequentTopics.map(({ topic, icon: Icon }) => {
            const isSelected = selectedTopic === topic

            return (
              <button
                key={topic}
                type="button"
                onClick={() => setSelectedTopic(isSelected ? null : topic)}
                aria-pressed={isSelected}
                className={cn(
                  "inline-flex min-h-12 items-center gap-2.5 rounded-full border px-5 py-2.5",
                  "font-heading text-sm font-semibold transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
                  isSelected
                    ? "border-foreground bg-foreground text-background"
                    : "border-foreground/10 bg-background text-foreground/70 hover:border-foreground/20 hover:text-foreground"
                )}
              >
                <Icon aria-hidden="true" className="size-4" />

                {content.topics[topic]}
              </button>
            )
          })}

          <button
            type="button"
            onClick={() => setShowAllFilters((current) => !current)}
            aria-expanded={showAllFilters}
            aria-controls="advanced-resource-filters"
            className="inline-flex min-h-12 items-center gap-2.5 rounded-full border border-dashed border-foreground/20 px-5 py-2.5 font-heading text-sm font-semibold text-foreground/60 transition-colors hover:border-foreground/40 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <SlidersHorizontal aria-hidden="true" className="size-4" />

            {showAllFilters ? content.filters.hideAll : content.filters.showAll}
          </button>
        </div>
      </div>

      {showAllFilters && (
        <div
          id="advanced-resource-filters"
          className="mt-6 rounded-[1.5rem] border border-foreground/10 bg-background p-5 sm:p-6"
        >
          <div className="grid gap-5 md:grid-cols-3">
            {/* Resource kind */}
            <div>
              <label
                htmlFor="resource-kind"
                className="font-heading text-sm font-semibold"
              >
                {content.filters.resourceType}
              </label>

              <select
                id="resource-kind"
                value={selectedKind ?? ""}
                onChange={(event) =>
                  setSelectedKind(
                    event.target.value
                      ? (event.target.value as ResourceKind)
                      : null
                  )
                }
                className="mt-2 h-12 w-full rounded-xl border border-foreground/15 bg-background px-4 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">{content.filters.anyKind}</option>

                {resourceKinds.map((kind) => (
                  <option key={kind} value={kind}>
                    {content.kinds[kind]}
                  </option>
                ))}
              </select>
            </div>

            {/* Beneficiary */}
            <div>
              <label
                htmlFor="resource-beneficiary"
                className="font-heading text-sm font-semibold"
              >
                {content.beneficiaries.title}
              </label>

              <select
                id="resource-beneficiary"
                value={selectedBeneficiary ?? ""}
                onChange={(event) =>
                  setSelectedBeneficiary(
                    event.target.value
                      ? (event.target.value as ResourceBeneficiary)
                      : null
                  )
                }
                className="mt-2 h-12 w-full rounded-xl border border-foreground/15 bg-background px-4 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">{content.filters.anyBeneficiary}</option>

                {beneficiaries.map((beneficiary) => (
                  <option key={beneficiary} value={beneficiary}>
                    {content.beneficiaries[beneficiary]}
                  </option>
                ))}
              </select>
            </div>

            {/* Scope */}
            <div>
              <label
                htmlFor="resource-scope"
                className="font-heading text-sm font-semibold"
              >
                {content.scopes.title}
              </label>

              <select
                id="resource-scope"
                value={selectedScope ?? ""}
                onChange={(event) =>
                  setSelectedScope(
                    event.target.value
                      ? (event.target.value as ResourceScope)
                      : null
                  )
                }
                className="mt-2 h-12 w-full rounded-xl border border-foreground/15 bg-background px-4 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">{content.filters.anyScope}</option>

                {scopes.map((scope) => (
                  <option key={scope} value={scope}>
                    {content.scopes[scope]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
      {/* Results */}
      <section
        className="mt-10 border-t border-foreground/10 pt-8"
        aria-labelledby="resource-results-title"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="resource-results-title"
              className="font-heading text-2xl font-semibold tracking-[-0.025em]"
            >
              {content.sections.allResources}
            </h2>

            <p
              aria-live="polite"
              aria-atomic="true"
              className="mt-2 text-sm text-foreground/55"
            >
              <strong className="font-semibold text-foreground">
                {filteredResources.length}
              </strong>{" "}
              {content.filters.results}
            </p>
          </div>

          {(search ||
            selectedTopic ||
            selectedKind ||
            selectedBeneficiary ||
            selectedScope) && (
            <button
              type="button"
              onClick={resetFilters}
              className="self-start font-heading text-sm font-semibold text-foreground/55 underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:self-auto"
            >
              {content.filters.clear}
            </button>
          )}
        </div>

        {filteredResources.length > 0 ? (
          <div className="mt-7 grid gap-4 lg:grid-cols-2">
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                locale={locale}
              />
            ))}
          </div>
        ) : (
          <div className="mt-7 flex min-h-[260px] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-foreground/15 bg-background px-6 py-10 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <SearchX
                aria-hidden="true"
                className="size-5 text-foreground/45"
              />
            </div>

            <p className="mt-5 max-w-md font-heading text-lg font-semibold">
              {content.filters.noResults}
            </p>

            {(search ||
              selectedTopic ||
              selectedKind ||
              selectedBeneficiary ||
              selectedScope) && (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full border border-foreground/15 bg-background px-5 font-heading text-sm font-semibold transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {content.filters.clear}
              </button>
            )}
          </div>
        )}
      </section>
      </div>
      </Container>
    </section>
  )
}
