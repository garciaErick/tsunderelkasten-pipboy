async function quickFoodCapture(tp) {
    const openFile = tp.user.openFile;
    const parseFrontmatter = tp.user.parseFrontmatter;
    const updateFrontmatter = tp.user.updateFrontmatter;
    const findDailyNote = tp.user.findDailyNote;
    
    // Find today's daily note
    const dailyNoteInfo = findDailyNote(tp);
    if(!dailyNoteInfo.exists) {
        new Notice(`Daily note not found: ${dailyNoteInfo.date}`);
        return;
    }
    
    let foodItem = await tp.system.prompt("What did you eat?");
    if(!foodItem) return; // User cancelled
    
    // Get current frontmatter using helper
    const frontmatterData = await parseFrontmatter(tp, dailyNoteInfo.file);
    
    // Get existing foods array or create empty one
    const currentFoods = frontmatterData.foods || [];
    
    // Add new food item
    const updatedFoods = [...currentFoods, foodItem];
    
    // Update frontmatter using helper
    await updateFrontmatter(tp, dailyNoteInfo.file, { foods: updatedFoods });
    
    // Open the daily note to show the updated foods list
    await openFile(dailyNoteInfo.path);
    new Notice(`Added "${foodItem}" to foods list!`);
}

module.exports = quickFoodCapture;