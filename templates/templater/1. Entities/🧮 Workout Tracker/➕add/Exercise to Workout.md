<%*
// Import helper functions
const findFilesByTag = tp.user.findFilesByTag;

// Step 1: Get today's workout file automatically
const today = tp.date.now("YYYY-MM-DD dddd");
const workoutFileName = `${today} Workout.md`;
const workoutPath = `tsunderelkasten/1.fleeting/1.daily/${workoutFileName}`;

const workoutFile = app.vault.getAbstractFileByPath(workoutPath);

if (!workoutFile) {
    new Notice(`No workout file found for today: ${workoutFileName}`);
    return;
}

// Step 2: Get workout type from the file's frontmatter
const workoutCache = app.metadataCache.getFileCache(workoutFile);
const workoutType = workoutCache?.frontmatter?.workoutType;

if (!workoutType) {
    new Notice("Could not determine workout type from file");
    return;
}

// Step 3: Get available exercises for this workout type
const exerciseResult = await findFilesByTag(tp, 'exercise');

let availableExercises = [];
if (exerciseResult.success && exerciseResult.files.length > 0) {
    exerciseResult.files.forEach(fileData => {
        try {
            const frontmatter = fileData.frontmatter;
            const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [frontmatter.tags];
            
            // Check if this exercise matches the workout type
            if (tags.includes(workoutType)) {
                const exercise = {
                    name: frontmatter.exerciseName,
                    shortName: frontmatter.shortName,
                    file: fileData.file,
                    description: frontmatter.description || "",
                    musclesWorked: frontmatter.musclesWorked || [],
                    imagePath: frontmatter.imagePath || ""
                };
                
                // Only add if we have the essential fields
                if (exercise.name && exercise.shortName) {
                    availableExercises.push(exercise);
                }
            }
        } catch (error) {
            console.error("Error processing exercise file:", error);
        }
    });
}

if (availableExercises.length === 0) {
    new Notice(`No exercises found for ${workoutType} workout`);
    return;
}

// Step 4: Check which exercises are already in the workout
const workoutContent = await app.vault.read(workoutFile);
const alreadyIncluded = availableExercises.filter(ex => 
    workoutContent.includes(ex.shortName)
);

const notIncluded = availableExercises.filter(ex => 
    !workoutContent.includes(ex.shortName)
);

if (notIncluded.length === 0) {
    new Notice("All available exercises are already in this workout");
    return;
}

// Step 5: Select exercise to add
const exerciseOptions = [
    "❌ Cancel",
    ...notIncluded.map(ex => `${ex.name} - ${ex.musclesWorked.join(', ')}`)
];

const selectedExercise = await tp.system.suggester(
    exerciseOptions,
    exerciseOptions,
    false,
    "Select exercise to add:"
);

if (!selectedExercise || selectedExercise === "❌ Cancel") {
    new Notice("Operation cancelled");
    return;
}

// Find the selected exercise
const exerciseName = selectedExercise.split(' - ')[0];
const exercise = notIncluded.find(ex => ex.name === exerciseName);

if (!exercise) {
    new Notice("Exercise not found");
    return;
}

// Step 6: Create exercise template
function createExerciseTemplate(exercise) {
    const imagePathClean = exercise.imagePath.replace(/\[\[|\]\]/g, '');
    
    return `
### ${exercise.name}
* [[${exercise.file.path}|${exercise.file.basename}]]
* ${exercise.description}
* **Muscles Worked:** ${exercise.musclesWorked.join(',')}
![[${imagePathClean}|250]]
#### Set 1
* Weight: \`INPUT[number(placeholder(Weight in Kilograms)):${exercise.shortName}Weight1]\`
* Reps: \`INPUT[number(placeholder(Number of Reps)):${exercise.shortName}Reps1]\`
#### Set 2
* Weight: \`INPUT[number(placeholder(Weight in Kilograms)):${exercise.shortName}Weight2]\`
* Reps: \`INPUT[number(placeholder(Number of Reps)):${exercise.shortName}Reps2]\`
#### Set 3
* Weight: \`INPUT[number(placeholder(Weight in Kilograms)):${exercise.shortName}Weight3]\`
* Reps: \`INPUT[number(placeholder(Number of Reps)):${exercise.shortName}Reps3]\`
#### Set 4
* Weight: \`INPUT[number(placeholder(Weight in Kilograms)):${exercise.shortName}Weight4]\`
* Reps: \`INPUT[number(placeholder(Number of Reps)):${exercise.shortName}Reps4]\`
`;
}

// Step 7: Update the workout file
try {
    // Add exercise fields to frontmatter
    const frontmatterMatch = workoutContent.match(/^---\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
        let frontmatterText = frontmatterMatch[1];
        
        // Add weight/rep fields for the new exercise
        for(let i = 1; i <= 4; i++) {
            frontmatterText += `\n${exercise.shortName}Weight${i}: `;
            frontmatterText += `\n${exercise.shortName}Reps${i}: `;
        }
        
        // Update exercise count
        frontmatterText = frontmatterText.replace(
            /exerciseCount: (\d+)/,
            (match, count) => `exerciseCount: ${parseInt(count) + 1}`
        );
        
        // Build new frontmatter
        const newFrontmatter = `---\n${frontmatterText}\n---`;
        
        // Replace frontmatter in content
        let newContent = workoutContent.replace(/^---\n[\s\S]*?\n---/, newFrontmatter);
        
        // Find where to insert the exercise (before the workout breakdown)
        const insertPoint = newContent.indexOf('## 📊 Workout breakdown');
        if (insertPoint !== -1) {
            const exerciseTemplate = createExerciseTemplate(exercise);
            newContent = newContent.slice(0, insertPoint) + exerciseTemplate + '\n' + newContent.slice(insertPoint);
        } else {
            // Fallback: add at the end
            newContent += createExerciseTemplate(exercise);
        }
        
        // Update the file
        await app.vault.modify(workoutFile, newContent);
        
        new Notice(`Added ${exercise.name} to ${workoutFile.basename}`);
        
        // Open the updated file
        await app.workspace.getLeaf(false).openFile(workoutFile);
        
    } else {
        new Notice("Could not parse workout file frontmatter");
    }
    
} catch (error) {
    new Notice("Error updating workout file");
    console.error("Update error:", error);
}
%>