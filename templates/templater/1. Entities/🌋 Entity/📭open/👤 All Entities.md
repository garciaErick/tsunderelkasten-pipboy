<%*
const { createSuggesterFromAllEntityTypes } = tp.user.constants();
const createSuggesterFromEntityType = tp.user.createSuggesterFromEntityType;
const openFile = tp.user.openFile;

try {
    const entityType = await createSuggesterFromAllEntityTypes(tp);
    console.log("Selected entity type:", entityType);
    const selectedEntity = await createSuggesterFromEntityType(tp, entityType, {
        prompt: 'Select entity to open:'
    });
	
    if (selectedEntity) {
        await openFile(selectedEntity.file.path);
    }
} catch (error) {
    new Notice("Error selecting entity type");
    console.error("Error:", error);
}
%>