---
title: 🕹️ Starcraft - How to play Starcraft 1 with an Ergodox keyboard
created: 2025-05-15
dg-publish: true
dg-show-local-graph: false
description: My Ergodox layout design for Starcraft left handed players.
tags:
  - gaming
  - starcraft
  - ergodox
aliases: 
isToc: false
isRootNote: false
parent: "[[🕹️ Gaming]]"
---
I have been trying to enjoy and learn to play Starcraft 1, however due to my weird keyboard I wasn't having a great time until I decided to design a layout where I can quickly reach all hotkeys with my left hand, while using my right hand exclusively for mouse. I am using only the left part of my Ergodox keyboard.
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

## Starcraft Game hotkeys
* Alt + 0-9: Select and center camera on group
* Ctrl + 0-9: Assign group
* Shift + 0-9: Add to group
* Shift + F2-F4: Save map location
* F2-F4: Recall saved map location (e.g., F2 jumps to saved view)
* Backspace: Cycle bases (switches between Hatcheries/Command Centers/Nexuses)
* 0-9: Select group (e.g., 1 selects Group 1; double-tap centers camera)
## Unit hotkey structure 
The command card (unit/building actions) in StarCraft uses a 3x3 grid, often mapped to a “Grid” layout. I’m using default hotkeys but noting the Grid structure for reference.
```
QWE = first row (e.g., Terran: SCV on `Q`, Marine on `Q` in Grid)
ASD = second row 
ZXC = third row 
```

![[pasted-image-20250515051150.png]]
![[pasted-image-20250515051024.png]]
## Ergodox
My ErgoDox EZ is configured for left-hand-only use, with two layers: Layer 1 for base commands (unit control) and Layer 2 for modifier macros (selection layer).
### Base layer - Unit control
This basically uses my grid layout for selecting the unit/building commands. Additionally, the mod select key from the diagram goes into the second layer without any modifier, in order to use most of the select hotkeys.

![[pasted-image-20250515051135.png]]
### Secondary Layer - Selection Layer
This layout is for convenience, since its left handed only I included all of the numbers and FX group keys closely. I even added some redundant FX keys in order to reach them more easily.
![[pasted-image-20250515051353.png]]