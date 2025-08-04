/**
 * Processor for storage location entities
 * Creates storage location metadata with room and place
 */
async function addStorageLocationEntityData(tp, entityData, config) {
    try {
        // Get room from user
        const room = await tp.system.prompt("Enter room name:", null, true);
        if (!room) {
            throw new Error("Room name is required");
        }
        
        // Get specific place within room
        const place = await tp.system.prompt("Enter specific place/area:", null, true);
        if (!place) {
            throw new Error("Place is required");
        }
        
        // Add storage location-specific data
        entityData.room = room;
        entityData.place = place;
        
        return entityData;
        
    } catch (error) {
        console.error("Error in addStorageLocationEntityData:", error);
        throw error;
    }
}

module.exports = addStorageLocationEntityData;