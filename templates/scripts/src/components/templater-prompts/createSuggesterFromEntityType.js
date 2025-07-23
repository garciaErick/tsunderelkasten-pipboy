async function createSuggesterFromEntityType(tp, entityType, options = {}) {
    const {
        requiredField = null,
        prompt = `Select ${entityType}:`,
        allowEmpty = false,
        noticeOnEmpty = true
    } = options;
    
    // Get all files with the entity type
	// TODO change this to getEntitiesByType()
    const result = await tp.user.getEntitiesByType(tp, entityType);

    // Filter by required field if specified
    let entities = result.files;
    if (requiredField) {
        entities = entities.filter(entity => entity.frontmatter[requiredField]);
        
        if (entities.length === 0 && noticeOnEmpty) {
            new Notice(`No ${entityType} found with ${requiredField}`);
            return null;
        }
    }
    
    if (entities.length === 0) {
        if (noticeOnEmpty) {
            new Notice(`No ${entityType} found`);
        }
        return null;
    }
    
    const displayOptions = entities.map(entity => 
        entity.frontmatter.entityName || entity.file.basename
    );
    
    // Show suggester
    const selectedEntity = await tp.system.suggester(
        displayOptions,
        entities,
        allowEmpty,
        prompt
    );
    
    if (!selectedEntity && noticeOnEmpty) {
        new Notice(`No ${entityType} selected`);
    }
    
    return selectedEntity;
}
module.exports = createSuggesterFromEntityType;