// Base paths
const BASE_PATH = "tsunderelkasten";
const FLEETING_NOTE_PATH = `${BASE_PATH}/1.fleeting`;
const LITERATURE_NOTE_PATH = `${BASE_PATH}/2.literature`;
const PERMANENT_NOTE_PATH = `${BASE_PATH}/3.permanent`;
const REFERENCE_NOTE_PATH = `${BASE_PATH}/4.reference`;
const STRUCTURED_NOTE_PATH = `${BASE_PATH}/5.structured`;
// Specific paths
const DAILY_NOTE_PATH = `${FLEETING_NOTE_PATH}/1.daily`;

// Entity types (sorted alphabetically)
const ENTITY_TYPES = [
  "adventure",
  "anime", 
  "book",
  "calculator",
  "daily-workout",
  "exercise",
  "expense-tracker",
  "fleeting-list", 
  "fleeting-note",
  "how-to",
  "inventory",
  "literature-note",
  "manga",
  "movie",
  "music-album",
  "permanent-note",
  "person",
  "project", 
  "recipe",
  "recurring-event",
  "recurring-payment",
  "reference-list",
  "reference-note",
  "shopping-list",
  "table-of-contents",
  "tv-show"
];

// Suggester function for entity types
async function createSuggesterFromAllEntityTypes(tp) {
  return await tp.system.suggester(
    ENTITY_TYPES,
    ENTITY_TYPES,
    false,
    "Select your entity type" 
  );
}

