async function updateWellnessMetadata(tp) {
    // Import helper functions
    const findDailyNote = tp.user.findDailyNote;
    const parseFrontmatter = tp.user.parseFrontmatter;
    const reorderSuggesterOptions = tp.user.reorderSuggesterOptions;
    const updateFrontmatter = tp.user.updateFrontmatter;
    const openFile = tp.user.openFile;

    // Find today's daily note
    const dailyNoteInfo = await findDailyNote(tp);
    if(!dailyNoteInfo.exists) {
        new Notice(`Daily note not found: ${dailyNoteInfo.date}`);
        return;
    }

    // Read current frontmatter using helper function
    let frontmatterData = parseFrontmatter(tp, dailyNoteInfo.file);

    // Prompt for new values with current values as defaults using helper
    const moodOptions = ["😊", "😐", "😣"];
    let mood = await reorderSuggesterOptions(tp, moodOptions, frontmatterData.mood, "Select mood");
    if(!mood) return;

    const energyOptions = ["5", "4", "3", "2", "1"];
    let energy = await reorderSuggesterOptions(tp, energyOptions, frontmatterData.energy, "Select energy level");
    if(!energy) return;

    const sleepOptions = ["8", "7", "6", "5", "4", "3", "2"];
    let sleepHours = await reorderSuggesterOptions(tp, sleepOptions, frontmatterData.sleepHours, "Hours of sleep");
    if(!sleepHours) return;

    // Parse current wake up time - just use the value directly
    let currentWakeTime = frontmatterData.wakeUpTime;
    const timeOptions = [];
    for(let hour = 5; hour < 12; hour++) { // 5 AM to 11:59 AM (typical wake up times)
        for(let minute = 0; minute < 60; minute += 15) { // 15-minute intervals
            const h = hour.toString().padStart(2, '0');
            const m = minute.toString().padStart(2, '0');
            timeOptions.push(`${h}:${m}`);
        }
    }

    // If current time exists but isn't in our standard options, add it
    if(currentWakeTime && !timeOptions.includes(currentWakeTime)) {
        timeOptions.push(currentWakeTime);
        timeOptions.sort();
    }

    let selectedWakeTime = await reorderSuggesterOptions(tp, timeOptions, currentWakeTime, "Select wake up time");
    if(!selectedWakeTime) return;

    // Build full datetime - just use the time format HH:MM
    let wakeUpTime = selectedWakeTime;
    let weightKilograms = await tp.system.prompt("Weight in kilograms:", frontmatterData.weightKilograms || "");
    let totalCalories = await tp.system.prompt("Total calories:", frontmatterData.totalCalories || "");
    let totalProtein = await tp.system.prompt("Total protein (grams):", frontmatterData.totalProtein || "");

    // Build updates object
    const updates = {
        mood: mood,
        energy: parseInt(energy),
        sleepHours: parseInt(sleepHours),
        wakeUpTime: wakeUpTime,
        weightKilograms: weightKilograms,
        totalCalories: totalCalories,
        totalProtein: totalProtein
    };

    // Update frontmatter using helper function
    await updateFrontmatter(tp, dailyNoteInfo.file, updates);

    // Open the daily note to show the updates
    await openFile(dailyNoteInfo.path);
    new Notice("Updated wellness metadata!");
}

module.exports = updateWellnessMetadata;