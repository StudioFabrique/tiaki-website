import { z } from "zod"
import { fetchCms } from "./client"
import { CMS_MAX_PAGINATION_PAGES } from "./config"

export const paginatedResponseSchema = z.object({
  docs: z.array(z.unknown()),
  totalDocs: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  hasNextPage: z.boolean(),
  nextPage: z.number().int().positive().nullable(),
})

export type PaginatedResponse = z.infer<typeof paginatedResponseSchema>

export async function fetchPaginatedCollection(
  endpoint: `/api/${string}`,
  locale: "fr" | "es",
  query: Record<string, string> = {}
): Promise<{ docs: unknown[] }> {
  const docs: unknown[] = []
  //	Initialise un ensemble vide d'identifiants uniques
  const seenIds = new Set<string>()

  let page = 1
  let firstPage: PaginatedResponse | undefined

  while (true) {
    const response = await fetchCms(endpoint, {
      locale,
      query: {
        ...query,
        page: String(page),
      },
    })

    const result = paginatedResponseSchema.parse(response)

    if (result.totalPages > CMS_MAX_PAGINATION_PAGES) {
      throw new Error(
        `[${locale}] ${endpoint}: Pagination limit exceeded ` +
          `(${result.totalPages}/${CMS_MAX_PAGINATION_PAGES} pages)`
      )
    }

    // Vérifier la cohérence de chaque page
    firstPage ??= result // Initialise la référence uniquement lors de la première itération

    if (result.page !== page) {
      throw new Error(`[${locale}] ${endpoint}: Unexpected page number`)
    }

    if (
      result.totalDocs !== firstPage.totalDocs ||
      result.totalPages !== firstPage.totalPages ||
      result.limit !== firstPage.limit // Vérifie que la taille maximale des pages reste constante
    ) {
      throw new Error(
        `[${locale}] ${endpoint}: Pagination metadata changed during synchronization`
      )
    }

    if (
      result.hasNextPage !== page < result.totalPages ||
      result.nextPage !== (result.hasNextPage ? page + 1 : null)
    ) {
      throw new Error(
        `[${locale}] ${endpoint}: Inconsistent pagination metadata`
      )
    }

    for (const doc of result.docs) {
      const { id } = z
        .object({
          // Vérifie que le document possède un identifiant valide
          id: z.union([z.number().int(), z.string().trim().min(1)]),
        })
        .parse(doc)

      const normalizedId = String(id)

      // Vérifie si l'identifiant a déjà été rencontré
      if (seenIds.has(normalizedId)) {
        throw new Error(
          `[${locale}] ${endpoint}: Duplicate document ID ${normalizedId}`
        )
      }

      seenIds.add(normalizedId)
      docs.push(doc)
    }

    console.log(
      `  Page ${page}/${result.totalPages} - ${result.docs.length} documents`
    )

    if (!result.hasNextPage) {
      break
    }

    if (result.nextPage !== page + 1) {
      throw new Error(`[${locale}] ${endpoint}: Invalid next page`)
    }

    page = result.nextPage
  }

  // Vérifier l'intégralité de la collection
  if (docs.length !== firstPage?.totalDocs) {
    throw new Error(
      `[${locale}] ${endpoint}: Expected ${firstPage?.totalDocs} documents, received ${docs.length}`
    )
  }

  return { docs }
}
