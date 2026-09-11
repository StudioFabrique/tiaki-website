import { notFound } from "next/navigation";

import { ComingSoonPage } from "@/components/layout/ComingSoonPage";
import { LocalizedPageShell } from "@/components/layout/LocalizedPageShell";
import { ResourcesPage } from "@/components/resources/ResourcesPage";

import {
  getRouteKeyFromSlug,
  isSiteLocale,
} from "@/lib/i18n/config";

type LocalizedPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;

  searchParams: Promise<{
    country?: string;
  }>;
};

export default async function LocalizedPage({
  params,
  searchParams,
}: LocalizedPageProps) {
  const { locale, slug } = await params;
  const { country } = await searchParams;

  if (!isSiteLocale(locale)) {
    notFound();
  }

  const routeKey = getRouteKeyFromSlug(
    locale,
    slug
  );

  if (!routeKey) {
    notFound();
  }

  return (
    <LocalizedPageShell
      locale={locale}
      currentRoute={routeKey}
    >
      {routeKey === "resources" ? (
        <ResourcesPage
          locale={locale}
          country={country}
        />
      ) : (
        <ComingSoonPage
          locale={locale}
          route={routeKey}
        />
      )}
    </LocalizedPageShell>
  );
}