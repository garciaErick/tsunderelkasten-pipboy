/**
 * Helper function to add expense tracker specific data
 * @param {Object} tp - Templater object
 * @param {Object} entityData - Base entity data to enhance
 * @param {Object} config - Entity configuration from constants
 * @returns {Promise<Object>} Enhanced entityData
 */
async function addExpenseTrackerEntityData(tp, entityData, config) {
    // Collect participants from existing person entities
    const participants = [];
    let addMore = true;
    
    new Notice("Add participants to the expense tracker");
    
    while (addMore) {
        const selectedPerson = await tp.user.createSuggesterFromEntityType(tp, "person", {
            prompt: "Select participant:",
            allowEmpty: true,
            noticeOnEmpty: false
        });
        
        if (selectedPerson) {
            const participantName = selectedPerson.frontmatter.entityName;
            if (!participants.includes(participantName)) {
                participants.push(participantName);
                new Notice(`Added: ${participantName}`);
            } else {
                new Notice(`${participantName} already added`);
            }
            
            addMore = await tp.system.suggester(
                ["Add another participant", "Done adding participants"],
                [true, false],
                false,
                "Add more participants?"
            );
        } else {
            addMore = false;
        }
    }
    
    if (participants.length === 0) {
        throw new Error("At least one participant is required");
    }
    
    // Add expense tracker specific data
    entityData.participants = participants;
    entityData.expenses = [];
    entityData.tags.push(...config.baseTags);
    
    // Return entityData directly
    return entityData;
}

module.exports = addExpenseTrackerEntityData;