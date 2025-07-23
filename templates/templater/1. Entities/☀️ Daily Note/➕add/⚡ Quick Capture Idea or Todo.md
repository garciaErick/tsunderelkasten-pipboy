<%*
// Quick capture using helper method
// Import the helper functions
const addTodoToFileSection = tp.user.addTodoToFileSection;
const addContentToFileSection = tp.user.addContentToFileSection;
const openFile = tp.user.openFile;

let dailyNoteFormat = tp.date.now("YYYY-MM-DD dddd");
let folderOverride = 'tsunderelkasten/1.fleeting/1.daily';
let sectionName = "# 📝 Notes"; // Section for both todos and regular notes

// Build the daily note file path
let qcFolderLocation = folderOverride;
if(qcFolderLocation != ''){qcFolderLocation = qcFolderLocation + '/'}
qcFolderLocation = qcFolderLocation.replace(/\/\//g,'/');
if(qcFolderLocation == '/'){qcFolderLocation = ''}
if(qcFolderLocation.startsWith('/')){qcFolderLocation = qcFolderLocation.substring(1)}
let qcFilePath = qcFolderLocation + dailyNoteFormat + '.md';

// Check if daily note exists
let qcFile = tp.app.vault.getAbstractFileByPath(qcFilePath);
if(!qcFile) {
    new Notice(`Daily note not found: ${dailyNoteFormat}`);
    return;
}

try {
    // Auto-suggester for note types
    let noteOptions = [
        "", // Empty option for regular note
        "todo",
    ];
    
    let selectedNoteType = await tp.system.suggester(
        noteOptions.map(option => option === "" ? "📝 Regular note" : `✅ ${option}`),
        noteOptions,
        false,
        "Select note type (or press Enter for regular note)"
    );
    
    // If user cancels the suggester, exit
    if(selectedNoteType === undefined) return;
    
    let qcNote = await tp.system.prompt("Enter a Quick Capture note");
    if(!qcNote) return; // User cancelled
    
    let isTodo = selectedNoteType !== "";
    
    if(isTodo) {
        // Use helper to add todo to Notes section
        const result = await addTodoToFileSection(tp, qcFilePath, sectionName, qcNote);
        
        if (!result.success) {
            new Notice(`Error: ${result.message}`);
            return;
        }
        
    } else {
        // Use generic helper for regular note
        const finalTimestamp = tp.date.now("HH:mm");
        let finalNote = `- ${finalTimestamp} - ${qcNote}`;
        const result = await addContentToFileSection(tp, qcFilePath, sectionName, finalNote);
        
        if (!result.success) {
            new Notice(`Error: ${result.message}`);
            return;
        }
    }
    
    // Open the daily note and jump to the Notes section
    await openFile(qcFilePath, sectionName);
    
    new Notice("Added to daily note!");
    
} catch (error) {
    new Notice("Error adding quick capture note");
    console.error("Quick capture error:", error);
}
%>