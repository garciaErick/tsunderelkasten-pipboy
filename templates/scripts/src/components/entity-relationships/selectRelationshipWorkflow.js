/**
 * Complete relationship selection workflow - handles everything including frontmatter updates
 * @param {Object} tp - Templater object
 * @param {string} currentFilePath - Path to the current file we're adding relationships to
 * @returns {Object|null} - {relationshipType, entityType, selectedEntities, frontmatterData}
 */
async function selectRelationshipWorkflow(tp, currentFilePath = null) {
    try {
        const { ENTITY_TYPES } = tp.user.constants();
        
        // Get current file if not provided
        let targetPath = currentFilePath;
        if (!targetPath) {
            if (tp.config && tp.config.target_file && tp.config.target_file.path) {
                targetPath = tp.config.target_file.path;
            } else if (tp.file && tp.file.path) {
                targetPath = tp.file.path;
            } else {
                const activeFile = app.workspace.getActiveFile();
                if (activeFile) {
                    targetPath = activeFile.path;
                }
            }
        }
        
        if (!targetPath) {
            new Notice("No current file found");
            return null;
        }
        
        // Step 1: Select relationship type
        const relationshipType = await tp.system.suggester(
            ["parent", "child", "related"],
            ["parent", "child", "related"],
            false,
            "Select relationship type:"
        );
        
        if (!relationshipType) {
            new Notice("No relationship type selected");
            return null;
        }
        
        // Step 2: Select entity type to search from
        const entityType = await tp.system.suggester(
            ENTITY_TYPES,
            ENTITY_TYPES,
            false,
            `Select entity type for ${relationshipType} relationship:`
        );
        
        if (!entityType) {
            new Notice("No entity type selected");
            return null;
        }
        
        // Step 3: Select the actual entities
        const selectedEntities = await selectEntityRelationships(tp, relationshipType, entityType, {
            prompt: `Select ${relationshipType} ${entityType}:`
        });
        
        if (!selectedEntities) {
            new Notice(`No ${entityType} selected for ${relationshipType} relationship`);
            return null;
        }
        
        // Step 4: Update frontmatter for both directions
        await updateRelationshipFrontmatter(tp, targetPath, selectedEntities, relationshipType);
        
        // Step 5: Show success message
        if (Array.isArray(selectedEntities)) {
            const entityNames = selectedEntities.map(e => e.frontmatter.entityName || e.file.basename);
            new Notice(`Added ${relationshipType} relationships: ${entityNames.join(', ')}`);
        } else {
            const entityName = selectedEntities.frontmatter.entityName || selectedEntities.file.basename;
            new Notice(`Added ${relationshipType}: ${entityName}`);
        }
        
        return {
            relationshipType,
            entityType, 
            selectedEntities,
            success: true
        };
        
    } catch (error) {
        new Notice("Error selecting relationships");
        console.error("Relationship selection error:", error);
        return null;
    }
}

/**
 * Force refresh of metadata cache for a file
 */
async function refreshFileCache(file) {
    if (app.metadataCache && app.metadataCache.getFileCache) {
        // Clear the cache for this file
        delete app.metadataCache.fileCache[file.path];
        // Trigger a re-cache
        await app.metadataCache.getFileCache(file);
    }
}

/**
 * Updates frontmatter for both the current file and related entities
 */
async function updateRelationshipFrontmatter(tp, currentFilePath, selectedEntities, relationshipType) {
    const currentFile = app.vault.getAbstractFileByPath(currentFilePath);
    if (!currentFile) {
        throw new Error("Current file not found");
    }
    
    // Get current frontmatter using your parseFrontmatter function
    const currentFrontmatter = tp.user.parseFrontmatter(tp, currentFile);
    
    // Update current file's frontmatter
    const currentUpdates = {};
    const entities = Array.isArray(selectedEntities) ? selectedEntities : [selectedEntities];
    
    // Add relationships to current file
    const relationshipLinks = entities.map(entity => `[[${entity.file.basename}]]`);
    
    
    if (relationshipType === 'parent') {
        const existingParents = currentFrontmatter.parent || [];
        
        const parentsArray = Array.isArray(existingParents) ? existingParents : [existingParents];
        const newParents = [...parentsArray, ...relationshipLinks];
        currentUpdates.parent = [...new Set(newParents)];
        
    } else if (relationshipType === 'child') {
        const existingChildren = currentFrontmatter.children || [];
        
        const newChildren = [...existingChildren, ...relationshipLinks];
        currentUpdates.children = [...new Set(newChildren)];
        
    } else if (relationshipType === 'related') {
        const existingRelated = currentFrontmatter.related || [];
        
        const newRelated = [...existingRelated, ...relationshipLinks];
        currentUpdates.related = [...new Set(newRelated)];
        
    }
    
    
    // Update current file
    await tp.user.updateFrontmatter(tp, currentFile, currentUpdates);
    
    // Force refresh the cache for the current file
    await refreshFileCache(currentFile);
    
    // Update reverse relationships in selected entities
    for (const entity of entities) {
        await updateReverseRelationship(tp, entity, currentFile, relationshipType);
    }
    
}

