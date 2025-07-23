async function addBookEntityData(tp, entityData, config) {
    entityData.status = await tp.system.suggester(
        ["Want to Read", "Reading", "Finished", "Dropped"], 
        ["want-to-read", "reading", "finished", "dropped"], 
        false, "Status:"
    );
    entityData.author = await tp.system.prompt("Author:", "", true);
    entityData.genre = await tp.system.prompt("Genre (optional):", "", false);
    entityData.year = await tp.system.prompt("Publication year (optional):", "", false);
    entityData.isbn = await tp.system.prompt("ISBN (optional):", "", false);
    entityData.imageUrl = await tp.system.prompt("Enter a image url (optional):", "", false);
    entityData.rating = await tp.system.prompt("Your rating (1-10, optional):", "", false);
    entityData.pages = await tp.system.prompt("Number of pages (optional):", "", false);
    
    entityData.tags.push(...config.baseTags, `status/${entityData.status}`, `author/${entityData.author.toLowerCase().replace(/\s+/g, '-')}`);
    if (entityData.genre) entityData.tags.push(`genre/${entityData.genre.toLowerCase()}`);
    
    return entityData;
}
module.exports = addBookEntityData;