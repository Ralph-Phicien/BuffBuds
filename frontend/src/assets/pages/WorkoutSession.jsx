import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import { createWorkoutSession, createPost } from "../services/api";
import { CheckCircle, TrendingUp } from "lucide-react";

const WorkoutSession = ({ username, isAdmin, setIsAuthed, setUsername }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.selectedPlan;

  const [formData, setFormData] = useState(() =>
    plan?.exercises.map((ex) => ({
      name: ex.name,
      sets: Array.from({ length: ex.sets }, () => ({ weight: "", reps: "" })),
    })) || []
  );

  const handleChange = (exerciseIndex, setIndex, field, value) => {
    setFormData((prev) => {
      const updated = [...prev];
      updated[exerciseIndex].sets[setIndex][field] = value;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const totalVolume = formData.reduce((acc, ex) => {
        return (
          acc +
          ex.sets.reduce(
            (sum, s) =>
              sum +
              parseFloat(s.weight || 0) * parseInt(s.reps || 0),
            0
          )
        );
      }, 0);

      const payload = {
        notes: `Workout for plan: ${plan.plan_name}`,
        total_volume: totalVolume,
        workoutPlan: {
          name: plan.plan_name,
          description: plan.description || "",
          exercises: formData.map((ex) => ({
            name: ex.name,
            type: "strength",
            sets: ex.sets.map((s) => ({
              weight: parseFloat(s.weight || 0),
              reps: parseInt(s.reps || 0),
            })),
          })),
        },
      };

      await createWorkoutSession(payload);

      const postTitle = `Completed ${plan.plan_name}`;
      const postContent = `
      🏋️ Workout Summary
      Total Volume: ${totalVolume.toFixed(1)} lbs

      Exercises:
      ${formData
        .map((ex) => {
          const setDetails = ex.sets
            .map(
              (s, i) =>
                `  - Set ${i + 1}: ${s.reps || 0} reps @ ${parseFloat(
                  s.weight || 0
                ).toFixed(1)} lbs`
            )
            .join("\n");
          return `${ex.name}\n${setDetails}`;
        })
        .join("\n\n")}

      Notes:
      ${payload.notes || "No notes today."}
      `;

      await createPost({ title: postTitle, content: postContent });

      alert("Workout session logged and post created!");
      navigate("/");
    } catch (err) {
      console.error("handleSubmit failed:", err);
      alert("Failed to log workout session");
    }
  };

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-4">No workout plan selected.</p>
          <button
            onClick={() => navigate('/select-workout')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Select a Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header
        username={username}
        isAdmin={isAdmin}
        setIsAuthed={setIsAuthed}
        setUsername={setUsername}
      />

      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 sm:p-8 mb-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8" />
            <h1 className="text-2xl sm:text-3xl font-bold">{plan.plan_name}</h1>
          </div>
          <p className="text-blue-100">Track your sets and reps for each exercise</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {formData.map((exercise, exIndex) => (
            <div
              key={exIndex}
              className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 transition hover:shadow-xl"
            >
              {/* Exercise Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">{exercise.name}</h2>
                <span className="text-sm text-gray-500 font-medium">
                  {exercise.sets.length} sets
                </span>
              </div>

              {/* Sets Grid */}
              <div className="space-y-3">
                {exercise.sets.map((set, setIndex) => (
                  <div 
                    key={setIndex}
                    className="grid grid-cols-3 gap-3 items-center p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {setIndex + 1}
                      </div>
                      <span className="text-sm font-semibold text-gray-600">Set</span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Weight (lbs)
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={set.weight}
                        onChange={(e) =>
                          handleChange(exIndex, setIndex, "weight", e.target.value)
                        }
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-center font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Reps
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={set.reps}
                        onChange={(e) =>
                          handleChange(exIndex, setIndex, "reps", e.target.value)
                        }
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-center font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Submit Button */}
          <div className="sticky bottom-4 pt-4">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition shadow-lg hover:shadow-xl"
            >
              <CheckCircle className="w-6 h-6" />
              Complete Workout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkoutSession;