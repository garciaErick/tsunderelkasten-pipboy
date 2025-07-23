---
title: 🕹️ Gaming - Final Fantasy 7 Menu Colors
created: 2025-03-28
dg-publish: true
dg-show-local-graph: false
description: 
tags:
  - ff7
  - final-fantasy
  - final-fantasy-7
  - ffvii
  - final-fantasy-vii
aliases: 
isToc: false
isRootNote: false
parent: "[[🕹️ Gaming]]"
---
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

## Menu Colors 
### Top Left
* R: 137
* G: 137
* B: 211
### Bottom Left
* R: 92
* G: 92
* B: 201
### Top Right
* R: 255
* G: 174
* B: 255
### Bottom Right
* R: 001
* G: 209
* B: 255
## Screenshots
![[20230517230105_1.jpg]]
![[20230518014010_1.jpg]]
![[20230518130052_1.jpg]]