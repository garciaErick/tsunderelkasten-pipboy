---
title: 🍳 Recetas
created: 2025-03-28
dg-publish: true
dg-show-local-graph: false
dg-pinned: true
description: 
tags: 
aliases: 
isToc: true
isRootNote: false
parent: "[[🍳 Cooking]]"
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

// Build the list recursively
function buildList(page, indent = 0) {
    const indentStr = "  ".repeat(indent);
    const link = dv.fileLink(page.file.path, false, page.file.name);
    let output = `${indentStr}- ${link}`;
    if (page.isToc) {
        const nestedChildren = allPages.where(p => {
            return p.parent && p.parent.toString() === page.file.link.toString();
        });
        for (const child of nestedChildren) {
            output += "\n" + buildList(child, indent + 1);
        }
    }
    return output;
}

// Build and render TOC
let tocContent = "";
if (children.length === 0) {
    tocContent = "No direct children found for '" + currentPage.file.name + "'.";
} else {
    const tocItems = children.map(child => buildList(child));
    tocContent = tocItems.join("\n");
}
dv.paragraph("## 📑 Table of Contents\n" + tocContent);
```