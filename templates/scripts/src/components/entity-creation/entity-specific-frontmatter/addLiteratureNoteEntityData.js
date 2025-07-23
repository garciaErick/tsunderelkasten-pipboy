/**
 * Helper function to add literature note specific data
 * @param {Object} tp - Templater object
 * @param {Object} entityData - Base entity data to enhance
 * @param {Object} config - Entity configuration from constants
 * @returns {Promise<Object>} Enhanced entityData
 */
async function addLiteratureNoteEntityData(tp, entityData, config) {
    const { sanitizeStringForVault } = tp.user.constants();

    // Required URL
    entityData.url = await tp.system.prompt("Enter URL:", "", true);
    
    // Optional fields
    entityData.author = await tp.system.prompt("Enter author (optional):", "", false);
    entityData.description = sanitizeStringForVault(await tp.system.prompt("Enter a short description (optional):", "", false));
    entityData.imageUrl = await tp.system.prompt("Enter a image url (optional):", "", false);
    
    return entityData;
}

module.exports = addLiteratureNoteEntityData;