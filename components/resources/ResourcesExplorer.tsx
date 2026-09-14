"use client"

import { useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

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

import { Container } from "@/components/layout/Container"
import { ResourceCard } from "@/components/resources/ResourceCard"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  getResourceTerritories,
  getResourcesByCountry,
  getResourcesUI,
  isResourceAvailableForTerritory,
} from "@/lib/content/resources"

import type { SiteLocale } from "@/lib/i18n/config"

import type {
  ResourceBeneficiary,
  ResourceCountry,
  ResourceKind,
  ResourceScope,
  ResourceTopic,
} from "@/lib/resources/types"

import { cn } from "@/lib/utils"


/* =========================================================
   TYPES
   ========================================================= */

type ResourcesExplorerProps = {
  locale: SiteLocale
  defaultCountry: ResourceCountry
}


/* =========================================================
   CONSTANTS
   ========================================================= */

/**
 * Valeur interne utilisée pour représenter
 * l'ensemble du pays dans le Select.
 *
 * Elle ne doit jamais être affichée directement.
 */
const ALL_TERRITORIES = "__all__"


/**
 * Besoins fréquents mis en avant directement
 * dans l'interface.
 */
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


/**
 * Types disponibles dans les filtres avancés.
 */
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


/**
 * Bénéficiaires possibles.
 */
const beneficiaries: ResourceBeneficiary[] = [
  "caregiver",
  "cared-person",
  "both",
]


/**
 * Niveaux territoriaux.
 *
 * Attention :
 * scope !== territoire.
 *
 * Exemple :
 * scope = "regional"
 * territoire = "Nouvelle-Aquitaine"
 */
const scopes: ResourceScope[] = [
  "national",
  "regional",
  "departmental",
  "provincial",
  "local",
]


/* =========================================================
   COMPONENT
   ========================================================= */

