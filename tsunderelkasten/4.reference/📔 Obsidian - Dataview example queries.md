---
title: 📔 Obsidian - Dataview example queries
created: 2025-04-01
dg-publish: true
dg-show-local-graph: false
description: 
tags:
  - obsidian
  - Dataview
  - queries
  - snippets
aliases: 
isToc: false
isRootNote: false
parent: "[[📔 Obsidian]]"
---
## Overview 
With Dataview queries, Dataview scripts and the Tasks plugins query you can automate a lot of your obsidian workflow. It isn't always as intuitive how to perform these queries so I will have some examples in this page to guide myself and others.

## Example queries 
### Pending tasks 
The following query, brings in the pending tasks from my vault. It excludes templates, [[🧉 Personal - Birthday Listing]], and #todo/dailyQuest . 

```SQL
TASK
WHERE !completed
  AND !contains(file.path, "birthdays") 
  AND !contains(file.path, "templates") 
  AND !contains(tags, "#todo/dailyQuest") 
  AND text != ""
GROUP BY file.link
```

Additionally I added a lowSortPriority front matter property to some files that I want to show up at the bottom. Since I have some less essential tasks in my vault, like my anime watch list or read list. In my mind that list should be at the very bottom, and at the top should be tasks that have a higher priority. It is kind of difficult to do with a regular query so I had to make use of a script. Remember scripts need the key `dataviewjs` at the top for them to be recognized.

```js
// Step 1: Get all files with tasks, filter tasks later
const filesWithTasks = dv.pages()
  .where(p => p.file.tasks.length > 0);

// Step 2: Sort files by taskSortPriority
const sortedFiles = filesWithTasks.sort(f => f.taskSortPriority === "low" ? 1 : 0, "asc");

// Step 3: Render tasks per file with filtering
for (const file of sortedFiles) {
  const filteredTasks = file.file.tasks
    .where(t => !t.completed
      && !t.path.includes("birthdays")
      && !t.path.includes("templates")
      && !t.tags.includes("#todo/dailyQuest")
      && t.text !== "");
  if (filteredTasks.length > 0) {
    dv.header(3, file.file.link);
    dv.taskList(filteredTasks, false);
  }
}
```

## References
* https://publish.obsidian.md/tasks/Queries/Sorting#Priority