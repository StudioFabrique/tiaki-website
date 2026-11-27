
import { execFileSync } from "node:child_process"
import { appendFileSync } from "node:fs"
import { cmsRegistry } from "../lib/cms/registry"

const allowedPaths = new Set(
  Object.values(cmsRegistry).flatMap(
    definition => Object.values(definition.snapshotPaths)
  )
)

const entries = execFileSync(
  "git",
  ["status", "--porcelain=v1", "-z", "--untracked-files=all", "--no-renames"],
  { encoding: "utf8" }
).split("\0").filter(Boolean)

for (const entry of entries) {
  const status = entry.slice(0, 2)
  const filePath = entry.slice(3)

  if (!allowedPaths.has(filePath) || status !== " M") {
    throw new Error(`Unexpected repository change: ${entry}`)
  }

  console.log(`Authorized change: ${filePath}`)
}

const changed = entries.length > 0

console.log(`Snapshot changes detected: ${changed}`)

if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changed}\n`)
}
