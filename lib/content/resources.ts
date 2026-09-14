import type { SiteLocale } from "@/lib/i18n/config";
import type {
  ResourceCountry,
  ResourceDataset,
  ResourceTerritory,
  ResourceTerritoryDataset,
  Resource
} from "@/lib/resources/types";


import frUI from "@/content/fr/resources-ui.json";
import esUI from "@/content/es/resources-ui.json";

import franceData from "@/content/resources/france.json";
import spainData from "@/content/resources/spain.json";

// import JSON File
import territoriesData from "@/content/resources/territories.json"

const territoryDataset = territoriesData as ResourceTerritoryDataset

const resourcesUI = {
  fr: frUI,
  es: esUI,
};

const resourcesData: Record<
  ResourceCountry,
  ResourceDataset
> = {
  france: franceData as ResourceDataset,
  spain: spainData as ResourceDataset,
};

// loader
export function getResourceTerritories(
  country: ResourceCountry
): ResourceTerritory[] {
  return territoryDataset.territories.filter(
    (territory) => territory.country === country
  )
}

// Helper

export function getResourceTerritoryById(
  territoryId: string
): ResourceTerritory | undefined {
  return territoryDataset.territories.find(
    (territory) => territory.id === territoryId
  )
}

// Helper : récupèrer les parents

export function getTerritoryAncestors(
  territoryId: string
): ResourceTerritory[] {
  const ancestors: ResourceTerritory[] = []

  let currentTerritory = getResourceTerritoryById(territoryId)

  while (currentTerritory?.parentId) {
    const parentTerritory = getResourceTerritoryById(
      currentTerritory.parentId
    )

    if (!parentTerritory) {
      break
    }

    ancestors.unshift(parentTerritory)

    currentTerritory = parentTerritory
  }

  return ancestors
}

// filtrer correctement les ressources
export function getApplicableTerritoryIds(
  territoryId: string
): string[] {
  // vérifier que le territoire existe dans territories.json
  const territory = getResourceTerritoryById(territoryId)

  if (!territory) {
    return []
  }

  return [
    // récupère les parents -> transforme les objets complets en IDs avec .map
    ...getTerritoryAncestors(territoryId).map(
      (ancestor) => ancestor.id
    ),
    territory.id,
  ]
}

// helper de filtrage territorial
export function isResourceAvailableForTerritory(
  resource: Resource,
  territoryId?: string
): boolean {
  if (!territoryId) {
    return true
  }

  if (resource.scope === "national") {
    return true
  }

  const selectedTerritory =
    getResourceTerritoryById(territoryId)

  if (!selectedTerritory) {
    return false
  }

  if (selectedTerritory.country !== resource.country) {
    return false
  }

  if (!resource.territoryIds?.length) {
    return false
  }

  const applicableTerritoryIds =
    getApplicableTerritoryIds(territoryId)

  return resource.territoryIds.some(
    (resourceTerritoryId) =>
      applicableTerritoryIds.includes(resourceTerritoryId)
  )
}

export function getResourcesUI(
  locale: SiteLocale
) {
  return resourcesUI[locale];
}

export function getResourcesByCountry(
  country: ResourceCountry
) {
  return resourcesData[country].resources;
}

export function getResourceDataset(
  country: ResourceCountry
) {
  return resourcesData[country];
}

export function getDefaultResourceCountry(
  locale: SiteLocale
): ResourceCountry {
  return locale === "fr"
    ? "france"
    : "spain";
}