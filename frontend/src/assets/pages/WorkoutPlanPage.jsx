import React, { useEffect, useState } from "react";
import { getWorkoutPlans } from "../services/api"; 

const WorkoutPlansPage = () => {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await getWorkoutPlans(); // fetch all plans for logged-in user
        setWorkoutPlans(response.data);
      } catch (err) {
        console.error("Error fetching workout plans:", err);
        setError(err.response?.data?.error || "Failed to fetch plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading workout plans...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
  if (!workoutPlans.length) return <p className="text-center mt-8">No workout plans found.</p>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Workout Plans</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {workoutPlans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => setSelectedPlan(plan)}
            className="border rounded-2xl p-4 shadow hover:shadow-lg cursor-pointer transition"
          >
            <h2 className="text-xl font-semibold">{plan.plan_name}</h2>
            <p>{plan.description}</p>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="mt-6 p-6 border rounded-xl bg-gray-50">
          <h2 className="text-2xl font-bold">{selectedPlan.plan_name}</h2>
          <ul className="list-disc ml-6 mt-2">
            {selectedPlan.exercises.map((ex, index) => (
              <li key={index}>
                {ex.name} — {ex.sets} sets × {ex.reps} reps
              </li>
            ))}
          </ul>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => alert("Starting Workout")}
          >
            Start Workout
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlansPage;
