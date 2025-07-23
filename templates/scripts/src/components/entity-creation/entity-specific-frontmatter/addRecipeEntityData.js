async function addRecipeEntityData(tp, entityData, config) {
    entityData.cuisine = await tp.system.prompt("Cuisine type (optional):", "", false);
    entityData.difficulty = await tp.system.suggester(
        ["Easy", "Medium", "Hard"], 
        ["easy", "medium", "hard"], 
        false, "Difficulty:"
    );
    entityData.prepTime = await tp.system.prompt("Prep time (e.g., '30 min'):", "", false);
    entityData.cookTime = await tp.system.prompt("Cook time (e.g., '45 min'):", "", false);
    entityData.servings = await tp.system.prompt("Number of servings (optional):", "", false);
    entityData.imageUrl = await tp.system.prompt("Recipe image URL (optional):", "", false);
    entityData.source = await tp.system.prompt("Recipe source (optional):", "", false);
    entityData.rating = await tp.system.prompt("Your rating (1-10, optional):", "", false);
    entityData.ingredients = [];
    entityData.steps = [];
    
    entityData.tags.push(...config.baseTags, `difficulty/${entityData.difficulty}`);
    if (entityData.cuisine) entityData.tags.push(`cuisine/${entityData.cuisine.toLowerCase()}`);
    
    return entityData;
}
module.exports = addRecipeEntityData;
