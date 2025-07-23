<%*
// Get the alt text and URL from user input
const altText = await tp.system.prompt("Enter the image alt text (optional):");
const url = await tp.system.prompt("Enter the image URL:");

// Check if URL was provided (alt text is optional)
if (!url) {
    new Notice("Image URL is required!");
    return;
}

// Create the markdown image link with size
// If no alt text provided, use empty string
const imageText = `![${altText || ""}|400](${url})`;

// Get current editor
const editor = app.workspace.activeEditor?.editor;
if (editor) {
    // Insert the image at cursor position
    editor.replaceSelection(imageText);
    new Notice("Image added successfully!");
} else {
    new Notice("No active editor found!");
}
%>