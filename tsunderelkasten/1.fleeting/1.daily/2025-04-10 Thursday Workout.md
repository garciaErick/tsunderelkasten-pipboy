---
currentExerciseName: Seated Leg Extension
currentExerciseDescription: Sit on the machine and extend your legs to lift the pad—keep your back against the seat, and avoid locking out your knees at the top.
lastLineNumber: "410"
workoutType: leg
exerciseToAdd: "[[tsunderelkasten/4.reference/🏋🏿 Exercises - Seated Leg Extension.md|🏋🏿 Exercises - Seated Leg Extension]]"
createdFrom: "[[Workout tracker]]"
currentMusclesWorked:
  - quads
romanianDeadliftWeight1: 45
romanianDeadliftReps1: 10
romanianDeadliftWeight2: 45
romanianDeadliftReps2: 10
romanianDeadliftWeight3: 45
romanianDeadliftReps3: 9
romanianDeadliftWeight4: 45
romanianDeadliftReps4: 9
deadLiftWeight1: 45
deadLiftReps1: 10
deadLiftWeight2: 45
deadLiftReps2: 10
deadLiftWeight3: 45
deadLiftReps3: 10
deadLiftWeight4: 45
deadLiftReps4: 9
undefinedReps4: 10
calfRaisesWeight1: 70
calfRaisesReps1: 10
calfRaisesWeight2: 70
calfRaisesReps2: 10
calfRaisesWeight3: 70
calfRaisesReps3: 10
gluteDriveWeight1: 90
gluteDriveReps1: 10
gluteDriveWeight2: 90
gluteDriveReps2: 10
gluteDriveWeight3: 90
gluteDriveReps3: 10
gluteDriveWeight4: 90
gluteDriveReps4: 10
hackSquatWeight1: 65
hackSquatReps1: 10
hackSquatWeight2: 80
hackSquatReps2: 10
hackSquatWeight3: 80
hackSquatReps3: 10
hackSquatWeight4: 80
hackSquatReps4: 10
calfRaisesWeight4: 70
calfRaisesReps4: 10
shortName: seatedLegExtension
lyingLegCurlWeight1: 65
lyingLegCurlReps1: 10
seatedLegExtensionWeight1: 90
seatedLegExtensionReps1: 10
lyingLegCurlWeight2: 80
lyingLegCurlReps2: 10
seatedLegExtensionWeight2: 90
seatedLegExtensionReps2: 10
barbell-backSquatWeight1: 90
barbell-backSquatReps1: 10
barbell-backSquatWeight2: 90
barbell-backSquatReps2: 10
barbell-backSquatWeight3: 90
barbell-backSquatReps3: 10
barbell-backSquatWeight4: 90
barbell-backSquatReps4: 10
seatedLegExtensionWeight3: 90
seatedLegExtensionReps3: 10
seatedLegExtensionWeight4: 90
seatedLegExtensionReps4: 10
lyingLegCurlWeight3: 80
lyingLegCurlReps3: 10
lyingLegCurlWeight4: 90
lyingLegCurlReps4: 10
title: 2025-04-10 Thursday Workout
created: 2025-04-10
dg-publish: true
dg-show-local-graph: false
description: 
tags:
  - leg-day
  - workout
aliases: 
---
# 🏋🏾‍♀️ Workout Tracker
```dataviewjs
const currentFile = dv.current().file;
const content = await dv.io.load(currentFile.path);
const lines = content.split("\n");

// Find headers
const headings = lines
  .map((line, index) => {
    const match = line.match(/^(#+)\s*(.+)$/);
    if (match) {
      return {
        level: match[1].length,
        text: match[2].trim(),
        line: index
      };
    }
    return null;
  })
  .filter(h => h && !/set/i.test(h.text));

// Build TOC items with indentation
const tocItems = headings.map(h => {
  const indent = "  ".repeat(h.level - 1); // Indent based on header level
  const link = dv.sectionLink(currentFile.path, h.text, false, h.text);
  return `${indent}- ${link}`; // Single bullet with indent
});

// Render TOC in one paragraph
dv.paragraph("## 📑 Table of Contents\n" + tocItems.join("\n"));
```

