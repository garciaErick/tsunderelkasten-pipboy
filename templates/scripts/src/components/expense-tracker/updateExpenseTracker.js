function calculateBalances(participants, expenses) {
   const balances = {};
   participants.forEach(person => balances[person] = { paid: 0, owes: 0, net: 0 });
   
   if (!Array.isArray(expenses)) {
       return balances;
   }
   
   expenses.forEach(expense => {
       if (!expense || !expense.payer || !expense.amount || !expense.split_among) {
           return;
       }
       
       if (balances[expense.payer]) {
           balances[expense.payer].paid += expense.amount;
       }
       
       let splitAmong = expense.split_among;
       if (!Array.isArray(splitAmong)) {
           return;
       }
       
       const splitAmount = expense.amount / splitAmong.length;
       splitAmong.forEach(person => {
           if (balances[person]) {
               balances[person].owes += splitAmount;
           }
       });
   });
   
   Object.keys(balances).forEach(person => {
       balances[person].net = balances[person].paid - balances[person].owes;
   });
   
   return balances;
}

function generateExpenseTable(expenses) {
   let content = `### 📋 Expense Details\n`;
   
   if (!expenses || expenses.length === 0) {
       content += `*No expenses recorded*\n\n`;
       return content;
   }
   
   content += `| Item | Amount | Paid By | Split Among | Date |\n`;
   content += `|------|--------|---------|-------------|------|\n`;
   
   expenses.forEach(expense => {
       const splitAmongStr = Array.isArray(expense.split_among) 
           ? expense.split_among.join(', ') 
           : expense.split_among;
           
       content += `| ${expense.item} | $${expense.amount.toFixed(2)} | ${expense.payer} | ${splitAmongStr} | ${expense.date || 'N/A'} |\n`;
   });
   
   content += `\n`;
   return content;
}

function generatePaymentSummary(balances) {
   let content = `### 💰 Payment Summary\n`;
   
   content += `| Person | Paid | Fair Share | Balance | Status |\n`;
   content += `|--------|------|------|---------|--------|\n`;
   
   Object.entries(balances).forEach(([person, balance]) => {
       const status = balance.net >= 0 ? `+$${balance.net.toFixed(2)}` : `-$${Math.abs(balance.net).toFixed(2)}`;
       const statusEmoji = balance.net >= 0 ? "✅" : "❌";
       
       content += `| ${person} | $${balance.paid.toFixed(2)} | $${balance.owes.toFixed(2)} | ${status} | ${statusEmoji} |\n`;
   });
   
   content += `\n`;
   return content;
}

function generateSettlements(participants, expenses) {
   let content = `### 🔄 Settlements\n`;
   
   // Calculate direct debts: who owes whom for specific expenses
   const directDebts = {}; // { debtor: { creditor: amount } }
   
   // Initialize debt tracking
   participants.forEach(person => {
       directDebts[person] = {};
       participants.forEach(otherPerson => {
           if (person !== otherPerson) {
               directDebts[person][otherPerson] = 0;
           }
       });
   });
   
   // Calculate direct debts from each expense
   expenses.forEach(expense => {
       if (!expense || !expense.payer || !expense.amount || !expense.split_among) {
           return;
       }
       
       let splitAmong = expense.split_among;
       if (!Array.isArray(splitAmong)) {
           return;
       }
       
       const splitAmount = expense.amount / splitAmong.length;
       
       // Each person in split_among owes the payer their share
       splitAmong.forEach(person => {
           if (person !== expense.payer && directDebts[person] && directDebts[person][expense.payer] !== undefined) {
               directDebts[person][expense.payer] += splitAmount;
           }
       });
   });
   
   // Generate settlement instructions
   const settlements = [];
   
   participants.forEach(debtor => {
       participants.forEach(creditor => {
           if (debtor !== creditor) {
               const debtAmount = directDebts[debtor][creditor];
               const creditAmount = directDebts[creditor][debtor];
               
               // Net the debts (if A owes B $100 and B owes A $30, A just owes B $70)
               const netDebt = debtAmount - creditAmount;
               
               if (netDebt > 0.01) { // Only show meaningful amounts (avoid floating point issues)
                   settlements.push({
                       from: debtor,
                       to: creditor,
                       amount: netDebt,
                       originalDebt: debtAmount,
                       originalCredit: creditAmount
                   });
               }
           }
       });
   });
   
   if (settlements.length === 0) {
       content += `*Everyone is settled up! 🎉*\n`;
   } else {
       content += `| Who Pays | Who Receives | Amount | Details |\n`;
       content += `|----------|--------------|--------|----------|\n`;
       settlements.forEach(settlement => {
           const details = settlement.originalCredit > 0 ? 
               `(${settlement.originalDebt.toFixed(2)} - ${settlement.originalCredit.toFixed(2)})` : 
               '';
           content += `| ${settlement.from} | ${settlement.to} | $${settlement.amount.toFixed(2)} | ${details} |\n`;
       });
   }
   
   content += `\n`;
   return content;
}

async function updateExpenseTracker(tp, customHeading = "## 💳 Expense Breakdown") {
   const {file} = await tp.user.getFileByTitle(tp, "Expense Tracker");
   
   if (!file) {
       new Notice("Expense Tracker file not found!");
       return;
   }
   
   const frontmatter = app.metadataCache.getFileCache(file)?.frontmatter;
   const participants = frontmatter?.participants || [];
   let expenses = frontmatter?.expenses || [];
   
   if (participants.length === 0) {
       new Notice("No participants found in frontmatter!");
       return;
   }
   
   if (!Array.isArray(expenses) || expenses.length === 0) {
       let content = `${customHeading}\n`;
       content += `**Last Updated:** ${tp.date.now("YYYY-MM-DD HH:mm")}\n`;
       content += tp.user.createJsFunctionButton("💳 Recalculate Expenses", "updateExpenseTracker");
       content += `\n*No expenses yet. Add some expenses to see the breakdown!*\n`;
       
       const result = await tp.user.updateFileSection(tp, file.path, customHeading, content);
       await tp.user.openFile(file.path);
       return;
   }
   
   const balances = calculateBalances(participants, expenses);
   
   let content = `${customHeading}\n`;
   content += `**Last Updated:** ${tp.date.now("YYYY-MM-DD HH:mm")}\n`;
   content += tp.user.createJsFunctionButton("💳 Recalculate Expenses", "updateExpenseTracker");
   content += `\n`;
   content += generateExpenseTable(expenses);
   content += generatePaymentSummary(balances);
   content += generateSettlements(participants, expenses);
   
   const result = await tp.user.updateFileSection(tp, file.path, customHeading, content);
   
   await tp.user.openFile(file.path);
   if (result.success) {
       new Notice(`Updated expense breakdown`);
   } else {
       new Notice(`Error: ${result.message}`);
   }
}

module.exports = updateExpenseTracker;