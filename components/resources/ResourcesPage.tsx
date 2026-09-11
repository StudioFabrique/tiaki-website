import { ResourcesExplorer } from "@/components/resources/ResourcesExplorer";
import { ResourcesHero } from "@/components/resources/ResourcesHero";
import type { SiteLocale } from "@/lib/i18n/config";
import {
  getDefaultResourceCountry,
} from "@/lib/content/resources";
import type {
  ResourceCountry,
} from "@/lib/resources/types";

type ResourcesPageProps = {
  locale: SiteLocale;
  country?: string;
};

function getValidCountry(
  country: string | undefined,
  locale: SiteLocale
): ResourceCountry {
  if (
    country === "france" ||
    country === "spain"
  ) {
    return country;
  }

  return getDefaultResourceCountry(locale);
}

export function ResourcesPage({
  locale,
  country,
}: ResourcesPageProps) {
  const selectedCountry = getValidCountry(
    country,
    locale
  );

  return (
    <>
      <ResourcesHero locale={locale} />

      <ResourcesExplorer
        locale={locale}
        defaultCountry={selectedCountry}
      />
    </>
  );
}