
import type { SiteLocale } from "@/lib/i18n/config";

const contactContent = {
  fr: {
    hero: {
      title: "Vous avez une question ? Parlons-en.",
      description:
        "Si vous avez une question sur T-IA-KI ou vous souhaitez participer au projet ou proposer une collaboration, notre équipe est à votre écoute",
    },
  },
  es: {
    hero: {
      title: "¿Tienes alguna pregunta? Hablemos.",
      description:
        "Si tienes alguna pregunta sobre T-IA-KI o quieres participar en el proyecto o proponer una colaboración, Estamos aquí para escucharte",
    },
  },
};

export function getContactUI(locale: SiteLocale) {
  return locale === "fr"
    ? contactContent.fr
    : contactContent.es;
}
