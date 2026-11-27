
import { test } from "node:test"
import assert from "node:assert/strict"
import { mkdtemp, writeFile, readFile, readdir, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"

import { persistSnapshots } from "../../lib/cms/persistence"

test("Preserve original snapshots when preparation fails", async (t) => {
  const dir = await mkdtemp(join(tmpdir(), "tiaki-test-"))

  t.after(() => rm(dir, { recursive: true, force: true }))

  const filePath = join(dir, "fallback.fr.json")
  const originalContent = '{"title":"Original"}'

  await writeFile(filePath, originalContent, "utf8")

  const snapshot = {
    key: "contact",
    locale: "fr" as const,
    filePath,
    data: { title: "Updated" },
    content: '{"title":"Updated"}',
  }

  await assert.rejects(
    persistSnapshots([
      snapshot,
      {
        ...snapshot,
        locale: "es",
        filePath: join(dir, "missing", "fallback.es.json"),
      },
    ]),
    { code: "ENOENT" }
  )

  assert.equal(await readFile(filePath, "utf8"), originalContent)
  assert.deepEqual(await readdir(dir), ["fallback.fr.json"])
})
