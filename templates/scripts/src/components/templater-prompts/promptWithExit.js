// Helper function to prompt with exit check
const promptWithExit = async (tp, message, defaultValue = "") => {
    const input = await tp.system.prompt(`${message}   (type exit to abort)`, defaultValue);
    
    if (input === null) {
        // User hit escape or cancel - return special symbol to go back
        return undefined; 
    }
    if (input && input.toLowerCase() === 'exit') {
        return null; // Signal to exit completely
    }
    
    return input || defaultValue; // Empty input uses default
};

module.exports = promptWithExit;