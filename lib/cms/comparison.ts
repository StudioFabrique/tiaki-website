
import { isDeepStrictEqual } from "node:util"
import { readFile } from "node:fs/promises"

// 	Type contenu distant validé, en attente de comparaison.
export type PendingSnapshot = {
  key: string
  locale: "fr" | "es"
  filePath: string
  data: unknown
}

// Type snapshot différent de sa version locale, avec son contenu JSON prêt à être écrit
export type ChangedSnapshot = PendingSnapshot & {
  content: string
}

export function logDifferences(
  before: unknown,
  after: unknown,
  path = "$"
): void {
  if (isDeepStrictEqual(before, after)) return

  if (
    typeof before === "object" && before !== null &&
    typeof after === "object" && after !== null &&
    Array.isArray(before) === Array.isArray(after)
  ) {
    const oldObject = before as Record<string, unknown>
    const newObject = after as Record<string, unknown>

    const keys = new Set([
      ...Object.keys(oldObject),
      ...Object.keys(newObject),
    ])

    for (const key of keys) {
      logDifferences(
        Object.hasOwn(oldObject, key) ? oldObject[key] : undefined,
        Object.hasOwn(newObject, key) ? newObject[key] : undefined,
        Array.isArray(before) ? `${path}[${key}]` : `${path}.${key}`
      )
    }

    return
  }

  console.log(`  - ${path}`)
  console.log(`    Before: ${JSON.stringify(before) ?? "(absent)"}`)
  console.log(`    After:  ${JSON.stringify(after) ?? "(absent)"}`)
}

  // Comparer les snapshots
  // Conserve uniquement les snapshots nécessitant une actualisation

export async function compareSnapshots(
  snapshots: PendingSnapshot[],
  dryRun: boolean
): Promise<ChangedSnapshot[]> {
  const changedSnapshots: ChangedSnapshot[] = []

  for (const snapshot of snapshots) {
    const currentContent = await readFile(
      snapshot.filePath,
      "utf8"
    )

    const currentData: unknown = JSON.parse(currentContent)

    if (isDeepStrictEqual(currentData, snapshot.data)) {
      console.log(`[${snapshot.key}][${snapshot.locale}] UNCHANGED`)
      continue
    }

    changedSnapshots.push({
      ...snapshot,
      content: JSON.stringify(snapshot.data, null, 2) + "\n",
    })

    console.log(`[${snapshot.key}][${snapshot.locale}] CHANGED`)

    if (dryRun) {
      logDifferences(currentData, snapshot.data)
    }
  }

  return changedSnapshots
}
