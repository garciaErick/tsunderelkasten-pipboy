---
title: 🔒 Personal - Family chore schedule
created: 2025-04-21
dg-publish: true 
dg-show-local-graph: false
dg-path: family-chores
description:
tags:
aliases:
dg-hide: true
dg-hide-in-graph: true
---
### Upcoming chores 
* [ ] 🐕 Limpiar patio 🔁 every month on the 1st Saturday ➕ 2025-05-05 📅 2025-06-07
* [ ] 🚘 Limpiar cochera 🔁 every 2 months on the 3rd Saturday 📅 2025-05-17
```dataviewjs
// Query incomplete Trapear tasks from the current file
const tasks = dv.current().file.tasks
    .filter(t => !t.completed)
    .sort(t => t.due); // Sort by due date

// Debug: Log tasks to confirm what's being queried
console.log("Queried incomplete tasks:", tasks.map(t => ({
    text: t.text,
    due: t.due ? t.due.toString() : "No due date"
})));

// Function to format date as yyyy-MM-dd
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
// Generate static schedule for May to December, avoiding duplicates
const queriedDates = tasks.map(t => t.due ? formatDate(new Date(t.due)) : null);
const staticSchedule = [];

// Combine queried tasks and static schedule
const tableData = [
    // Queried tasks
    ...tasks.map((task, index) => ({
        task: task.text.split(' 🔁')[0], // Remove metadata
        date: task.due ? formatDate(new Date(task.due)) : "No Date",
    })),
    // Static schedule
    ...staticSchedule
];

// Sort by date
tableData.sort((a, b) => new Date(a.date) - new Date(b.date));

// Render table
dv.table(
    ["Task", "Date"],
    tableData.map(s => [s.task, s.date])
);
```

