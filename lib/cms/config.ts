
export const CMS_REQUEST_TIMEOUT_MS = 5_000
export const CMS_MAX_PAGINATION_PAGES = 100
export const CMS_FALLBACK_LOCALE = "none"

export function getCmsBaseUrl(): URL {
  const value = process.env.TIAKI_BACKOFFICE_URL?.trim()

  if (!value) {
    throw new Error("TIAKI_BACKOFFICE_URL is not configured")
  }

  const url = new URL(value)

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Invalid CMS URL protocol")
  }

  return url
}


// l'utilisation d'une fonction présente plusieurs avantages :
// - Validation de la configuration au moment de son utilisation.
// - Possibilité d'intercepter les erreurs dans notre futur client HTTP.
// - Absence d'exception lors du simple import du module.
// - Réutilisation dans nos futurs scripts de synchronisation des snapshots.
// - Meilleure testabilité.
// Par exemple, 
// si la variable d'environnement est absente, 
// nous pourrons intercepter l'exception et utiliser les contenus de secours plutôt que de provoquer une erreur lors du chargement du module.