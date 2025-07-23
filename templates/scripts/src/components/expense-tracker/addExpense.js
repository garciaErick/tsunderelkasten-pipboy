async function addExpense(tp) {
    const {file} = await tp.user.getFileByTitle(tp, "Expense Tracker");
    
    if (!file) {
        new Notice("Expense Tracker file not found!");
        return;
    }
    
    const frontmatter = app.metadataCache.getFileCache(file)?.frontmatter;
    const participants = frontmatter?.participants || [];
    let expenses = frontmatter?.expenses || [];
    
    if (!Array.isArray(expenses)) {
        expenses = [];
    }
    
    if (participants.length === 0) {
        new Notice("No participants found! Add participants to frontmatter first.");
        return;
    }
    
    const item = await tp.system.prompt("Expense description:");
    if (!item) return;
    
    const amountStr = await tp.system.prompt("Amount (just the number):");
    if (!amountStr) return;
    const amount = parseFloat(amountStr);
    
    if (isNaN(amount)) {
        new Notice("Invalid amount entered!");
        return;
    }
    
    const payer = await tp.system.suggester(participants, participants, false, "Who paid?");
    if (!payer) return;
    
    // Choose split type
    const splitTypeOptions = [
        "💰 Normal split (payer included in split)",
        "🎁 Payer not included in the split"
    ];
    
    const splitType = await tp.system.suggester(
        splitTypeOptions,
        splitTypeOptions,
        false,
        "Split type:",
        0  // Default to normal split
    );
    
    if (!splitType) return;
    
    const payerExcluded = splitType === "🎁 Payer not included in the split";
    
    // Multi-select who to split among
    let splitAmong = [];
    let continuePicking = true;
    
    // FIXED: For both split types, remove payer from suggestions
    // But for normal splits, we'll add them back at the end
    const availableParticipants = participants.filter(p => p !== payer);
    
    if (availableParticipants.length === 0) {
        new Notice("No other participants available to split with!");
        return;
    }
    
    // First choice: split among all available or select individually
    const splitOptions = payerExcluded ? 
        [
            "🌍 Split among all other participants",
            "👤 Select specific people"
        ] :
        [
            "🌍 Split among all other participants (+ payer automatically)", 
            "👤 Select specific people (+ payer automatically)"
        ];
    
    const splitChoice = await tp.system.suggester(
        splitOptions,
        splitOptions,
        false,
        "How to split the expense?"
    );
    
    if (!splitChoice) return;
    
    if (splitChoice.includes("Split among all")) {
        splitAmong = [...availableParticipants];
    } else {
        // Individual selection with multi-select flow
        while (continuePicking && splitAmong.length < availableParticipants.length) {
            const remainingParticipants = availableParticipants.filter(person => 
                !splitAmong.includes(person)
            );
            
            if (remainingParticipants.length === 0) break;
            
            const selectionOptions = ["✅ Done selecting people"];
            remainingParticipants.forEach(person => {
                selectionOptions.push(person);
            });
            
            const selected = await tp.system.suggester(
                selectionOptions,
                selectionOptions,
                false,
                `Select person ${splitAmong.length + 1} to split with (or finish):`
            );
            
            if (!selected || selected === "✅ Done selecting people") {
                continuePicking = false;
            } else {
                splitAmong.push(selected);
                new Notice(`Added ${selected} (${splitAmong.length} people selected)`);
            }
        }
        
        if (splitAmong.length === 0) {
            new Notice("No people selected for splitting");
            return;
        }
    }
    
    // FIXED: For normal splits, automatically add payer at the end
    if (!payerExcluded) {
        splitAmong.push(payer);
    }
    
    // Create new expense
    const newExpense = {
        item,
        amount,
        payer,
        split_among: splitAmong,
        date: tp.date.now("YYYY-MM-DD"),
        time: tp.date.now("HH:mm"),
        payerExcluded: payerExcluded
    };
    
    expenses.push(newExpense);
    
    await tp.user.updateFrontmatter(tp, file, {
        expenses: expenses
    });
    
    const splitSummary = splitAmong.join(", ");
    const payerNote = payerExcluded ? ` (${payer} not included in split)` : ` (including ${payer})`;
    
    new Notice(`Added expense: ${item} ($${amount}) paid by ${payer}, split among ${splitSummary}${payerNote}`);
    
    await new Promise(resolve => setTimeout(resolve, 200));
    await tp.user.updateExpenseTracker(tp);
}

module.exports = addExpense;