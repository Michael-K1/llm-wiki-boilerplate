import { tool } from "@opencode-ai/plugin"
import type { Plugin } from "@opencode-ai/plugin"
import { readdir, readFile } from "fs/promises"
import { join } from "path"

export const WikiWatcherPlugin: Plugin = async ({ directory }) => {
  return {
    tool: {
      check_raw: tool({
        description:
          "Check for unprocessed source files in raw/ that haven't been ingested into the wiki yet.",
        args: {},
        async execute(_args, _ctx) {
          const rawDir = join(directory, "raw")
          const indexPath = join(directory, "wiki", "index.md")

          // Get all files in raw/ (exclude .gitkeep and hidden files)
          let rawFiles: string[] = []
          try {
            const entries = await readdir(rawDir)
            rawFiles = entries.filter(
              (f) => !f.startsWith(".") && f !== ".gitkeep",
            )
          } catch {
            return "No raw/ directory found."
          }

          if (rawFiles.length === 0) {
            return "No source files in raw/. Drop documents there to get started."
          }

          // Read wiki/index.md to find ingested sources
          let indexContent = ""
          try {
            indexContent = await readFile(indexPath, "utf-8")
          } catch {
            // index.md doesn't exist or is empty — nothing ingested yet
          }

          // Check if the raw filename (without extension) appears as a wiki-link in the index
          const indexLower = indexContent.toLowerCase()
          const unprocessed: string[] = []
          const ingested: string[] = []

          for (const file of rawFiles) {
            const baseName = file.replace(/\.[^.]+$/, "").toLowerCase()
            if (indexLower.includes(`[[${baseName}]]`)) {
              ingested.push(file)
            } else {
              unprocessed.push(file)
            }
          }

          if (unprocessed.length === 0) {
            return `All ${rawFiles.length} source files have been ingested. Wiki is up to date.`
          }

          const lines = [
            `Found ${unprocessed.length} unprocessed source file(s) in raw/:`,
            "",
            ...unprocessed.map((f) => `- **${f}** — not yet ingested`),
            "",
            `Total: ${rawFiles.length} files in raw/ (${ingested.length} ingested, ${unprocessed.length} pending)`,
            "",
            `Run \`/wiki-ingest <filename>\` to process them.`,
          ]

          return lines.join("\n")
        },
      }),
    },
  }
}
