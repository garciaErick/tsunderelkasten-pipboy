/**
 * Smart Generic Todo - detects entity type and uses appropriate handler
 */
async function addSmartTodo(tp, targetPath = null) {
    try {
        // Get current file path if not provided
        if (!targetPath) {
            if (tp.config && tp.config.target_file && tp.config.target_file.path) {
                targetPath = tp.config.target_file.path;
            } else if (tp.file && tp.file.path) {
                targetPath = tp.file.path;
            } else {
                const activeFile = tp.app.workspace.getActiveFile();
                if (activeFile) {
                    targetPath = activeFile.path;
                }
            }
        }
        
        if (!targetPath) {
            return { success: false, message: "Unable to determine current file" };
        }
        
        // Get the file to analyze its frontmatter
        const file = app.vault.getAbstractFileByPath(targetPath);
        if (!file) {
            return { success: false, message: "File not found" };
        }
        
        // Read frontmatter to determine entity type
        const fileCache = app.metadataCache.getFileCache(file);
        const frontmatter = fileCache?.frontmatter;
        const entityType = frontmatter?.entityType;
        
        // Route to appropriate handler based on entity type
        return await routeTodoByEntityType(tp, targetPath, entityType, frontmatter);
        
    } catch (error) {
        console.error("Error adding smart todo:", error);
        return { success: false, message: `Error adding todo: ${error.message}` };
    }
}

/**
 * Routes todo creation to appropriate handler based on entity type
 */
async function routeTodoByEntityType(tp, targetPath, entityType, frontmatter) {
    if (entityType) {
        return await handleEntityTodo(tp, targetPath, frontmatter, entityType);
    } else {
        return await handleGenericTodo(tp, targetPath);
    }
}

/**
 * Generic entity todo handler - works for all entity types
 */
async function handleEntityTodo(tp, targetPath, frontmatter, entityType) {
    const todoContent = await tp.system.prompt(`Enter ${entityType} todo:`);
    if (!todoContent) {
        return { success: false, message: "No todo content provided" };
    }
    
    // Find the entity tag that contains the shortname or id
    const entityTags = frontmatter.tags || [];
    const entityTag = entityTags.find(tag => 
        tag.startsWith(`${entityType}/`) && 
        (tag.includes(frontmatter.shortname) || tag.includes(frontmatter.id))
    );
    
    // Add the entity tag if found
    const taskContentWithTag = entityTag ? 
        `${todoContent} #${entityTag}` : 
        `${todoContent} #${entityType}`;
    
    // Check if Todo section exists first, if so, use it directly
    const sectionName = await findTodoSectionOrAuto(tp, targetPath);
    const result = await tp.user.addTodoToFileSection(tp, targetPath, sectionName, taskContentWithTag);
    
    if (result.success) {
        // Open file and jump to the Todo section
        await tp.user.openFile(targetPath, sectionName);
        
        if (entityType === "project") {
            return { success: true, message: `Added task to ${entityType}: ${frontmatter.entityName}` };
        }
        return { success: true, message: `Added todo to ${entityType}: ${frontmatter.entityName}` };
    }
    
    return result;
}



/**
 * Generic todo handler (fallback for unknown entity types or non-entities)
 */
async function handleGenericTodo(tp, targetPath) {
    const todoContent = await tp.system.prompt("Enter todo description:");
    if (!todoContent) {
        return { success: false, message: "No todo content provided" };
    }
    
    // Check if Todo section exists first, if so, use it directly
    const sectionName = await findTodoSectionOrAuto(tp, targetPath);
    const result = await tp.user.addTodoToFileSection(tp, targetPath, sectionName, todoContent);
    
    if (result.success) {
        // Open file and jump to the Todo section
        await tp.user.openFile(targetPath, sectionName);
    }
    
    return result;
}

/**
 * Helper to find existing Todo section or use auto suggester
 */
async function findTodoSectionOrAuto(tp, targetPath) {
    // Use existing getSectionsFromFile helper
    const sectionsResult = await tp.user.getSectionsFromFile(tp, targetPath);
    
    if (!sectionsResult.success) {
        return "auto"; // Fall back to suggester if can't get sections
    }
    
    // Look for Todo sections (case insensitive)
    const todoSection = sectionsResult.sections.find(section => 
        /[Tt]odo/.test(section)
    );
    
    if (todoSection) {
        return todoSection.trim(); // Return the exact section name
    }
    
    return "auto"; // Fall back to suggester
}

module.exports = addSmartTodo;