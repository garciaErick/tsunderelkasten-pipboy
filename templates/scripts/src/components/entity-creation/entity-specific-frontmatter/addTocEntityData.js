/**
 * Helper function to add TOC-specific entity data
 * @param {Object} tp - Templater object
 * @param {Object} entityData - Base entity data
 * @param {Object} config - Entity configuration
 * @returns {Object} Enhanced entity data with TOC-specific properties
 */
async function addTocEntityData(tp, entityData, config) {
    try {
        // Get entity types and let user select one
        const { createSuggesterFromAllEntityTypes } = tp.user.constants();
        const createSuggesterFromEntityType = tp.user.createSuggesterFromEntityType;
        
        const selectedEntityType = await createSuggesterFromAllEntityTypes(tp);
        console.log("Selected entity type:", selectedEntityType);
        
        if (!selectedEntityType) {
            throw new Error("No entity type selected");
        }
        
        // Debug: Let's see what getEntitiesByType returns
        const entitiesResult = tp.user.getEntitiesByType(tp, selectedEntityType);
        console.log("getEntitiesByType result:", entitiesResult);
        console.log("Found entities count:", entitiesResult.files?.length);
        
        // Debug: Log each entity's frontmatter
        if (entitiesResult.files) {
            entitiesResult.files.forEach((entity, index) => {
                console.log(`Entity ${index}:`, entity.file.basename, "entityType:", entity.frontmatter.entityType);
            });
        }
        
        // Get all entities of the selected type and let user pick one
        const selectedEntity = await createSuggesterFromEntityType(tp, selectedEntityType, {
            prompt: 'Select entity to create TOC for:'
        });
        
        console.log("Selected entity:", selectedEntity);
        
        if (!selectedEntity) {
            throw new Error("No entity selected");
        }
        
        // Get the selected entity's file and read its frontmatter
        const selectedFile = selectedEntity.file;
        const selectedEntityFrontmatter = tp.user.parseFrontmatter(tp, selectedFile);
        
        // Set the TOC source entity as a link to the actual file
        entityData.tocSourceEntity = `[[${selectedFile.basename}]]`;
        entityData.description = `Table of Contents for ${selectedEntityFrontmatter.entityName || selectedFile.basename} and its related entities`;
        
        // Copy only the parent property from the source entity
        if (selectedEntityFrontmatter.parent) {
            entityData.parent = selectedEntityFrontmatter.parent;
        }
        
        return entityData;
        
    } catch (error) {
        console.error("Error adding TOC entity data:", error);
        throw error;
    }
}

module.exports = addTocEntityData;