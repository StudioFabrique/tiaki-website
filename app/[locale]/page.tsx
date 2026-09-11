import { LocalizedPageShell } from "@/components/layout/LocalizedPageShell";
import type { SiteLocale } from "@/lib/i18n/config";

import { HomeHero } from "@/components/home/HomeHero";
import { HomeWhy } from "@/components/home/HomeWhy";
import { HomeFeatures } from "@/components/home/HomeFeatures";
import { HomeAudiences } from "@/components/home/HomeAudiences";
import { HomeCooperation } from "@/components/home/HomeCooperation";
import { HomeStats } from "@/components/home/HomeStats";
import { HomeFunding } from "@/components/home/HomeFunding";
import { HomeFinalCta } from "@/components/home/HomeFinalCta";

type HomePageProps = {
  params: Promise<{
    locale: SiteLocale;
  }>;
};

export default async function HomePage({
  params,
}: HomePageProps) {
  const { locale } = await params;

  return (
    <LocalizedPageShell
      locale={locale}
      currentRoute="home"
    >
      <HomeHero locale={locale} />
      <HomeWhy locale={locale} />
      <HomeFeatures locale={locale} />
      <HomeAudiences locale={locale} />
      <HomeCooperation locale={locale} />
      <HomeStats locale={locale} />
      <HomeFunding locale={locale} />
      <HomeFinalCta locale={locale} />
    </LocalizedPageShell>
  );
}