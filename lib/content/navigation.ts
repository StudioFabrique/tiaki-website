import type { SiteLocale } from "@/lib/i18n/config";

import fr from "@/content/fr/navigation.json";
import es from "@/content/es/navigation.json";

const navigationContent = {
  fr,
  es,
};

export function getNavigationContent(locale: SiteLocale) {
  return navigationContent[locale];
}