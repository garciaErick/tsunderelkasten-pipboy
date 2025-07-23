/**
 * Main entity creation orchestrator - handles the entire workflow
 */
async function createEntity(tp) {
    try {
        const { ENTITY_TYPES, ENTITY_CONFIGS } = tp.user.constants();
        
        // === BASE ENTITY CREATION ===
        const baseData = await createBaseEntity(tp, ENTITY_TYPES);
        if (!baseData) {
            new Notice("Base entity creation failed");
            return;
        }
        
        // === ENTITY-SPECIFIC PROCESSING ===
        const config = ENTITY_CONFIGS[baseData.entityType];
        if (!config) {
            throw new Error(`No configuration found for entity type: ${baseData.entityType}`);
        }
        
        let entityData = { ...baseData };
        if (config.processor) {
            entityData = await config.processor(tp, entityData, config);
        }
        
        // === GENERATE FILE METADATA FROM CONFIG ===
        const templateContent = config.templateName;
        const fileName = config.filenameGenerator ? 
            config.filenameGenerator(config, entityData, tp) : 
            `${config.prefix} - ${entityData.entityName}`;
        const filePath = config.pathGenerator ? 
            config.pathGenerator(config, fileName, tp) : 
            `${config.parentPath}/${fileName}.md`;
        
        // === FILE CREATION ===
        const result = await createEntityFile(tp, filePath, entityData, templateContent);
        
        if (result.success) {
            new Notice(`Created ${baseData.entityType}: ${entityData.entityName}`);
        } else {
            new Notice(`Error creating entity file: ${result.reason || 'unknown error'}`);
        }
        
    } catch (error) {
        console.error("Entity creation error:", error);
        new Notice(`Entity creation cancelled: ${error.message}`);
    }
}

/**
 * Creates base entity data (common to all entity types)
 */
async function createBaseEntity(tp, ENTITY_TYPES) {
    const data = {};
    data.entityType = await tp.system.suggester(ENTITY_TYPES, ENTITY_TYPES, false, "Entity type:");
    
    const { ENTITY_CONFIGS, sanitizeStringForVault } = tp.user.constants();
    const config = ENTITY_CONFIGS[data.entityType];
    
    // Get and sanitize entity name
    let entityName = await tp.system.prompt(`Enter ${data.entityType} name:`, null, true);
    if (!entityName) {
        new Notice("Entity name is required");
        return;
    }
    
    data.entityName = sanitizeStringForVault(entityName);
    
    // Process entity name if config has a processor
    if (config?.entityNameProcessor) {
        data.entityName = config.entityNameProcessor(data.entityName, tp);
    }
    
    // Generate metadata
    data.shortname = await tp.user.generateShortName(tp, data.entityName);
    data.id = await tp.user.generateShortName(tp, data.entityName, true);
    data.created = tp.date.now("YYYY-MM-DD");
    data.createdFrom = "[[Create Entity]]";
    
    // Add parent if config has one
    if (config?.parent) {
        data.parent = config.parent;
    }
    
    // Build tags
    data.tags = [
        `${data.entityType}/${data.shortname}`,
        `entity/${data.entityType}`,
        ...(config?.baseTags || [])
    ];
    
    return data;
}

async function createEntityFile(tp, filePath, frontmatterData, templateName = null) {
    try {
        // Handle existing file
        const existingFile = app.vault.getAbstractFileByPath(filePath);
        if (existingFile) {
            const overwrite = await tp.system.suggester(
                ["Yes, overwrite", "No, cancel"], 
                [true, false], 
                false, 
                "File already exists. Overwrite?"
            );
            if (!overwrite) return { success: false, reason: "cancelled" };
            await app.vault.delete(existingFile);
        }
        
        // Create file with frontmatter
        await app.vault.create(filePath, "---\n---\n");
        const newFile = app.vault.getAbstractFileByPath(filePath);
        await tp.user.updateFrontmatter(tp, newFile, frontmatterData);
        
        // Add template content
        if (templateName) {
            const templateResult = await tp.user.getFileByTitle(tp, templateName);
            if (templateResult.success) {
                const currentContent = await app.vault.read(newFile);
                await app.vault.modify(newFile, currentContent + '\n' + templateResult.content);
            }
        }
        
        // Open file
        await app.workspace.getLeaf(false).openFile(newFile);
        
        return { success: true, file: newFile, path: filePath, overwritten: !!existingFile };
        
    } catch (error) {
        console.error("Error creating entity file:", error);
        return { success: false, reason: "error", error: error.message };
    }
}

module.exports = createEntity;