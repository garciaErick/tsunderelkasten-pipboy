async function addDailyWorkoutEntityData(tp, entityData, config) {
    // This one is more complex and depends on your existing workout system
    // You'll need to adapt your existing addDailyWorkoutEntityData method
    // For now, just adding the tags
    entityData.tags.push(...config.baseTags);
    return entityData;
}
module.exports = addDailyWorkoutEntityData