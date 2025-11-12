import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import { createWorkoutSession, createPost } from "../services/api";

const WorkoutSession = ({ username, setIsAuthed, setUsername }) => {
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
      console.log("🧩 handleSubmit called");
      console.log("Form data:", formData);
      console.log("Plan:", plan);

      // ✅ Compute total volume
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

      console.log("✅ totalVolume:", totalVolume);

      // ✅ Build payload using correct schema
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

      console.log("Submitting payload:", payload);

      // ✅ Create workout session
      await createWorkoutSession(payload);

      // ✅ Build post content
      const exercises = formData
        .map((ex) => {
          const setDetails = ex.sets
            .map(
              (s, i) =>
                `- Set ${i + 1}: ${s.reps || 0} reps @ ${parseFloat(
                  s.weight || 0
                ).toFixed(1)} lbs`
            )
            .join("\n");
          return `${ex.name}\n${setDetails}`;
        })
        .join("\n\n");

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


      // ✅ Create the post
      await createPost({ title: postTitle, content: postContent });

      alert("Workout session logged and post created!");
      navigate("/"); // redirect to feed root
    } catch (err) {
      console.error("🔥 handleSubmit failed:", err);
      alert("Failed to log workout session");
    }
  };

  if (!plan)
    return (
      <p className="text-center mt-8 text-red-500">
        No workout plan selected.
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        username={username}
        setIsAuthed={setIsAuthed}
        setUsername={setUsername}
      />

      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {plan.plan_name}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {formData.map((exercise, exIndex) => (
            <div
              key={exIndex}
              className="border rounded-xl p-4 bg-white shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{exercise.name}</h2>
              {exercise.sets.map((set, setIndex) => (
                <div key={setIndex} className="flex gap-3 mb-2">
                  <span className="w-12 font-medium">
                    Set {setIndex + 1}
                  </span>
                  <input
                    type="number"
                    placeholder="Weight"
                    value={set.weight}
                    onChange={(e) =>
                      handleChange(exIndex, setIndex, "weight", e.target.value)
                    }
                    className="border p-2 rounded w-24"
                  />
                  <input
                    type="number"
                    placeholder="Reps"
                    value={set.reps}
                    onChange={(e) =>
                      handleChange(exIndex, setIndex, "reps", e.target.value)
                    }
                    className="border p-2 rounded w-24"
                  />
                </div>
              ))}
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Complete Workout
          </button>
        </form>
      </div>
    </div>
  );
};

export default WorkoutSession;
