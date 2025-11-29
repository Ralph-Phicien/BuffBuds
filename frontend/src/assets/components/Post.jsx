import { useState, useEffect } from "react";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import { likePost, unlikePost, commentOnPost, deleteComment } from "../services/api";

const Post = ({ post, currentUserId, currentUsername }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.like_count ?? 0);

  const [comments, setComments] = useState(post.comments ?? []);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (Array.isArray(post.liked_by) && currentUserId) {
      setLiked(post.liked_by.includes(currentUserId));
    }
  }, [post.liked_by, currentUserId]);

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const newComment = {
        username: currentUsername,
        text: commentText.trim()
      };

      setComments(prev => [...prev, newComment]);
      setCommentText("");

      await commentOnPost(post.id, newComment);
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDeleteComment = async (index) => {
    try {
      const comment = comments[index];

      setComments(prev => prev.filter((_, i) => i !== index));

      await deleteComment(post.id, index);
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const handleLike = async () => {
    try {
      if (!liked) {
        setLiked(true);
        setLikeCount((prev) => prev + 1);
        await likePost(post.id);
      } else {
        setLiked(false);
        setLikeCount((prev) => (prev > 0 ? prev - 1 : 0));
        await unlikePost(post.id);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  // Get username from post object - check multiple possible locations
  const postUsername = post.username || post.user_profile?.username || "Unknown";

  // Detect workout summary posts
  const isWorkoutSummary =
    post.title?.toLowerCase().includes("completed") ||
    post.content?.includes("🏋️ Workout Summary");

  // Parse workout summary structure if detected
  let summary = null;
  if (isWorkoutSummary) {
    const lines = post.content.split("\n").map(line => line.trim()).filter(line => line);
    
    // Find key sections
    const volumeLine = lines.find((l) => l.toLowerCase().includes("total volume"));
    const exercisesStartIndex = lines.findIndex((l) => l.toLowerCase().includes("exercises:"));
    const notesIndex = lines.findIndex((l) => l.toLowerCase().includes("notes:"));
    
    const totalVolume = volumeLine?.split(":")[1]?.trim();
    
    // Extract exercises (between "Exercises:" and "Notes:")
    let exercises = [];
    if (exercisesStartIndex !== -1) {
      const exercisesEndIndex = notesIndex !== -1 ? notesIndex : lines.length;
      const exerciseLines = lines.slice(exercisesStartIndex + 1, exercisesEndIndex);
      
      let currentExercise = null;
      
      exerciseLines.forEach((line) => {
        // Check if this is an exercise name (doesn't start with "Set" or "-")
        if (!line.toLowerCase().startsWith('set') && !line.startsWith('-')) {
          // This is a new exercise name
          if (currentExercise) {
            exercises.push(currentExercise);
          }
          currentExercise = {
            name: line,
            sets: []
          };
        } else if (currentExercise && (line.toLowerCase().startsWith('set') || line.startsWith('-'))) {
          // This is a set detail for the current exercise
          const cleanedLine = line.replace(/^[-•\s]+/, '').trim();
          currentExercise.sets.push(cleanedLine);
        }
      });
      
      // Don't forget the last exercise
      if (currentExercise) {
        exercises.push(currentExercise);
      }
    }
    
    // Extract notes
    const notes = notesIndex !== -1 
      ? lines.slice(notesIndex + 1).join("\n").trim() 
      : null;

    summary = { totalVolume, notes, exercises };
  }

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6 transition hover:shadow-md w-full max-w-xl">
      {/* Header */}
      <header className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {post.title || "Untitled Post"}
          </h3>
          <p className="text-sm text-gray-500">@{postUsername}</p>
        </div>
      </header>

      {/* Content */}
      {!isWorkoutSummary ? (
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
          {post.content}
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-green-600">
              🏋️ Workout Summary
            </span>
            {summary?.totalVolume && (
              <span className="text-sm text-gray-600">
                <strong>Total Volume:</strong> {summary.totalVolume}
              </span>
            )}
          </div>

          {summary?.exercises?.length > 0 && (
            <div className="mb-3">
              <p className="font-medium text-gray-800 mb-3">Exercises:</p>
              <div className="space-y-3">
                {summary.exercises.map((exercise, i) => (
                  <div key={i} className="bg-white rounded-lg p-3 border border-gray-200">
                    {/* Exercise name without bullet */}
                    <p className="font-semibold text-gray-900 mb-2">{exercise.name}</p>
                    {/* Sets with bullets */}
                    {exercise.sets.length > 0 && (
                      <div className="space-y-1 ml-3">
                        {exercise.sets.map((set, j) => (
                          <div key={j} className="flex items-start gap-2 text-gray-700 text-sm">
                            <span className="text-gray-400 mt-0.5">•</span>
                            <span className="flex-1">{set}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {summary?.notes && (
            <div className="text-gray-700 text-sm whitespace-pre-wrap bg-white rounded-lg p-3 border border-gray-200">
              <p className="font-medium text-gray-800 mb-1">Notes:</p>
              <p>{summary.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Footer with likes and comments */}
      <footer className="border-t border-gray-100 pt-3">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex gap-4">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 transition active:scale-95"
            >
              <Heart
                className={`w-5 h-5 ${
                  liked ? "text-red-500 fill-red-500" : "text-red-500"
                }`}
              />
              <span>{likeCount}</span>
            </button>

            <button onClick={toggleComments} className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-500" />
              <span>{comments.length}</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-2 border-t border-gray-100 pt-2 space-y-2">
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                className="flex-1 border rounded px-2 py-1 text-sm"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                Post
              </button>
            </form>

            <ul className="space-y-1">
              {comments.map((c, i) => (
                <li key={i} className="flex justify-between items-center">
                  <span>
                    <b>{c.username}:</b> {c.text}
                  </span>
                  {c.username === currentUsername && (
                    <button
                      onClick={() => handleDeleteComment(i)}
                      className="text-red-500 text-xs ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </footer>
    </article>
  );
};

export default Post;