## 🔎 Workout Selector
This is a two step form, you first select you initial filter. I usually do a push, pull, leg, 3 day split. This will filter the next list, you can select an exercise to view a brief explanation and add to tracking.
```meta-bind-js-view
{workoutType} as workoutType
{exerciseToAdd} as exerciseToAdd
---
const dv = app.plugins.plugins["dataview"].api;
const workoutTag = context.bound.workoutType || "exercise"; // Fallback if empty
const exerciseOptions = dv.pages('"tsunderelkasten/4.reference"')
    .where(p => p.file.path.includes("🏋🏿 Exercises") && !p.file.path.includes("templates") && p.tags?.includes(workoutTag))
    .map(p => `option(${p.file.link}, ${p.file.name})`)
    .join(", ");
const lines = [];
lines.push("```meta-bind");
lines.push('INPUT[select(title(1. Exercise type), defaultValue(""), option(push, Push Day), option(pull, Pull Day), option(leg, Leg Day), option(exercise, All)):workoutType]');
lines.push("```");
lines.push(`### 2. Exercises to Add: \`INPUT[suggester(${exerciseOptions}):exerciseToAdd]\``);

// Get metadata with corrected link handling
const linkPath = String(context.bound.exerciseToAdd).replace(/\[\[(.*?)(?:\|.*)?\]\]/, "$1");
const exerciseData = dv.page(linkPath);
const { exerciseName = "⚠️ Select an exercise first", description = "", imagePath = "", musclesWorked = []} = exerciseData || {};
lines.push(`#### ${exerciseName}`);
lines.push(`${description}`);
lines.push("");
if(musclesWorked.length){
	lines.push("##### Muscles worked");
	musclesWorked.forEach(muscle => lines.push(`- ${muscle}`));
}
lines.push(`${imagePath ? "!"+ imagePath : ""}`);  

return engine.markdown.create(lines.join("\n"));
```
 ```meta-bind-js-view
{exerciseToAdd} as exerciseToAdd 
{workoutType} as workoutType
save to {lastLineNumber}  
hidden
---
const dv = app.plugins.plugins["dataview"].api;
const currentFile = dv.page(app.workspace.getActiveFile().path); // Use active file path
const content = await app.vault.read(app.workspace.getActiveFile()); // Read file content
const lineCount = content.split('\n').length;
return `${lineCount}`;
```
 ```meta-bind-js-view
{workoutType} as workoutType
{exerciseToAdd} as exerciseToAdd
save to {currentExerciseName}  
hidden
---
const dv = app.plugins.plugins["dataview"].api;
const linkPath = String(context.bound.exerciseToAdd).replace(/\[\[(.*?)(?:\|.*)?\]\]/, "$1");
const exerciseData = dv.page(linkPath) || { exerciseName: "⚠️ Select an exercise first", description: "" };
return exerciseData.exerciseName;
```
 ```meta-bind-js-view
{workoutType} as workoutType
{exerciseToAdd} as exerciseToAdd
save to {currentExerciseDescription}  
hidden
---
const dv = app.plugins.plugins["dataview"].api;
const linkPath = String(context.bound.exerciseToAdd).replace(/\[\[(.*?)(?:\|.*)?\]\]/, "$1");
const exerciseData = dv.page(linkPath) || { exerciseName: "Unknown", description: "No description" };
return exerciseData.description;
```
 ```meta-bind-js-view
{workoutType} as workoutType
{exerciseToAdd} as exerciseToAdd
save to {shortName}  
hidden
---
const dv = app.plugins.plugins["dataview"].api;
const linkPath = String(context.bound.exerciseToAdd).replace(/\[\[(.*?)(?:\|.*)?\]\]/, "$1");
const exerciseData = dv.page(linkPath) || { exerciseName: "Unknown", description: "No description" };
return exerciseData.shortName;
```
```meta-bind-js-view
{workoutType} as workoutType
{exerciseToAdd} as exerciseToAdd
save to {currentMusclesWorked}  
hidden
---
const dv = app.plugins.plugins["dataview"].api;
const linkPath = String(context.bound.exerciseToAdd).replace(/\[\[(.*?)(?:\|.*)?\]\]/, "$1");
const exerciseData = dv.page(linkPath) || { exerciseName: "Unknown", description: "No description" };
return exerciseData.musclesWorked;
```
```meta-bind-js-view
{lastLineNumber} as lastLineNumber 
{exerciseToAdd} as exerciseToAdd
---
const lastLine = context.bound.lastLineNumber;
const lines = [];
lines.push("```meta-bind-button");
lines.push("id: add-selected-exercise-button");
lines.push("style: primary");
lines.push("label: ➕ Exercise");
lines.push("hidden: true");
lines.push("action:");
lines.push("  type: insertIntoNote");
lines.push(`  line: ${lastLine}`);
lines.push("  value: templates/templater/workout-tracker/1. Workout tracker - Add exercise and sets based on selection.md");
lines.push("  templater: true");
lines.push("```");
lines.push("```meta-bind-button");
lines.push("id: add-workout-breakdown-button");
lines.push("style: primary");
lines.push("label: 🏁 Finish");
lines.push("hidden: true");
lines.push("action:");
lines.push("  type: insertIntoNote");
lines.push(`  line: ${lastLine}`);
lines.push("  value: templates/templater/workout-tracker/2. Workout tracker - Exercise breakdown");
lines.push("  templater: true");
lines.push("```");
lines.push("`BUTTON[add-selected-exercise-button, add-workout-breakdown-button]`");

