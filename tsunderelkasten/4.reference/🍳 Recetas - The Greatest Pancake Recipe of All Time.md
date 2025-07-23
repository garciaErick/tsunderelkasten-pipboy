---
title: 🍳 Recetas - The Greatest Pancake Recipe of All Time
created: 2025-04-02
dg-publish: true
dg-show-local-graph: false
description: 
tags: 
aliases: 
isToc: false
isRootNote: false
parent: "[[🍳 Recetas]]"
---
![[pasted-image-20250402004248.png]]
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

## Ingredients

* 140g (10T) unsalted butter
* 600g (5c) all-purpose flour
* 12g (2 1/2t) salt (I use coarse kosher)
* 60g (1/4c) granulated sugar
* 2g (1/2t) baking soda
* 25g (5t) baking powder
* 900g (3 2/3c) buttermilk
* 4 large eggs
* Grassfed salted butter (for serving)

## Instructions
1. Place butter into a pan over low heat and melt.  Set aside.
2. In a medium bowl, combine flour, salt,sugar, baking soda, and baking powder. Whisk the dry ingredients until the salt and leaveners are evenly mixed throughout.
3. In a second bowl, combine buttermilk and eggs. Whisk  until well blended. If you can’t find buttermilk, combine 500 grams (2 cups) of sour cream with 400 grams (1 2/3 cups) of water as a substitute.
4. Pour the buttermilk mixture into the dry ingredients and carefully fold to combine. Start with 10 gentle stirs.
5. Stream in half of the melted butter and fold gently. Then, add the remaining butter and fold for another 30 seconds. Be careful not to overmix the batter; it should remain lumpy.
6. Heat a griddle or non-stick pan to 350-375°F (175-190°C). Use a 4-ounce scoop or 1/2 cup of batter per pancake.
7. Drop the batter onto the preheated griddle or pan with a 4oz scoop or about a ½ cup measure and smooth it out into a round shape.
8. Cook for 2-3 minutes on the first side until golden brown. Flip and cook for another 2-3 minutes on the second side.
9. To check if the pancakes are done, give them a quick poke. If they are firm and do not cave in, they are ready. If they cave in, continue cooking.
10. Serve the pancakes immediately, or keep them warm in a low oven if cooking multiple batches.
## Leftovers 
### Pancake McGriddle Sandwich Recipe
#### Leftovers Ingredients
* Leftover pancakes
* Breakfast sausage patty
* 2 slices American cheese
* 1 fried egg
* Maple syrup

#### Leftovers Instructions
1. Use a wide-rimmed glass or cup to press leftover pancakes into perfect 4-inch rounds.
2. Toast the pancake rounds in a toaster for 2 minutes.
3. Cook a breakfast sausage patty in a pan until cooked through, then top with 2 slices of American cheese to melt. 
4. To assemble the sandwich, place the cheesy sausage patty on one toasted pancake, top with a fried egg then place the second toasted pancake on top, give it a gentle squish to break the yolk, and drizzle with maple syrup.

## References
* I DID NOT MAKE THIS RECIPE: [The Greatest Pancake Recipe of All Time (The GOAT) - YouTube](https://www.youtube.com/watch?v=4QcK3MXl9sg) by [Brian Lagerstrom](https://www.instagram.com/brian_lagerstrom) 