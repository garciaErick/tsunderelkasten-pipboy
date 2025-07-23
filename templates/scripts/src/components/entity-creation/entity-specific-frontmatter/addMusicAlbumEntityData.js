async function addMusicAlbumEntityData(tp, entityData, config) {
    entityData.status = await tp.system.suggester(
        ["Needs Review", "Ready to Buy", "In Library", "No Go for Library"], 
        ["needs-review", "ready-to-buy", "in-library", "no-go"], 
        false, "Status:"
    );
    entityData.artist = await tp.system.prompt("Artist:", "", true);
    entityData.genre = await tp.system.prompt("Genre (optional):", "", false);
    entityData.year = await tp.system.prompt("Release year (optional):", "", false);
    entityData.imageUrl = await tp.system.prompt("Enter a image url (optional):", "", false);
    entityData.rating = await tp.system.prompt("Your rating (1-10, optional):", "", false);
    
    entityData.tags.push(...config.baseTags, `status/${entityData.status}`, `artist/${entityData.artist.toLowerCase().replace(/\s+/g, '-')}`);
    if (entityData.genre) entityData.tags.push(`genre/${entityData.genre.toLowerCase()}`);
    
    return entityData;
}
module.exports = addMusicAlbumEntityData;