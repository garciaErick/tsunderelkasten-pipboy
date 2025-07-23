// Helper function to find files by entityType and return all frontmatter
const getEntitiesByType = (tp, entityTypes) => {
    // Normalize entityTypes to array
    const typeArray = Array.isArray(entityTypes) ? entityTypes : [entityTypes];
    
    // Find all files with the specified entityType(s) using Obsidian's metadata cache
    const entityFiles = app.vault.getMarkdownFiles().filter(file => {
        const cache = app.metadataCache.getFileCache(file);
        const fileEntityType = cache?.frontmatter?.entityType;
        
        // Handle both array and single value entityTypes
        if (!fileEntityType) return false;
        
        // If fileEntityType is an array, check if any of its values match our search
        if (Array.isArray(fileEntityType)) {
            return typeArray.some(searchType => fileEntityType.includes(searchType));
        }
        
        // If fileEntityType is a single value, check if it matches any of our search types
        return typeArray.includes(fileEntityType);
    });
    
    if (entityFiles.length === 0) {
        const typeDisplay = Array.isArray(entityTypes) ? entityTypes.join(' + ') : entityTypes;
        return { success: false, reason: `No files with entityType '${typeDisplay}' found`, files: [] };
    }
    
    // Extract all frontmatter from files using metadata cache
    const filesWithData = entityFiles.map(file => {
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

module.exports = getEntitiesByType;