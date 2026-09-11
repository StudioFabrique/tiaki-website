import type { SiteLocale } from "@/lib/i18n/config";

import fr from "@/content/fr/home.json";
import es from "@/content/es/home.json";

const homeContent = {
  fr,
  es,
};

export function getHomeContent(locale: SiteLocale) {
  return homeContent[locale];
}