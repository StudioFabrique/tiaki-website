import type { SiteLocale } from "@/lib/i18n/config";

import fr from "@/content/fr/coming-soon.json";
import es from "@/content/es/coming-soon.json";

const comingSoonContent = {
  fr,
  es,
};

export function getComingSoonContent(
  locale: SiteLocale
) {
  return comingSoonContent[locale];
}
