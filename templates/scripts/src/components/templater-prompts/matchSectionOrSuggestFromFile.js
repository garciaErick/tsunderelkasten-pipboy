/**
 * Matches a section name or shows a suggester if "auto" is passed
 * @param {Object} tp - Templater object
 * @param {string} filePath - Path to the target file
 * @param {string} sectionName - Section name, "auto" for suggester, or null
 * @param {string} promptMessage - Message to show in the suggester
 * @param {Array} priorityKeywords - Keywords to prioritize at the top (optional)
 * @returns {Object} - {success: boolean, sectionName: string|null, message?: string}
 */
async function matchSectionOrSuggestFromFile(tp, filePath, sectionName, promptMessage, priorityKeywords) {
    try {
        // Handle current file if no path specified
        let targetPath = filePath;
        if (!targetPath) {
            // Try different ways to get current file path
            if (tp.config && tp.config.target_file && tp.config.target_file.path) {
                targetPath = tp.config.target_file.path;
            } else if (tp.file && tp.file.path) {
                targetPath = tp.file.path;
            } else {
                // Fallback: try to get the active file
                const activeFile = tp.app.workspace.getActiveFile();
                if (activeFile) {
                    targetPath = activeFile.path;
                }
            }
        }
        
        if (!targetPath) {
            return {
                success: false,
                message: "No file path provided and unable to determine current file",
                sectionName: null
            };
        }

        // Get the file to read sections
        const file = tp.app.vault.getAbstractFileByPath(targetPath);
        if (!file) {
            return {
                success: false,
                message: `File not found: ${targetPath}`,
                sectionName: null
            };
        }
        // Read file content and extract sections
        const fileContent = await tp.app.vault.read(file);
        const allSections = fileContent.match(/^#+\s+.+$/gm) || [];
        
        // Filter out script-related sections
        const sectionMatches = allSections.filter(section => {
            const sectionText = section.toLowerCase();
            return !sectionText.includes('script') && !sectionText.includes('templater');
        });
        
        // If not "auto", validate that the section exists
        if (sectionName !== "auto") {
            const sectionExists = sectionMatches.some(section => {
                // Check if the provided section name matches any existing section
                if (sectionName.startsWith('#')) {
                    return section === sectionName;
                } else {
                    // Remove # and whitespace to compare just the section title
                    const cleanSection = section.replace(/^#+\s+/, '');
                    return cleanSection === sectionName;
                }
            });
            
            if (sectionExists) {
                return {
                    success: true,
                    sectionName: sectionName
                };
            } else {
                return {
                    success: false,
                    message: `Section "${sectionName}" not found in file`,
                    sectionName: null
                };
            }
        }
        
        if (sectionMatches.length === 0) {
            return {
                success: false,
                message: "No sections found in file",
                sectionName: null
            };
        }
        
        // Sort sections if priority keywords provided
        let sortedSections = sectionMatches;
        if (priorityKeywords && priorityKeywords.length > 0) {
            sortedSections = sectionMatches.sort((a, b) => {
                const aText = a.toLowerCase();
                const bText = b.toLowerCase();
                
                // Check if either section contains priority keywords
                const aHasPriority = priorityKeywords.some(keyword => aText.includes(keyword.toLowerCase()));
                const bHasPriority = priorityKeywords.some(keyword => bText.includes(keyword.toLowerCase()));
                
                // Priority sections come first
                if (aHasPriority && !bHasPriority) return -1;
                if (!aHasPriority && bHasPriority) return 1;
                
                // If both or neither have priority, maintain original order
                return 0;
            });
        }
        
        // Show suggester for section selection
        const selectedSection = await tp.system.suggester(
            sortedSections,
            sortedSections,
            false,
            promptMessage
        );
        if (!selectedSection) {
            return {
                success: false,
                message: "No section selected",
                sectionName: null
            };
        }
        return {
            success: true,
            sectionName: selectedSection
        };
    } catch (error) {
        return {
            success: false,
            message: `Error processing sections: ${error.message}`,
            sectionName: null
        };
    }
}
// Export the function
module.exports = matchSectionOrSuggestFromFile;