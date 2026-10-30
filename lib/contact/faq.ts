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

    {
      id: "caregiver-participation",
      question: "Comment les aidant(e)s peuvent-ils contribuer au projet ?",
      answer:
        "Les aidant(e)s peuvent contribuer aux réflexions sur la plateforme en partageant leur expérience, leurs besoins et leurs attentes. Ces retours permettent de mieux comprendre les réalités du quotidien et d'orienter la conception des services.",
    },
    {
      id: "professional-participation",
      question:
        "Les professionnels et les organisations peuvent-ils participer ?",
      answer:
        "Oui, leurs connaissances et leur expérience de terrain peuvent enrichir le projet. Ils peuvent notamment contribuer aux échanges autour des besoins des aidant(e)s, des ressources utiles et des possibilités de collaboration.",
    },
    {
      id: "platform-testing",
      question: "Est-il possible de participer aux tests de la plateforme ?",
      answer:
        "Les retours sur les prototypes et les parcours utilisateurs font partie des formes de participation envisagées. Les modalités de participation et le calendrier des tests restent à préciser selon l'avancement du projet.",
    },

{
  id: "languages",
  question: "Dans quelles langues le site T·IA·KI est-il disponible ?",
  answer:
    "Le site T·IA·KI est disponible en français et en espagnol. Vous pouvez changer de langue à l'aide du sélecteur présent dans la navigation.",
},
{
  id: "website-platform",
  question: "Quelle est la différence entre le site et la plateforme T·IA·KI ?",
  answer:
    "Le site web présente le projet T·IA·KI, ses objectifs et ses ressources publiques. La plateforme vise à proposer des services numériques pour accompagner les aidant(e)s dans leur quotidien. Ses fonctionnalités évolueront au fil du développement du projet.",
},
{
  id: "account-required",
  question: "Faut-il créer un compte pour consulter les informations du site ?",
  answer:
    "Non. Les pages publiques du site sont accessibles sans inscription. Certains services de la future plateforme pourront nécessiter une connexion à un compte personnel.",
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

    {
      id: "caregiver-participation",
      question: "¿Cómo pueden contribuir las personas cuidadoras al proyecto?",
      answer:
        "Las personas cuidadoras pueden contribuir al desarrollo de la plataforma compartiendo sus experiencias, necesidades y expectativas. Estas aportaciones permiten comprender mejor su realidad cotidiana y orientar el diseño de los servicios.",
    },
    {
      id: "professional-participation",
      question: "¿Pueden participar profesionales y organizaciones?",
      answer:
        "Sí, sus conocimientos y su experiencia práctica pueden enriquecer el proyecto. Pueden contribuir al intercambio de ideas sobre las necesidades de las personas cuidadoras, los recursos útiles y las posibilidades de colaboración.",
    },
    {
      id: "platform-testing",
      question: "¿Es posible participar en las pruebas de la plataforma?",
      answer:
        "La evaluación de prototipos y recorridos de usuario forma parte de las modalidades de participación previstas. Las condiciones de participación y el calendario de las pruebas aún están por definir según el avance del proyecto.",
    },

{
  id: "languages",
  question: "¿En qué idiomas está disponible el sitio web de T·IA·KI?",
  answer:
    "El sitio web de T·IA·KI está disponible en francés y español. Puedes cambiar de idioma mediante el selector situado en la navegación.",
},
{
  id: "website-platform",
  question: "¿Cuál es la diferencia entre el sitio web y la plataforma T·IA·KI?",
  answer:
    "El sitio web presenta el proyecto T·IA·KI, sus objetivos y sus recursos públicos. La plataforma tiene como objetivo ofrecer servicios digitales para acompañar a las personas cuidadoras en su vida cotidiana. Sus funcionalidades evolucionarán a medida que avance el proyecto.",
},
{
  id: "account-required",
  question: "¿Es necesario crear una cuenta para consultar la información del sitio web?",
  answer:
    "No. Las páginas públicas del sitio web son accesibles sin registrarse. Algunos servicios de la futura plataforma podrán requerir el acceso mediante una cuenta personal.",
},

  ],
} satisfies Record<SiteLocale, ContactFaqItem[]>
