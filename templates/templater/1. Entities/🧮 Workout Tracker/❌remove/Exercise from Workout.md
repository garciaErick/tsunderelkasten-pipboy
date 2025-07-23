<%*
// Step 1: Get today's workout file automatically
const today = tp.date.now("YYYY-MM-DD dddd");
const workoutFileName = `${today} Workout.md`;
const workoutPath = `tsunderelkasten/1.fleeting/1.daily/${workoutFileName}`;

const workoutFile = app.vault.getAbstractFileByPath(workoutPath);

if (!workoutFile) {
    new Notice(`No workout file found for today: ${workoutFileName}`);
    return;
}

// Step 2: Parse the workout file to find exercises
const workoutContent = await app.vault.read(workoutFile);
const workoutCache = app.metadataCache.getFileCache(workoutFile);

// Find exercise sections in the content
const exerciseHeaders = workoutContent.match(/^### (.+)$/gm);

if (!exerciseHeaders || exerciseHeaders.length === 0) {
    new Notice("No exercises found in this workout");
    return;
}

// Extract exercise names
const exerciseNames = exerciseHeaders.map(header => header.replace('### ', ''));

// Step 3: Select exercise to remove
const exerciseOptions = [
    "❌ Cancel",
    ...exerciseNames
];

const selectedExercise = await tp.system.suggester(
    exerciseOptions,
    exerciseOptions,
    false,
    "Select exercise to remove:"
);

if (!selectedExercise || selectedExercise === "❌ Cancel") {
    new Notice("Operation cancelled");
    return;
}

// Step 4: Confirm removal
const confirmOptions = [
    `Yes, remove "${selectedExercise}"`,
    "No, cancel"
];

const confirmed = await tp.system.suggester(
    confirmOptions,
    [true, false],
    false,
    `Are you sure you want to remove "${selectedExercise}" from this workout?`
);

if (!confirmed) {
    new Notice("Operation cancelled");
    return;
}

// Step 5: Remove the exercise
try {
    // Find the exercise section to remove
    const exerciseStartPattern = new RegExp(`^### ${selectedExercise.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'm');
    const exerciseStartMatch = workoutContent.match(exerciseStartPattern);
    
    if (!exerciseStartMatch) {
        new Notice("Could not find exercise section in workout");
        return;
    }
    
    const exerciseStartIndex = exerciseStartMatch.index;
    
    // Find the next exercise or end of section
    const nextExercisePattern = /^### /m;
    const remainingContent = workoutContent.slice(exerciseStartIndex + exerciseStartMatch[0].length);
    const nextExerciseMatch = remainingContent.match(nextExercisePattern);
    
    let exerciseEndIndex;
    if (nextExerciseMatch) {
        exerciseEndIndex = exerciseStartIndex + exerciseStartMatch[0].length + nextExerciseMatch.index;
    } else {
        // Check for workout breakdown section
        const breakdownMatch = workoutContent.match(/^## 📊 Workout breakdown/m);
        if (breakdownMatch && breakdownMatch.index > exerciseStartIndex) {
            exerciseEndIndex = breakdownMatch.index;
        } else {
            exerciseEndIndex = workoutContent.length;
        }
    }
    
    // Remove the exercise section
    let newContent = workoutContent.slice(0, exerciseStartIndex) + workoutContent.slice(exerciseEndIndex);
    
    // Update frontmatter to remove exercise fields and update count
    const frontmatterMatch = newContent.match(/^---\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
        let frontmatterText = frontmatterMatch[1];
        
        // Try to find the shortName by looking at existing weight/rep fields in frontmatter
        const lines = frontmatterText.split('\n');
        let shortNameToRemove = null;
        
        // First pass: find potential shortNames from all weight1 fields
        const shortNames = [];
        for (const line of lines) {
            const fieldMatch = line.match(/^([a-zA-Z0-9-]+)Weight1:\s*$/);
            if (fieldMatch) {
                shortNames.push(fieldMatch[1]);
            }
        }
        
        // Try to match exercise name to shortName
        for (const shortName of shortNames) {
            // Check if shortName could belong to the selected exercise
            const exerciseNameNormalized = selectedExercise.toLowerCase().replace(/[^a-z0-9]/g, '');
            const shortNameNormalized = shortName.toLowerCase().replace(/[^a-z0-9]/g, '');
            
            if (exerciseNameNormalized.includes(shortNameNormalized) || 
                shortNameNormalized.includes(exerciseNameNormalized) ||
                exerciseNameNormalized.startsWith(shortNameNormalized.substring(0, 4))) {
                shortNameToRemove = shortName;
                break;
            }
        }
        
        // If we found a shortName to remove, filter out its fields
        if (shortNameToRemove) {
            const filteredLines = lines.filter(line => {
                // Remove only the fields for this specific shortName
                const fieldMatch = line.match(/^([a-zA-Z0-9-]+)(Weight|Reps)[1-4]:\s*$/);
                if (fieldMatch && fieldMatch[1] === shortNameToRemove) {
                    return false; // Remove this line
                }
                return true; // Keep this line
            });
            
            frontmatterText = filteredLines.join('\n');
            console.log(`Removed frontmatter fields for shortName: ${shortNameToRemove}`);
        } else {
            console.warn(`Could not find shortName to remove for exercise: ${selectedExercise}`);
        }
        
        // Update exercise count
        frontmatterText = frontmatterText.replace(
            /exerciseCount: (\d+)/,
            (match, count) => `exerciseCount: ${Math.max(0, parseInt(count) - 1)}`
        );
        
        // Build new frontmatter
        const newFrontmatter = `---\n${frontmatterText}\n---`;
        
        // Replace frontmatter in content
        newContent = newContent.replace(/^---\n[\s\S]*?\n---/, newFrontmatter);
    }
    
    // Update the file
    await app.vault.modify(workoutFile, newContent);
    
    new Notice(`Removed ${selectedExercise} from ${workoutFile.basename}`);
    
    // Open the updated file
    await app.workspace.getLeaf(false).openFile(workoutFile);
    
} catch (error) {
    new Notice("Error updating workout file");
    console.error("Remove error:", error);
}
%>