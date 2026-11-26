import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

import { cmsRegistry } from "../lib/cms/registry"

const locales = ["fr", "es"] as const

async function main() {
  console.log("CMS Fallback Validation\n")

  const startTime = performance.now()
  // comptabiliser les fichiers contrôlés, les validations réussies et la durée totale d'exécution.
  let total = 0
  let valid = 0

  for (const [key, definition] of Object.entries(cmsRegistry)) {
    for (const locale of locales) {
      total++
      const filePath = resolve(definition.snapshotPaths[locale])

      // Gestion individuelle des erreurs

      let data: unknown // Déclare les données en dehors du bloc try pour permettre leur utilisation lors de la validation Zod

      // si un fichier est absent ou contient un JSON malformé, l'exécution s'interrompt avant de vérifier les autres fichiers
      // Coorection cvomportement

      try {
        const content = await readFile(filePath, "utf8")
        data = JSON.parse(content)
      } catch (error) {
        console.error(`[${key}][${locale}] INVALID`)
        console.error(`  File: ${filePath}`)

        if (error instanceof SyntaxError) {
          console.error("  - Malformed JSON")
        } else if (
          error instanceof Error &&
          "code" in error &&
          error.code === "ENOENT"
        ) {
          console.error("  - File not found")
        } else {
          console.error(
            `  - Unable to read file: ${
              error instanceof Error ? error.message : String(error)
            }`
          )
        }

        process.exitCode = 1
        continue
      }

      const result = definition.schema.safeParse(data) // Valide les données avec le schéma Zod associé au contenu dans le registre

      if (!result.success) {
          console.error(`[${key}][${locale}] INVALID`)

          for (const issue of result.error.issues) {
              console.error(
                  `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`
                )
            }

            process.exitCode = 1
            continue
        }

        valid++
      console.log(`[${key}][${locale}] Valid`)
    }
  }

  const invalid = total - valid
  const duration = performance.now() - startTime

  console.log("\n--- Validation Summary ---")
  console.log(`Total snapshots: ${total}`)
  console.log(`Valid snapshots: ${valid}`)
  console.log(`Invalid snapshots: ${invalid}`)
  console.log(`Execution time: ${duration.toFixed(2)} ms`)

  if (invalid > 0) {
    console.error("\nCMS fallback validation failed.")
    process.exitCode = 1
  } else {
    console.log("\nAll CMS fallbacks are valid.")
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
