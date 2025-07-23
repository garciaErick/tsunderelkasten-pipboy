/**
 * Adds a todo item to a specific section in a file
 * @param {Object} tp - Templater object
 * @param {string} [filePath] - Path to the target file (defaults to current file)
 * @param {string} sectionName - Name of the section to add todo to - set to null to add anywhere, set to "auto" for section suggester
 * @param {string} todoContent - The todo description/content
 * @param {Object} options - Optional configuration
 * @param {boolean} options.createSection - Whether to create section if it doesn't exist (default: true)
 * @param {string} options.insertPosition - Where to insert in section: "start" or "end" (default: "start")
 * @returns {Object} - {success: boolean, message: string, file?: TFile}
 */
async function addTodoToFileSection(tp, filePath = null, sectionName, todoContent, options = {}) {
    try {
        // Set default options
        const opts = {
            createSection: true,
            insertPosition: "start",
            ...options
        };

        // Use current file if no path specified
        const targetPath = filePath || tp.file.path || tp.config.target_file.path;
        
        if (!targetPath) {
            return {
                success: false,
                message: "No file path provided and unable to determine current file"
            };
        }

        // Use helper to resolve section name
        const matchSectionOrSuggestFromFile = tp.user.matchSectionOrSuggestFromFile;
        const sectionResult = await matchSectionOrSuggestFromFile(tp, targetPath, sectionName, "Select section for todo:", ["todo"]);
        
        if (!sectionResult.success) {
            return {
                success: false,
                message: sectionResult.message
            };
        }

        const finalSectionName = sectionResult.sectionName;

        // Get current date and time, format the todo line with standard defaults
        const creationDate = tp.date.now("YYYY-MM-DD");
        const finalTimestamp = tp.date.now("HH:mm");
        const todoLine = `- [ ] ${finalTimestamp} - ${todoContent} ➕ ${creationDate}`;

        // Use the generic helper to add the formatted todo
        const addContentToFileSection = tp.user.addContentToFileSection;
        const result = await addContentToFileSection(tp, targetPath, finalSectionName, todoLine, {
            createSection: opts.createSection,
            insertPosition: opts.insertPosition
        });

        // Update the message to be todo-specific
        if (result.success) {
            result.message = finalSectionName ? 
                `Todo added to "${finalSectionName}" in ${result.file.basename}` : 
                `Todo added to ${result.file.basename}`;
        }

        return result;

    } catch (error) {
        return {
            success: false,
            message: `Error adding todo: ${error.message}`
        };
    }
}

// Export the function for use in other templates
module.exports = addTodoToFileSection;