return engine.markdown.create(lines.join("\n"));
```
## 🤸🏾‍♀️ Weight and Reps by Exercise  
### Barbell Back Squat
[[tsunderelkasten/4.reference/🏋🏿 Exercises - Barbell Back Squat.md|🏋🏿 Exercises - Barbell Back Squat]]
**Muscles Worked:** quads,glutes,hamstrings,core
Squat with a barbell on your upper back—keep your chest up, knees tracking over toes, and go as low as your mobility allows while maintaining form.
#### Set 1
* Weight: `INPUT[number(placeholder(Weight in Kilograms)):barbell-backSquatWeight1]`
* Reps: `INPUT[number(placeholder(Number of Reps)):barbell-backSquatReps1]`
#### Set 2
* Weight: `INPUT[number(placeholder(Weight in Kilograms)):barbell-backSquatWeight2]`
* Reps: `INPUT[number(placeholder(Number of Reps)):barbell-backSquatReps2]`
#### Set 3
* Weight: `INPUT[number(placeholder(Weight in Kilograms)):barbell-backSquatWeight3]`
* Reps: `INPUT[number(placeholder(Number of Reps)):barbell-backSquatReps3]`
#### Set 4
* Weight: `INPUT[number(placeholder(Weight in Kilograms)):barbell-backSquatWeight4]`
* Reps: `INPUT[number(placeholder(Number of Reps)):barbell-backSquatReps4]`
### Deadlift
[[tsunderelkasten/4.reference/🏋🏿 Exercises - Deadlift.md|🏋🏿 Exercises - Deadlift]]
**Muscles Worked:** hamstrings,glutes,lower back,core
Lift a barbell from the floor to standing using a full hip and knee drive—keep the bar close to your body, and engage your lats to protect your spine.
#### Set 1
* Weight: `INPUT[number(placeholder(Weight in Kilograms)):deadLiftWeight1]`
* Reps: `INPUT[number(placeholder(Number of Reps)):deadLiftReps1]`
#### Set 2
* Weight: `INPUT[number(placeholder(Weight in Kilograms)):deadLiftWeight2]`
* Reps: `INPUT[number(placeholder(Number of Reps)):deadLiftReps2]`
#### Set 3
* Weight: `INPUT[number(placeholder(Weight in Kilograms)):deadLiftWeight3]`
* Reps: `INPUT[number(placeholder(Number of Reps)):deadLiftReps3]`
#### Set 4
* Weight: `INPUT[number(placeholder(Weight in Kilograms)):deadLiftWeight4]`
* Reps: `INPUT[number(placeholder(Number of Reps)):deadLiftReps4]`
### Romanian Deadlift
[[tsunderelkasten/4.reference/🏋🏿 Exercises - Romanian Deadlift.md|🏋🏿 Exercises - Romanian Deadlift]]
**Muscles Worked:** hamstrings,glutes,lower back
Lower a barbell to mid-shin by hinging at the hips, keeping legs mostly straight—push your hips back and feel the stretch in your hamstrings.
#### Set 1
* Weight: `INPUT[number(placeholder(Weight in Kilograms)):romanianDeadliftWeight1]`
* Reps: `INPUT[number(placeholder(Number of Reps)):romanianDeadliftReps1]`
#### Set 2
* Weight: `INPUT[number(placeholder(Weight in Kilograms)):romanianDeadliftWeight2]`
* Reps: `INPUT[number(placeholder(Number of Reps)):romanianDeadliftReps2]`
#### Set 3
* Weight: `INPUT[number(placeholder(Weight in Kilograms)):romanianDeadliftWeight3]`
* Reps: `INPUT[number(placeholder(Number of Reps)):romanianDeadliftReps3]`
#### Set 4
* Weight: `INPUT[number(placeholder(Weight in Kilograms)):romanianDeadliftWeight4]`
* Reps: `INPUT[number(placeholder(Number of Reps)):romanianDeadliftReps4]`
### Calf Raises
[[tsunderelkasten/4.reference/🏋🏿 Exercises - Calf Raises.md|🏋🏿 Exercises - Calf Raises]]
**Muscles Worked:** calves
Raise your heels to flex your calves, either standing or seated—pause at the top for a full contraction, and lower slowly for max gains.
#### Set 1
* Weight: `INPUT[number(placeholder(Weight in Kilograms)):calfRaisesWeight1]`
* Reps: `INPUT[number(placeholder(Number of Reps)):calfRaisesReps1]`
#### Set 2
* Weight: `INPUT[number(placeholder(Weight in Kilograms)):calfRaisesWeight2]`
* Reps: `INPUT[number(placeholder(Number of Reps)):calfRaisesReps2]`
#### Set 3
* Weight: `INPUT[number(placeholder(Weight in Kilograms)):calfRaisesWeight3]`
* Reps: `INPUT[number(placeholder(Number of Reps)):calfRaisesReps3]`
#### Set 4
* Weight: `INPUT[number(placeholder(Weight in Kilograms)):calfRaisesWeight4]`
* Reps: `INPUT[number(placeholder(Number of Reps)):calfRaisesReps4]`
### Glute Drive
[[tsunderelkasten/4.reference/🏋🏿 Exercises - Glute Drive.md|🏋🏿 Exercises - Glute Drive]]
**Muscles Worked:** glutes
null
#### Set 1
* Weight: `INPUT[number(placeholder(Weight in Kilograms)):gluteDriveWeight1]`
* Reps: `INPUT[number(placeholder(Number of Reps)):gluteDriveReps1]`
#### Set 2
* Weight: `INPUT[number(placeholder(Weight in Kilograms)):gluteDriveWeight2]`
* Reps: `INPUT[number(placeholder(Number of Reps)):gluteDriveReps2]`
#### Set 3
* Weight: `INPUT[number(placeholder(Weight in Kilograms)):gluteDriveWeight3]`
* Reps: `INPUT[number(placeholder(Number of Reps)):gluteDriveReps3]`
#### Set 4
* Weight: `INPUT[number(placeholder(Weight in Kilograms)):gluteDriveWeight4]`
* Reps: `INPUT[number(placeholder(Number of Reps)):gluteDriveReps4]`
### Hack Squat
[[tsunderelkasten/4.reference/🏋🏿 Exercises - Hack Squat.md|🏋🏿 Exercises - Hack Squat]]
**Muscles Worked:** hamstrings
null
#### Set 1
* Weight: `INPUT[number(placeholder(Weight in Kilograms)):hackSquatWeight1]`
* Reps: `INPUT[number(placeholder(Number of Reps)):hackSquatReps1]`
#### Set 2
* Weight: `INPUT[number(placeholder(Weight in Kilograms)):hackSquatWeight2]`
* Reps: `INPUT[number(placeholder(Number of Reps)):hackSquatReps2]`
#### Set 3
* Weight: `INPUT[number(placeholder(Weight in Kilograms)):hackSquatWeight3]`
* Reps: `INPUT[number(placeholder(Number of Reps)):hackSquatReps3]`
#### Set 4
* Weight: `INPUT[number(placeholder(Weight in Kilograms)):hackSquatWeight4]`
* Reps: `INPUT[number(placeholder(Number of Reps)):hackSquatReps4]`
### Lying Leg Curl
[[tsunderelkasten/4.reference/🏋🏿 Exercises - Lying Leg Curl.md|🏋🏿 Exercises - Lying Leg Curl]]
**Muscles Worked:** hamstrings
Lie face down on the machine and curl the pad toward your glutes by bending your knees—keep your hips pressed into the bench and control the lowering phase.
#### Set 1
* Weight: `INPUT[number(placeholder(Weight in Kilograms)):lyingLegCurlWeight1]`
* Reps: `INPUT[number(placeholder(Number of Reps)):lyingLegCurlReps1]`
#### Set 2
* Weight: `INPUT[number(placeholder(Weight in Kilograms)):lyingLegCurlWeight2]`
* Reps: `INPUT[number(placeholder(Number of Reps)):lyingLegCurlReps2]`
#### Set 3
* Weight: `INPUT[number(placeholder(Weight in Kilograms)):lyingLegCurlWeight3]`
* Reps: `INPUT[number(placeholder(Number of Reps)):lyingLegCurlReps3]`
#### Set 4
* Weight: `INPUT[number(placeholder(Weight in Kilograms)):lyingLegCurlWeight4]`
* Reps: `INPUT[number(placeholder(Number of Reps)):lyingLegCurlReps4]`
### Seated Leg Extension
[[tsunderelkasten/4.reference/🏋🏿 Exercises - Seated Leg Extension.md|🏋🏿 Exercises - Seated Leg Extension]]
**Muscles Worked:** quads
Sit on the machine and extend your legs to lift the pad—keep your back against the seat, and avoid locking out your knees at the top.
#### Set 1
* Weight: `INPUT[number(placeholder(Weight in Kilograms)):seatedLegExtensionWeight1]`
* Reps: `INPUT[number(placeholder(Number of Reps)):seatedLegExtensionReps1]`
#### Set 2
* Weight: `INPUT[number(placeholder(Weight in Kilograms)):seatedLegExtensionWeight2]`
* Reps: `INPUT[number(placeholder(Number of Reps)):seatedLegExtensionReps2]`
#### Set 3
* Weight: `INPUT[number(placeholder(Weight in Kilograms)):seatedLegExtensionWeight3]`
* Reps: `INPUT[number(placeholder(Number of Reps)):seatedLegExtensionReps3]`
#### Set 4
* Weight: `INPUT[number(placeholder(Weight in Kilograms)):seatedLegExtensionWeight4]`
* Reps: `INPUT[number(placeholder(Number of Reps)):seatedLegExtensionReps4]`
## 📊 Workout breakdown
```dataviewjs
const currentFile = dv.current();
const weightRegex = /(.+?)Weight(\d+)/;
const prefixes = new Set();

