async function addTVShowEntityData(tp, entityData, config) {
    entityData.status = await tp.system.suggester(
        ["Want to Watch", "Watching", "Finished", "Dropped"], 
        ["want-to-watch", "watching", "finished", "dropped"], 
        false, "Status:"
    );
    entityData.genre = await tp.system.prompt("Genre (optional):", "", false);
    entityData.year = await tp.system.prompt("Year (optional):", "", false);
    entityData.imageUrl = await tp.system.prompt("Enter a image url (optional):", "", false);
    entityData.rating = await tp.system.prompt("Your rating (1-10, optional):", "", false);
    entityData.seasons = await tp.system.prompt("Number of seasons (optional):", "", false);
    
    entityData.tags.push(...config.baseTags, `status/${entityData.status}`);
    if (entityData.genre) entityData.tags.push(`genre/${entityData.genre.toLowerCase()}`);
    
    return entityData;
}
module.exports = addTVShowEntityData;