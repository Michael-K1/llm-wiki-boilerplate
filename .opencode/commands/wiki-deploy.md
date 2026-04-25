---
description: Scaffold a new LLM Wiki vault at a given path
---

Scaffold a new LLM Wiki vault.

Target path: $1
Vault purpose: $2

Steps:
1. Create the directory structure at the target path:
   - `raw/` (with `.gitkeep`)
   - `wiki/` (with initial `index.md` and `log.md`)
   - `.templates/` (copy all template files from this vault's `.templates/`)
   - `.opencode/` (copy `agents/`, `skills/`, `commands/` from this vault)
2. Create `AGENTS.md` at the target root (copy from this vault)
3. Create `purpose.md` with the specified vault purpose
4. Create `opencode.json` with `"instructions": ["purpose.md"]`
5. Report the created vault structure

If no arguments provided, show usage:
```
Usage: /deploy <path> <purpose>
Example: /deploy ~/wikis/japan-trip "Planning a trip to Japan in October 2025"
```
