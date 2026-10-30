
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


export const contactSubjects = {
  fr: [
    { value: "general", label: "Question générale sur T-IA-KI" },
    { value: "platform", label: "Informations sur la plateforme" },
    { value: "resources", label: "Ressources et accompagnement" },
    { value: "content", label: "Proposer une ressource ou un contenu" },
    { value: "participation", label: "Participer aux ateliers ou aux tests" },
    { value: "demo", label: "Demander une démonstration" },
    { value: "partnership", label: "Partenariat et collaboration" },
    { value: "technical", label: "Signaler un problème technique" },
    { value: "other", label: "Autre demande" },
  ],
  es: [
    { value: "general", label: "Consulta general sobre T-IA-KI" },
    { value: "platform", label: "Información sobre la plataforma" },
    { value: "resources", label: "Recursos y acompañamiento" },
    { value: "content", label: "Proponer un recurso o contenido" },
    { value: "participation", label: "Participar en talleres o pruebas" },
    { value: "demo", label: "Solicitar una demostración" },
    { value: "partnership", label: "Colaboración y alianzas" },
    { value: "technical", label: "Comunicar un problema técnico" },
    { value: "other", label: "Otra consulta" },
  ],
} satisfies Record<SiteLocale, { value: string; label: string }[]>;


export const contactProfiles = {
  fr: [
    { value: "caregiver", label: "Aidant(e)" },
    { value: "professional", label: "Professionnel de santé ou médico-social" },
    { value: "association", label: "Association" },
    { value: "institution", label: "Institution ou collectivité" },
    { value: "other", label: "Autre" },
  ],
  es: [
    { value: "caregiver", label: "Persona cuidadora" },
    { value: "professional", label: "Profesional sanitario o sociosanitario" },
    { value: "association", label: "Asociación" },
    { value: "institution", label: "Institución o administración pública" },
    { value: "other", label: "Otro" },
  ],
} satisfies Record<SiteLocale, { value: string; label: string }[]>;
