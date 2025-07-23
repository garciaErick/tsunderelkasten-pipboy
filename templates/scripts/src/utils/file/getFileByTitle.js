/**
 * Gets a file by title and optionally reads its content
 * @param {Object} tp - Templater object
 * @param {string} title - File title (optional, defaults to current file)
 * @returns {Object} - {success: boolean, file?: TFile, content?: string, message?: string}
 */
async function getFileByTitle(tp, title = null) {
    try {
        // Use current file title if none provided
        const fileTitle = title || tp.file.title;
        
        // Get the file
        const file = tp.file.find_tfile(fileTitle);
        if (!file) {
            new Notice(`Could not find file: ${fileTitle}`);
            return {
                success: false,
                message: `Could not find file: ${fileTitle}`
            };
        }
        
        let content = await app.vault.read(file);
        
        return {
            success: true,
            file: file,
            content: content
        };
    } catch (error) {
        new Notice(`Error reading file: ${error.message}`);
        return {
            success: false,
            message: `Error reading file: ${error.message}`
        };
    }
}

// Export the function
module.exports = getFileByTitle;