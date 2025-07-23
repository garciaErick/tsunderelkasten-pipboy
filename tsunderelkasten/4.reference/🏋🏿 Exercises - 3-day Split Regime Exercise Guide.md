---
title: 🏋🏿 Exercises - 3-day Split Regime Exercise Guide
created: 2025-04-21
dg-publish: true
dg-show-local-graph: false
description: 
tags: 
aliases: 
isToc: false
isRootNote: false
parent: "[[🏋🏿 Exercises]]"
---
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
  .filter(h => h);

// Build TOC items with indentation
const tocItems = headings.map(h => {
  const indent = "  ".repeat(h.level - 1); // Indent based on header level
  const link = dv.sectionLink(currentFile.path, h.text, false, h.text);
  return `${indent}- ${link}`; // Single bullet with indent
});

// Render TOC in one paragraph
dv.paragraph("## 📑 Table of Contents\n" + tocItems.join("\n"));
```
## Intro
I typically workout 3-4 times a week and go through a cycle of push -> pull -> leg day. I decided to make 3 variations for my standard workouts for ease of use and knowledge sharing.
## Push
### Push Day Variation 1: Chest and Tricep Emphasis
1. Incline Bench Press (Barbell) – 4 sets of 8-12 reps
2. Bench Press (Barbell) – 4 sets of 8-12 reps
3. Shoulder Press (Dumbbell, Seated) – 4 sets of 8-12 reps
4. Tricep Rope Extension (Cable) – 4 sets of 8-12 reps
5. Extra 1: Dumbbell Flyes (Flat Bench) – 4 sets of 8-12 reps
6. Extra 2: Overhead Dumbbell Tricep Extension – 4 sets of 8-12 reps
7. Extra 3: Cable Crossover (High-to-Low) – 4 sets of 8-12 reps (targets lower chest)
### Push Day Variation 2: Shoulder and Upper Chest Focus
1. Incline Bench Press (Dumbbell) – 4 sets of 8-12 reps
2. Bench Press (Barbell) – 4 sets of 8-12 reps
3. Shoulder Press (Barbell, Standing) – 4 sets of 8-12 reps
4. Tricep Rope Extension (Cable) – 4 sets of 8-12 reps
5. Extra 1: Lateral Raises (Dumbbell) – 4 sets of 8-12 reps
6. Extra 2: Incline Cable Flyes – 4 sets of 8-12 reps
7. Extra 3: Close-Grip Push-Ups (Bodyweight or Weighted) – 4 sets of 8-12 reps (targets triceps and chest with minimal overlap)
### Push Day Variation 3: Balanced Push with Power
1. Incline Bench Press (Barbell) – 4 sets of 8-12 reps
2. Bench Press (Dumbbell) – 4 sets of 8-12 reps
3. Shoulder Press (Machine or Barbell) – 4 sets of 8-12 reps
4. Tricep Rope Extension (Cable) – 4 sets of 8-12 reps
5. Extra 1: Weighted Dips (Chest-focused) – 4 sets of 8-12 reps
6. Extra 2: Front Raises (Dumbbell or Plate) – 4 sets of 8-12 reps
7. Extra 3: Skull Crushers (EZ-Bar or Dumbbell) – 4 sets of 8-12 reps
## Pull
* [ ] [[2025-06-19 Thursday Workout]] is a pull variation 1, need to make this its own template ⏳ 2025-06-19 
### Pull Day Variation 1: Lat and Bicep Emphasis
1. Lat Pulldown (Wide Grip) – 4 sets of 8-12 reps
2. Cable Low Row (Neutral Grip) – 4 sets of 8-12 reps
3. Chin-Ups (Underhand Grip, Lat Pulldown Machine) – 4 sets of 8-12 reps
4. Rear Delt Flyes (Dumbbell) – 4 sets of 8-12 reps
5. Extra 1: Bent-Over Row (Barbell) – 4 sets of 8-12 reps (horizontal pull for mid-back and lats)
6. Extra 2: Barbell Bicep Curl – 4 sets of 8-12 reps (direct biceps isolation)
7. Extra 3: Straight-Arm Pulldown (Cable) – 4 sets of 8-12 reps (isolates lats for width)
### Pull Day Variation 2: Mid-Back and Trap Focus
1. Lat Pulldown (Wide Grip) – 4 sets of 8-12 reps
2. Cable Low Row (Neutral Grip) – 4 sets of 8-12 reps
3. Chin-Ups (Underhand Grip, Lat Pulldown Machine) – 4 sets of 8-12 reps
4. Rear Delt Flyes (Dumbbell) – 4 sets of 8-12 reps
5. Extra 1: T-Bar Row – 4 sets of 8-12 reps (heavy horizontal pull for mid-back thickness)
6. Extra 2: Dumbbell Shrugs – 4 sets of 8-12 reps (targets upper traps for size)
7. Extra 3: Face Pulls (Cable) – 4 sets of 8-12 reps (targets rear delts and traps for shoulder health)
### Pull Day Variation 3: Balanced Pull with Bicep Focus
1. Lat Pulldown (Wide Grip) – 4 sets of 8-12 reps
2. Cable Low Row (Neutral Grip) – 4 sets of 8-12 reps
3. Chin-Ups (Underhand Grip, Lat Pulldown Machine) – 4 sets of 8-12 reps
4. Rear Delt Flyes (Dumbbell) – 4 sets of 8-12 reps
5. Extra 1: Pull-Ups (Weighted or Bodyweight, Overhand Grip) – 4 sets of 8-12 reps (vertical pull for lats and upper back)
6. Extra 2: Hammer Curls (Dumbbell) – 4 sets of 8-12 reps (targets biceps and brachialis)
7. Extra 3: Chest-Supported Row (Machine or Dumbbell) – 4 sets of 8-12 reps (horizontal pull, isolates mid-back)
## Leg
### Leg Day Variation 1: Quad and Glute Emphasis
1. Barbell Squat – 4 sets of 8-12 reps
2. Deadlift (Conventional) – 4 sets of 8-12 reps
3. Romanian Deadlift (Barbell) – 4 sets of 8-12 reps
4. Seated Calf Raise (Barbell or Dumbbell) – 4 sets of 8-12 reps
5. Extra 1: Front Squat (Barbell) – 4 sets of 8-12 reps (quad-focused, enhances quad development)
6. Extra 2: Barbell Hip Thrust – 4 sets of 8-12 reps (glute isolation for size and strength)
7. Extra 3: Leg Extension (Machine) – 4 sets of 8-12 reps (isolates quads for hypertrophy)
### Leg Day Variation 2: Hamstring and Calf Focus
1. Barbell Squat – 4 sets of 8-12 reps
2. Deadlift (Conventional) – 4 sets of 8-12 reps
3. Romanian Deadlift (Barbell) – 4 sets of 8-12 reps
4. Seated Calf Raise (Barbell or Dumbbell) – 4 sets of 8-12 reps
5. Extra 1: Bulgarian Split Squat (Dumbbell) – 4 sets of 8-12 reps (unilateral, targets quads and glutes)
6. Extra 2: Lying Leg Curl (Machine) – 4 sets of 8-12 reps (isolates hamstrings)
7. Extra 3: Standing Calf Raise (Dumbbell or Bodyweight) – 4 sets of 8-12 reps (targets gastrocnemius for calf balance)
### Leg Day Variation 3: Balanced Leg Development
1. Barbell Squat – 4 sets of 8-12 reps
2. Deadlift (Conventional) – 4 sets of 8-12 reps
3. Romanian Deadlift (Barbell) – 4 sets of 8-12 reps
4. Seated Calf Raise (Barbell or Dumbbell) – 4 sets of 8-12 reps
5. Extra 1: Leg Press (Machine) – 4 sets of 8-12 reps (compound, targets quads and glutes)
6. Extra 2: Walking Lunges (Dumbbell) – 4 sets of 8-12 reps (unilateral, hits quads, glutes, and hamstrings)
7. Extra 3: Goblet Squat (Dumbbell) – 4 sets of 8-12 reps (quad- and glute-focused, reinforces leg development)