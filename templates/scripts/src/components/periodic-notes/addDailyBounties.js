async function addDailyBounties(tp) {
    const findDailyNote = tp.user.findDailyNote;
    const openFile = tp.user.openFile;
    
    const targetHeading = '### 🎯 Top 3 bounties';
    
    // Find today's daily note
    const dailyNoteInfo = findDailyNote(tp);
    if(!dailyNoteInfo.exists) {
        new Notice(`Daily note not found: ${dailyNoteInfo.date}`);
        return;
    }
    
    // Get the three bounties
    let bounty1 = await tp.system.prompt("Bounty #1:");
    if(!bounty1) return;
    
    let bounty2 = await tp.system.prompt("Bounty #2:");
    if(!bounty2) return;
    
    let bounty3 = await tp.system.prompt("Bounty #3:");
    if(!bounty3) return;
    
    let curContent = await app.vault.read(dailyNoteInfo.file);
    
    // Find the target heading
    let headingIndex = curContent.indexOf(targetHeading);
    if(headingIndex === -1) {
        new Notice("Top 3 bounties heading not found!");
        return;
    }
    
    // Find the existing bounty lines (numbered 1, 2, 3)
    let bounty1Index = curContent.indexOf('1. [ ] ⏳', headingIndex);
    let bounty2Index = curContent.indexOf('2. [ ] ⏳', headingIndex);
    let bounty3Index = curContent.indexOf('3. [ ] ⏳', headingIndex);
    
    if(bounty1Index === -1 || bounty2Index === -1 || bounty3Index === -1) {
        new Notice("Could not find all 3 bounty template lines!");
        return;
    }
    
    // Replace each bounty line
    let newContent = curContent;
    
    // Find end of each line and replace
    let bounty1End = newContent.indexOf('\n', bounty1Index);
    let bounty2End = newContent.indexOf('\n', bounty2Index);
    let bounty3End = newContent.indexOf('\n', bounty3Index);
    
    // Replace in reverse order to maintain indices
    newContent = newContent.substring(0, bounty3Index) + 
                `3. [ ] ${bounty3} ⏳ ${dailyNoteInfo.dateOnly}` + 
                newContent.substring(bounty3End);
    
    // Update bounty2Index after bounty3 replacement
    bounty2End = newContent.indexOf('\n', bounty2Index);
    newContent = newContent.substring(0, bounty2Index) + 
                `2. [ ] ${bounty2} ⏳ ${dailyNoteInfo.dateOnly}` + 
                newContent.substring(bounty2End);
    
    // Update bounty1Index after bounty2 replacement  
    bounty1End = newContent.indexOf('\n', bounty1Index);
    newContent = newContent.substring(0, bounty1Index) + 
                `1. [ ] ${bounty1} ⏳ ${dailyNoteInfo.dateOnly}` + 
                newContent.substring(bounty1End);
    
    await app.vault.modify(dailyNoteInfo.file, newContent);
    await openFile(dailyNoteInfo.path);
    
    new Notice("Added your 3 bounties!");
}

module.exports = addDailyBounties;