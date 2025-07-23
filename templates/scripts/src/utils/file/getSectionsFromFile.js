/**
 * Gets all sections from a file
 * @param {Object} tp - Templater object
 * @param {string} [filePath] - Path to the target file (defaults to current file)
 * @returns {Object} - {success: boolean, sections: string[], message?: string}
 */
async function getSectionsFromFile(tp, filePath = null) {
    try {
        // Use current file if no path specified
        const targetPath = filePath || tp.file.path || tp.config.target_file.path;
        
        if (!targetPath) {
            return {
                success: false,
                sections: [],
                message: "No file path provided and unable to determine current file"
            };
        }

        // Get the file
        const file = tp.app.vault.getAbstractFileByPath(targetPath);
        if (!file) {
            return {
                success: false,
                sections: [],
                message: `File not found: ${targetPath}`
            };
        }

        // Read file content and extract sections
        const fileContent = await tp.app.vault.read(file);
        const sections = fileContent.match(/^#+\s+.+$/gm) || [];
        
        return {
            success: true,
            sections: sections,
            message: sections.length > 0 ? `Found ${sections.length} sections` : "No sections found"
        };

    } catch (error) {
        return {
            success: false,
            sections: [],
            message: `Error reading sections: ${error.message}`
        };
    }
}

// Export the function as default
module.exports = getSectionsFromFile;