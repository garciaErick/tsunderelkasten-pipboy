/**
 * Opens a file in your Obsidian tab by file path. Will optionally create 
 * if pass in true to the second parameter. Can also jump to a specific heading.
 * @param {string} fullPath - 
 * @param {string} targetHeading - Optional heading to jump to after opening
 * @param {boolean} createIfDoesNotExist - 
 */
async function openFile(fullPath, targetHeading = null, createIfDoesNotExist) {
    try {
        let file = app.vault.getAbstractFileByPath(fullPath);
        
        if (!file && createIfDoesNotExist) {
            // Create empty file if it doesn't exist
            file = await app.vault.create(fullPath, '');
            new Notice(`Created new file: ${fullPath}`);
        }
        
        // Open the file
        await app.workspace.getLeaf(false).openFile(file);
        
        // Jump to heading if specified
        if (targetHeading) {
            setTimeout(async () => {
                const editor = app.workspace.activeLeaf?.view?.editor;
                if (editor) {
                    const content = editor.getValue();
                    const headingIndex = content.indexOf(targetHeading);
                    
                    if (headingIndex !== -1) {
                        const beforeHeading = content.substring(0, headingIndex);
                        const lineNumber = beforeHeading.split('\n').length - 1;
                        
                        editor.setCursor(lineNumber, 0);
                        editor.scrollIntoView({from: {line: lineNumber, ch: 0}, to: {line: lineNumber, ch: 0}}, true);
                        
                        new Notice(`Jumped to section!`);
                    } else {
                        new Notice(`Section "${targetHeading}" not found`);
                    }
                }
            }, 100);
        }
        
    } catch (error) {
        new Notice("Error with file");
        console.error(error);
    }
}
module.exports = openFile;