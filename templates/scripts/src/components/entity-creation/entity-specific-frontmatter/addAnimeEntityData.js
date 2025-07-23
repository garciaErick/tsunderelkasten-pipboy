async function addAnimeEntityData(tp, entityData, config) {
    entityData.status = await tp.system.suggester(
        ["Want to Watch", "Watching", "Finished", "Dropped"], 
        ["want-to-watch", "watching", "finished", "dropped"], 
        false, "Status:"
    );
    entityData.url = await tp.system.prompt("URL to watch", "", false);
    entityData.genre = await tp.system.prompt("Genre (optional):", "", false);
    entityData.year = await tp.system.prompt("Year (optional):", "", false);
    entityData.studio = await tp.system.prompt("Studio (optional):", "", false);
    entityData.imageUrl = await tp.system.prompt("Enter a image url (optional):", "", false);
    entityData.rating = await tp.system.prompt("Your rating (1-10, optional):", "", false);
    entityData.episodes = await tp.system.prompt("Number of episodes (optional):", "", false);
    entityData.malId = await tp.system.prompt("MyAnimeList ID (optional):", "", false);
    
    entityData.tags.push(...config.baseTags, `status/${entityData.status}`);
    if (entityData.genre) entityData.tags.push(`genre/${entityData.genre.toLowerCase()}`);
    
    return entityData;
}
module.exports = addAnimeEntityData;