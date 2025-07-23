// Helper function to generate camelCase IDs with optional unique suffix
const generateShortName = (tp, fullName, addUniqueSuffix = false) => {
    if (!fullName || typeof fullName !== 'string') return '';
    
    // Check if the string starts with a date pattern (YYYY-MM-DD)
    const datePattern = /^(\d{4}-\d{2}-\d{2})\s+(.+)$/;
    const dateMatch = fullName.match(datePattern);
    
    if (dateMatch) {
        // Handle date + other content separately
        const datePart = dateMatch[1]; // e.g., "2025-07-14"
        const restPart = dateMatch[2]; // e.g., "Monday Workout"
        
        // Process the non-date part with camelCase
        const camelCaseRest = restPart
            .toLowerCase()
            .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters from non-date part
            .split(' ')
            .map((word, index) => {
                if (index === 0) return word;
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join('');
        
        const result = `${datePart}-${camelCaseRest}`;
        
        // Add unique suffix only if requested
        if (addUniqueSuffix) {
            const uniqueSuffix = Math.random().toString(36).substr(2, 6);
            return `${result}_${uniqueSuffix}`;
        }
        
        return result;
    } else {
        // No date pattern, use original logic
        const camelCaseName = fullName
            .toLowerCase()
            .replace(/[^a-zA-Z0-9\s\-]/g, '') // Keep hyphens along with letters, numbers, and spaces
            .split(' ')
            .map((word, index) => {
                if (index === 0) return word;
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join('');
        
        // Add unique suffix only if requested
        if (addUniqueSuffix) {
            const uniqueSuffix = Math.random().toString(36).substr(2, 6);
            return `${camelCaseName}_${uniqueSuffix}`;
        }
        
        return camelCaseName;
    }
};

module.exports = generateShortName;