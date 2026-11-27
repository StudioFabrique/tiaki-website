// Source centralisée des configurations CMS
import { cmsRegistry } from "../lib/cms/registry"
import { fetchCms } from "../lib/cms/client"
import { fetchPaginatedCollection } from "../lib/cms/pagination"
import { compareSnapshots, type PendingSnapshot } from "../lib/cms/comparison"

import { persistSnapshots } from "../lib/cms/persistence"

const locales = ["fr", "es"] as const

async function main() {
  console.log("CMS Fallback Synchronization\n")

  const dryRun = process.argv.includes("--dry-run")

  console.log(`Mode: ${dryRun ? "DRY RUN" : "SYNC"}\n`)

  const pendingSnapshots: PendingSnapshot[] = []

  for (const [key, definition] of Object.entries(cmsRegistry)) {
    // Parcours dynamique de tous les contenus enregistrés
    for (const locale of locales) {
      console.log(`[${key}][${locale}]`)
      console.log(`  Endpoint: ${definition.endpoint}`)
      console.log(`  Snapshot: ${definition.snapshotPaths[locale]}`)

      const query = "query" in definition ? definition.query : {}

      const data =
        definition.kind === "collection"
          ? // 	Récupère et agrège toutes les pages d'une collection
            await fetchPaginatedCollection(definition.endpoint, locale, query)
          : // Récupère directement un Global
            await fetchCms(definition.endpoint, {
              locale,
              query,
            })

      // Validation métier des contenus distants avec Zod

      // Valide les données distantes sans générer immédiatement une exception
      const result = definition.schema.safeParse(data)

      if (!result.success) {
        console.error(`[${key}][${locale}] INVALID`)

        for (const issue of result.error.issues) {
          console.error(
            `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`
          )
        }

        throw new Error(`[${key}][${locale}] CMS content validation failed`)
      }

      pendingSnapshots.push({
        key,
        locale,
        filePath: definition.snapshotPaths[locale],
        // Réponse validée et normalisée par Zod, sans les propriétés non déclarées dans nos schémas z.object().
        data: result.data,
      })

      console.log(`[${key}][${locale}] VALID`)
    }
  }

  const changedSnapshots = await compareSnapshots(pendingSnapshots, dryRun)

  console.log("\n--- Synchronization Summary ---")
  console.log(`Validated snapshots: ${pendingSnapshots.length}`)
  console.log(`Changed snapshots: ${changedSnapshots.length}`)
  console.log(
    `Unchanged snapshots: ${pendingSnapshots.length - changedSnapshots.length}`
  )

  if (dryRun) {
    console.log("\nDry run completed. No files modified.")
    return
  }

  if (changedSnapshots.length === 0) {
    console.log("\nAll snapshots are already up to date.")
    return
  }

  console.log("\n--- Persisting Snapshots ---")

  await persistSnapshots(changedSnapshots)

  console.log("\nSynchronization completed successfully.")
  console.log(`Updated snapshots: ${changedSnapshots.length}`)
}

main().catch((error) => {
  console.error("CMS synchronization failed:", error)
  process.exitCode = 1
})
