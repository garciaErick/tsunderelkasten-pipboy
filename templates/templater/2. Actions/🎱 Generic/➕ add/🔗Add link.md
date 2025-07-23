<%*
// Get the title and URL from user input
const title = await tp.system.prompt("Enter the link title:");
const url = await tp.system.prompt("Enter the URL:");

// Check if both inputs were provided
if (!title || !url) {
    new Notice("Both title and URL are required!");
    return;
}

// Create the markdown link
const linkText = `[${title}](${url})`;

// Get current editor
const editor = app.workspace.activeEditor?.editor;
if (editor) {
    // Insert the link at cursor position
    editor.replaceSelection(linkText);
    new Notice("Link added successfully!");
} else {
    new Notice("No active editor found!");
}
%>