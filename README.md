# LLM Wiki Agent

**A reusable framework for building LLM-maintained personal knowledge bases.**

Inspired by [Andrej Karpathy's LLM Wiki pattern](https://x.com/karpathy/status/1924556469498498368) — drop source documents in, get a structured, interlinked, citation-backed wiki out. Runs on [OpenCode](https://opencode.ai) with an orchestrator + subagent architecture.

> **Requires [OpenCode](https://opencode.ai)** — this project uses OpenCode's agent system, custom commands, and skill framework.

## How It Works

You drop source documents (PDFs, articles, notes) into `raw/`. The wiki agents read them, discuss key takeaways with you, then create structured, interlinked wiki pages with full citations back to the sources. Over time, your wiki compounds — entities cross-reference each other, contradictions are tracked, and you can query the whole knowledge base in natural language.

You can also use the **research workflow** to find new sources online — the wiki-researcher agent searches the web, evaluates candidates against your vault's scope, and stages them for your review before ingest.

```
                         ┌─────────────────────┐
                         │   wiki-orchestrator  │
                         │      (primary)       │
                         │                      │
                         │  • Triages requests  │
                         │  • Discusses sources  │
                         │  • Presents results  │
                         │  • NEVER writes wiki │
                         └──┬────┬────┬────┬───┘
                            │    │    │    │
             ┌──────────────┘    │    │    └──────────────┐
             ▼                   ▼    ▼                   ▼
  ┌──────────────────┐ ┌─────────────────┐ ┌───────────────┐ ┌─────────────────┐
  │ wiki-researcher  │ │   wiki-ingest   │ │  wiki-query   │ │   wiki-lint     │
  │   (subagent)     │ │   (subagent)    │ │  (subagent)   │ │   (subagent)    │
  │                  │ │                 │ │               │ │                 │
  │ • Searches web   │ │ • Reads raw/    │ │ • Searches    │ │ • Checks health │
  │ • Evaluates      │ │ • Creates pages │ │   wiki pages  │ │ • Finds orphans │
  │   sources        │ │ • Updates index │ │ • Synthesizes │ │ • Spots broken  │
  │ • Stages         │ │ • Maintains log │ │   answers     │ │   links         │
  │   candidates     │ │                 │ │ • Cites       │ │ • Verifies      │
  │                  │ │ SOLE WIKI WRITER│ │   sources     │ │   citations     │
  └──────────────────┘ └─────────────────┘ └───────────────┘ └─────────────────┘
    writes candidate/     writes wiki/        read-only           read-only
```

**Key design principle: single-writer architecture.** Only `wiki-ingest` writes to `wiki/`. The orchestrator and other agents are read-only. `wiki-researcher` writes only to `candidate/`, never to `wiki/` or `raw/`.

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
| `/wiki-scout [topic]`           | Search the web for relevant sources            |
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

## Research Flow

The wiki-researcher agent finds new sources online and stages them for your review.

```
/wiki-scout find papers on Shinkansen timetable optimization
        │
        ▼
┌─ Orchestrator ──────────────────────────────────┐
│  Routes to wiki-researcher                      │
└────────────────────┬────────────────────────────┘
                     ▼
┌─ wiki-researcher ───────────────────────────────┐
│  1. Reads purpose.md and sources.md             │
│  2. Searches configured sources + web           │
│  3. Evaluates relevance to vault scope          │
│  4. Saves summary cards to candidate/           │
└────────────────────┬────────────────────────────┘
                     ▼
┌─ User review ───────────────────────────────────┐
│  1. Reviews candidates in candidate/            │
│  2. Moves approved sources to raw/              │
│  3. Runs /wiki-ingest on approved sources       │
└─────────────────────────────────────────────────┘
```

**Three search modes:**

- **Query** — you provide search terms, the agent searches configured sources
- **Gap analysis** — the agent reads wiki pages, finds thin coverage and open questions, then searches to fill gaps
- **Contradiction resolution** — the agent reads contradiction pages and searches for authoritative sources to settle disputes

### Configuring Research Sources

Edit `sources.md` to define where the researcher looks. Sources are organized in three priority tiers:

| Tier | Label          | Examples                              |
| ---- | -------------- | ------------------------------------- |
| 1    | Authoritative  | Peer-reviewed journals, official docs |
| 2    | Reliable       | Established publications, textbooks   |
| 3    | Supplementary  | Blogs, forums, community wikis        |

Each entry follows this format:

```markdown
- [Source Name](url) — Description | keywords: topic1, topic2
```

The researcher prioritizes higher-tier sources and includes tier metadata in candidate summary cards.

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
├── sources.md                      ← Research source configuration
├── raw/                            ← Immutable source documents (human-curated)
│   └── .gitkeep
├── candidate/                      ← Source candidates staged by wiki-researcher
│   └── .gitkeep
├── wiki/                           ← LLM-maintained markdown pages
│   ├── index.md                    ← Table of contents (auto-maintained)
│   └── log.md                      ← Append-only operation log
├── .templates/                     ← Page type templates (read-only reference)
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
    │   ├── wiki-researcher.md      ← Subagent — web research and source discovery
    │   ├── wiki-query.md           ← Subagent — read-only Q&A
    │   └── wiki-lint.md            ← Subagent — read-only health auditor
    ├── skills/
    │   └── wiki-page-formats/
    │       └── SKILL.md            ← Page format reference skill
    └── commands/
        ├── wiki-ingest.md          ← /wiki-ingest [filename]
        ├── wiki-scout.md           ← /wiki-scout [topic]
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

**3. Scout for more sources:**

```
> /wiki-scout find recent articles on JR Pass pricing changes 2025
```

> **Found 3 candidates:**
>
> - `jr-pass-price-hike-2023.md` — Japan Times article on the October 2023 price increase (Tier 2)
> - `jrpass-official-faq.md` — JR Group official FAQ with current pricing (Tier 1)
> - `japan-travel-forum-jr-pass.md` — Reddit discussion comparing JR Pass vs individual tickets (Tier 3)
>
> **Candidates saved to `candidate/`.** Review and move approved sources to `raw/`, then run `/wiki-ingest` on them.

**4. Query the wiki:**

```
> /wiki-query What's the best way to get from Tokyo to Kyoto?
```

> **Answer:** The Shinkansen Nozomi is the fastest option at 2h15m, but is **not covered by the JR Pass** (source: japan-rail-guide-2025.pdf). The Hikari (2h40m) and Kodama (4h) services are covered. If you're making 3+ long-distance trips, the JR Pass pays for itself. See [[shinkansen]] and [[jr-pass]] for details.
>
> **Would you like me to file this as a wiki page?**

**5. Audit wiki health** after adding several more sources:

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

## Optional: MCP Search Integration

The wiki-researcher uses OpenCode's built-in `webfetch` and `websearch` tools by default. For better search results, you can add an MCP search server like [Brave Search](https://brave.com/search/api/), [Exa](https://exa.ai), or [Tavily](https://tavily.com).

**To keep token usage efficient**, globally disable the MCP tools in `opencode.json` so their descriptions aren't injected into every agent's context, then re-enable them only in the wiki-researcher agent:

1. Add the MCP server to `opencode.json` under `"mcp"`:

```json
{
  "mcp": {
    "brave-search": {
      "type": "local",
      "command": ["npx", "-y", "@anthropic/brave-search-mcp"],
      "enabled": true,
      "environment": { "BRAVE_API_KEY": "your-key-here" }
    }
  }
}
```

2. Disable its tools globally in the `"tools"` field (use glob pattern + boolean):

```json
{
  "tools": {
    "brave-search_*": false
  }
}
```

3. Re-enable in `.opencode/agents/wiki-researcher.md` frontmatter:

```yaml
tools:
  brave-search_*: true
```

This way only wiki-researcher pays the token cost for MCP tool descriptions.

## Design Decisions

- **Single-writer architecture** — only `wiki-ingest` writes to `wiki/`, preventing conflicting edits
- **Human-in-the-loop ingest** — the orchestrator always discusses sources with you before writing, so you control emphasis and priorities
- **Human-in-the-loop research** — wiki-researcher stages candidates in `candidate/` for your review; nothing goes into `raw/` or `wiki/` without your approval
- **Immutable sources** — `raw/` is never modified by agents, preserving your original documents
- **Citation-first** — every factual claim requires a `(source: filename.ext)` citation; unsourced claims are marked `[needs verification]`
- **Obsidian-compatible** — `[[wiki-links]]` and YAML frontmatter work natively in Obsidian; `.templates/` is dot-prefixed so Obsidian ignores template files in search and graph view

## Credits

Created by **Michael Daniel Naguib**.

Inspired by Andrej Karpathy's [LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) pattern — the idea of using LLMs to incrementally build and maintain persistent, interlinked knowledge bases instead of re-deriving knowledge from scratch on every query.

Built with [OpenCode](https://opencode.ai).
