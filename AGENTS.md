# LLM Wiki

A personal knowledge base maintained by LLM agents.
Based on Andrej Karpathy's LLM Wiki pattern.

## Purpose

Read `purpose.md` for the scope, goals, and domain of this vault.

## Folder Structure

- `raw/` — source documents. IMMUTABLE. Never modify, rename, or delete anything in this folder.
- `wiki/` — LLM-maintained markdown pages. All pages created and updated by wiki-ingest agent only.
- `wiki/index.md` — table of contents for the entire wiki. Updated on every ingest operation.
- `wiki/log.md` — append-only operation log. Appended on every operation.
- `templates/` — page type templates. Read-only reference for agents when creating pages.

## Citation Rules

- Every factual claim MUST reference its source using the format: `(source: filename.ext)`
- If two sources disagree, note the contradiction explicitly and create a contradiction page
- If a claim has no source, mark it as `[needs verification]`
- Never present LLM-generated synthesis as if it were a primary source
- When updating a page with new source material, add the new source to the Sources list

## Naming Conventions

- Page filenames: lowercase with hyphens (e.g., `tokyo-transportation.md`)
- No spaces, no underscores, no uppercase in filenames
- Use descriptive names, not abbreviations or acronyms

## Cross-Referencing

- Use `[[page-name]]` wiki-links (Obsidian-compatible) to connect related pages
- Every page should link to at least one other page — no orphan pages
- When creating a new page, search existing pages for relevant outbound and inbound links
- When a new page is about an entity or concept already mentioned in other pages, update those pages to link to the new one

## Index and Log Maintenance

### wiki/index.md

A catalog of every wiki page organized by category:

- **Sources** — summary pages for ingested raw documents
- **Entities** — people, places, organizations, products
- **Concepts** — ideas, theories, techniques, topics
- **Comparisons** — side-by-side analyses
- **Contradictions** — disputed or conflicting claims
- **Questions** — valuable Q&A filed from queries

Each entry: `- [[page-name]] — one-line summary`

### wiki/log.md

Append-only chronological record. Each entry formatted as:

```
## [YYYY-MM-DD] operation | Subject

- Created: list of new pages
- Updated: list of modified pages
- Details: brief description of what changed and why
```

## Page Format

Every wiki page MUST include YAML frontmatter and follow the structure defined in `templates/`. At minimum:

- `type` field in frontmatter (source-summary, entity, concept, comparison, contradiction, question-answer)
- `title` field matching the H1 heading
- `sources` array listing raw source files
- `created` and `updated` date fields
- A "Related Pages" section at the bottom with wiki-links

Load the `wiki-page-formats` skill for detailed template reference.

## Rules

- NEVER modify anything in the `raw/` folder
- ALWAYS update `wiki/index.md` and `wiki/log.md` after any wiki changes
- ALWAYS follow the appropriate template from `templates/` when creating pages
- ALWAYS include citations for factual claims
- When uncertain about how to categorize content, default to a concept page
