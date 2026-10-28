
import type { SiteLocale, RouteKey } from "@/lib/i18n/config"

type ContactResourceLink = {
  id: string
  route: RouteKey
  title: string
  description: string
}


export const contactResourceTopics = {
  fr: [
    {
      id: "participation",
      title: "Participer au projet",
      description:
        "Vous êtes aidant(e) ou professionnel(le) ? Manifestez votre intérêt pour les ateliers de co-conception et les tests utilisateurs.",
    },
    {
      id: "suggestion",
      title: "Proposer une idée ou une ressource",
      description:
        "Partagez un outil, un guide, une initiative ou une suggestion susceptible d'être utile aux aidant(e)s.",
    },
    {
      id: "demo",
      title: "Demander une démonstration",
      description:
        "Vous représentez une association ou une structure d'accompagnement ? Faites-nous part de votre intérêt pour une présentation du projet.",
    },
  ],
  es: [
    {
      id: "participation",
      title: "Participar en el proyecto",
      description:
        "¿Eres una persona cuidadora o profesional? Expresa tu interés en los talleres de codiseño y las pruebas con usuarios.",
    },
    {
      id: "suggestion",
      title: "Proponer una idea o un recurso",
      description:
        "Comparte una herramienta, una guía, una iniciativa o una sugerencia que pueda ser útil para las personas cuidadoras.",
    },
    {
      id: "demo",
      title: "Solicitar una demostración",
      description:
        "¿Representas a una asociación o entidad de apoyo? Comunícanos tu interés en una presentación del proyecto.",
    },
  ],
} satisfies Record<
  SiteLocale,
  { id: string; title: string; description: string }[]
>
