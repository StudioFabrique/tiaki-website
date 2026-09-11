import type { SiteLocale } from "@/lib/i18n/config";

import fr from "@/content/fr/footer.json";
import es from "@/content/es/footer.json";

const footerContent = {
  fr,
  es,
};

export function getFooterContent(
  locale: SiteLocale
) {
  return footerContent[locale];
}