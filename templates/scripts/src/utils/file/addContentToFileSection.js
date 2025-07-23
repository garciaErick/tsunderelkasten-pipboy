/**
 * Adds content to a specific section in a file or at the end of file
 * @param {Object} tp - Templater object
 * @param {string} filePath - Path to the target file
 * @param {string} sectionName - Name of the section to add content to - set to null to add anywhere
 * @param {string} content - The content to add
 * @param {Object} options - Optional configuration
 * @param {boolean} options.createSection - Whether to create section if it doesn't exist (default: true)
 * @param {string} options.insertPosition - Where to insert in section: "start" or "end" (default: "start")
 * @returns {Object} - {success: boolean, message: string, file?: TFile}
 */
async function addContentToFileSection(tp, filePath, sectionName, content, options = {}) {
    try {
        // Set default options
        const opts = {
            createSection: true,
            insertPosition: "start",
            ...options
        };

        // Get the file
        const file = tp.app.vault.getAbstractFileByPath(filePath);
        if (!file) {
            return {
                success: false,
                message: `File not found: ${filePath}`
            };
        }

        // Read file content
        let fileContent = await tp.app.vault.read(file);

        // If no section specified, add directly to file at end
        if (!sectionName) {
            fileContent = fileContent + '\n' + content;
        } else {
            // Create regex to find the section
            let regexPattern;
            if (sectionName.startsWith('#')) {
                regexPattern = `^${sectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`;
            } else {
                regexPattern = `^#+\\s+${sectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`;
            }
            const sectionRegex = new RegExp(regexPattern, 'm');
            const sectionMatch = fileContent.match(sectionRegex);

            if (sectionMatch) {
                // Section exists, find where to insert the content
                const sectionIndex = sectionMatch.index + sectionMatch[0].length;
                
                if (opts.insertPosition === "start") {
                    // Insert right after the section header
                    const beforeSection = fileContent.substring(0, sectionIndex);
                    const afterSection = fileContent.substring(sectionIndex);
                    fileContent = beforeSection + '\n' + content + afterSection;
                } else {
                    // Insert at the end of the section (before next section or end of file)
                    const afterSectionContent = fileContent.substring(sectionIndex);
                    const nextSectionMatch = afterSectionContent.match(/\n^#+\s+/m);
                    
                    if (nextSectionMatch) {
                        // There's a next section - insert before it
                        const nextSectionIndex = sectionIndex + nextSectionMatch.index;
                        const beforeNextSection = fileContent.substring(0, nextSectionIndex);
                        const afterNextSection = fileContent.substring(nextSectionIndex);
                        fileContent = beforeNextSection + '\n' + content + afterNextSection;
                    } else {
                        // No next section - add at the very end of the file
                        fileContent = fileContent + '\n' + content;
                    }
                }
            } else if (opts.createSection) {
                // Section doesn't exist, create it
                const headerToCreate = sectionName.startsWith('#') ? sectionName : `## ${sectionName}`;
                const newSection = `\n\n${headerToCreate}\n${content}`;
                fileContent += newSection;
            } else {
                return {
                    success: false,
                    message: `Section "${sectionName}" not found and createSection is disabled`
                };
            }
        }

        // Save the updated file
        await tp.app.vault.modify(file, fileContent);

        return {
            success: true,
            message: sectionName ? `Content added to "${sectionName}" in ${file.basename}` : `Content added to ${file.basename}`,
            file: file
        };

    } catch (error) {
        return {
            success: false,
            message: `Error adding content: ${error.message}`
        };
    }
}

// Export the function for use in other templates
module.exports = addContentToFileSection;