async function morningRoutine(tp) {
    const addDailyHeadspace = tp.user.addDailyHeadspace;
    const addDailyBounties = tp.user.addDailyBounties;
    const updateWellnessMetadata = tp.user.updateWellnessMetadata;

    new Notice("Starting morning routine...");
    
    // 1. What's on your mind?
    await addDailyHeadspace(tp);
    
    // 2. Top 3 bounties
    await addDailyBounties(tp);
    
    // 3. Wellness check
    await updateWellnessMetadata(tp);
    
    new Notice("Morning routine complete! Ready to conquer the day! 🚀");
}

module.exports = morningRoutine;