// Helper function to find files by tag(s) and return all frontmatter
const findFilesByTag = (tp, tags) => {
    // Normalize tags to array
    const tagArray = Array.isArray(tags) ? tags : [tags];
    
    // Find all files with the specified tag(s) using Obsidian's metadata cache
    const taggedFiles = app.vault.getMarkdownFiles().filter(file => {
        const cache = app.metadataCache.getFileCache(file);
        const fileTags = cache?.frontmatter?.tags || [];
        
        // Check if file has ALL specified tags
        return tagArray.every(tag => fileTags.includes(tag));
    });

    if (taggedFiles.length === 0) {
        const tagDisplay = Array.isArray(tags) ? tags.join(' + ') : tags;
        return { success: false, reason: `No files with tag(s) '${tagDisplay}' found`, files: [] };
    }

    // Extract all frontmatter from files using metadata cache
    const filesWithData = taggedFiles.map(file => {
        const cache = app.metadataCache.getFileCache(file);
        
        return {
            file: file,
            frontmatter: cache?.frontmatter || {}
        };
    });

    return {
        success: true,
        files: filesWithData,
        count: filesWithData.length
    };
};

module.exports = findFilesByTag;