
import { test } from "node:test"
import assert from "node:assert/strict"
import { execFileSync, spawnSync } from "node:child_process"
import { mkdtemp, mkdir, writeFile, readFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"

const script = resolve("scripts/check-cms-sync-changes.ts")
const tsx = resolve("node_modules/.bin/tsx")

test("Restrict CMS synchronization to authorized snapshots", async (t) => {
  const dir = await mkdtemp(join(tmpdir(), "tiaki-git-test-"))

  t.after(() => rm(dir, { recursive: true, force: true }))

  const git = (...args: string[]) =>
    execFileSync("git", args, { cwd: dir, encoding: "utf8" })

  const snapshot = "lib/contact/fallback.fr.json"
  const output = join(dir, ".git", "cms-output")

  const run = () => spawnSync(tsx, [script], {
    cwd: dir,
    encoding: "utf8",
    env: { ...process.env, GITHUB_OUTPUT: output },
  })

  await mkdir(join(dir, "lib/contact"), { recursive: true })
  await writeFile(join(dir, snapshot), "{}")
  await writeFile(join(dir, "README.md"), "Original")

  git("init", "-q")
  git("add", ".")
  git("-c", "user.name=Test", "-c", "user.email=test@example.com",
    "-c", "commit.gpgsign=false", "commit", "-qm", "Initial commit")

  // WL01 - Clean repository
  assert.equal(run().status, 0)

  // WL02 - Authorized modification
  await writeFile(join(dir, snapshot), '{"updated":true}')
  assert.equal(run().status, 0)

  // WL03 - Unauthorized modification
  await writeFile(join(dir, "README.md"), "Modified")
  assert.equal(run().status, 1)
  git("restore", "README.md")

  // WL04 - Untracked file
  await writeFile(join(dir, "unexpected.txt"), "Unexpected")
  assert.equal(run().status, 1)
  await rm(join(dir, "unexpected.txt"))

  // WL05 - Deleted snapshot
  await rm(join(dir, snapshot))
  assert.equal(run().status, 1)
  git("restore", snapshot)

  // WL06 - Staged modification
  await writeFile(join(dir, snapshot), '{"updated":true}')
  git("add", snapshot)
  assert.equal(run().status, 1)

  assert.equal(
    await readFile(output, "utf8"),
    "changed=false\nchanged=true\n"
  )
})