// Step 1: Identify prefixes
const keys = Object.keys(currentFile);
for (const key of keys) {
  const match = key.match(weightRegex);
  if (match) {
    prefixes.add(match[1]); // e.g., "dead", "bench"
  }
}

// Step 2: Collect data for each prefix
const data = {};
prefixes.forEach(prefix => {
  data[prefix] = { weights: {}, reps: {} };
  for (let i = 1; i <= 4; i++) {
    const weightKey = `${prefix}Weight${i}`;
    const repsKey = `${prefix}Reps${i}`;
    data[prefix].weights[i] = currentFile[weightKey] || "-";
    data[prefix].reps[i] = currentFile[repsKey] || "-";
  }
});

// Step 3: Build markdown table
let table = ["| Exercise | Set 1 | Set 2 | Set 3 | Set 4 |", "|----------|-------|-------|-------|-------|"];
prefixes.forEach(prefix => {
  const row = [
    `${prefix.toUpperCase()}`,
    `${data[prefix].weights[1]} lbs x ${data[prefix].reps[1]} reps`,
    `${data[prefix].weights[2]} lbs x ${data[prefix].reps[2]} reps`,
    `${data[prefix].weights[3]} lbs x ${data[prefix].reps[3]} reps`,
    `${data[prefix].weights[4]} lbs x ${data[prefix].reps[4]} reps`
  ];
  table.push(`| ${row.join(" | ")} |`);
});

dv.paragraph(table.join('\n'));
```
