
import {
  CMS_REQUEST_TIMEOUT_MS,
  CMS_FALLBACK_LOCALE,
  getCmsBaseUrl,
} from "./config"

type CmsRequestOptions = {
  locale: "fr" | "es"
  query?: Record<string, string>
}

export async function fetchCms(
  endpoint: `/api/${string}`,
  { locale, query = {} }: CmsRequestOptions,
): Promise<unknown> {
  const url = new URL(endpoint, getCmsBaseUrl())

  for (const [key, value] of Object.entries(query)) {
    url.searchParams.set(key, value)
  }

  url.searchParams.set("locale", locale)
  url.searchParams.set("fallback-locale", CMS_FALLBACK_LOCALE)

  const response = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(CMS_REQUEST_TIMEOUT_MS),
  })

  if (!response.ok) {
    throw new Error(
      `[CMS][${locale}] ${endpoint}: HTTP ${response.status}`,
    )
  }

  return response.json()
}
