---
name: wiki-page-formats
description: >
  Wiki page format templates and conventions for the LLM Wiki knowledge base.
  Covers 6 page types: source-summary, entity, concept, comparison,
  contradiction, question-answer. Includes frontmatter schema, section
  structure, cross-referencing rules, and index/log maintenance.
  Load this skill before creating or validating wiki pages.
license: MIT
compatibility: opencode
metadata:
  audience: developers
  category: reference
---

# Wiki Page Format Reference

Format conventions and template reference for the LLM Wiki knowledge base.
Covers all 6 page types, their frontmatter schemas, required sections, and
cross-referencing rules.

---

## 1. Page Type Overview

| Type | Filename Pattern | When to Use |
|------|-----------------|-------------|
| `source-summary` | `{source-name}.md` | After ingesting a raw source document |
| `entity` | `{entity-name}.md` | For people, places, organizations, products, or other named things |
| `concept` | `{concept-name}.md` | For ideas, theories, techniques, topics, or abstract subjects |
| `comparison` | `{subject-a}-vs-{subject-b}.md` | When comparing two or more things side by side |
| `contradiction` | `contradiction-{topic}.md` | When sources disagree on a factual claim |
| `question-answer` | `qa-{short-title}.md` | When filing a valuable query answer back into the wiki |

**Decision guide:**

- Is it about a specific named thing? → `entity`
- Is it about an abstract idea or topic? → `concept`
- Is it a summary of a raw source? → `source-summary`
- Are you comparing two things? → `comparison`
- Do sources disagree? → `contradiction`
- Is this a Q&A worth preserving? → `question-answer`

---

## 2. Common Frontmatter Schema

Every wiki page MUST include YAML frontmatter with these fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | One of: `source-summary`, `entity`, `concept`, `comparison`, `contradiction`, `question-answer` |
| `title` | string | Yes | Page title, must match the H1 heading |
| `summary` | string | Yes | One to two sentence description |
| `sources` | array | Yes | List of raw source filenames this page draws from |
| `created` | string | Yes | Creation date in `YYYY-MM-DD` format |
| `updated` | string | Yes | Last update date in `YYYY-MM-DD` format |
| `tags` | array | Yes | At least one tag matching the page type |

Additional fields by type:

| Type | Extra Fields |
|------|-------------|
| `contradiction` | `status`: `unresolved`, `resolved`, or `partially-resolved` |
| `question-answer` | None additional |
| `comparison` | None additional |

---

## 3. Source Summary Pages

**Purpose**: Capture the key information from an ingested raw source document.

**Required sections** (in order):

1. H1 title matching the source document name or topic
2. Metadata block: Summary, Source file, Last updated
3. Horizontal rule
4. **Key Takeaways** -- bullet list of the most important points
5. **Detailed Notes** -- organized content with sub-headings
6. **Notable Quotes or Data** -- blockquotes for important verbatim content
7. **Questions Raised** -- questions for further investigation
8. **Related Pages** -- wiki-links to connected pages

**Naming**: use the source document name, simplified (e.g., `raw/japan-rail-guide-2025.pdf` → `wiki/japan-rail-guide-2025.md`)

---

## 4. Entity Pages

**Purpose**: Document a specific named thing -- person, place, organization, product.

**Required sections** (in order):

1. H1 title with the entity name
2. Metadata block: Summary, Sources, Last updated
3. Horizontal rule
4. **Overview** -- brief description and significance
5. **Key Details** -- facts, attributes, characteristics
6. **Role and Significance** -- connection to the vault's main topic
7. **Mentions Across Sources** -- table tracking where this entity appears
8. **Related Pages** -- wiki-links

**Key rule**: Entity pages aggregate information across ALL sources that mention this entity. When a new source mentions an existing entity, UPDATE the existing entity page rather than creating a new one.

---

## 5. Concept Pages

**Purpose**: Document an idea, theory, technique, or abstract topic.

**Required sections** (in order):

1. H1 title with the concept name
2. Metadata block: Summary, Sources, Last updated
3. Horizontal rule
4. **Definition** -- clear, cited definition
5. **Context** -- why this concept matters in the vault's scope
6. **Key Points** -- bullet list with citations
7. **Examples** -- concrete illustrations from sources
8. **Open Questions** -- aspects needing further research
9. **Related Pages** -- wiki-links

