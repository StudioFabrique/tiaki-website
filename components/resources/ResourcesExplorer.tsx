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
  getResourceTerritories,
  getResourcesByCountry,
  getResourcesUI,
  getTerritoryAncestors,
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


type ResourcesExplorerProps = {
  locale: SiteLocale
  defaultCountry: ResourceCountry
}


/**
 * Besoins fréquents mis en avant.
 *
 * Ils restent séparés des filtres avancés afin de réduire
 * la charge mentale sur la page.
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
 * Types de ressources disponibles dans le filtre avancé.
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
 * Public concerné par la ressource.
 */
const beneficiaries: ResourceBeneficiary[] = [
  "caregiver",
  "cared-person",
  "both",
]


/**
 * Niveaux territoriaux disponibles.
 *
 * Ce filtre est différent du territoire concret :
 *
 * scope = "regional"
 * territory = "Nouvelle-Aquitaine"
 */
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
  /**
   * Contenus UI localisés FR / ES.
   */
  const content = getResourcesUI(locale)

  /**
   * Outils Next.js permettant de synchroniser
   * le pays sélectionné avec l'URL.
   */
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  /**
   * Lecture du pays depuis :
   *
   * ?country=france
   * ?country=spain
   */
  const countryParam = searchParams.get("country")

  /**
   * Si l'URL contient un pays valide, on l'utilise.
   * Sinon on utilise le pays par défaut associé à la route.
   */
  const initialCountry: ResourceCountry =
    countryParam === "france" || countryParam === "spain"
      ? countryParam
      : defaultCountry

  /**
   * États principaux.
   */
  const [country, setCountry] =
    useState<ResourceCountry>(initialCountry)

  const [search, setSearch] = useState("")

  const [selectedTopic, setSelectedTopic] =
    useState<ResourceTopic | null>(null)

  const [showAllFilters, setShowAllFilters] =
    useState(false)

  const [selectedKind, setSelectedKind] =
    useState<ResourceKind | null>(null)

  const [
    selectedBeneficiary,
    setSelectedBeneficiary,
  ] = useState<ResourceBeneficiary | null>(null)

  const [selectedScope, setSelectedScope] =
    useState<ResourceScope | null>(null)

  /**
   * Identifiant territorial sélectionné.
   *
   * Exemple :
   *
   * ""                → tous les territoires
   * "fr-naq"          → Nouvelle-Aquitaine
   * "fr-64"           → Pyrénées-Atlantiques
   * "es-eus"          → Euskadi
   * "es-eus-gipuzkoa" → Gipuzkoa
   */
  const [
    selectedTerritoryId,
    setSelectedTerritoryId,
  ] = useState("")

  /**
   * Territoires disponibles pour le pays actif.
   *
   * IMPORTANT :
   * le state s'appelle `country`.
   *
   * C'est ici que se trouvait ton erreur :
   * `selectedCountry` n'existe pas dans ce composant.
   */
  const territories =
    getResourceTerritories(country)

  /**
   * Ressources appartenant au pays actuellement sélectionné.
   */
  const resources =
    getResourcesByCountry(country)


  /**
   * Construit le libellé visuel d'un territoire
   * en fonction de sa profondeur dans la hiérarchie.
   *
   * Exemple :
   *
   * Nouvelle-Aquitaine
   * — Pyrénées-Atlantiques
   *
   * Euskadi
   * — Gipuzkoa
   */
  function getTerritoryOptionLabel(
    territoryId: string,
    label: string
  ) {
    const depth =
      getTerritoryAncestors(territoryId).length

    if (depth === 0) {
      return label
    }

    return `${"— ".repeat(depth)}${label}`
  }


  /**
   * Filtrage des ressources.
   *
   * useMemo évite de recalculer toute la liste à chaque
   * rendu lorsque les critères n'ont pas changé.
   */
  const filteredResources = useMemo(() => {
    /**
     * Normalisation de la recherche :
     *
     * "Pyrénées" → "pyrenees"
     *
     * Cela permet une recherche insensible aux accents.
     */
    const normalizedSearch = search
      .trim()
      .toLocaleLowerCase(locale)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")

    return resources.filter((resource) => {
      /**
       * On utilise la traduction correspondant à l'interface.
       *
       * Si elle n'existe pas encore, fallback vers la
       * langue originale de la ressource.
       */
      const localizedContent =
        resource.content[locale] ??
        resource.content[resource.sourceLanguage]

      if (!localizedContent) {
        return false
      }

      /**
       * Recherche plein texte.
       *
       * Recherche dans :
       * - titre
       * - description
       * - organisation
       * - nom officiel
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
        !normalizedSearch ||
        searchableText.includes(normalizedSearch)

      /**
       * Besoin fréquent / topic.
       */
      const matchesTopic =
        !selectedTopic ||
        resource.topics.includes(selectedTopic)

      /**
       * Type de ressource.
       */
      const matchesKind =
        !selectedKind ||
        resource.kind === selectedKind

      /**
       * Bénéficiaire.
       *
       * Une ressource destinée à "both" reste pertinente
       * lorsqu'on filtre seulement pour l'aidant(e)
       * ou seulement pour la personne accompagnée.
       */
      const matchesBeneficiary =
        !selectedBeneficiary ||
        resource.beneficiary === selectedBeneficiary ||
        (
          selectedBeneficiary !== "both" &&
          resource.beneficiary === "both"
        )

      /**
       * Niveau administratif.
       *
       * Exemple :
       * national / regional / departmental / provincial.
       */
      const matchesScope =
        !selectedScope ||
        resource.scope === selectedScope

      /**
       * Territoire concret.
       *
       * Exemple :
       * sélectionner Pyrénées-Atlantiques accepte :
       *
       * - les ressources nationales françaises
       * - les ressources Nouvelle-Aquitaine
       * - les ressources Pyrénées-Atlantiques
       */
      const matchesTerritory =
        isResourceAvailableForTerritory(
          resource,
          selectedTerritoryId || undefined
        )

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


  /**
   * Change le pays actif.
   *
   * Tous les autres filtres sont réinitialisés
   * afin d'éviter des combinaisons incohérentes entre
   * la France et l'Espagne.
   */
  function changeCountry(
    nextCountry: ResourceCountry
  ) {
    if (nextCountry === country) {
      return
    }

    setCountry(nextCountry)

    /**
     * Réinitialisation de la recherche
     * et de tous les filtres.
     */
    setSearch("")
    setSelectedTopic(null)
    setSelectedKind(null)
    setSelectedBeneficiary(null)
    setSelectedScope(null)
    setSelectedTerritoryId("")
    setShowAllFilters(false)

    /**
     * Synchronisation du pays avec l'URL.
     *
     * scroll: false permet de conserver la position
     * de lecture actuelle.
     */
    const params =
      new URLSearchParams(searchParams.toString())

    params.set("country", nextCountry)

    router.replace(
      `${pathname}?${params.toString()}`,
      {
        scroll: false,
      }
    )
  }


  /**
   * Réinitialise les filtres sans changer de pays.
   */
  function resetFilters() {
    setSearch("")
    setSelectedTopic(null)
    setSelectedKind(null)
    setSelectedBeneficiary(null)
    setSelectedScope(null)
    setSelectedTerritoryId("")
  }


  /**
   * Permet de savoir rapidement si au moins
   * un filtre est actif.
   *
   * Utilisé pour afficher les boutons
   * "Effacer les filtres".
   */
  const hasActiveFilters =
    Boolean(search) ||
    Boolean(selectedTopic) ||
    Boolean(selectedKind) ||
    Boolean(selectedBeneficiary) ||
    Boolean(selectedScope) ||
    Boolean(selectedTerritoryId)


  return (
    <section>
      <Container>
        <div>
          {/* =========================================================
              COUNTRY
             ========================================================= */}

          <fieldset>
            <legend className="font-heading text-lg font-semibold">
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


          {/* =========================================================
              TERRITORY
              
              Le territoire est volontairement visible immédiatement,
              contrairement aux filtres secondaires.
             ========================================================= */}

          <div className="mt-6 max-w-sm">
            <label
              htmlFor="resource-territory"
              className="font-heading text-sm font-semibold"
            >
              {content.territory.label}
            </label>

            <select
              id="resource-territory"
              value={selectedTerritoryId}
              onChange={(event) =>
                setSelectedTerritoryId(
                  event.target.value
                )
              }
              className="mt-2 min-h-12 w-full rounded-xl border border-foreground/15 bg-background px-4 text-sm text-foreground outline-none transition-colors hover:border-foreground/30 focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">
                {content.territory.all}
              </option>

              {territories.map((territory) => (
                <option
                  key={territory.id}
                  value={territory.id}
                >
                  {getTerritoryOptionLabel(
                    territory.id,
                    territory.labels[locale]
                  )}
                </option>
              ))}
            </select>
          </div>


          {/* =========================================================
              SEARCH
             ========================================================= */}

          <div className="mt-8">
            <label
              htmlFor="resource-search"
              className="sr-only"
            >
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


          {/* =========================================================
              FREQUENT NEEDS
             ========================================================= */}

          <div className="mt-8 border-t border-foreground/10 pt-8">
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

            <div className="mt-5 flex flex-wrap gap-3">
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
                        "inline-flex min-h-12 items-center gap-2.5 rounded-full border px-5 py-2.5",
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

              <button
                type="button"
                onClick={() =>
                  setShowAllFilters(
                    (current) => !current
                  )
                }
                aria-expanded={showAllFilters}
                aria-controls="advanced-resource-filters"
                className="inline-flex min-h-12 items-center gap-2.5 rounded-full border border-dashed border-foreground/20 px-5 py-2.5 font-heading text-sm font-semibold text-foreground/60 transition-colors hover:border-foreground/40 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
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


          {/* =========================================================
              ADVANCED FILTERS
             ========================================================= */}

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
                          ? (
                              event.target
                                .value as ResourceKind
                            )
                          : null
                      )
                    }
                    className="mt-2 h-12 w-full rounded-xl border border-foreground/15 bg-background px-4 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">
                      {content.filters.anyKind}
                    </option>

                    {resourceKinds.map((kind) => (
                      <option
                        key={kind}
                        value={kind}
                      >
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
                    value={
                      selectedBeneficiary ?? ""
                    }
                    onChange={(event) =>
                      setSelectedBeneficiary(
                        event.target.value
                          ? (
                              event.target
                                .value as ResourceBeneficiary
                            )
                          : null
                      )
                    }
                    className="mt-2 h-12 w-full rounded-xl border border-foreground/15 bg-background px-4 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">
                      {
                        content.filters
                          .anyBeneficiary
                      }
                    </option>

                    {beneficiaries.map(
                      (beneficiary) => (
                        <option
                          key={beneficiary}
                          value={beneficiary}
                        >
                          {
                            content.beneficiaries[
                              beneficiary
                            ]
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>


                {/* Territorial scope */}
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
                          ? (
                              event.target
                                .value as ResourceScope
                            )
                          : null
                      )
                    }
                    className="mt-2 h-12 w-full rounded-xl border border-foreground/15 bg-background px-4 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">
                      {content.filters.anyScope}
                    </option>

                    {scopes.map((scope) => (
                      <option
                        key={scope}
                        value={scope}
                      >
                        {content.scopes[scope]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}


          {/* =========================================================
              RESULTS
             ========================================================= */}

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


            {/* Resource cards */}
            {filteredResources.length > 0 ? (
              <div className="mt-7 grid gap-4 lg:grid-cols-2">
                {filteredResources.map(
                  (resource) => (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      locale={locale}
                      showTranslationStatus
                    />
                  )
                )}
              </div>
            ) : (
              /**
               * Empty state.
               */
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
  )
}