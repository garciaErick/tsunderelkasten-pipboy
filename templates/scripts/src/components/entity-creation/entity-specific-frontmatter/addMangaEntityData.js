async function addMangaEntityData(tp, entityData, config) {
    entityData.status = await tp.system.suggester(
        ["Want to Read", "Reading", "Finished", "Dropped"], 
        ["want-to-read", "reading", "finished", "dropped"], 
        false, "Status:"
    );
    entityData.author = await tp.system.prompt("Author/Mangaka (optional):", "", false);
    entityData.genre = await tp.system.prompt("Genre (optional):", "", false);
    entityData.year = await tp.system.prompt("Year (optional):", "", false);
    entityData.imageUrl = await tp.system.prompt("Enter a image url (optional):", "", false);
    entityData.rating = await tp.system.prompt("Your rating (1-10, optional):", "", false);
    entityData.volumes = await tp.system.prompt("Number of volumes (optional):", "", false);
    entityData.malId = await tp.system.prompt("MyAnimeList ID (optional):", "", false);
    
    entityData.tags.push(...config.baseTags, `status/${entityData.status}`);
    if (entityData.author) entityData.tags.push(`author/${entityData.author.toLowerCase().replace(/\s+/g, '-')}`);
    if (entityData.genre) entityData.tags.push(`genre/${entityData.genre.toLowerCase()}`);
    
    return entityData;
}
module.exports = addMangaEntityData;