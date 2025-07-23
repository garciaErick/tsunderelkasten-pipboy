// Helper function to reorder suggester options with current value first
const reorderSuggesterOptions = async (tp, options, currentValue, prompt) => {
    if (!Array.isArray(options)) return null;
    
    // Reorder options to put current value first if it exists
    const reorderedOptions = currentValue && options.includes(currentValue)
        ? [currentValue, ...options.filter(option => option !== currentValue)]
        : options;
    
    // Enhance prompt to show current value
    const enhancedPrompt = currentValue 
        ? `${prompt} (current: ${currentValue})`
        : prompt;
    
    return await tp.system.suggester(reorderedOptions, reorderedOptions, false, enhancedPrompt);
};

module.exports = reorderSuggesterOptions;