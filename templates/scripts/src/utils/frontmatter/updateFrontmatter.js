/**
 * Helper function to update frontmatter fields and save
 * @param {Object} tp - Templater object
 * @param {Object} file - Obsidian file object
 * @param {Object} updates - Key-value pairs to update in frontmatter
 * @returns {Promise<string>} The updated file content
 */
async function updateFrontmatter(tp, file, updates) {
    if (!file || !file.path) {
        throw new Error("Invalid file provided");
    }
    
    try {
        // Use Obsidian's built-in frontmatter processing
        await app.fileManager.processFrontMatter(file, (frontmatter) => {
            // Update frontmatter with new values
            Object.entries(updates).forEach(([key, value]) => {
                frontmatter[key] = value;
            });
        });
        
        // Read and return the updated content
        return await app.vault.read(file);
        
    } catch (error) {
        console.error("Error updating frontmatter:", error);
        throw error;
    }
}

module.exports = updateFrontmatter;