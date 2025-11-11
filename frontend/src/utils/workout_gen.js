// ------------------------------
// Automatic Workout Generator (JS version of Python)
// ------------------------------

import exercisesData from "../assets/data/exercises.json";

// Utility: random sample without replacement
function sample(array, n) {
  const arr = [...array];
  const result = [];
  n = Math.min(n, arr.length);
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * arr.length);
    result.push(arr.splice(idx, 1)[0]);
  }
  return result;
}

// Main generator
export function generateWorkout(day) {
  /*
    current workout days: 'push', 'pull', 'legs', or 'push_pull'
    Will select 2 compound, 2 functional, and 3 isolated exercises.
  */

  // --- Push/Pull Split ---
  if (day === "push_pull") {
    const pushCat = exercisesData.exercises.push_pull_split.push_day;
    const pullCat = exercisesData.exercises.push_pull_split.pull_day;

    const pushWorkout = {
      day: "push_day",
      exercises: {
        compound: sample(pushCat.compound, 2),
        functional: sample(pushCat.functional, 2),
        isolated: sample(pushCat.isolated, 3),
      },
    };

    const pullWorkout = {
      day: "pull_day",
      exercises: {
        compound: sample(pullCat.compound, 2),
        functional: sample(pullCat.functional, 2),
        isolated: sample(pullCat.isolated, 3),
      },
    };

    return {
      push_day: pushWorkout,
      pull_day: pullWorkout,
    };
  }

  // --- Regular Push, Pull, or Legs ---
  const category = exercisesData.exercises[day];
  if (!category) throw new Error(`Unknown workout day: ${day}`);

  const workout = {
    day,
    exercises: {
      compound: sample(category.compound, 2),
      functional: sample(category.functional, 2),
      isolated: sample(category.isolated, 3),
    },
  };

  return workout;
}

// Example for testing:
// console.log(generateWorkout("push"));
// console.log(generateWorkout("pull"));
// console.log(generateWorkout("legs"));
// console.log(generateWorkout("push_pull"));