**Key rule**: Every key point MUST have a citation. Use `(source: filename.ext)` format.

---

## 6. Comparison Pages

**Purpose**: Side-by-side analysis of two or more subjects.

**Required sections** (in order):

1. H1 title in `X vs Y` format
2. Metadata block: Summary, Sources, Last updated
3. Horizontal rule
4. **Overview** -- why this comparison matters
5. **Comparison Table** -- dimensions as rows, subjects as columns
6. **Analysis** -- subsections for strengths of each subject
7. **Key Differences** -- the most important distinguishing factors
8. **Recommendation** -- if applicable, which is better for the vault's context
9. **Related Pages** -- wiki-links

**Key rule**: The comparison table is the centerpiece. Choose dimensions that highlight meaningful differences, not superficial ones.

---

## 7. Contradiction Pages

**Purpose**: Explicitly document when sources disagree on factual claims.

**Required sections** (in order):

1. H1 title prefixed with "Contradiction:"
2. Metadata block: Summary, Sources in conflict, Status, Last updated
3. Horizontal rule
4. **Claim A** -- blockquote with source and context
5. **Claim B** -- blockquote with source and context
6. **Analysis** -- why the claims conflict, possible explanations
7. **Resolution** -- how it was resolved or what would resolve it
8. **Impact on Wiki** -- which other pages are affected
9. **Related Pages** -- wiki-links

**Key rule**: Always present both claims as direct quotes or precise paraphrases. Never editorialize about which is "right" without evidence.

**Status values**:

| Status | Meaning |
|--------|---------|
| `unresolved` | Conflicting claims, no resolution yet |
| `resolved` | One claim determined more reliable, with justification |
| `partially-resolved` | Some aspects resolved, others remain unclear |

---

## 8. Question & Answer Pages

**Purpose**: Preserve valuable query answers as wiki pages so knowledge compounds.

**Required sections** (in order):

1. H1 title (short descriptive title, not the full question)
2. Metadata block: Question, Short answer, Sources consulted, Last updated
3. Horizontal rule
4. **Answer** -- detailed synthesized answer with citations
5. **Evidence** -- subsections for Supporting evidence and Caveats
6. **Follow-Up Questions** -- questions this answer raises
7. **Related Pages** -- wiki-links

**Key rule**: Only file answers that synthesize information or provide insight. Simple factual lookups that just repeat one source don't need their own page.

---

## 9. Cross-Referencing Rules

### When to add links

- Every page MUST link to at least one other page (no orphans)
- When mentioning an entity or concept that has its own page, always use `[[page-name]]`
- When creating a new page, search existing pages for mentions of the new topic and add backlinks

### Link format

- Use Obsidian-compatible wiki-links: `[[page-name]]`
- For display text: `[[page-name|display text]]`
- Links should flow naturally in prose, not just appear in the Related Pages section

### Related Pages section

- Every page ends with a `## Related Pages` section
- List links as bullets: `- [[page-name]]`
- Order by relevance (most related first)
- Include 2--8 related pages (fewer is fine for new wikis)

---

## 10. Index and Log Conventions

### wiki-index.md format

```markdown
## Category Name

- [[page-name]] -- one-line summary
- [[page-name]] -- one-line summary
```

Categories: Sources, Entities, Concepts, Comparisons, Contradictions, Questions

### wiki-log.md format

```markdown
## [YYYY-MM-DD] operation | Subject

- Created: [[page-a]], [[page-b]]
- Updated: [[page-c]], [[index]]
- Details: brief description of what changed
```

Valid operations: `ingest`, `query-filed`, `lint-fix`, `update`, `delete`

---

## 11. Quick-Start Checklist

When creating a new wiki page:

1. **Determine the page type** -- use the decision guide in Section 1
2. **Read the template** -- load the appropriate file from `.templates/`
3. **Write frontmatter** -- include all required fields from Section 2
4. **Add citations** -- every factual claim needs `(source: filename.ext)`
5. **Add cross-references** -- use `[[wiki-links]]` throughout the text
6. **Write Related Pages** -- add 2--8 related page links at the bottom
7. **Report changes** -- the wiki-linker agent handles wiki-index.md, wiki-log.md, and wiki-dashboard.md updates
