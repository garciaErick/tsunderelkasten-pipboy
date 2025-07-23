// Function to round time to nearest 15 minutes
function roundToNearestQuarter(date) {
    const minutes = date.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 15) * 15;
    const roundedDate = new Date(date);
    roundedDate.setMinutes(roundedMinutes);
    roundedDate.setSeconds(0);
    return roundedDate;
}

function formatTimeWithoutSeconds(date) {
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
}

function generateSleepSection(now, fallAsleepTime) {
    const sleepCycleMinutes = 90;
    const sleepOptions = [3, 4, 5, 6, 7]; // 3-7 sleep cycles
    
    let sleepContent = `### 😴 Deep Sleep Options\n`;
    sleepContent += `| Cycles | Wake Time | Set Alarm | Total Sleep | Rest Quality | Status |\n`;
    sleepContent += `|--------|-----------|-----------|-------------|--------------|--------|\n`;
    
    sleepOptions.forEach(cycles => {
        const totalSleepMinutes = (cycles * sleepCycleMinutes);
        const wakeTime = new Date(now.getTime() + (totalSleepMinutes + fallAsleepTime) * 60000);
        const alarmTime = roundToNearestQuarter(wakeTime);
        const hours = Math.floor(totalSleepMinutes / 60);
        const minutes = totalSleepMinutes % 60;
        
        // Calculate rest quality
        let restQuality = "";
        let emoji = "";
        
        if (cycles <= 3) {
            restQuality = "Poor";
            emoji = "😴";
        } else if (cycles <= 4) {
            restQuality = "Fair";
            emoji = "😐";
        } else if (cycles <= 5) {
            restQuality = "Good";
            emoji = "😊";
        } else if (cycles <= 6) {
            restQuality = "Very Good";
            emoji = "😄";
        } else if (cycles <= 7) {
            restQuality = "Excellent";
            emoji = "🌟";
        } else {
            restQuality = "Well Rested";
            emoji = "✨";
        }
        
        sleepContent += `| ${cycles} ${emoji} | ${formatTimeWithoutSeconds(wakeTime)} | ${formatTimeWithoutSeconds(alarmTime)} | ${hours}h ${minutes}m | ${restQuality} | ${cycles >= 5 ? '✅' : cycles >= 4 ? '⚠️' : '❌'} |\n`;
    });
    
    sleepContent += `\n`;
    return sleepContent;
}

function generateNapSection(now, fallAsleepTime) {
    const napOptions = [
        { duration: 20, type: "Power Nap", description: "Quick refresher, no grogginess", emoji: "⚡" },
        { duration: 30, type: "Recovery Nap", description: "Brief grogginess possible", emoji: "🔋" },
        { duration: 90, type: "Full Cycle Nap", description: "Complete cycle, most restorative", emoji: "🌙" }
    ];
    
    let napContent = `### ⚡ Nap Options\n`;
    napContent += `| Type | Duration | Wake Time | Set Alarm | Effect | Recommended |\n`;
    napContent += `|------|----------|-----------|-----------|--------|-------------|\n`;
    
    napOptions.forEach(nap => {
        const totalNapMinutes = nap.duration + fallAsleepTime;
        const wakeTime = new Date(now.getTime() + totalNapMinutes * 60000);
        const alarmTime = roundToNearestQuarter(wakeTime);
        
        let recommendation = "";
        if (nap.duration === 20) {
            recommendation = "✅ Best";
        } else if (nap.duration === 90) {
            recommendation = "✅ Long Break";
        } else {
            recommendation = "⚠️ Risky";
        }
        
        napContent += `| ${nap.type} ${nap.emoji} | ${nap.duration} min | ${formatTimeWithoutSeconds(wakeTime)} | ${formatTimeWithoutSeconds(alarmTime)} | ${nap.description} | ${recommendation} |\n`;
    });
    
    napContent += `\n`;
    return napContent;
}

async function updateDailyNoteSleepTime(tp, now) {
    const currentTime = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
    
    const currentHour = now.getHours();
    const shouldUpdateYesterday = currentHour >= 0 && currentHour < 4;
    
    let targetDate;
    if (shouldUpdateYesterday) {
        targetDate = tp.date.now("YYYY-MM-DD dddd", -1);
    } else {
        targetDate = null;
    }
    
    const dailyNoteResult = tp.user.findDailyNote(tp, targetDate);
    
    if (dailyNoteResult.exists) {
        await tp.user.updateFrontmatter(tp, dailyNoteResult.file, {
            sleepTime24Hours: currentTime,
        });
    }
}

async function updateSleepCycles(tp, customHeading = "## 🌙 Sleep & Nap Calculator") {
    const now = new Date();
    const currentTime = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
    const fallAsleepTime = 15;
    
    const {file} = await tp.user.getFileByTitle(tp, "Sleep Calculator") || {};
    
    await tp.user.updateFrontmatter(tp, file, {
        sleepTime24Hours: currentTime,
    });

    await updateDailyNoteSleepTime(tp, now);

    let sleepContent = `${customHeading}\n`;
    sleepContent += `**Current Time:** ${currentTime} | **Fall Asleep Time:** ~15 minutes | **Sleep Cycle:** 90 minutes\n\n`;
    sleepContent += tp.user.createJsFunctionButton("🌙 Recalculate Sleep Times", "updateSleepCycles");
    sleepContent += `\n`;
    sleepContent += generateSleepSection(now, fallAsleepTime);
    sleepContent += generateNapSection(now, fallAsleepTime);
    
    const result = await tp.user.updateFileSection(tp, file.path, customHeading, sleepContent);

    await tp.user.openFile(file.path);
    if (result.success) {
        new Notice(`Updated sleep cycles at ${currentTime}`);
    } else {
        new Notice(`Error: ${result.message}`);
    }
}

module.exports = updateSleepCycles;