```dataviewjs
// Get the current page
const currentPage = dv.current();
// Get all pages
const allPages = dv.pages();

// Determine which page to use for TOC generation
let sourcePageLink = currentPage.file.link;
if (currentPage.tocSourceEntity) {
    sourcePageLink = currentPage.tocSourceEntity;
}

// Get the source page data
const sourcePage = sourcePageLink.toString() === currentPage.file.link.toString() 
    ? currentPage 
    : allPages.where(p => p.file.link.toString() === sourcePageLink.toString())[0];

if (!sourcePage) {
    dv.paragraph("❌ Source entity not found: " + sourcePageLink);
} else {
    // Get children in two ways:
    // 1. Files that have this source as their parent
    const childrenByParent = allPages.where(p => p.parent && p.parent.toString() === sourcePage.file.link.toString() && !p.file.path.includes("templates"));
    
    // 2. Files listed in the source's children property
    const childrenLinks = sourcePage.children || [];
    const childrenByProperty = childrenLinks.length > 0 
        ? allPages.where(p => childrenLinks.some(child => p.file.link.toString() === child.toString()))
        : [];
    
    // Combine both sets of children (remove duplicates)
    const allChildrenMap = new Map();
    [...childrenByParent, ...childrenByProperty].forEach(child => {
        allChildrenMap.set(child.file.path, child);
    });
    const children = Array.from(allChildrenMap.values());

    // Get related entities from the source page's frontmatter
    const relatedLinks = sourcePage.related || [];
    const relatedPages = relatedLinks.length > 0 
        ? allPages.where(p => relatedLinks.some(rel => p.file.link.toString() === rel.toString()))
        : [];

    // Build the list recursively
    function buildList(page, indent = 0) {
        const indentStr = "  ".repeat(indent);
        const link = dv.fileLink(page.file.path, false, page.file.name);
        let output = `${indentStr}- ${link}`;
        
        // Always recurse - get children of this page
        const nestedChildren = allPages.where(p => {
            return p.parent && p.parent.toString() === page.file.link.toString();
        });
        for (const child of nestedChildren) {
            output += "\n" + buildList(child, indent + 1);
        }
        
        return output;
    }

    // Build and render TOC
    let tocContent = "";

    // Show source if different from current page
    if (sourcePageLink.toString() !== currentPage.file.link.toString()) {
        tocContent += `**📍 Source:** ${dv.fileLink(sourcePage.file.path, false, sourcePage.file.name)}\n\n`;
    }

    // Add children section
    if (children.length === 0) {
        tocContent += "No direct children found for '" + sourcePage.file.name + "'.";
    } else {
        const tocItems = children.map(child => buildList(child));
        tocContent += "## 📑 Table of Contents\n" + tocItems.join("\n");
    }

    // Add related section if there are related entities
    if (relatedPages.length > 0) {
        const relatedItems = relatedPages.map(page => buildList(page));
        tocContent += "\n\n## 🔗 Related Entities\n" + relatedItems.join("\n");
    }

    dv.paragraph(tocContent);
}
```
