/**
 * Helper function to get frontmatter from a file
 * @param {Object} tp - Templater object
 * @param {Object} file - Obsidian file object (optional if using current file)
 * @returns {Object} The frontmatter object
 */
function parseFrontmatter(tp, file = null) {
    try {
        // If no file provided, use current file
        const targetFile = file || tp.file.find_tfile(tp.file.title);
        
        if (!targetFile) {
            console.warn("No file found for frontmatter parsing");
            return {};
        }
        
        // Use Obsidian's metadata cache to get frontmatter
        const fileCache = app.metadataCache.getFileCache(targetFile);
        return fileCache?.frontmatter || {};
        
    } catch (error) {
        console.error("Error parsing frontmatter:", error);
        return {};
    }
}

module.exports = parseFrontmatter;