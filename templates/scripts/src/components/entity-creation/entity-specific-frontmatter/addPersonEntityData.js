async function addPersonEntityData(tp, entityData, config) {
    entityData.username = await tp.system.prompt("Username:", "", false);
    entityData.skills = await tp.system.prompt("Skills:", "", false);
    entityData.birthday = await tp.system.prompt("Birthday:", "", false);
    entityData.homeMapsUrl = await tp.system.prompt("Enter google maps home url:", "", false);
    
    return entityData;
}
module.exports = addPersonEntityData;