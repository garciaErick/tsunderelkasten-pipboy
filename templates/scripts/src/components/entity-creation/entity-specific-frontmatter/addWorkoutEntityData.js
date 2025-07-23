/**
 * Enhanced helper function to add workout-specific entity data
 * @param {Object} tp - Templater object
 * @param {Object} entityData - Base entity data
 * @returns {Promise<Object>} Enhanced entity data with workout-specific fields
 */
async function addDailyWorkoutEntityData(tp, entityData) {
    const { findFilesByTag } = tp.user;
    
    // Step 1: Select workout type
    const workoutTypes = ["push", "pull", "leg"];
    const workoutType = await tp.system.suggester(workoutTypes, workoutTypes, false, "Select workout type:");
    if (!workoutType) {
        throw new Error("Workout type selection cancelled");
    }
    
    // Step 2: Get available exercises for this workout type
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
        throw new Error(`No exercises found for ${workoutType} workout`);
    }
    
    // Step 3: Multi-select exercises
    let selectedExercises = [];
    let continuePicking = true;
    
    while (continuePicking && selectedExercises.length < 8) {
        const remainingExercises = availableExercises.filter(ex => 
            !selectedExercises.find(sel => sel.shortName === ex.shortName)
        );
        
        if (remainingExercises.length === 0) break;
        
        // Build exercise options more carefully to avoid null values
        const exerciseOptions = ["✅ Done selecting exercises"];
        
        remainingExercises.forEach(ex => {
            if (ex && ex.name && ex.musclesWorked) {
                const muscles = Array.isArray(ex.musclesWorked) ? ex.musclesWorked.join(', ') : ex.musclesWorked;
                exerciseOptions.push(`${ex.name} - ${muscles}`);
            }
        });
        
        const selected = await tp.system.suggester(
            exerciseOptions, 
            exerciseOptions, 
            false, 
            `Select exercise ${selectedExercises.length + 1} (or finish):`
        );
        
        if (!selected || selected === null || selected === undefined || selected === "✅ Done selecting exercises") {
            continuePicking = false;
        } else {
            const exerciseName = selected.split(' - ')[0];
            const exercise = remainingExercises.find(ex => ex.name === exerciseName);
            if (exercise) {
                selectedExercises.push(exercise);
                new Notice(`Added ${exercise.name} (${selectedExercises.length} exercises total)`);
            }
        }
    }
    
    if (selectedExercises.length === 0) {
        throw new Error("No exercises selected");
    }
    
    // Step 4: Build enhanced entity data
    const enhancedEntityData = {
        ...entityData,
        workoutType: workoutType,
        exerciseCount: selectedExercises.length,
        selectedExercises: selectedExercises, // Store for content generation
        obsidianUIMode: "preview"
    };
    
    // Add dynamic weight/rep fields for each exercise to frontmatter
    selectedExercises.forEach(exercise => {
        for (let i = 1; i <= 4; i++) {
            enhancedEntityData[`${exercise.shortName}Weight${i}`] = "";
            enhancedEntityData[`${exercise.shortName}Reps${i}`] = "";
        }
    });
    
    // Add workout-specific tags
    enhancedEntityData.tags.push(`daily-workout/${workoutType}`);
    
    return enhancedEntityData;
}

/**
 * Helper function to create exercise template content
 * @param {Object} exercise - Exercise data object
 * @returns {string} Formatted exercise template
 */
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

/**
 * Helper function to generate workout content
 * @param {Object} tp - Templater object
 * @param {Object} entityData - Enhanced entity data with workout info
 * @returns {Promise<string>} Complete workout content
 */
async function generateWorkoutContent(tp, entityData) {
    const today = tp.date.now("YYYY-MM-DD dddd");
    
    // Build content body as one big string
    let contentBody = `# 🏋🏾‍♀️ Workout Tracker
If you need inspiration, you can follow my [[🏋🏿 Exercises - 3-day Split Regime Exercise Guide]]

`;

    // Get templates as strings (with error handling)
    try {
        const tocContent = await tp.file.include("[[3. Workout Tracker - TOC]]");
        contentBody += tocContent + "\n\n";
    } catch (error) {
        console.warn("Could not load TOC template:", error);
    }

    contentBody += `## 🤸🏾‍♀️ Weight and Reps by Exercise

`;

    // Add all exercises as one big string
    entityData.selectedExercises.forEach(exercise => {
        contentBody += createExerciseTemplate(exercise) + "\n";
    });

    // Add exercise breakdown template
    try {
        const exerciseBreakdownTemplate = await tp.file.include("[[2. Workout tracker - Exercise breakdown]]");
        contentBody += "\n" + exerciseBreakdownTemplate;
    } catch (error) {
        console.warn("Could not load exercise breakdown template:", error);
    }
    
    return contentBody;
}

module.exports = function() {
    return {
        addDailyWorkoutEntityData,
        generateWorkoutContent,
        createExerciseTemplate
    };
};