import { useEffect } from "react";
import { createPost } from "../services/api";

/**
 * Displays a summary of the completed workout and automatically
 * creates a post to share it on completion.
 *
 * Props:
 *  - session: the workout session object returned by backend (/sessions)
 *  - plan:    the workout plan object used for this session
 *  - onPosted: callback fired when post is successfully created
 */

const WorkoutSummary = ({ session, plan, onPosted }) => {
  useEffect(() => {
    if (!session || !plan) return;

    // Build summary content
    const totalVolume = session.total_volume?.toFixed(1);
    const date = new Date(session.session_date).toLocaleDateString();
    const planName = plan.name || "Workout";
    const exercises = plan.exercises || [];

    const exerciseDetails = exercises
      .map(
        (ex) =>
          `• ${ex.name} — ${ex.sets}×${ex.reps} @ ${ex.exercise_weight} ${ex.type === "weight" ? "lbs" : ""}`
      )
      .join("\n");

    const postTitle = `Completed ${planName} (${date}) 💪`;
    const postContent = `Session Summary:
Total Volume: ${totalVolume} lbs

Exercises:
${exerciseDetails}

Notes:
${session.notes || "No notes today."}`;

    // Auto-create post
    const postData = { title: postTitle, content: postContent };

    createPost(postData)
      .then(() => {
        console.log("Workout summary post created!");
        if (onPosted) onPosted();
      })
      .catch((err) => console.error("Failed to create workout post:", err));
  }, [session, plan, onPosted]);

  if (!session || !plan) return null;

  const totalVolume = session.total_volume?.toFixed(1);
  const date = new Date(session.session_date).toLocaleDateString();

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 max-w-lg w-full border border-gray-100 mx-auto mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Workout Summary</h2>
      <p className="text-sm text-gray-500 mb-4">{date}</p>

      <p className="text-gray-700 mb-2">
        <strong>Total Volume:</strong> {totalVolume} lbs
      </p>

      <div className="mb-3">
        <strong className="text-gray-800">Exercises:</strong>
        <ul className="list-disc ml-5 mt-1 text-gray-700 space-y-1">
          {plan.exercises.map((ex, i) => (
            <li key={i}>
              {ex.name} — {ex.sets}×{ex.reps} @ {ex.exercise_weight}
              {ex.type === "weight" ? " lbs" : ""}
            </li>
          ))}
        </ul>
      </div>

      {session.notes && (
        <p className="text-gray-600 whitespace-pre-wrap">
          <strong>Notes:</strong> {session.notes}
        </p>
      )}
    </div>
  );
};

export default WorkoutSummary;
