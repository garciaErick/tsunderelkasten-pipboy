/**
 * Helper function to add Digital Garden frontmatter template to a file
 * @param {Object} tp - Templater object
 * @param {Object} file - Obsidian file object (optional if using current file)
 * @param {Object} options - Optional overrides for default values
 * @param {string} options.title - Custom title (defaults to entityName from frontmatter or file title)
 * @param {string} options.created - Custom creation date (defaults to today)
 * @param {boolean} options.dgPublish - dg-publish value (default: false)
 * @param {string} options.description - Description text (default: empty)
 * @param {string} options.ogType - Open Graph type (default: empty, will prompt if not provided)
 * @param {string} options.image - Image URL for og:image (default: empty)
 * @param {Array|string} options.aliases - Aliases array or string (default: empty array)
 * @returns {Promise<string>} The updated file content
 */
async function addDigitalGardenFrontmatter(tp, file = null, options = {}) {
    const updateFrontmatter = tp.user.updateFrontmatter;
    const parseFrontmatter = tp.user.parseFrontmatter;
    
    // If no file provided, use current file
    const targetFile = file || tp.file.find_tfile(tp.file.title);
    
    if (!targetFile) {
        throw new Error("No file found for frontmatter template");
    }
    
    // Get existing frontmatter to check for entityName
    const existingFrontmatter = parseFrontmatter(tp, targetFile);
    
    // Get current date in YYYY-MM-DD format
    const currentDate = tp.date.now("YYYY-MM-DD");
    
    // Default title priority: options.title > entityName > file.title
    const defaultTitle = options.title || existingFrontmatter.entityName || tp.file.title;
    
    // Build updates object with defaults and overrides
    const updates = {
        title: defaultTitle,
        created: options.created || currentDate,
        'dg-publish': options.dgPublish !== undefined ? options.dgPublish : false,
        aliases: options.aliases || []
    };
    
    // Add dg-metatags with description and/or image if provided
    if (options.description || options.image || options.ogType) {
        const metatags = {};
        if (options.description) {
            metatags.description = options.description;
            metatags['og:description'] = options.description;
        }
        if (options.image) {
            metatags['og:image'] = options.image;
            metatags['twitter:card'] = 'summary_large_image';
        }
        if (options.ogType) {
            metatags['og:type'] = options.ogType;
        }
        
        // Always add these defaults
        metatags['twitter:site'] = '@tsunderick';
        metatags.author = 'tsunderick';
        
        updates['dg-metatags'] = metatags;
    }
    
    // Use your existing updateFrontmatter helper
    return await updateFrontmatter(tp, targetFile, updates);
}

/**
 * Interactive wrapper that prompts user for Digital Garden frontmatter values
 * @param {Object} tp - Templater object
 * @param {Object} file - Obsidian file object (optional if using current file)
 * @returns {Promise<string>} The updated file content
 */
async function addDigitalGardenFrontmatterInteractive(tp, file = null) {
    const parseFrontmatter = tp.user.parseFrontmatter;
    const reorderSuggesterOptions = tp.user.reorderSuggesterOptions;
    
    // Get target file
    const targetFile = file || tp.file.find_tfile(tp.file.title);
    
    // Get existing frontmatter to check for entityName
    const existingFrontmatter = parseFrontmatter(tp, targetFile);
    const title = existingFrontmatter.entityName || tp.file.title;
    
    // Get existing values for defaults
    const existingDescription = existingFrontmatter['dg-metatags']?.description || existingFrontmatter.description || "";
    const existingImage = existingFrontmatter.imageUrl || existingFrontmatter['dg-metatags']?.['og:image'] || "";
    const existingOgType = existingFrontmatter['dg-metatags']?.['og:type'] || "";
    const existingAliases = Array.isArray(existingFrontmatter.aliases) 
        ? existingFrontmatter.aliases.join(", ") 
        : (existingFrontmatter.aliases || "");
    const existingPublish = existingFrontmatter['dg-publish'] || false;
    
    // Prompt for user input with existing values as defaults
    const description = await tp.system.prompt("Description", existingDescription);
    const image = await tp.system.prompt("Image URL (for social media preview)", existingImage);
    
    // Use helper for og:type suggester with descriptive labels
    const ogTypeOptions = ["recipe", "article", "blogpost", "review", "guide", "howto", "book", "music", "video"];
    const ogTypeLabels = [
        "recipe (cooking content)",
        "article (general articles, lists, reference content)",
        "blogpost (thoughts, personal posts, observations)",
        "review (product/yerba/book reviews)",
        "guide (comprehensive guides and tutorials)",
        "howto (step-by-step instructions)",
        "book (book content)",
        "music (music content)",
        "video (video content)"
    ];
    
    // Create a mapping function for the suggester
    const ogTypeMapper = (option) => {
        const index = ogTypeOptions.indexOf(option);
        return index >= 0 ? ogTypeLabels[index] : option;
    };
    
    const ogType = await reorderSuggesterOptions(tp, ogTypeOptions.map(ogTypeMapper), existingOgType ? ogTypeMapper(existingOgType) : "", "Select Open Graph Type");
    
    // Extract the actual type from the selected label
    const selectedOgType = ogType ? ogTypeOptions[ogTypeLabels.indexOf(ogType)] || ogType.split(' ')[0] : existingOgType || "article";
    
    const aliasesInput = await tp.system.prompt("Aliases (comma-separated)", existingAliases);
    const dgPublish = await tp.system.prompt("Publish to Digital Garden? (y/n)", existingPublish ? "y" : "n") === "y";
    
    // Process aliases from comma-separated strings
    const aliases = aliasesInput ? aliasesInput.split(",").map(alias => alias.trim()).filter(alias => alias) : [];
    
    // Build options object
    const options = {
        title,
        description,
        ogType: selectedOgType,
        image,
        aliases,
        dgPublish
    };
    
    // Use the main helper method
    return await addDigitalGardenFrontmatter(tp, file, options);
}

module.exports = addDigitalGardenFrontmatterInteractive;