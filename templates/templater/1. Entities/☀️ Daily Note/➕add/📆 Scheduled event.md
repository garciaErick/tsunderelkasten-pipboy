<%*
// Quick schedule capture - adds to schedule section with time pickers
const openFile = tp.user.openFile;

const today = tp.date.now("YYYY-MM-DD dddd");
let qcFolderLocation = 'tsunderelkasten/1.fleeting/1.daily';
if(qcFolderLocation != ''){qcFolderLocation = qcFolderLocation + '/'}
qcFolderLocation = qcFolderLocation.replace(/\/\//g,'/');
if(qcFolderLocation == '/'){qcFolderLocation = ''}
if(qcFolderLocation.startsWith('/')){qcFolderLocation = qcFolderLocation.substring(1)}

let qcFilePath = qcFolderLocation + today + '.md';
let qcFile = app.vault.getAbstractFileByPath(qcFilePath);

if(!qcFile) {
    new Notice(`Daily note not found: ${today}`);
    return;
}

let scheduleItem = await tp.system.prompt("What's your schedule item?");
if(!scheduleItem) return; // User cancelled

// Time options for suggester (24-hour format)
const timeOptions = ["All Day"];
for(let hour = 0; hour < 24; hour++) {
    for(let minute = 0; minute < 60; minute += 15) { // 15-minute intervals
        const h = hour.toString().padStart(2, '0');
        const m = minute.toString().padStart(2, '0');
        timeOptions.push(`${h}:${m}`);
    }
}

// Start time picker
let startTime = await tp.system.suggester(timeOptions, timeOptions, false, "Select start time:");
if(!startTime) return; // User cancelled

let endTime = "";

// Only ask for end time if it's not an all-day event
if(startTime !== "All Day") {
    // End time picker (with option to skip)
    const endTimeOptions = ["No end time", ...timeOptions.slice(1)]; // Remove "All Day" from end time options
    let endTimeChoice = await tp.system.suggester(endTimeOptions, endTimeOptions, false, "Select end time (or no end time):");
    if(!endTimeChoice) return; // User cancelled
    
    endTime = endTimeChoice === "No end time" ? "" : endTimeChoice;
}

let curContent = await app.vault.read(qcFile);
const targetHeading = '### 🤖 Schedule of the day';

// Find the target heading
let headingIndex = curContent.indexOf(targetHeading);
if(headingIndex === -1) {
    new Notice("Schedule section not found in daily note!");
    return;
}

// Find the callout block
let calloutStart = curContent.indexOf('> [!date]- Expand to edit schedule', headingIndex);
if(calloutStart === -1) {
    new Notice("Schedule callout not found!");
    return;
}

// Find the next heading or end of file to know where the section ends
let nextHeadingIndex = curContent.indexOf('\n###', headingIndex + 1);
if(nextHeadingIndex === -1) nextHeadingIndex = curContent.indexOf('\n##', headingIndex + 1);
if(nextHeadingIndex === -1) nextHeadingIndex = curContent.length;

// Get the section content
let sectionContent = curContent.substring(headingIndex, nextHeadingIndex);
let beforeSection = curContent.substring(0, headingIndex);
let afterSection = curContent.substring(nextHeadingIndex);

// Find where to insert the new item (after the last > - line in the callout)
let lines = sectionContent.split('\n');
let newLines = [];
let lastScheduleLineIndex = -1;

for(let i = 0; i < lines.length; i++) {
    newLines.push(lines[i]);
    if(lines[i].trim().startsWith('> - ')) {
        lastScheduleLineIndex = i;
    }
}

// Add the new schedule item
let newScheduleItem;
if(startTime === "All Day") {
    newScheduleItem = `> - ${scheduleItem} [allDay:: true]`;
} else {
    const endTimeMetadata = endTime ? ` [endTime:: ${endTime}]` : "";
    newScheduleItem = `> - ${scheduleItem} [startTime:: ${startTime}]${endTimeMetadata}`;
}

if(lastScheduleLineIndex >= 0) {
    // Insert after the last schedule item
    newLines.splice(lastScheduleLineIndex + 1, 0, newScheduleItem);
} else {
    // If no existing items, add after the callout header
    let calloutHeaderIndex = newLines.findIndex(line => line.includes('> [!date]- Expand to edit schedule'));
    if(calloutHeaderIndex >= 0) {
        newLines.splice(calloutHeaderIndex + 1, 0, newScheduleItem);
    }
}

let updatedSection = newLines.join('\n');
let newContent = beforeSection + updatedSection + afterSection;

await app.vault.modify(qcFile, newContent);

// Open the daily note and jump to the schedule section
await openFile(qcFilePath, targetHeading);

new Notice(`Added "${scheduleItem}" to schedule!`);
%>