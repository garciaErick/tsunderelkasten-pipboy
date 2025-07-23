async function addMovieEntityData(tp, entityData, config) {
    entityData.status = await tp.system.suggester(
        ["Want to Watch", "Watched", "Dropped"], 
        ["want-to-watch", "watched", "dropped"], 
        false, "Status:"
    );
    entityData.imdbUrl = await tp.system.prompt("IMDB URL", "", false);
    entityData.genre = await tp.system.prompt("Genre (optional):", "", false);
    entityData.year = await tp.system.prompt("Year (optional):", "", false);
    entityData.director = await tp.system.prompt("Director (optional):", "", false);
    entityData.imageUrl = await tp.system.prompt("Enter a image url (optional):", "", false);
    entityData.rating = await tp.system.prompt("Your rating (1-10, optional):", "", false);
    entityData.duration = await tp.system.prompt("Duration (optional):", "", false);
    
    entityData.tags.push(...config.baseTags, `status/${entityData.status}`);
    if (entityData.genre) entityData.tags.push(`genre/${entityData.genre.toLowerCase()}`);
    
    return entityData;
}
module.exports = addMovieEntityData;