### Chores with an assignee
Estos que haceres si tienen alguien asignado como lider de ese dia, asi que la idea es de compartir esta pagina para que cada quien lo pueda checar y ver de que esta asignado.
#### Trapear
* [ ] 🧹 Trapear 🔁 every month on the 2nd Saturday and last Saturday ➕ 2025-05-07 📅 2025-05-10
```dataviewjs
// Query incomplete Trapear tasks from the current file
const tasks = dv.current().file.tasks
    .filter(t => !t.completed && t.text.match(/Trapear\b/))
    .sort(t => t.due); // Sort by due date

// Query completed Trapear tasks to track past assignees
const completedTasks = dv.current().file.tasks
    .filter(t => t.completed && t.text.match(/Trapear\b/))
    .sort(t => t.due);

// Debug: Log tasks to confirm what's being queried
console.log("Queried incomplete tasks:", tasks.map(t => ({
    text: t.text,
    due: t.due ? t.due.toString() : "No due date"
})));
console.log("Queried completed tasks:", completedTasks.map(t => ({
    text: t.text,
    due: t.due ? t.due.toString() : "No due date"
})));

// Assignees cycle
const assignees = ["🧉 Erick", "🤖 Eduardo", "🐸 Pepo"];
const startAssignee = "🧉 Erick"; // Start with Erick for the first incomplete task
const startIndex = assignees.indexOf(startAssignee);

// Function to format date as yyyy-MM-dd
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Function to get 2nd Saturday of a month
function getSecondSaturday(year, month) {
    const firstDay = new Date(year, month - 1, 1);
    const firstSaturday = new Date(firstDay);
    firstSaturday.setDate(firstDay.getDate() + (6 - firstDay.getDay() + 7) % 7);
    const secondSaturday = new Date(firstSaturday);
    secondSaturday.setDate(firstSaturday.getDate() + 7);
    return formatDate(secondSaturday);
}

// Function to get last Saturday of a month
function getLastSaturday(year, month) {
    const lastDay = new Date(year, month, 0); // Last day of the month
    const lastSaturday = new Date(lastDay);
    lastSaturday.setDate(lastDay.getDate() - (lastDay.getDay() + 1) % 7);
    return formatDate(lastSaturday);
}

// Generate months dynamically from current date (April 2025) to December 2025
const today = new Date(2025, 3, 21); // April 21, 2025 (month is 0-based)
const endDate = new Date(2025, 11, 31); // End at December 31, 2025
const months = [];
let currentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1); // Start from May 2025

while (currentMonth <= endDate) {
    months.push({
        year: currentMonth.getFullYear(),
        month: currentMonth.getMonth() + 1
    });
    currentMonth.setMonth(currentMonth.getMonth() + 1);
}

// Determine the starting assignee index, accounting for completed tasks
let assigneeIndex = startIndex;
// If there are completed tasks, ensure the next task starts with Erick
if (completedTasks.length > 0) {
    const lastCompletedAssignee = completedTasks[completedTasks.length - 1].text.match(/@(\w+)/)?.[1];
    if (lastCompletedAssignee === "eduardo") {
        assigneeIndex = startIndex; // Start with Erick for the next task
    }
}

// Combine queried tasks and static schedule
const queriedDates = tasks.map(t => t.due ? formatDate(new Date(t.due)) : null);
const tableData = [];

// Add queried tasks, starting with Erick
tasks.forEach((task, index) => {
    tableData.push({
        task: task.text.split(' 🔁')[0], // Remove metadata
        date: task.due ? formatDate(new Date(task.due)) : "No Date",
        assignee: assignees[(startIndex + index) % assignees.length] // Use startIndex for rotation
    });
});

// Set assigneeIndex to continue after queried tasks
assigneeIndex = startIndex + tasks.length;

// Generate static schedule for future months, avoiding duplicates
for (const { year, month } of months) {
    const secondSat = getSecondSaturday(year, month);
    if (!queriedDates.includes(secondSat)) {
        tableData.push({
            task: "🧹 Trapear",
            date: secondSat,
            assignee: assignees[assigneeIndex++ % assignees.length]
        });
    }

    const lastSat = getLastSaturday(year, month);
    if (!queriedDates.includes(lastSat)) {
        tableData.push({
            task: "🧹 Trapear",
            date: lastSat,
            assignee: assignees[assigneeIndex++ % assignees.length]
        });
    }
}

// Sort by date
tableData.sort((a, b) => new Date(a.date) - new Date(b.date));

// Render table
dv.table(
    ["Task", "Date", "Assignee"],
    tableData.map(s => [s.task, s.date, s.assignee])
);
```

#### Lavar Trastes
La idea es que todos los dias haya una hora limite. Es decir si la hora limite es a las 9, la persona asignada debera lavar todos los platos a esa hora. Despues de esa hora, cualquier plato que se usa se lava individualmente. Asi no habra una larga pila de platos despues de las 9pm y si se ensucian mas platos individuales, seran muy faciles de lavar. Todo con el fin de **despertar con una cocina libre de platos sucios**
```dataviewjs
// Assignees cycle
const assignees = ["🧉 Erick", "🤖 Eduardo", "🐸 Pepo"];
const startAssignee = "🧉 Erick"; // Start with Erick
const startIndex = assignees.indexOf(startAssignee);

// Function to format date as yyyy-MM-dd
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Generate daily schedule for April 2025
const tableData = [];
const startDate = new Date(2025, 3, 1); // April 1, 2025 (month is 0-based)
const endDate = new Date(2025, 3, 30); // April 30, 2025
let assigneeIndex = startIndex;

// Loop through each day in April 2025
for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    tableData.push({
        task: "🍽️ Lavar trastes",
        date: formatDate(date),
        assignee: assignees[assigneeIndex++ % assignees.length]
    });
}

// Sort by date (not strictly necessary since dates are added in order)
tableData.sort((a, b) => new Date(a.date) - new Date(b.date));

// Render table
dv.table(
    ["Task", "Date", "Assignee"],
    tableData.map(s => [s.task, s.date, s.assignee])
);
```