const ENTITY_CONFIGS = {
  // === STRUCTURED NOTES ===
  "expense-tracker": {
    prefix: "💰 Expense Tracker",
    parent: "[[💰 Expense Trackers]]",
    parentPath: STRUCTURED_NOTE_PATH,
    processor: (tp, entityData, config) => tp.user.addExpenseTrackerEntityData(tp, entityData, config),
    templateName: "Expense Tracker Entity View",
    baseTags: ["finance"]
  },
  
  "adventure": {
    prefix: "🧭 Adventures",
    parent: "[[🧭 Adventures]]",
    parentPath: STRUCTURED_NOTE_PATH,
    templateName: "Adventure Entity View",
    baseTags: ["reference-note"]
  },
  
  "project": {
    prefix: "📋 Projects",
    parent: "[[📋 Projects]]",
    parentPath: STRUCTURED_NOTE_PATH,
    processor: (tp, entityData, config) => tp.user.addProjectEntityData(tp, entityData),
    templateName: "Project Entity View",
    baseTags: []
  },
  
  "inventory": {
    prefix: "📦 Inventory",
    parent: "[[📦 Inventory]]",
    parentPath: STRUCTURED_NOTE_PATH,
    processor: (tp, entityData, config) => tp.user.addInventoryEntityData(tp, entityData, config),
    templateName: "Inventory Entity View",
    baseTags: ["inventory"]
  },
  
  "recurring-event": {
    prefix: "📅 Recurring Event",
    parent: "[[📅 Recurring Events]]",
    parentPath: STRUCTURED_NOTE_PATH,
    processor: (tp, entityData, config) => tp.user.addRecurringEventEntityData(tp, entityData, config),
    templateName: "Recurring Event Entity View",
    baseTags: ["event", "recurring"]
  },
  
  "recurring-payment": {
    prefix: "💳 Payment",
    parent: "[[💳 Payments]]",
    parentPath: STRUCTURED_NOTE_PATH,
    processor: (tp, entityData, config) => tp.user.addRecurringPaymentEntityData(tp, entityData, config),
    templateName: "Recurring Payment Entity View",
    baseTags: ["payment", "recurring"]
  },
  
  "shopping-list": {
    prefix: "🛒 Shopping List",
    parent: "[[🛒 Shopping Lists]]",
    parentPath: STRUCTURED_NOTE_PATH,
    processor: (tp, entityData, config) => tp.user.addShoppingListEntityData(tp, entityData, config),
    templateName: "Shopping List Entity View",
    baseTags: ["shopping-list"]
  },

  // === DAILY NOTES ===
  "daily-workout": {
    prefix: "",
    parentPath: DAILY_NOTE_PATH,
    entityNameProcessor: (entityName, tp) => `${tp.date.now("YYYY-MM-DD dddd")} Workout`,
    filenameGenerator: (config, entityData, tp) => `${tp.date.now("YYYY-MM-DD dddd")} Workout`,
    processor: (tp, entityData, config) => tp.user.addDailyWorkoutEntityData(tp, entityData, config),
    templateName: "Daily Workout Entity View",
    baseTags: []
  },

  // === FLEETING NOTES ===
  "fleeting-note": {
    prefix: "📎",
    parentPath: FLEETING_NOTE_PATH,
    entityNameProcessor: (entityName, tp) => `${tp.date.now("YYYY-MM-DD")} - ${entityName}`,
    filenameGenerator: (config, entityData, tp) => `${config.prefix} ${entityData.entityName}`,
    pathGenerator: (config, fileName, tp) => `${config.parentPath}/5.misc/${fileName}.md`,
    templateName: "Fleeting Note Entity View",
    baseTags: ["fleeting-note"]
  },
  
  "fleeting-list": {
    prefix: "📎",
    parentPath: FLEETING_NOTE_PATH,
    entityNameProcessor: (entityName, tp) => `${tp.date.now("YYYY-MM-DD")} - ${entityName}`,
    filenameGenerator: (config, entityData, tp) => `${config.prefix} ${entityData.entityName}`,
    pathGenerator: (config, fileName, tp) => `${config.parentPath}/5.misc/${fileName}.md`,
    templateName: "Fleeting List Entity View",
    baseTags: ["fleeting-note"]
  },

  // === LITERATURE NOTES ===
  "literature-note": {
    prefix: "📚 Literature",
    parent: "[[📚 Literature]]",
    parentPath: LITERATURE_NOTE_PATH,
    processor: (tp, entityData, config) => tp.user.addLiteratureNoteEntityData(tp, entityData, config),
    templateName: "Literature Note Entity View",
    baseTags: ["literature-note"]
  },

  // === PERMANENT NOTES ===
  "permanent-note": {
    prefix: "🧠 Permanent",
    parent: "[[🧠 Permanent Notes]]",
    parentPath: PERMANENT_NOTE_PATH,
    templateName: "Permanent Note Entity View",
    baseTags: ["permanent-note"]
  },
  
  "person": {
    prefix: "👤 People",
    parent: "[[👤 People]]",
    parentPath: PERMANENT_NOTE_PATH,
    templateName: "Person Entity View",
    baseTags: ["permanent-note"]
  },

  // === REFERENCE NOTES ===
  "reference-note": {
    prefix: "📖 Reference",
    parent: "[[📖 References]]",
    parentPath: REFERENCE_NOTE_PATH,
    templateName: "Reference Note Entity View",
    baseTags: ["reference-note"]
  },
  
  "reference-list": {
    prefix: "📋 Reference List",
    parent: "[[📋 Reference Lists]]",
    parentPath: REFERENCE_NOTE_PATH,
    processor: (tp, entityData, config) => tp.user.addReferenceListEntityData(tp, entityData, config),
    templateName: "Reference List Entity View",
    baseTags: ["reference-note"]
  },
  
  "calculator": {
    prefix: "🧮 Calculator",
    parent: "[[🧮 Calculators]]",
    parentPath: REFERENCE_NOTE_PATH,
    templateName: "Calculator Entity View",
    baseTags: ["reference-note"]
  },
  
  "exercise": {
    prefix: "🏋🏿 Exercises",
    parent: "[[🏋🏿 Exercises]]",
    parentPath: REFERENCE_NOTE_PATH,
    processor: (tp, entityData, config) => tp.user.addExerciseEntityData(tp, entityData),
    templateName: "Exercise Entity View",
    baseTags: []
  },
  
  "how-to": {
    prefix: "📋 How To",
    parent: "[[📋 How To]]",
    parentPath: REFERENCE_NOTE_PATH,
    processor: (tp, entityData, config) => { entityData.steps = []; return entityData; },
    templateName: "How To Entity View",
    baseTags: ["how-to", "reference-note"]
  },
  
  "table-of-contents": {
    prefix: "📚 Table of Contents",
    parent: "[[📚 Table of Contents]]",
    parentPath: REFERENCE_NOTE_PATH,
    templateName: "Table of Contents Entity View",
    baseTags: ["toc", "reference-note"]
  },
  
  "recipe": {
    prefix: "🍳 Recipe",
    parent: "[[🍳 Recipes]]",
    parentPath: REFERENCE_NOTE_PATH,
    processor: (tp, entityData, config) => tp.user.addRecipeEntityData(tp, entityData, config),
    templateName: "Recipe Entity View",
    baseTags: ["recipe"]
  },

  // === MEDIA ENTITIES ===
  "tv-show": {
    prefix: "📺 TV Shows",
    parent: "[[📺 TV Shows]]",
    parentPath: REFERENCE_NOTE_PATH,
    processor: (tp, entityData, config) => tp.user.addTVShowEntityData(tp, entityData, config),
    templateName: "TV Show Entity View",
    baseTags: ["media", "tv-show"]
  },
  
  "movie": {
    prefix: "🎬 Movies",
    parent: "[[🎬 Movies]]",
    parentPath: REFERENCE_NOTE_PATH,
    processor: (tp, entityData, config) => tp.user.addMovieEntityData(tp, entityData, config),
    templateName: "Movie Entity View",
    baseTags: ["media", "movie"]
  },
  
  "anime": {
    prefix: "🎌 Anime",
    parent: "[[🎌 Anime]]",
    parentPath: REFERENCE_NOTE_PATH,
    processor: (tp, entityData, config) => tp.user.addAnimeEntityData(tp, entityData, config),
    templateName: "Anime Entity View",
    baseTags: ["media", "anime"]
  },
  
  "book": {
    prefix: "📚 Book",
    parent: "[[📚 Books]]",
    parentPath: REFERENCE_NOTE_PATH,
    processor: (tp, entityData, config) => tp.user.addBookEntityData(tp, entityData, config),
    templateName: "Book Entity View",
    baseTags: ["media", "book"]
  },
  
  "manga": {
    prefix: "📖 Manga",
    parent: "[[📖 Manga]]",
    parentPath: REFERENCE_NOTE_PATH,
    processor: (tp, entityData, config) => tp.user.addMangaEntityData(tp, entityData, config),
    templateName: "Manga Entity View",
    baseTags: ["media", "manga"]
  },
  
  "music-album": {
    prefix: "🎵 Album",
    parent: "[[🎵 Albums]]",
    parentPath: REFERENCE_NOTE_PATH,
    processor: (tp, entityData, config) => tp.user.addMusicAlbumEntityData(tp, entityData, config),
    templateName: "Music Album Entity View",
    baseTags: ["media", "music", "album"]
  }
};

/**
 * Helper function to sanitize entity name for safe filename usage
 * @param {string} stringToSanitize - The string to sanitize
 * @returns {string} Sanitized name safe for filenames
 */
function sanitizeStringForVault(stringToSanitize) {
    return stringToSanitize
        .replace(/[<>:"/\\|?*]/g, '') // Remove Windows invalid characters
        .replace(/[|]/g, '-') // Replace pipes with dashes
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim(); // Remove leading/trailing whitespace
}

// Export as function for Templater compatibility
module.exports = function() {
  return {
    // Paths
    BASE_PATH,
    FLEETING_NOTE_PATH,
    DAILY_NOTE_PATH,
    LITERATURE_NOTE_PATH,
    PERMANENT_NOTE_PATH,
    REFERENCE_NOTE_PATH,
    STRUCTURED_NOTE_PATH,
    
    // Entity types
    ENTITY_TYPES,
    ENTITY_CONFIGS, // Added to exports
    
    // Utility functions
    createSuggesterFromAllEntityTypes,
    sanitizeStringForVault
  };
};