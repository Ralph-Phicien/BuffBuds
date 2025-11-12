import { useState, useEffect } from "react";
import { Heart, MessageCircle, Trash2 } from "lucide-react"; // only icons we actually use
import { likePost, unlikePost, getPost, commentOnPost, deleteComment } from "../services/api";

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
      await commentOnPost(post.id, { text: newComment.text });
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDeleteComment = async (index) => {
    try {
      await deleteComment(post.id, index); // API call to delete comment
      setComments((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6 transition hover:shadow-md w-full max-w-xl">
      <header className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {post.title || "Untitled Post"}
          </h3>
          <p className="text-sm text-gray-500">@{post.username}</p>
        </div>
      </header>

      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
        {post.content}
      </div>

      <footer className="flex flex-col gap-3 text-sm text-gray-600 border-t border-gray-100 pt-3">
        <div className="flex gap-4">
          <button onClick={handleLike} className="flex items-center gap-2 transition active:scale-95">
            <Heart className={`w-5 h-5 ${liked ? "text-red-500 fill-red-500" : "text-red-500"}`} />
            <span>{likeCount}</span>
          </button>

          <button onClick={toggleComments} className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            <span>{comments.length ?? post.comments?.length ?? 0}</span>
          </button>
        </div>

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
