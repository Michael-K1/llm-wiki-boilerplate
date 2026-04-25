# LLM Wiki Agent

**A reusable framework for building LLM-maintained personal knowledge bases.**

Inspired by [Andrej Karpathy's LLM Wiki pattern](https://x.com/karpathy/status/1924556469498498368) — drop source documents in, get a structured, interlinked, citation-backed wiki out. Runs on [OpenCode](https://opencode.ai) with an orchestrator + subagent architecture.

> **Requires [OpenCode](https://opencode.ai)** — this project uses OpenCode's agent system, custom commands, and skill framework.

## How It Works

You drop source documents (PDFs, articles, notes) into `raw/`. The wiki agents read them, discuss key takeaways with you, then create structured, interlinked wiki pages with full citations back to the sources. Over time, your wiki compounds — entities cross-reference each other, contradictions are tracked, and you can query the whole knowledge base in natural language.

```
                         ┌─────────────────────┐
                         │   wiki-orchestrator  │
                         │      (primary)       │
                         │                      │
                         │  • Triages requests  │
                         │  • Discusses sources  │
                         │  • Presents results  │
                         │  • NEVER writes wiki │
                         └──────┬───┬───┬───────┘
                                │   │   │
                 ┌──────────────┘   │   └──────────────┐
                 ▼                  ▼                   ▼
      ┌──────────────────┐ ┌───────────────┐ ┌─────────────────┐
      │   wiki-ingest    │ │  wiki-query   │ │   wiki-lint     │
      │   (subagent)     │ │  (subagent)   │ │   (subagent)    │
      │                  │ │               │ │                  │
      │ • Reads raw/     │ │ • Searches    │ │ • Checks health │
      │ • Creates pages  │ │   wiki pages  │ │ • Finds orphans │
      │ • Updates index  │ │ • Synthesizes │ │ • Spots broken  │
      │ • Maintains log  │ │   answers     │ │   links         │
      │                  │ │ • Cites       │ │ • Verifies       │
      │ SOLE WIKI WRITER │ │   sources     │ │   citations     │
      └──────────────────┘ └───────────────┘ └─────────────────┘
         writes wiki/        read-only           read-only
```

**Key design principle: single-writer architecture.** Only `wiki-ingest` writes to `wiki/`. The orchestrator and other agents are read-only. This prevents conflicting edits and keeps permissions clean.

## Quick Start

### 1. Clone the repo

```bash
git clone <repo link>
cd llm-wiki-agent
```

### 2. Edit `purpose.md`

This is the **only file you customize**. Set your vault's scope and goals:

```markdown
# Vault Purpose

## Scope

Planning a trip to Japan in October 2025.

## Goals

- Build a comprehensive travel knowledge base
- Synthesize information from guidebooks, blogs, and official sources
- Track contradictions between sources (e.g., conflicting JR Pass advice)
- Create a queryable reference for itinerary planning
```

### 3. Drop sources into `raw/`

```bash
cp ~/Downloads/japan-rail-guide-2025.pdf raw/
```

### 4. Open in OpenCode and start working

```
opencode
```

Switch to the wiki-orchestrator agent (Tab key), then use the commands below.

## Commands

| Command                         | Description                                    |
| ------------------------------- | ---------------------------------------------- |
| `/wiki-ingest [filename]`       | Process a raw source document into the wiki    |
| `/wiki-query [question]`        | Ask a question against the wiki knowledge base |
| `/wiki-lint`                    | Audit wiki health and report findings          |
| `/wiki-status`                  | Show wiki statistics and recent activity       |
| `/wiki-deploy [path] [purpose]` | Scaffold a new vault at a given path           |

## Ingest Flow

```
User drops file in raw/
        │
        ▼
/wiki-ingest japan-rail-guide-2025.pdf
        │
        ▼
┌─ Orchestrator ──────────────────────────────────┐
│  1. Reads the source file                       │
│  2. Summarizes key takeaways for the user       │
│  3. Discusses emphasis and priorities with user  │
└────────────────────┬────────────────────────────┘
                     │  User confirms
                     ▼
┌─ wiki-ingest ───────────────────────────────────┐
│  1. Loads wiki-page-formats skill               │
│  2. Reads appropriate templates from .templates/ │
│  3. Creates/updates wiki pages                  │
│  4. Updates wiki/index.md                       │
│  5. Appends to wiki/log.md                      │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
Orchestrator reports results to user
```

## Page Types

Every wiki page has a `type` in its YAML frontmatter and follows a template from `.templates/`.

| Type              | Description                                 | Example                        |
| ----------------- | ------------------------------------------- | ------------------------------ |
| `source-summary`  | Summary of an ingested raw document         | `japan-rail-guide-2025.md`     |
| `entity`          | A person, place, organization, or product   | `tokyo-transportation.md`      |
| `concept`         | An idea, theory, technique, or topic        | `jr-pass.md`                   |
| `comparison`      | Side-by-side analysis of two or more things | `jr-pass-vs-ic-cards.md`       |
| `contradiction`   | Conflicting claims between sources          | `jr-pass-pricing-conflict.md`  |
| `question-answer` | Valuable Q&A filed from wiki queries        | `tokyo-to-kyoto-best-route.md` |

All pages use `(source: filename.ext)` citations and `[[wiki-links]]` for cross-referencing (Obsidian-compatible).

## Project Structure

```
llm-wiki-agent/
├── AGENTS.md                       ← Framework conventions (injected into all agents)
├── purpose.md                      ← Vault scope — the ONLY file you customize
├── opencode.json                   ← OpenCode config
├── raw/                            ← Immutable source documents (human-curated)
│   └── .gitkeep
├── wiki/                           ← LLM-maintained markdown pages
│   ├── index.md                    ← Table of contents (auto-maintained)
│   └── log.md                      ← Append-only operation log
├── .templates/                      ← Page type templates (read-only reference)
│   ├── source-summary.md
│   ├── entity.md
│   ├── concept.md
│   ├── comparison.md
│   ├── contradiction.md
│   └── question-answer.md
└── .opencode/
    ├── agents/
    │   ├── wiki-orchestrator.md    ← Primary agent (Tab key) — routes to subagents
    │   ├── wiki-ingest.md          ← Subagent — sole wiki writer
    │   ├── wiki-query.md           ← Subagent — read-only Q&A
    │   └── wiki-lint.md            ← Subagent — read-only health auditor
    ├── skills/
    │   └── wiki-page-formats/
    │       └── SKILL.md            ← Page format reference skill
    └── commands/
        ├── wiki-ingest.md          ← /wiki-ingest [filename]
        ├── wiki-query.md           ← /wiki-query [question]
        ├── wiki-lint.md            ← /wiki-lint
        ├── wiki-status.md          ← /wiki-status
        └── wiki-deploy.md          ← /wiki-deploy [path] [purpose]
```

## Example Session

Here's a realistic workflow for a Japan trip planning wiki:

**1. Set your purpose** — edit `purpose.md`:

```markdown
## Scope

Planning a trip to Japan in October 2025.
```

**2. Add a source and ingest it:**

```
> /wiki-ingest japan-rail-guide-2025.pdf
```

The orchestrator reads the source and discusses it with you:

> **Key takeaways from japan-rail-guide-2025.pdf:**
>
> - JR Pass pricing and validity periods
> - Shinkansen routes and timetables
> - IC card systems (Suica, PASMO, ICOCA)
> - Regional rail networks in Tokyo, Kyoto, Osaka
>
> **What would you like me to emphasize?**

You respond:

> Emphasize Tokyo and Kyoto transportation. I'm most interested in getting between those two cities and getting around within each.

The wiki-ingest agent creates:

| Page                       | Type           |
| -------------------------- | -------------- |
| `japan-rail-guide-2025.md` | source-summary |
| `tokyo-transportation.md`  | entity         |
| `kyoto-transportation.md`  | entity         |
| `jr-pass.md`               | concept        |
| `shinkansen.md`            | concept        |

**3. Query the wiki:**

```
> /wiki-query What's the best way to get from Tokyo to Kyoto?
```

> **Answer:** The Shinkansen Nozomi is the fastest option at 2h15m, but is **not covered by the JR Pass** (source: japan-rail-guide-2025.pdf). The Hikari (2h40m) and Kodama (4h) services are covered. If you're making 3+ long-distance trips, the JR Pass pays for itself. See [[shinkansen]] and [[jr-pass]] for details.
>
> **Would you like me to file this as a wiki page?**

**4. Audit wiki health** after adding several more sources:

```
> /wiki-lint
```

> **Wiki Health Report** — 12 pages scanned, 4 findings
>
> **MODERATE**
>
> - `osaka-food-guide.md` is an orphan page (no inbound links)
> - `ic-cards.md` is an orphan page (no inbound links)
>
> **LOW**
>
> - `tokyo-transportation.md` mentions "Narita Express" without a `[[wiki-link]]`
> - "Osaka" mentioned in 4 pages but has no dedicated entity page
>
> **Would you like me to fix any of these?**

## Deploying a New Vault

Two options:

**Option A — Use the deploy command** (from an existing vault):

```
> /wiki-deploy ~/wikis/cooking-notes "Recipes and cooking techniques from various cookbooks"
```

**Option B — Clone and customize:**

```bash
git clone https://github.com/your-org/llm-wiki-agent.git ~/wikis/cooking-notes
cd ~/wikis/cooking-notes
# Edit purpose.md with your scope and goals
# Clear raw/ and wiki/ if they contain example content
```

Either way, `purpose.md` is the only file you need to edit. Everything else is framework infrastructure.

## Design Decisions

- **Single-writer architecture** — only `wiki-ingest` writes to `wiki/`, preventing conflicting edits
- **Human-in-the-loop ingest** — the orchestrator always discusses sources with you before writing, so you control emphasis and priorities
- **Immutable sources** — `raw/` is never modified by agents, preserving your original documents
- **Citation-first** — every factual claim requires a `(source: filename.ext)` citation; unsourced claims are marked `[needs verification]`
- **Obsidian-compatible** — `[[wiki-links]]` and YAML frontmatter work natively in Obsidian for browsing outside OpenCode

## Credits

Created by **Michael Daniel Naguib**.

Inspired by Andrej Karpathy's [LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) pattern — the idea of using LLMs to incrementally build and maintain persistent, interlinked knowledge bases instead of re-deriving knowledge from scratch on every query.

Built with [OpenCode](https://opencode.ai).
