
import { mkdtemp, writeFile, rename, rm } from "node:fs/promises"
import { dirname, basename, join } from "node:path"

import type { ChangedSnapshot } from "./comparison"


export async function persistSnapshots(
  snapshots: ChangedSnapshot[] // Contient uniquement les snapshots à actualiser
): Promise<void> {
  const prepared: {
    filePath: string
    tempDir: string
    tempPath: string
  }[] = []

  try {
    // Phase 1: Preparer tous les fichiers temporaires
    for (const snapshot of snapshots) {
      const tempDir = await mkdtemp(
        join(dirname(snapshot.filePath), ".cms-sync-")
      )

      const tempPath = join(
        tempDir,
        basename(snapshot.filePath)
      )

      prepared.push({
        filePath: snapshot.filePath,
        tempDir,
        tempPath,
      })

      await writeFile(tempPath, snapshot.content, "utf8")
    }

    // Phase 2: Remplacer les snapshots originales
    for (const file of prepared) {
      await rename(file.tempPath, file.filePath)
      console.log(`  Updated: ${file.filePath}`)
    }
  } finally {
    // Phase 3: Clean up temporary directories
    const results = await Promise.allSettled(
      prepared.map((file) =>
        rm(file.tempDir, {
          recursive: true,
          force: true,
        })
      )
    )

    for (const result of results) {
      if (result.status === "rejected") {
        console.warn("Temporary directory cleanup failed:", result.reason)
      }
    }
  }
}
