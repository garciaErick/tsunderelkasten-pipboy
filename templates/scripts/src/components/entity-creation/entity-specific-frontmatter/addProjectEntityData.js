/**
 * Main function to add project-specific data
 */
async function addProjectEntityData(tp, entityData) {
    // Add basic project fields
    entityData.description = await tp.system.prompt("Project Description:", "");
    
    // Handle parent project selection
    const parentProject = await selectParentProject(tp);
    entityData.parent = parentProject ? `[[${parentProject.file.basename}]]` : "[[Projects]]";
    
    // Store parent project ID for hierarchy building
    entityData.parentProject = parentProject ? parentProject.frontmatter.id : null;
    
    // Build project tag with hierarchy
    const projectTag = await buildProjectHierarchyTag(tp, entityData, parentProject);
    entityData.tags.push("structured-note");
    entityData.tags.push(`project/${projectTag}`);
    return entityData;
}

/**
 * Handles parent project selection logic
 */
async function selectParentProject(tp) {
    const isSubProject = await tp.system.suggester(
        ["No, main project", "Yes, sub-project"], 
        [false, true], 
        false, 
        "Is this a sub-project?"
    );
    
    if (!isSubProject) return null;
    
    // Get existing projects using the entity-specific method
    const projectsResult = await tp.user.getEntitiesByType(tp, 'project');
    
    if (!projectsResult || !projectsResult.files || projectsResult.files.length === 0) {
        new Notice("No existing projects found, creating as main project");
        return null;
    }
    
    const existingProjects = projectsResult.files.filter(p => p.frontmatter && p.frontmatter.id);
    
    if (existingProjects.length === 0) {
        new Notice("No valid projects found, creating as main project");
        return null;
    }
    
    // Build selection options
    const projectOptions = existingProjects.map(p => p.frontmatter.entityName || p.file.basename);
    
    const selectedParentName = await tp.system.suggester(
        projectOptions,
        projectOptions,
        false,
        "Select parent project:"
    );
    
    if (!selectedParentName) {
        new Notice("No parent project selected, creating as main project");
        return null;
    }
    
    return existingProjects.find(p => 
        (p.frontmatter.entityName || p.file.basename) === selectedParentName
    );
}

/**
 * Builds hierarchical project tag using IDs for relationships but shortnames for display
 */
async function buildProjectHierarchyTag(tp, entityData, parentProject) {
    if (!parentProject) {
        return entityData.shortname; // Just use shortname for main projects
    }
    
    // Get all projects to build full hierarchy
    const allProjectsResult = await tp.user.getEntitiesByType(tp, 'project');
    const allProjects = (allProjectsResult && allProjectsResult.files) ? allProjectsResult.files : [];
    
    // Build the hierarchy by walking up the parent chain
    return buildHierarchicalTag(entityData, allProjects, parentProject);
}

/**
 * Helper function to build hierarchical project tag from IDs but display shortnames
 */
function buildHierarchicalTag(currentEntityData, allProjects, parentProject) {
    const tags = [currentEntityData.shortname]; // Start with current project's shortname
    let currentParent = parentProject;
    
    // Walk up the parent chain using IDs for lookup
    while (currentParent) {
        tags.unshift(currentParent.frontmatter.shortname); // Add parent's shortname to front
        
        // Find the next parent up the chain
        if (currentParent.frontmatter.parentProject) {
            currentParent = allProjects.find(p => p.frontmatter.id === currentParent.frontmatter.parentProject);
        } else {
            break; // No more parents
        }
    }
    
    return tags.join('/');
}

module.exports = addProjectEntityData;