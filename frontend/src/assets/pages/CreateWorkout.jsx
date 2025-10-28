import { useState, useMemo } from "react";
import Header from "../components/Header.jsx";
import exercisesData from "../../assets/data/exercises.json";
import { generateWorkout } from "../../utils/workout_gen";
import { createWorkoutPlan } from "../services/api";

function flattenExerciseNames(node) {
  if (!node) return [];
  if (Array.isArray(node)) return node.filter((x) => typeof x === "string");
  if (typeof node === "object") return Object.values(node).flatMap((v) => flattenExerciseNames(v));
  return [];
}

function normalizeGenerated(gen, fallbackType) {
  if (!gen) return [];
  const raw = gen.exercises ?? gen.workout?.exercises ?? gen.plan?.exercises;
  if (Array.isArray(raw)) {
    return raw.map((e) => ({
      muscleGroup: e.type || fallbackType || "",
      exercise: e.name || "",
      sets: e.sets ?? 3,
      reps: e.reps ?? 10,
    }));
  }
  if (raw && typeof raw === "object") {
    const names = flattenExerciseNames(raw);
    return names.map((name) => ({
      muscleGroup: fallbackType || "",
      exercise: name,
      sets: 3,
      reps: 10,
    }));
  }
  return [];
}

function CreateWorkout({ username, setIsAuthed, setUsername }) {
  const [dayType, setDayType] = useState("");
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState([]);

  const MUSCLE_GROUPS = useMemo(() => {
    const keys = Object.keys(exercisesData.exercises || {});
    return keys.filter((k) => k !== "push_pull_split");
  }, []);

  const getOptionsForGroup = (group) => {
    const node = exercisesData.exercises?.[group];
    return flattenExerciseNames(node);
  };

  const addExercise = () => {
    setExercises((prev) => [...prev, { muscleGroup: "", exercise: "", sets: 3, reps: 10 }]);
  };

  const updateExercise = (index, field, value) => {
    setExercises((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      if (field === "muscleGroup") copy[index].exercise = "";
      return copy;
    });
  };

  const removeExercise = (index) => setExercises((prev) => prev.filter((_, i) => i !== index));

  const autoGenerateWorkout = () => {
    if (!dayType) {
      alert("Please select a Day Type before generating a workout.");
      return;
    }
    const generated = generateWorkout(dayType);
    const normalizedRows = normalizeGenerated(generated, dayType);
    setWorkoutName(generated?.name || `${dayType} Workout`);
    setExercises(normalizedRows);
  };

  const handleSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 0)); // ✅ ensures latest state

    if (!workoutName || exercises.length === 0) {
      alert("Please name your workout and add at least one exercise.");
      return;
    }

    const payload = {
      name: workoutName,
      exercises: exercises.map((e) => ({
        name: e.exercise,
        type: e.muscleGroup,
        sets: e.sets,
        reps: e.reps,
      })),
    };

    try {
      await createWorkoutPlan(payload); // ✅ no redirect
      alert("Workout plan saved successfully!");
      setDayType("");
      setWorkoutName("");
      setExercises([]);
    } catch (err) {
      console.error("Workout plan creation failed:", err);
      alert("Failed to save workout plan");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header username={username} setIsAuthed={setIsAuthed} setUsername={setUsername} />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Create Workout</h1>

        {/* Day Type */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
          <div className="flex-1">
            <label className="block mb-2 font-semibold">Day Type</label>
            <select
              value={dayType}
              onChange={(e) => setDayType(e.target.value)}
              className="p-2 border rounded-md w-full bg-white"
            >
              <option value="">Select Day Type</option>
              {Object.keys(exercisesData.exercises || {}).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={autoGenerateWorkout}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md h-[42px]"
          >
            🧠 Auto Generate
          </button>
        </div>

        {/* Workout Name */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Workout Name</label>
          <input
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            placeholder="Workout name"
            className="w-full p-2 border rounded-md bg-white"
          />
        </div>

        {/* Exercises */}
        <div className="space-y-3">
          {exercises.map((ex, idx) => {
            const options = ex.muscleGroup ? getOptionsForGroup(ex.muscleGroup) : [];
            return (
              <div
                key={idx}
                className="border p-3 rounded-md flex flex-wrap gap-2 items-center bg-white shadow-sm"
              >
                {/* Muscle Group */}
                <div className="flex flex-col">
                  <span className="text-xs font-semibold">Muscle Group</span>
                  <select
                    value={ex.muscleGroup}
                    onChange={(e) => updateExercise(idx, "muscleGroup", e.target.value)}
                    className="p-2 border rounded-md"
                  >
                    <option value="">Select Muscle Group</option>
                    {MUSCLE_GROUPS.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Exercise */}
                <div className="flex flex-col">
                  <span className="text-xs font-semibold">Exercise</span>
                  <select
                    disabled={!ex.muscleGroup}
                    value={ex.exercise}
                    onChange={(e) => updateExercise(idx, "exercise", e.target.value)}
                    className="p-2 border rounded-md min-w-52"
                  >
                    <option value="">
                      {ex.muscleGroup ? "Select Exercise" : "Pick a muscle group first"}
                    </option>
                    {options.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sets */}
                <div className="flex flex-col">
                  <span className="text-xs font-semibold">Sets</span>
                  <input
                    type="number"
                    min="1"
                    value={ex.sets}
                    onChange={(e) =>
                      updateExercise(idx, "sets", parseInt(e.target.value) || 1)
                    }
                    className="w-20 p-2 border rounded-md"
                  />
                </div>

                {/* Reps */}
                <div className="flex flex-col">
                  <span className="text-xs font-semibold">Reps</span>
                  <input
                    type="number"
                    min="1"
                    value={ex.reps}
                    onChange={(e) =>
                      updateExercise(idx, "reps", parseInt(e.target.value) || 1)
                    }
                    className="w-20 p-2 border rounded-md"
                  />
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeExercise(idx)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md ml-auto"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 mt-6 justify-center">
          <button
            onClick={addExercise}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
          >
            + Add Exercise
          </button>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            💾 Save Workout
          </button>

          <button
            onClick={() => {
              setDayType("");
              setWorkoutName("");
              setExercises([]);
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            🧹 Clear Form
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateWorkout;
