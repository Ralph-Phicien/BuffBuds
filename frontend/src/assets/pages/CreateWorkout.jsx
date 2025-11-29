import { useState, useMemo } from "react";
import Header from "../components/Header.jsx";
import exercisesData from "../../assets/data/exercises.json";
import { generateWorkout } from "../../utils/workout_gen";
import { createWorkoutPlan } from "../services/api";
import { Plus, X, Trash2, Sparkles, Save, Eraser } from "lucide-react";

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

function CreateWorkout({ username, isAdmin, setIsAuthed, setUsername }) {
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
    await new Promise((resolve) => setTimeout(resolve, 0));

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
      await createWorkoutPlan(payload);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header username={username} isAdmin={isAdmin} setIsAuthed={setIsAuthed} setUsername={setUsername} />
      
      <div className="p-4 sm:p-6 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800 text-center">
            Create Workout Plan
          </h1>
          <p className="text-gray-600 text-center mb-8">Build your custom workout routine</p>

          {/* Day Type & Auto Generate */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block mb-2 font-semibold text-gray-700 text-sm">Day Type</label>
              <select
                value={dayType}
                onChange={(e) => setDayType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="">Select Day Type</option>
                {Object.keys(exercisesData.exercises || {}).map((key) => (
                  <option key={key} value={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={autoGenerateWorkout}
                className="w-full bg-gradient-to-r from-[var(--hl)] to-[var(--bg)] hover:opacity-90 text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition shadow-md"
              >
                <Sparkles className="w-5 h-5" />
                Auto Generate
              </button>
            </div>
          </div>

          {/* Workout Name */}
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700 text-sm">Workout Name</label>
            <input
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="e.g., Push Day Alpha"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Exercises Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Exercises</h2>
            <button
              onClick={addExercise}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition shadow-md"
            >
              <Plus className="w-5 h-5" />
              Add Exercise
            </button>
          </div>

          <div className="space-y-4">
            {exercises.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-lg mb-2">No exercises yet</p>
                <p className="text-sm">Click "Add Exercise" or "Auto Generate" to get started</p>
              </div>
            ) : (
              exercises.map((ex, idx) => {
                const options = ex.muscleGroup ? getOptionsForGroup(ex.muscleGroup) : [];
                return (
                  <div
                    key={idx}
                    className="border-2 border-gray-200 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-sm font-bold text-gray-500">Exercise #{idx + 1}</span>
                      <button
                        onClick={() => removeExercise(idx)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {/* Muscle Group */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Muscle Group</label>
                        <select
                          value={ex.muscleGroup}
                          onChange={(e) => updateExercise(idx, "muscleGroup", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select</option>
                          {MUSCLE_GROUPS.map((group) => (
                            <option key={group} value={group}>
                              {group.charAt(0).toUpperCase() + group.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Exercise */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Exercise</label>
                        <select
                          disabled={!ex.muscleGroup}
                          value={ex.exercise}
                          onChange={(e) => updateExercise(idx, "exercise", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        >
                          <option value="">
                            {ex.muscleGroup ? "Select Exercise" : "Pick muscle group first"}
                          </option>
                          {options.map((name) => (
                            <option key={name} value={name}>
                              {name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Sets */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Sets</label>
                        <input
                          type="number"
                          min="1"
                          value={ex.sets}
                          onChange={(e) =>
                            updateExercise(idx, "sets", parseInt(e.target.value) || 1)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Reps */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Reps</label>
                        <input
                          type="number"
                          min="1"
                          value={ex.reps}
                          onChange={(e) =>
                            updateExercise(idx, "reps", parseInt(e.target.value) || 1)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition shadow-lg"
          >
            <Save className="w-5 h-5" />
            Save Workout Plan
          </button>

          <button
            onClick={() => {
              setDayType("");
              setWorkoutName("");
              setExercises([]);
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition shadow-lg"
          >
            <Eraser className="w-5 h-5" />
            Clear Form
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateWorkout;