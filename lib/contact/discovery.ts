
import type { SiteLocale } from "@/lib/i18n/config"

type DiscoveryOption = {
  value: string
  label: string
}

export const discoveryOptions = {
  fr: [
    { value: "google", label: "Google" },
    { value: "search-engine", label: "Autre moteur de recherche" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "social-media", label: "Autres réseaux sociaux" },
    { value: "advertisement", label: "Publicité ou annonce" },
    { value: "word-of-mouth", label: "Bouche-à-oreille" },
    { value: "event", label: "Événement ou rencontre" },
    { value: "organization", label: "Association ou organisation partenaire" },
    { value: "other", label: "Autre" },
  ],
  es: [
    { value: "google", label: "Google" },
    { value: "search-engine", label: "Otro motor de búsqueda" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "social-media", label: "Otras redes sociales" },
    { value: "advertisement", label: "Publicidad o anuncio" },
    { value: "word-of-mouth", label: "Recomendación de otra persona" },
    { value: "event", label: "Evento o encuentro" },
    { value: "organization", label: "Asociación u organización colaboradora" },
    { value: "other", label: "Otro" },
  ],
} satisfies Record<SiteLocale, DiscoveryOption[]>
