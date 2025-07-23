/**
 * Main function to add exercise-specific data
 */
async function addExerciseEntityData(tp, entityData) {
    entityData.exerciseName = entityData.entityName; // Keep both for compatibility
    entityData.description = await tp.system.prompt("Exercise Description:", "", false);
    
    // Select single workout type
    const workoutTypeOptions = ["push", "pull", "leg"];
    entityData.workoutType = await tp.system.suggester(workoutTypeOptions, workoutTypeOptions, false, "Select workout type:");
    
    // Select muscles worked (multi-select)
    entityData.musclesWorked = await selectMusclesWorked(tp);
    
    if(entityData.musclesWorked.length === 0) {
        new Notice("At least one muscle must be selected");
        throw new Error("Exercise creation cancelled - no muscles selected");
    }
    
    entityData.substitute = await tp.system.prompt("Substitute exercises (optional):", "", false);
    entityData.imagePath = "[[media/workout-dictionary/default.png]]"; // Default image
    entityData.obsidianUIMode = "preview";
    entityData.parent = "[[🏋🏿 Exercises]]";
    
    // Add exercise-specific tags
    entityData.tags.push("exercise", entityData.workoutType);
    entityData.musclesWorked.forEach(muscle => {
        entityData.tags.push(`muscle/${muscle.replace(/\s+/g, '-')}`);
    });
    
    return entityData;
}

/**
 * Helper function to handle muscle selection with multi-select logic
 */
async function selectMusclesWorked(tp) {
    const muscleOptions = [
        "chest", "shoulders", "triceps", "back", "lats", "biceps", "legs", "glutes", 
        "quads", "hamstrings", "calves", "core", "abs", "forearms", "traps", 
        "rear shoulders", "upper back", "mid-back", "lower back"
    ];
    
    let selectedMuscles = [];
    let continueMusclePicking = true;
    
    while(continueMusclePicking && selectedMuscles.length < 8) {
        const remainingMuscles = muscleOptions.filter(muscle => !selectedMuscles.includes(muscle));
        
        if(remainingMuscles.length === 0) break;
        
        const muscleDisplayOptions = [
            "✅ Done selecting muscles",
            ...remainingMuscles
        ];
        
        const selectedMuscle = await tp.system.suggester(muscleDisplayOptions, muscleDisplayOptions, false, 
            `Select muscle ${selectedMuscles.length + 1} (or finish):`);
        
        if(!selectedMuscle || selectedMuscle === "✅ Done selecting muscles") {
            continueMusclePicking = false;
        } else {
            selectedMuscles.push(selectedMuscle);
            new Notice(`Added ${selectedMuscle} (${selectedMuscles.length} muscles selected)`);
        }
    }
    
    return selectedMuscles;
}

module.exports = addExerciseEntityData;