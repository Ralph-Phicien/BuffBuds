import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Post from "../components/Post";
import CreatePostModal from "../components/CreatePostModal";
import { getPosts } from "../services/api";
import { PlusCircle } from "lucide-react";

const Feed = ({ userId, username, isAdmin, setIsAuthed, setUsername }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await getPosts();
      // Handle different response structures
      const postsData = Array.isArray(response.data) 
        ? response.data 
        : response.data?.data || [];
      
      // Sort posts by created_at date - most recent first
      const sortedPosts = postsData.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA; // Descending order (newest first)
      });
      
      setPosts(sortedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = () => {
    // Refresh the posts feed
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <Header
        username={username}
        isAdmin={isAdmin}
        setIsAuthed={setIsAuthed}
        setUsername={setUsername}
      />

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Create Post Button */}
        <div className="mb-6 w-full max-w-xl mx-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all touch-manipulation"
          >
            <PlusCircle className="w-6 h-6" />
            Create New Post
          </button>
        </div>

        {/* Posts Feed */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center w-full max-w-xl mx-auto">
            <div className="text-gray-400 mb-4">
              <PlusCircle className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No posts yet
            </h3>
            <p className="text-gray-500 mb-4">
              Be the first to share something!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg transition touch-manipulation"
            >
              Create Your First Post
            </button>
          </div>
        ) : (
          <div className="space-y-4 w-full max-w-xl mx-auto">
            {posts.map((post) => (
              <Post
                key={post.id}
                post={post}
                currentUserId={userId}
                currentUsername={username}
                isAdmin={isAdmin}
                onUpdate={fetchPosts}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
};

export default Feed;