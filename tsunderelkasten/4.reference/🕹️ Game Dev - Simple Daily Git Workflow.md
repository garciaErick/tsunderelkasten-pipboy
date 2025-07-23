---
title: 🕹️ Game Dev - Simple Daily Git Workflow
created: 2025-05-06
dg-publish: true
dg-show-local-graph: false
description: This runbook helps you stay in sync with main, commit changes, create a pull request (PR), and reset your branch. Follow daily to keep your branch (e.g., tsunderick) aligned.
tags:
  - game-dev
  - godot
  - indie
  - git
aliases:
  - Git good practices
---
# Simple Daily Git Workflow for Indie-Seishun
This runbook helps you stay in sync with main, commit changes, create a pull request (PR), and reset your branch. Follow daily to keep your branch (e.g., tsunderick) aligned.

```dataviewjs
const currentFile = dv.current().file;
const content = await dv.io.load(currentFile.path);
const lines = content.split("\n");

// Find headers
const headings = lines
  .map((line, index) => {
    const match = line.match(/^(#+)\s*(.+)$/);
    if (match) {
      return {
        level: match[1].length,
        text: match[2].trim(),
        line: index
      };
    }
    return null;
  })
  .filter(h => h);

// Build TOC items with indentation
const tocItems = headings.map(h => {
  const indent = "  ".repeat(h.level - 1); // Indent based on header level
  const link = dv.sectionLink(currentFile.path, h.text, false, h.text);
  return `${indent}- ${link}`; // Single bullet with indent
});

// Render TOC in one paragraph
dv.paragraph("## 📑 Table of Contents\n" + tocItems.join("\n"));
```

## Prerequisites
- Git installed, repo cloned: https://github.com/Indie-Seishun/indie-seishun.
- Godot project opened to test changes.
- Your branch (e.g., tsunderick) set up.
## Steps
### 1. Open Project
- Open Godot, load indie-seishun project.
- In terminal, go to project folder:
```bash
cd /path/to/indie-seishun
```
- Switch to your branch:
```bash
git checkout your-branch
```
### 2. Sync with main
- Pull and rebase onto main:
```bash
git pull --rebase origin main
```
- If conflicts occur:
    - Edit conflicted files 
    - Stage resolved files:
```bash
git add file
```
* Continue:
```bash
git rebase --continue
```
        
### 3. Commit Changes
- Edit files in Godot or editor.
- Stage changes:
```bash
git add .
```
- Commit:
```bash
git commit -m "description"
```
Example:
```bash
git commit -m "Added two-player mode"
```
### 4. Push to Your Branch
- Push commits:
```bash
git push
```
### 5. Create PR to main
- Go to GitHub: https://github.com/Indie-Seishun/indie-seishun.
- Create PR:
	* Base: main, compare: your-branch
	* Fix feedback:
    - Edit, commit, push:
```bash
git add .
git commit -m "Fixed feedback"
git push
```
 - Merge PR on GitHub.
### 6. Reset Branch to origin/main
- Update local main:
```bash
git checkout main
git pull origin main
```
- Reset your branch:
```bash
git checkout your-branch
git reset --hard origin/main
```
- Push force with lease: this overrides your unique commit in your branch and that is how you are in sync with main. DO NOT do this if you have pending work or commits, that have NOT been PR'd and merged
```bash
git push --force-with-lease
```
- Check sync:
    ```bash
    git status
    ```
Should say: “Your branch is up to date with 'origin/your-branch'.”
* Compare where the head of the branches are
```bash
git log --oneline --graph --all
```
## Tips
- Sync Daily: Run step 2 every morning.
- Push Often: Push after commits to avoid divergence.
- Test in Godot: Check project works after rebasing/resetting.
- Stash Changes: Save work before rebasing/resetting:
```bash
git stash
```
Reapply:
```bash
git stash pop
```
### If Stuck
- Conflicts: Abort rebase if needed:
```bash
git rebase --abort
```
- Push Errors: Check with team before force-pushing.
- Ask for help if changes are lost or Godot breaks.