async function addDailyHeadspace(tp) {
    const openFile = tp.user.openFile;
    const findDailyNote = tp.user.findDailyNote;
    
    const targetHeading = '### 🧉 Hey Erick, What is on your mind?';
    
    // Find today's daily note
    const dailyNoteInfo = findDailyNote(tp);
    if(!dailyNoteInfo.exists) {
        new Notice(`Daily note not found: ${dailyNoteInfo.date}`);
        return;
    }
    
    let thought = await tp.system.prompt("What's on your mind today?");
    if(!thought) return; // User cancelled
    
    let curContent = await app.vault.read(dailyNoteInfo.file);
    
    // Find "Keep it simple" and add after it
    let keepItSimpleIndex = curContent.indexOf('*Keep it simple*');
    if(keepItSimpleIndex === -1) {
        new Notice("Could not find 'Keep it simple' line!");
        return;
    }
    
    // Find the end of that line
    let lineEndIndex = curContent.indexOf('\n', keepItSimpleIndex);
    if(lineEndIndex === -1) lineEndIndex = curContent.length;
    
    // Insert the new thought after the "Keep it simple" line
    let beforeInsertion = curContent.substring(0, lineEndIndex);
    let afterInsertion = curContent.substring(lineEndIndex);
    
    let newContents = beforeInsertion + '\n' + thought + afterInsertion;
    
    await app.vault.modify(dailyNoteInfo.file, newContents);
    await openFile(dailyNoteInfo.path);
    
    new Notice("Added your thought!");
}

module.exports = addDailyHeadspace;