import { Heart, MessageCircle, Clock } from "lucide-react";

const Post = ({ post }) => {
  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6 transition hover:shadow-md w-full max-w-xl">
      {/* Header */}
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

      {/* Body */}
      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
        {typeof post.content === "string" ? (
          post.content
        ) : (
          <pre className="text-sm bg-gray-50 p-3 rounded-md overflow-x-auto">
            {JSON.stringify(post.content, null, 2)}
          </pre>
          
        )}
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between text-sm text-gray-600 border-t border-gray-100 pt-3">
        <div>
            <button className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span>{post.like_count ?? 0}</span>
            </button>
            <button className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-blue-500" />
                <span>{post.comments?.length ?? 0}</span>
            </button>
        </div>
      </footer>
    </article>
  );
};

export default Post;
