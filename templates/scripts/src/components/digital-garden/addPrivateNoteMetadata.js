/**
 * Helper function to add private note metadata to a file
 * @param {Object} tp - Templater object
 * @param {Object} file - Obsidian file object (optional if using current file)
 * @param {boolean} dgHide - Whether to hide the file (default: true)
 * @param {boolean} dgHideInGraph - Whether to hide in graph (default: true)
 * @returns {Promise<string>} The updated file content
 */
async function addPrivateNoteMetadata(tp, file = null, dgHide = true, dgHideInGraph = true) {
    const updateFrontmatter = tp.user.updateFrontmatter;
    
    // If no file provided, use current file
    const targetFile = file || tp.file.find_tfile(tp.file.title);
    
    if (!targetFile) {
        throw new Error("No file found for adding private note metadata");
    }
    
    // Get the file path and make it URL-friendly
    const originalPath = targetFile.path.replace(/\.md$/, '');
    
    // Convert to URL-friendly path
    const urlFriendlyPath = originalPath
        .toLowerCase()                    // Convert to lowercase
        .replace(/\./g, '-')             // Replace dots with hyphens FIRST
        .replace(/[^\w\s-/]/g, '')       // Remove special chars except word chars, spaces, hyphens, slashes
        .replace(/\s+/g, '-')            // Replace spaces with hyphens
        .replace(/-+/g, '-')             // Replace multiple hyphens with single
        .replace(/^-+|-+$/g, '')         // Remove leading/trailing hyphens
        .replace(/\/-/g, '/')            // Remove hyphens after slashes
        .replace(/-\//g, '/');           // Remove hyphens before slashes
    
    // Build updates object
    const updates = {
        'dg-path': urlFriendlyPath,
        'dg-hide': dgHide,
        'dg-hide-in-graph': dgHideInGraph
    };
    
    // Use your existing updateFrontmatter helper
    return await updateFrontmatter(tp, targetFile, updates);
}

module.exports = addPrivateNoteMetadata;