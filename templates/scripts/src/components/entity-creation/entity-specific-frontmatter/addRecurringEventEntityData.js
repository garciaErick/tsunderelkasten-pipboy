async function addRecurringEventEntityData(tp, entityData, config) {
    entityData.frequency = await tp.system.suggester(
        ["Daily", "Weekly", "Bi-weekly", "Monthly", "Quarterly", "Yearly"], 
        ["daily", "weekly", "bi-weekly", "monthly", "quarterly", "yearly"], 
        false, "Frequency:"
    );
    entityData.startDate = await tp.system.prompt("Start date (YYYY-MM-DD):", "", true);
    entityData.endDate = await tp.system.prompt("End date (YYYY-MM-DD, optional):", "", false);
    entityData.time = await tp.system.prompt("Time (e.g., '14:30', optional):", "", false);
    entityData.duration = await tp.system.prompt("Duration (e.g., '2 hours', optional):", "", false);
    entityData.location = await tp.system.prompt("Location (optional):", "", false);
    
    entityData.tags.push(...config.baseTags, `frequency/${entityData.frequency}`);
    
    return entityData;
}
module.exports = addRecurringEventEntityData;
