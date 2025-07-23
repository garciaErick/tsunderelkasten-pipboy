---
title: 📔 Obsidian - Dataview example queries
created: 2025-04-01
dg-publish: true
dg-show-local-graph: false
description: 
tags:
  - obsidian
  - templater
  - snippets
aliases: 
isToc: false
isRootNote: false
parent: "[[📔 Obsidian]]"
---
# Templater Quick Action Setup Guide

## Overview
This guide shows how to set up a Templater action that quickly opens your daily workout file without creating any new files or clutter.

## Setup Steps

### 1. Create the Action Template
- Create a new note in your `1. Actions/` folder
- Name it something like [[Daily Workout]]
- Add this content:

```javascript
<%*
const today = tp.date.now("YYYY-MM-DD dddd");
const fullPath = `tsunderelkasten/1.fleeting/1.daily/${today} Workout.md`;

try {
    const file = app.vault.getAbstractFileByPath(fullPath);
    if (file) {
        await app.workspace.getLeaf(false).openFile(file);
    } else {
        new Notice(`Workout not found: ${today}`);
    }
} catch (error) {
    new Notice("Error opening workout file");
    console.error(error);
}
%>
```

### 2. How to Use
**Method 1: Command Palette**
- Press `Ctrl/Cmd + P`
- Type "Templater: Insert template"
- Select your "Open Daily Workout" template

**Method 2: Assign Hotkey (Recommended)**
- Go to Settings → Templater → Hotkeys
- Find your "Open Daily Workout" template
- Assign a hotkey (e.g., `Ctrl + Shift + W`)
- Now you can open today's workout from anywhere with the hotkey

### 3. What It Does
- ✅ Generates today's date in the correct format (e.g., "2025-06-23 Monday")
- ✅ Looks for the workout file in your specified path
- ✅ Opens the file in a new tab (doesn't replace current file)
- ✅ Shows a notice if the file doesn't exist
- ✅ Handles errors gracefully
- ✅ No extra files created, no template content inserted

## References
* [Obsidian Docs](https://docs.obsidian.md/Reference/TypeScript+API/Vault/getAbstractFileByPath)
* [SilentVoid13/Templater Templates Showcase](https://github.com/SilentVoid13/Templater/discussions/categories/templates-showcase?discussions_q=is%3Aopen+category%3A%22Templates+Showcase%22+sort%3Atop)
