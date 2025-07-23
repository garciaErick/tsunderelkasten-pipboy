<%*
// Add Todo to Entity - select entity type, then specific entity, then add smart todo
const { createSuggesterFromAllEntityTypes } = tp.user.constants();
const createSuggesterFromEntityType = tp.user.createSuggesterFromEntityType;
const openFile = tp.user.openFile;
const addSmartTodo = tp.user.addSmartTodo;

try {
    // Step 1: Select entity type
    const entityType = await createSuggesterFromAllEntityTypes(tp);
    if (!entityType) {
        new Notice("❌ No entity type selected");
        return;
    }
    
    console.log("Selected entity type:", entityType);
    
    // Step 2: Select specific entity of that type
    const selectedEntity = await createSuggesterFromEntityType(tp, entityType, {
        prompt: `Select ${entityType} to add todo to:`
    });
    
    if (!selectedEntity) {
        new Notice("❌ No entity selected");
        return;
    }
    
    // Step 3: Open the entity file
    await openFile(selectedEntity.file.path);
    
    // Step 4: Add smart todo to the opened entity
    const result = await addSmartTodo(tp, selectedEntity.file.path);
    
    if (result.success) {
        new Notice(`✅ ${result.message}`);
    } else {
        new Notice(`❌ ${result.message}`);
    }
    
} catch (error) {
    new Notice("❌ Error adding todo to entity");
    console.error("Error adding todo to entity:", error);
}
%>