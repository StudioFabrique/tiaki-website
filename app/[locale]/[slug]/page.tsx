import { notFound } from "next/navigation";

import { ComingSoonPage } from "@/components/layout/ComingSoonPage";
import { LocalizedPageShell } from "@/components/layout/LocalizedPageShell";
import {
  getRouteKeyFromSlug,
  isSiteLocale,
} from "@/lib/i18n/config";

type LocalizedPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export default async function LocalizedPage({
  params,
}: LocalizedPageProps) {
  const { locale, slug } = await params;

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
      <ComingSoonPage
        locale={locale}
        route={routeKey}
      />
    </LocalizedPageShell>
  );
}