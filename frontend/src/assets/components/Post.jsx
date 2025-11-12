import { useState, useEffect } from "react";
import { Heart, MessageCircle, Clock } from "lucide-react";
import { likePost, unlikePost, getPost, commentOnPost } from "../services/api";

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

  // Like/unlike
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

  // Fetch latest comments
  const fetchComments = async () => {
    try {
      const res = await getPost(post.id);
      setComments(res.data.comments ?? []);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const toggleComments = async () => {
    setShowComments(!showComments);
    if (!showComments && comments.length === 0) {
      await fetchComments();
    }
  };

  const handleAddComment = async (e) => {
  e.preventDefault();
  if (!commentText.trim()) return;

  const newComment = {
    username: currentUsername,
    text: commentText,
  };

  
  setComments((prev) => [...prev, newComment]);
  setCommentText("");

  try {
    const res = await commentOnPost(post.id, { text: newComment.text });

    // Update with backend data in case something changed
    setComments(res.comments ?? res.data?.comments ?? []);
  } catch (err) {
    console.error("Error adding comment:", err);
    
  }
};


  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6 transition hover:shadow-md w-full max-w-xl">
      {/* Post Header */}
      <header className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {post.title || "Untitled Post"}
          </h3>
          <p className="text-sm text-gray-500">@{post.username}</p>
        </div>
        {post.created_at && (
          <div className="flex items-center text-xs text-gray-400 gap-1">
            <Clock className="w-3 h-3" />
            {new Date(post.created_at).toLocaleDateString()}
          </div>
        )}
      </header>

      {/* Post Content */}
      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
        {post.content}
      </div>

      {/* Post Footer */}
      <footer className="flex flex-col gap-3 text-sm text-gray-600 border-t border-gray-100 pt-3">
        <div className="flex gap-4">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className="flex items-center gap-2 transition active:scale-95"
          >
            <Heart
              className={`w-5 h-5 ${liked ? "text-red-500 fill-red-500" : "text-red-500"}`}
            />
            <span>{likeCount}</span>
          </button>

          {/* Comments Toggle */}
          <button
            onClick={toggleComments}
            className="flex items-center gap-2"
          >
            <MessageCircle className="w-5 h-5 text-blue-500" />
            <span>{comments.length ?? post.comments?.length ?? 0}</span>
          </button>
        </div>

        {/* Comment Section */}
        {showComments && (
          <div className="mt-2 border-t border-gray-100 pt-2 space-y-2">
            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                className="flex-1 border rounded px-2 py-1 text-sm"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
              >
                Post
              </button>
            </form>

            {/* Comment List */}
            <ul className="space-y-1">
              {comments.map((c, i) => (
                <li key={i}>
                  <b>{c.username}:</b> {c.text}
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
