# LLM Wiki — Roadmap

Enhancement backlog organized by effort and impact.

## 🟢 Low Effort, High Impact

- [x] **Auto-ingest watcher** — OpenCode plugin that detects new files in `raw/` and prompts "New source detected. Ingest?"
- [x] **Obsidian frontmatter tags** — Add `cssclass` field per page type to wiki templates for distinct graph view styling
- [x] **Dataview queries** — Pre-built [Dataview](https://github.com/blackfold/obsidian-dataview) queries (all entities, recent sources, unresolved contradictions)
- [x] **Citation link checker** — Lint check that verifies `(source: filename.ext)` references point to files that exist in `raw/`
- [ ] **`/wiki-merge` command** — Merge two or more candidate summary cards into a single richer summary before ingesting

## 🟡 Medium Effort, High Impact

- [ ] **Semantic search** — MCP server or plugin that indexes wiki pages into a vector store for "find pages similar to X"
- [ ] **Source monitoring** — wiki-researcher periodically checks configured sources for new publications matching wiki keywords
- [ ] **RAG pipeline** — Use the wiki as a retrieval-augmented generation source for grounded answers
- [ ] **Confidence scoring** — Add `confidence: high/medium/low` to claims based on corroborating sources, tier, and recency
- [ ] **Wiki diff/changelog** — Track page-level changes over time beyond the append-only log
- [ ] **Multi-format export** — `/wiki-export` command generating static HTML site, PDF report, or Notion import

## 🔴 High Effort, Transformative

- [ ] **Multi-vault linking** — Cross-reference pages between separate vaults
- [ ] **Collaborative vaults** — Multi-user with merge conflict resolution for wiki pages
- [ ] **Auto-scout pipeline** — wiki-lint identifies gaps → wiki-researcher searches → candidates staged for batch review
- [ ] **Temporal knowledge tracking** — Track when facts were true, when they changed, which version is current
- [ ] **Obsidian plugin** — Native Obsidian plugin triggering wiki commands from within Obsidian's UI

## 🔧 Architecture

- [ ] **Structured candidate metadata** — `candidate/index.json` tracking all candidates with status (pending/approved/rejected/ingested)
- [ ] **Source deduplication** — wiki-researcher checks `raw/`, `candidate/`, and wiki citations before scouting
- [ ] **Tiered ingest** — Quick ingest (source-summary only) vs deep ingest (full entity/concept extraction)

---

See [[AGENTS]] for wiki conventions and [[purpose]] for vault scope.
