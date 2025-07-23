async function addReferenceListEntityData(tp, entityData, config) {
    entityData.description = await tp.system.prompt("Enter a short description (optional):", "", false);
    entityData.imageUrl = await tp.system.prompt("Enter a image url (optional):", "", false);
    entityData.tags.push(...config.baseTags);
    return entityData;
}
module.exports = addReferenceListEntityData;