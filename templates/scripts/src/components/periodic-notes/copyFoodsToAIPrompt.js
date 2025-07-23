/**
 * Helper function to copy foods to clipboard with AI prompt and open Claude
 * @param {Object} tp - Templater object
 * @returns {Promise<void>}
 */
async function copyFoodsToAIPrompt(tp) {
    try {
        // Check current file first
        let frontmatter = tp.user.parseFrontmatter(tp);
        let foods = frontmatter.foods || [];
        
        // If no foods in current file, fall back to today's daily note
        if (foods.length === 0) {
            const dailyNoteResult = tp.user.findDailyNote(tp);
            
            if (!dailyNoteResult.exists) {
                new Notice("No foods found in daily note or current file");
                return;
            }
            
            frontmatter = tp.user.parseFrontmatter(tp, dailyNoteResult.file);
            foods = frontmatter.foods || [];
            
            // If still no foods after checking daily note
            if (foods.length === 0) {
                new Notice("No foods found in daily note or current file");
                return;
            }
        }
        
        const promptResult = await tp.user.getFileByTitle(tp, "💾 AI Assistant - Deficit Prompt");
        
        if (!promptResult.success) {
            new Notice("AI Deficit prompt file not found!");
            return;
        }
        
        // Build the final prompt
        const lines = [];
        lines.push(promptResult.content);
        lines.push("");
        lines.push("# Final input for Hachikuji AI");
        lines.push("## Input for Foods Eaten Today");
        lines.push(`Found: ${foods.length} food items`);
        foods.forEach(food => lines.push(`- ${food}`));
        
        const finalPrompt = lines.join("\n");
        
        // Copy to clipboard and open Claude
        await navigator.clipboard.writeText(finalPrompt);
        new Notice(`Copied AI prompt with ${foods.length} foods to clipboard!`);
        window.open("https://claude.ai/new", '_blank');
        
    } catch (error) {
        new Notice("Error creating AI prompt");
        console.error(error);
    }
}

module.exports = copyFoodsToAIPrompt;