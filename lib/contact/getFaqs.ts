
export type FaqLocale = 'fr' | 'es'

export interface FAQ {
  id: number | string
  key: string
  question: string
  answer: string
  displayOrder: number
}

interface FAQsResponse {
  docs: FAQ[]
}

export async function getFaqs(locale: FaqLocale): Promise<FAQ[]> {
  const baseURL = process.env.TIAKI_BACKOFFICE_URL

  if (!baseURL) {
    throw new Error('TIAKI_BACKOFFICE_URL is not configured')
  }

  const url = new URL('/api/faqs', baseURL)

  url.searchParams.set('locale', locale)
  url.searchParams.set('fallback-locale', 'none')
  url.searchParams.set('where[published][equals]', 'true')
  url.searchParams.set('sort', 'displayOrder')
  url.searchParams.set('limit', '100')

  const response = await fetch(url, {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch FAQs: ${response.status}`)
  }

  const data = (await response.json()) as FAQsResponse

  return data.docs
}
