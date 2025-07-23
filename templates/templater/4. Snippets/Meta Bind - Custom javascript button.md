<%*
// Prompt for button parameters
let style = await tp.system.prompt("Button style (primary, secondary, destructive, default):", "primary");
let label = await tp.system.prompt("Button label (required):");
if (!label) {
    new Notice("Label is required!");
    return;
}
let functionName = await tp.system.prompt("Templater function name (e.g., updateSleepCycles, leave empty for custom code):");

// Generate and return the button template
return tp.user.createJsFunctionButton(label, functionName, style);
_%>