<%*
const frontmatter = await tp.file.include("[[1. TOC - Front matter for TOC logic]]");
const script = await tp.file.include("[[2. TOC - Generate TOC dataviewJs script]]");
tR += frontmatter.trim() + "\n" + script.trim();
%>