---
description: Audit wiki health and report findings
agent: wiki-orchestrator
---

Perform a health check on the wiki.

Follow the lint workflow:
1. Delegate to wiki-lint to audit all wiki pages
2. Present findings organized by severity (CRITICAL, MODERATE, LOW)
3. Ask me which issues to fix
4. For approved fixes, delegate to wiki-ingest
