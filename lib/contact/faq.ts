
import type { SiteLocale } from "@/lib/i18n/config"

type ContactFaqItem = {
  id: string
  question: string
  answer: string
}

export const contactFaq = {
  fr: [
    {
      id: "about",
      question: "Qu'est-ce que T-IA-KI ?",
      answer:
        "T-IA-KI est un projet de plateforme numérique conçu pour accompagner les aidant(e)s en leur facilitant l'accès à des informations, des ressources et des outils utiles au quotidien.",
    },
    {
      id: "audience",
      question: "À qui s'adresse T-IA-KI ?",
      answer:
        "T-IA-KI s'adresse principalement aux aidant(e)s qui accompagnent un proche ayant besoin d'aide, ainsi qu'aux acteurs impliqués dans leur accompagnement.",
    },
    {
      id: "services",
      question: "Quels services propose T-IA-KI ?",
      answer:
        "Le projet prévoit des ressources d'information, des outils d'organisation du quotidien et des services d'accompagnement. La plateforme est actuellement en développement.",
    },
    {
      id: "participation",
      question: "Comment participer au projet T-IA-KI ?",
      answer:
        "Le projet s'appuie notamment sur la participation des aidant(e)s et des professionnels à des ateliers et des tests utilisateurs. Les modalités de participation seront communiquées au fil du projet.",
    },
  ],
  es: [
    {
      id: "about",
      question: "¿Qué es T-IA-KI?",
      answer:
        "T-IA-KI es un proyecto de plataforma digital diseñado para apoyar a las personas cuidadoras, facilitándoles el acceso a información, recursos y herramientas útiles para el día a día.",
    },
    {
      id: "audience",
      question: "¿A quién se dirige T-IA-KI?",
      answer:
        "T-IA-KI se dirige principalmente a las personas que cuidan de un familiar o ser querido que necesita ayuda, así como a los agentes implicados en su acompañamiento.",
    },
    {
      id: "services",
      question: "¿Qué servicios ofrece T-IA-KI?",
      answer:
        "El proyecto contempla recursos informativos, herramientas para organizar la vida cotidiana y servicios de apoyo. La plataforma se encuentra actualmente en desarrollo.",
    },
    {
      id: "participation",
      question: "¿Cómo puedo participar en el proyecto T-IA-KI?",
      answer:
        "El proyecto cuenta con la participación de personas cuidadoras y profesionales en talleres y pruebas con usuarios. Las modalidades de participación se comunicarán a medida que avance el proyecto.",
    },
  ],
} satisfies Record<SiteLocale, ContactFaqItem[]>