/**
 * Updates the reverse relationship in the related entity
 * @param {Object} tp - Templater object
 * @param {Object} relatedEntity - The entity to update reverse relationship for
 * @param {Object} currentFile - The current file object
 * @param {string} relationshipType - The relationship type from current file's perspective
 */
async function updateReverseRelationship(tp, relatedEntity, currentFile, relationshipType) {
    try {
        // Get current frontmatter using your parseFrontmatter function
        const relatedFrontmatter = tp.user.parseFrontmatter(tp, relatedEntity.file);
        
        const currentFileLink = `[[${currentFile.basename}]]`;
        const reverseUpdates = {};
        
        // Determine reverse relationship type
        if (relationshipType === 'parent') {
            // Current file considers this entity as parent, so this entity should have current as child
            const existingChildren = relatedFrontmatter.children || [];
            
            // Ensure we have an array and add the new child
            const childrenArray = Array.isArray(existingChildren) ? existingChildren : [existingChildren];
            const newChildren = [...childrenArray, currentFileLink];
            reverseUpdates.children = [...new Set(newChildren)]; // Remove duplicates
            
        } else if (relationshipType === 'child') {
            // Current file considers this entity as child, so this entity should have current as parent
            const existingParents = relatedFrontmatter.parent || [];
            
            const parentsArray = Array.isArray(existingParents) ? existingParents : [existingParents];
            const newParents = [...parentsArray, currentFileLink];
            reverseUpdates.parent = [...new Set(newParents)]; // Remove duplicates
            
        } else if (relationshipType === 'related') {
            // Bidirectional relationship - both should have each other as related
            const existingRelated = relatedFrontmatter.related || [];
            
            const relatedArray = Array.isArray(existingRelated) ? existingRelated : [existingRelated];
            const newRelated = [...relatedArray, currentFileLink];
            reverseUpdates.related = [...new Set(newRelated)]; // Remove duplicates
            
        }
        
        // Update the related entity file
        await tp.user.updateFrontmatter(tp, relatedEntity.file, reverseUpdates);
        
        // Force refresh the cache for the related file
        await refreshFileCache(relatedEntity.file);
        
    } catch (error) {
        console.error(`Error updating reverse relationship for ${relatedEntity.file.basename}:`, error);
        // Don't throw - continue with other entities
    }
}

async function selectEntityRelationships(tp, relationshipType, entityType, options = {}) {
    const {
        allowMultiple = relationshipType === 'related', // Auto-detect based on relationship type
        prompt = `Select ${relationshipType} ${entityType}:`,
        requiredField = null,
        noticeOnEmpty = true
    } = options;
    
    // Get all entities of the specified type
    const entitiesResult = await tp.user.getEntitiesByType(tp, entityType);
    
    if (!entitiesResult || !entitiesResult.files || entitiesResult.files.length === 0) {
        if (noticeOnEmpty) {
            new Notice(`No ${entityType} entities found`);
        }
        return null;
    }
    
    // Filter by required field if specified
    let entities = entitiesResult.files;
    if (requiredField) {
        entities = entities.filter(entity => entity.frontmatter && entity.frontmatter[requiredField]);
        
        if (entities.length === 0 && noticeOnEmpty) {
            new Notice(`No ${entityType} found with ${requiredField}`);
            return null;
        }
    }
    
    // Filter out entities without required frontmatter
    entities = entities.filter(entity => entity.frontmatter && entity.frontmatter.id);
    
    if (entities.length === 0) {
        if (noticeOnEmpty) {
            new Notice(`No valid ${entityType} entities found`);
        }
        return null;
    }
    
    // Handle selection based on relationship type
    if (allowMultiple) {
        return await selectMultipleEntities(tp, entities, prompt);
    } else {
        return await selectSingleEntity(tp, entities, prompt);
    }
}

async function selectSingleEntity(tp, entities, prompt) {
    const displayOptions = entities.map(entity => 
        entity.frontmatter.entityName || entity.file.basename
    );
    
    const selectedName = await tp.system.suggester(
        displayOptions,
        displayOptions,
        false,
        prompt
    );
    
    if (!selectedName) {
        return null;
    }
    
    return entities.find(entity => 
        (entity.frontmatter.entityName || entity.file.basename) === selectedName
    );
}

async function selectMultipleEntities(tp, entities, prompt) {
    const selectedEntities = [];
    const availableEntities = [...entities];
    
    while (availableEntities.length > 0) {
        const displayOptions = [
            "✅ Done selecting",
            ...availableEntities.map(entity => 
                entity.frontmatter.entityName || entity.file.basename
            )
        ];
        
        const selection = await tp.system.suggester(
            displayOptions,
            displayOptions,
            false,
            `${prompt} (${selectedEntities.length} selected)`
        );
        
        if (!selection || selection === "✅ Done selecting") {
            break;
        }
        
        const selectedEntity = availableEntities.find(entity => 
            (entity.frontmatter.entityName || entity.file.basename) === selection
        );
        
        if (selectedEntity) {
            selectedEntities.push(selectedEntity);
            const index = availableEntities.indexOf(selectedEntity);
            availableEntities.splice(index, 1);
        }
    }
    
    return selectedEntities.length > 0 ? selectedEntities : null;
}

module.exports = selectRelationshipWorkflow;