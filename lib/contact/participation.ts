
import type { SiteLocale } from "@/lib/i18n/config"

export type ParticipationAudience = {
  id: string
  title: string
  description: string
}

export const participationAudiences = {
  fr: [
    {
      id: "caregivers",
      title: "Vous êtes aidant(e) ?",
      description:
        "Partagez votre expérience du quotidien, les difficultés rencontrées et vos attentes pour contribuer à la conception d'une plateforme adaptée à vos besoins.",
    },
    {
      id: "professionals",
      title: "Vous êtes professionnel(le) ?",
      description:
        "Apportez votre expertise de terrain et vos connaissances des besoins des aidant(e)s pour enrichir les réflexions autour des services et fonctionnalités.",
    },
    {
      id: "organizations",
      title: "Vous représentez une organisation ?",
      description:
        "Explorez les possibilités de collaboration autour du partage de ressources, des échanges d'expertise et de la participation au projet.",
    },
  ],
  es: [
    {
      id: "caregivers",
      title: "¿Eres una persona cuidadora?",
      description:
        "Comparte tu experiencia cotidiana, las dificultades que encuentras y tus expectativas para contribuir al diseño de una plataforma adaptada a tus necesidades.",
    },
    {
      id: "professionals",
      title: "¿Eres profesional?",
      description:
        "Aporta tu experiencia práctica y tus conocimientos sobre las necesidades de las personas cuidadoras para enriquecer el desarrollo de los servicios y funcionalidades.",
    },
    {
      id: "organizations",
      title: "¿Representas a una organización?",
      description:
        "Explora las posibilidades de colaboración mediante el intercambio de recursos, conocimientos y la participación en el proyecto.",
    },
  ],
} satisfies Record<SiteLocale, ParticipationAudience[]>


export type ParticipationActivity = {
  id: string
  title: string
  description: string
}

export const participationActivities = {
  fr: [
    {
      id: "experience",
      title: "Partager son expérience",
      description:
        "Exprimer ses besoins, ses difficultés et ses attentes pour contribuer aux réflexions sur la plateforme.",
    },
    {
      id: "workshops",
      title: "Participer aux ateliers",
      description:
        "Contribuer à la co-conception des services et des fonctionnalités de T-IA-KI.",
    },
    {
      id: "testing",
      title: "Tester la plateforme",
      description:
        "Évaluer les prototypes et partager ses impressions sur les interfaces et les parcours utilisateurs.",
    },
    {
      id: "collaboration",
      title: "Proposer une collaboration",
      description:
        "Partager des ressources, des connaissances ou des initiatives en lien avec l'accompagnement des aidant(e)s.",
    },
  ],
  es: [
    {
      id: "experience",
      title: "Compartir su experiencia",
      description:
        "Expresar necesidades, dificultades y expectativas para contribuir al desarrollo de la plataforma.",
    },
    {
      id: "workshops",
      title: "Participar en talleres",
      description:
        "Contribuir al codiseño de los servicios y funcionalidades de T-IA-KI.",
    },
    {
      id: "testing",
      title: "Probar la plataforma",
      description:
        "Evaluar prototipos y compartir impresiones sobre las interfaces y los recorridos de usuario.",
    },
    {
      id: "collaboration",
      title: "Proponer una colaboración",
      description:
        "Compartir recursos, conocimientos o iniciativas relacionadas con el apoyo a las personas cuidadoras.",
    },
  ],
} satisfies Record<SiteLocale, ParticipationActivity[]>
