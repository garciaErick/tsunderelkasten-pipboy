/**
 * Helper function to generate Meta Bind button templates
 * @param {string} label - Button label text
 * @param {string} functionName - Templater function name (defaults to placeholder)
 * @param {string} style - Button style (primary, secondary, destructive, default)
 * @returns {string} The generated Meta Bind button template
 */
function createJsFunctionButton(label, functionName = "yourFunction", style = "primary") {
    if (!label) {
        throw new Error("Label is required for Meta Bind button");
    }
    
    const buttonTemplate = `\`\`\`meta-bind-button
style: ${style}
label: ${label}
action:
  type: inlineJS
  code: |
    const templater = app.plugins.getPlugin('templater-obsidian');
    if (templater) {
      const tp = templater.templater.current_functions_object;
      await tp.user.${functionName}(tp);
    } else {
      new Notice("Templater plugin not found");
    }
\`\`\`\n`;
    
    return buttonTemplate;
}

module.exports = createJsFunctionButton;