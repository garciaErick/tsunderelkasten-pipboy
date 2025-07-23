// Helper function to find daily note file
const findDailyNote = (tp, date = null) => {
    // Use provided date or default to today - use tp parameter properly
    const targetDate = date || tp.date.now("YYYY-MM-DD dddd");
    const dateOnly = date ? date.split(' ')[0] : tp.date.now("YYYY-MM-DD");
    const fullPath = `tsunderelkasten/1.fleeting/1.daily/${targetDate}.md`;
    
    const file = app.vault.getAbstractFileByPath(fullPath);
    
    return {
        file: file,
        path: fullPath,
        exists: !!file,
        date: targetDate,
        dateOnly: dateOnly
    };
};

module.exports = findDailyNote;