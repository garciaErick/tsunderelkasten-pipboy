<%*
// Add Todo to Current File - uses smart todo detection
try {
    const result = await tp.user.addSmartTodo(tp);
    
    if (result.success) {
        new Notice(`✅ ${result.message}`);
    } else {
        new Notice(`❌ ${result.message}`);
    }
    
} catch (error) {
    new Notice("❌ Error adding todo to current file");
    console.error("Error adding todo to current file:", error);
}
%>