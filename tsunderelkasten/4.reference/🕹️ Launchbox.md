---
title: 🕹️ Launchbox
created: 2025-03-28
dg-publish: true
dg-show-local-graph: false
description: Launchbox is my favorite premium front end for emulation
tags:
  - gaming
  - launchbox
  - emulation
  - front-end
aliases: 
isToc: true
isRootNote: false
parent: "[[🕹️ Gaming]]"
obsidianUIMode: preview
---
```dataviewjs
// Get the current page
const currentPage = dv.current();

// Get all pages
const allPages = dv.pages();

// Filter for children of the current page using parent.toString()
const children = allPages.where(p => {
    return p.parent && p.parent.toString() === currentPage.file.link.toString();
});

if (children.length === 0) {
    dv.paragraph("No direct children found for '" + currentPage.file.name + "'.");
}

// Build the list
function buildList(page, indent = 0) {
    let output = "";
    const indentStr = "  ".repeat(indent);
    output += `${indentStr}- [[${page.file.name}]]\n`;
    if (page.isToc) {
        const nestedChildren = allPages.where(p => {
            return p.parent && p.parent.toString() === page.file.link.toString();
        });
        for (const child of nestedChildren) {
            output += buildList(child, indent + 1);
        }
    }
    return output;
}

let result = "";
for (const child of children) {
    result += buildList(child);
}
dv.paragraph("## TOC\n" + result);
```