export function ResourcesExplorer({
  locale,
  defaultCountry,
}: ResourcesExplorerProps) {
  /* ---------------------------------------------------------
     LOCALIZED UI CONTENT
     --------------------------------------------------------- */

  const content = getResourcesUI(locale)


  /* ---------------------------------------------------------
     NEXT.JS ROUTER
     --------------------------------------------------------- */

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()


  /* ---------------------------------------------------------
     COUNTRY
     --------------------------------------------------------- */

  /**
   * Le pays peut être stocké dans l'URL :
   *
   * ?country=france
   * ?country=spain
   */
  const countryParam = searchParams.get("country")

  const initialCountry: ResourceCountry =
    countryParam === "france" || countryParam === "spain"
      ? countryParam
      : defaultCountry

  const [country, setCountry] =
    useState<ResourceCountry>(initialCountry)


  /* ---------------------------------------------------------
     SEARCH + FILTER STATES
     --------------------------------------------------------- */

  const [search, setSearch] = useState("")

  const [selectedTopic, setSelectedTopic] =
    useState<ResourceTopic | null>(null)

  const [selectedKind, setSelectedKind] =
    useState<ResourceKind | null>(null)

  const [
    selectedBeneficiary,
    setSelectedBeneficiary,
  ] = useState<ResourceBeneficiary | null>(null)

  const [selectedScope, setSelectedScope] =
    useState<ResourceScope | null>(null)

  const [
    selectedTerritoryId,
    setSelectedTerritoryId,
  ] = useState(ALL_TERRITORIES)

  const [showAllFilters, setShowAllFilters] =
    useState(false)


  /* ---------------------------------------------------------
     TERRITORIES
     --------------------------------------------------------- */

  /**
   * Charge uniquement les territoires du pays actif.
   */
  const territories =
    getResourceTerritories(country)


  /**
   * Regroupe les territoires selon leur parent.
   *
   * Exemple France :
   *
   * Nouvelle-Aquitaine
   * └── Pyrénées-Atlantiques
   *
   * Exemple Espagne :
   *
   * Euskadi
   * ├── Álava / Araba
   * ├── Bizkaia
   * └── Gipuzkoa
   */
  const territoryGroups = territories
    .filter((territory) => !territory.parentId)
    .map((parent) => ({
      parent,

      children: territories.filter(
        (territory) =>
          territory.parentId === parent.id
      ),
    }))


  /**
   * Liste simple utilisée par Base UI / shadcn
   * pour résoudre correctement le label de la valeur
   * actuellement sélectionnée.
   *
   * Sans cette liste, SelectValue pourrait afficher :
   *
   * __all__
   *
   * au lieu de :
   *
   * Toute la France
   */
  const selectItems = [
    {
      value: ALL_TERRITORIES,
      label: content.territory.all[country],
    },

    ...territories.map((territory) => ({
      value: territory.id,
      label: territory.labels[locale],
    })),
  ]


  /* ---------------------------------------------------------
     RESOURCES
     --------------------------------------------------------- */

  /**
   * Première sélection :
   * uniquement les ressources appartenant au pays actif.
   */
  const resources =
    getResourcesByCountry(country)


  /* ---------------------------------------------------------
     FILTERING
     --------------------------------------------------------- */

  const filteredResources = useMemo(() => {
    /**
     * Normalisation de la recherche :
     *
     * Pyrénées → pyrenees
     *
     * pour permettre une recherche sans accents.
     */
    const normalizedSearch = search
      .trim()
      .toLocaleLowerCase(locale)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")

    return resources.filter((resource) => {
      /**
       * Utilise la langue actuelle si disponible.
       * Sinon fallback vers la langue originale.
       */
      const localizedContent =
        resource.content[locale] ??
        resource.content[resource.sourceLanguage]

      if (!localizedContent) {
        return false
      }


      /* -----------------------------------------------------
         FULL-TEXT SEARCH
         ----------------------------------------------------- */

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
        !normalizedSearch ||
        searchableText.includes(normalizedSearch)


      /* -----------------------------------------------------
         TOPIC
         ----------------------------------------------------- */

      const matchesTopic =
        !selectedTopic ||
        resource.topics.includes(selectedTopic)


      /* -----------------------------------------------------
         RESOURCE TYPE
         ----------------------------------------------------- */

      const matchesKind =
        !selectedKind ||
        resource.kind === selectedKind


      /* -----------------------------------------------------
         BENEFICIARY
         ----------------------------------------------------- */

      /**
       * Une ressource destinée à "both" reste pertinente
       * lorsqu'on cherche :
       *
       * caregiver
       * ou
       * cared-person
       */
      const matchesBeneficiary =
        !selectedBeneficiary ||
        resource.beneficiary === selectedBeneficiary ||
        (
          selectedBeneficiary !== "both" &&
          resource.beneficiary === "both"
        )


      /* -----------------------------------------------------
         ADMINISTRATIVE SCOPE
         ----------------------------------------------------- */

      const matchesScope =
        !selectedScope ||
        resource.scope === selectedScope


      /* -----------------------------------------------------
         TERRITORY
         ----------------------------------------------------- */

      /**
       * Exemple :
       *
       * Pyrénées-Atlantiques
       *
       * peut afficher :
       *
       * - ressources nationales
       * - ressources Nouvelle-Aquitaine
       * - ressources Pyrénées-Atlantiques
       */
      const matchesTerritory =
        isResourceAvailableForTerritory(
          resource,
          selectedTerritoryId === ALL_TERRITORIES
            ? undefined
            : selectedTerritoryId
        )


      /* -----------------------------------------------------
         FINAL RESULT
         ----------------------------------------------------- */

      return (
        matchesSearch &&
        matchesTopic &&
        matchesKind &&
        matchesBeneficiary &&
        matchesScope &&
        matchesTerritory
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
    selectedTerritoryId,
  ])


  /* ---------------------------------------------------------
     CHANGE COUNTRY
     --------------------------------------------------------- */

  function changeCountry(
    nextCountry: ResourceCountry
  ) {
    /**
     * Ne fait rien si le pays est déjà actif.
     */
    if (nextCountry === country) {
      return
    }

    setCountry(nextCountry)

    /**
     * Réinitialise tous les critères.
     *
     * Important notamment pour éviter :
     *
     * Espagne + fr-64
     */
    setSearch("")
    setSelectedTopic(null)
    setSelectedKind(null)
    setSelectedBeneficiary(null)
    setSelectedScope(null)
    setSelectedTerritoryId(ALL_TERRITORIES)
    setShowAllFilters(false)

    /**
     * Synchronise le pays avec l'URL.
     */
    const params =
      new URLSearchParams(
        searchParams.toString()
      )

    params.set("country", nextCountry)

    router.replace(
      `${pathname}?${params.toString()}`,
      {
        scroll: false,
      }
    )
  }


  /* ---------------------------------------------------------
     RESET FILTERS
     --------------------------------------------------------- */

  function resetFilters() {
    setSearch("")
    setSelectedTopic(null)
    setSelectedKind(null)
    setSelectedBeneficiary(null)
    setSelectedScope(null)
    setSelectedTerritoryId(ALL_TERRITORIES)
  }


  /* ---------------------------------------------------------
     ACTIVE FILTERS
     --------------------------------------------------------- */

  /**
   * Permet d'afficher ou non le bouton
   * "Effacer les filtres".
   */
  const hasActiveFilters =
    Boolean(search) ||
    Boolean(selectedTopic) ||
    Boolean(selectedKind) ||
    Boolean(selectedBeneficiary) ||
    Boolean(selectedScope) ||
    selectedTerritoryId !== ALL_TERRITORIES


    
return (
  <section>
    <Container>
      <div>
        {/* ========== FILTER PANEL ========= */}

        <div className="my-16 rounded-[2rem] border border-foreground/10 bg-background p-5 sm:p-7 lg:p-8">
          {/* ======== COUNTRY ============================== */}

          <fieldset>
            <legend className="font-heading text-2xl font-extrabold text-tiaki-green">
              {content.countrySelector.title}
            </legend>

            <p className="mt-2 text-sm leading-6 text-foreground/55">
              {content.countrySelector.description}
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              {/* France */}
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

              {/* Spain */}
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

          {/* ===============================================
              MAIN FILTER LAYOUT

              LEFT  : Territory
              RIGHT : Search + frequent needs
             =============================================== */}

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,2fr)]">

            {/* ======LEFT COLUMN — TERRITORY======= */}

            <div>
              <div className="rounded-[1.5rem] bg-muted/40 p-5 sm:p-6">
                <p className="font-heading text-sm font-semibold">
                  {content.territory.label}
                </p>

                {/* Territory selector */}
                <div className="mt-3">
                  <Select
                    items={selectItems}
                    value={selectedTerritoryId}
                    onValueChange={(value) =>
                      setSelectedTerritoryId(
                        value ?? ALL_TERRITORIES
                      )
                    }
                  >
                    <SelectTrigger
                      id="resource-territory"
                      className="min-h-12 w-full rounded-xl border-foreground/15 bg-background px-4"
                    >
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {/* Entire country */}
                      <SelectGroup>
                        <SelectItem value={ALL_TERRITORIES}>
                          {content.territory.all[country]}
                        </SelectItem>
                      </SelectGroup>

                      <SelectSeparator />

                      {/* Regions / autonomous communities */}
                      {territoryGroups.map(
                        ({ parent, children }, groupIndex) => (
                          <SelectGroup key={parent.id}>
                            {groupIndex > 0 && (
                              <SelectSeparator />
                            )}

                            <SelectLabel>
                              {parent.labels[locale]}
                            </SelectLabel>

                            {/* Whole parent territory */}
                            <SelectItem value={parent.id}>
                              <span className="flex items-center gap-2">
                                <span>
                                  {
                                    content.territory.whole[
                                      country
                                    ]
                                  }
                                </span>

                                <span className="text-foreground/45">
                                  · {parent.labels[locale]}
                                </span>
                              </span>
                            </SelectItem>

                            {/* Departments / provinces */}
                            {children.map((territory) => (
                              <SelectItem
                                key={territory.id}
                                value={territory.id}
                              >
                                <span className="pl-3">
                                  {
                                    territory.labels[
                                      locale
                                    ]
                                  }
                                </span>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Territory helper */}
                <p className="mt-3 text-sm leading-6 text-foreground/50">
                  {content.territory.help}
                </p>
              </div>
            </div>

            {/* ===============RIGHT COLUMN — SEARCH + FREQUENT NEEDS============== */}

            <div>
              {/* -------------SEARCH-------------- */}

              <div>
                <label
                  htmlFor="resource-search"
                  className="sr-only"
                >
                  {content.hero.searchPlaceholder}
                </label>

                <div className="relative">
                  <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-foreground/40"
                  />

                  <input
                    id="resource-search"
                    type="search"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder={
                      content.hero.searchPlaceholder
                    }
                    autoComplete="off"
                    className="h-14 w-full rounded-full border border-foreground/10 bg-background pr-5 pl-14 text-base transition-shadow outline-none placeholder:text-foreground/35 focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>

              {/* --------FREQUENT NEEDS-------- */}

              <div className="mt-7">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="font-heading text-base font-semibold">
                    {content.filters.frequentNeeds}
                  </h2>

                  {selectedTopic && (
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedTopic(null)
                      }
                      className="text-sm font-medium text-foreground/50 underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      {content.filters.clear}
                    </button>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  {frequentTopics.map(
                    ({ topic, icon: Icon }) => {
                      const isSelected =
                        selectedTopic === topic

                      return (
                        <button
                          key={topic}
                          type="button"
                          onClick={() =>
                            setSelectedTopic(
                              isSelected
                                ? null
                                : topic
                            )
                          }
                          aria-pressed={isSelected}
                          className={cn(
                            "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2",
                            "font-heading text-sm font-semibold transition-colors",
                            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
                            isSelected
                              ? "border-foreground bg-foreground text-background"
                              : "border-foreground/10 bg-background text-foreground/70 hover:border-foreground/20 hover:text-foreground"
                          )}
                        >
                          <Icon
                            aria-hidden="true"
                            className="size-4"
                          />

                          {content.topics[topic]}
                        </button>
                      )
                    }
                  )}

                  {/* Advanced filters toggle */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowAllFilters(
                        (current) => !current
                      )
                    }
                    aria-expanded={showAllFilters}
                    aria-controls="advanced-resource-filters"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-dashed border-foreground/20 px-4 py-2 font-heading text-sm font-semibold text-foreground/60 transition-colors hover:border-foreground/40 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    <SlidersHorizontal
                      aria-hidden="true"
                      className="size-4"
                    />

                    {showAllFilters
                      ? content.filters.hideAll
                      : content.filters.showAll}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ============ADVANCED FILTERS============ */}

          {showAllFilters && (
            <div
              id="advanced-resource-filters"
              className="mt-8 rounded-[1.5rem] border border-foreground/10 bg-muted/20 p-5 sm:p-6"
            >
              <div className="grid gap-5 md:grid-cols-3">
                
                {/* ---------RESOURCE TYPE -------------- */}

                <div>
                  <label className="font-heading text-sm font-semibold">
                    {content.filters.resourceType}
                  </label>

                  <Select
                    value={selectedKind}
                    onValueChange={(value) =>
                      setSelectedKind(
                        value
                          ? (value as ResourceKind)
                          : null
                      )
                    }
                  >
                    <SelectTrigger className="mt-2 min-h-12 w-full rounded-xl border-foreground/15 bg-background px-4">
                      <SelectValue
                        placeholder={
                          content.filters.anyKind
                        }
                      />
                    </SelectTrigger>

                    <SelectContent>
                      {resourceKinds.map((kind) => (
                        <SelectItem
                          key={kind}
                          value={kind}
                        >
                          {content.kinds[kind]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* -----------BENEFICIARY--------------- */}

                <div>
                  <label className="font-heading text-sm font-semibold">
                    {content.beneficiaries.title}
                  </label>

                  <Select
                    value={selectedBeneficiary}
                    onValueChange={(value) =>
                      setSelectedBeneficiary(
                        value
                          ? (
                              value as ResourceBeneficiary
                            )
                          : null
                      )
                    }
                  >
                    <SelectTrigger className="mt-2 min-h-12 w-full rounded-xl border-foreground/15 bg-background px-4">
                      <SelectValue
                        placeholder={
                          content.filters
                            .anyBeneficiary
                        }
                      />
                    </SelectTrigger>

                    <SelectContent>
                      {beneficiaries.map(
                        (beneficiary) => (
                          <SelectItem
                            key={beneficiary}
                            value={beneficiary}
                          >
                            {
                              content.beneficiaries[
                                beneficiary
                              ]
                            }
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* --- SCOPE ---------------- */}

                <div>
                  <label className="font-heading text-sm font-semibold">
                    {content.scopes.title}
                  </label>

                  <Select
                    value={selectedScope}
                    onValueChange={(value) =>
                      setSelectedScope(
                        value
                          ? (value as ResourceScope)
                          : null
                      )
                    }
                  >
                    <SelectTrigger className="mt-2 min-h-12 w-full rounded-xl border-foreground/15 bg-background px-4">
                      <SelectValue
                        placeholder={
                          content.filters.anyScope
                        }
                      />
                    </SelectTrigger>

                    <SelectContent>
                      {scopes.map((scope) => (
                        <SelectItem
                          key={scope}
                          value={scope}
                        >
                          {content.scopes[scope]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* =================================================
            RESULTS

            IMPORTANT:
            Ce bloc est maintenant EN DEHORS du panneau
            des filtres avancés.
           ================================================= */}

        <section
          className="mb-16"
          aria-labelledby="resource-results-title"
        >
          {/* Results header */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="resource-results-title"
                className="font-heading text-lg font-extrabold tracking-[-0.025em] text-tiaki-green"
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

            {/* Clear all filters */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="self-start font-heading text-sm font-semibold text-foreground/55 underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:self-auto"
              >
                {content.filters.clear}
              </button>
            )}
          </div>

          {/* ===============================================
              RESOURCE GRID

              Mobile  → 1
              Tablet  → 2
              Desktop → 3
             =============================================== */}

          {filteredResources.length > 0 ? (
            <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-2">
              {filteredResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  locale={locale}
                  showTranslationStatus
                />
              ))}
            </div>
          ) : (
            /* =======EMPTY STATE ============= */

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

              {hasActiveFilters && (
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
)}