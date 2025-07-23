<%*
// Edit workout sets for exercises in frontmatter
const currentFile = app.workspace.getActiveFile();
if(!currentFile) {
    new Notice("No active file");
    return;
}

// Read current frontmatter
let curContent = await app.vault.read(currentFile);
let frontmatterData = {};

if(curContent.startsWith('---')) {
    let endFrontmatter = curContent.indexOf('---', 3);
    
    if(endFrontmatter !== -1) {
        let frontmatter = curContent.substring(3, endFrontmatter);
        let lines = frontmatter.split('\n');
        
        for(let line of lines) {
            if(line.includes(':') && !line.trim().startsWith('-')) {
                let [key, value] = line.split(':').map(s => s.trim());
                frontmatterData[key] = value;
            }
        }
    }
}

// Find exercises in frontmatter (those with Weight1 fields)
const exercisePattern = /(.+?)Weight1/;
const exercises = new Set();

Object.keys(frontmatterData).forEach(key => {
    const match = key.match(exercisePattern);
    if(match) {
        exercises.add(match[1]);
    }
});

if(exercises.size === 0) {
    new Notice("No exercises found in workout frontmatter");
    return;
}

// Step 1: Select exercise to edit
const exerciseList = Array.from(exercises);
const exerciseDisplayNames = exerciseList.map(ex => ex.charAt(0).toUpperCase() + ex.slice(1)); // Capitalize first letter

let selectedExercise = await tp.system.suggester(exerciseDisplayNames, exerciseList, false, "Select exercise to edit:");
if(!selectedExercise) return;

// Step 2: Select which set to edit
const setOptions = ["Set 1", "Set 2", "Set 3", "Set 4"];
const setNumbers = ["1", "2", "3", "4"];

let selectedSet = await tp.system.suggester(setOptions, setNumbers, false, `Select set to edit for ${selectedExercise}:`);
if(!selectedSet) return;

// Step 3: Get current values
const weightKey = `${selectedExercise}Weight${selectedSet}`;
const repsKey = `${selectedExercise}Reps${selectedSet}`;

const currentWeight = frontmatterData[weightKey] || "";
const currentReps = frontmatterData[repsKey] || "";

// Step 4: Prompt for new values
const weight = await tp.system.prompt(`Set ${selectedSet} - Weight (current: ${currentWeight}):`, currentWeight);
if(weight === null) return; // User cancelled

const reps = await tp.system.prompt(`Set ${selectedSet} - Reps (current: ${currentReps}):`, currentReps);
if(reps === null) return; // User cancelled

// Step 5: Update frontmatter
if(curContent.startsWith('---')) {
    let endFrontmatter = curContent.indexOf('---', 3);
    
    if(endFrontmatter !== -1) {
        let frontmatter = curContent.substring(3, endFrontmatter);
        let afterFrontmatter = curContent.substring(endFrontmatter);
        
        let lines = frontmatter.split('\n');
        let newLines = [];
        
        let weightUpdated = false;
        let repsUpdated = false;
        
        for(let line of lines) {
            if(line.trim().startsWith(`${weightKey}:`)) {
                newLines.push(`${weightKey}: ${weight}`);
                weightUpdated = true;
            } else if(line.trim().startsWith(`${repsKey}:`)) {
                newLines.push(`${repsKey}: ${reps}`);
                repsUpdated = true;
            } else {
                newLines.push(line);
            }
        }
        
        // Add missing fields if they don't exist
        if(!weightUpdated) {
            newLines.push(`${weightKey}: ${weight}`);
        }
        if(!repsUpdated) {
            newLines.push(`${repsKey}: ${reps}`);
        }
        
        let newFrontmatter = newLines.join('\n');
        let newContent = '---' + newFrontmatter + afterFrontmatter;
        
        await app.vault.modify(currentFile, newContent);
        new Notice(`Updated ${selectedExercise} Set ${selectedSet}: ${weight}kg x ${reps} reps`);
    }
}
%>