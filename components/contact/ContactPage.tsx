
import { ContactHero } from "@/components/contact/ContactHero";
import { getContactUI } from "@/lib/contact/contact";
import type { SiteLocale } from "@/lib/i18n/config";

type ContactPageProps = {
  locale: SiteLocale;
};

export function ContactPage({ locale }: ContactPageProps) {
  const content = getContactUI(locale);

  return (
    <>
      <ContactHero
        title={content.hero.title}
        description={content.hero.description}
      />
    </>
  );
}
