# Dataview Queries for LLM Wiki

Pre-built [Dataview](https://github.com/blackfold/obsidian-dataview) queries for exploring the wiki.
Copy any query block into an Obsidian note to use it.

> **Requires**: Install the Dataview community plugin in Obsidian and enable JavaScript queries if using `dataviewjs` blocks.

---

## All Pages by Type

```dataview
TABLE type, summary, updated
FROM "wiki"
SORT type ASC, updated DESC
```

## Recent Activity

```dataview
TABLE type, summary
FROM "wiki"
SORT updated DESC
LIMIT 10
```

## All Entities

```dataview
TABLE summary, sources
FROM "wiki"
WHERE type = "entity"
SORT title ASC
```

## All Concepts

```dataview
TABLE summary, sources
FROM "wiki"
WHERE type = "concept"
SORT title ASC
```

## All Source Summaries

```dataview
TABLE summary, created
FROM "wiki"
WHERE type = "source-summary"
SORT created DESC
```

## Unresolved Contradictions

```dataview
TABLE summary, sources
FROM "wiki"
WHERE type = "contradiction" AND status = "unresolved"
SORT updated DESC
```

## All Contradictions by Status

```dataview
TABLE summary, status, updated
FROM "wiki"
WHERE type = "contradiction"
SORT status ASC, updated DESC
```

## Comparisons

```dataview
TABLE summary, sources
FROM "wiki"
WHERE type = "comparison"
SORT title ASC
```

## Filed Questions

```dataview
TABLE summary, updated
FROM "wiki"
WHERE type = "question-answer"
SORT updated DESC
```

## Pages Missing Sources

```dataview
TABLE type, title
FROM "wiki"
WHERE !sources OR length(sources) = 0
SORT type ASC
```

## Most-Linked Pages

```dataviewjs
const pages = dv.pages('"wiki"');
const linkCounts = [];
for (const page of pages) {
  const inlinks = dv.pages('"wiki"').where(p => 
    p.file.outlinks.some(l => l.path === page.file.path)
  ).length;
  linkCounts.push([page.file.link, page.type, inlinks]);
}
linkCounts.sort((a, b) => b[2] - a[2]);
dv.table(["Page", "Type", "Inbound Links"], linkCounts.slice(0, 15));
```

## Candidate Sources Pending Review

```dataview
TABLE title, url, tier, date_found
FROM "candidate"
SORT date_found DESC
```
