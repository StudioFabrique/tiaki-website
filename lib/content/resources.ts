import type { SiteLocale } from "@/lib/i18n/config";
import type {
  ResourceCountry,
  ResourceDataset,
} from "@/lib/resources/types";

import frUI from "@/content/fr/resources-ui.json";
import esUI from "@/content/es/resources-ui.json";

import franceData from "@/content/resources/france.json";
import spainData from "@/content/resources/spain.json";

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