/**
 * Opens a section from the current file using suggester
 */
async function openSectionFromCurrentFile(tp) {
    const sectionResult = await tp.user.matchSectionOrSuggestFromFile(tp, null, "auto", "📂 Select section to navigate to:");
    if (sectionResult.success) await tp.user.openFile(tp.file.path, sectionResult.sectionName);
    return sectionResult;
}

module.exports = openSectionFromCurrentFile;