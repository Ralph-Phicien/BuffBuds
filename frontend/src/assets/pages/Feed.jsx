import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Post from "../components/Post";
import CreatePostModal from "../components/CreatePostModal";
import { getPosts } from "../services/api";
import { PlusCircle } from "lucide-react";

const Feed = ({ userId, username, isAdmin, setIsAuthed, setUsername }) => {
  console.log("Feed component rendered with props:", { userId, username, isAdmin });
  
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    console.log("Feed useEffect running - fetching posts");
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await getPosts();
      console.log("Posts fetched:", response.data);
      // Handle different response structures
      const postsData = Array.isArray(response.data) 
        ? response.data 
        : response.data?.data || [];
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = () => {
    console.log("Post created - refreshing feed");
    // Refresh the posts feed
    fetchPosts();
  };

  console.log("Rendering Feed - isModalOpen:", isModalOpen, "posts count:", posts.length);

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
        <div className="mb-6">
          <button
            onClick={() => {
              console.log("Create Post button clicked!");
              setIsModalOpen(true);
            }}
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
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
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
              onClick={() => {
                console.log("Empty state button clicked!");
                setIsModalOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg transition touch-manipulation"
            >
              Create Your First Post
            </button>
          </div>
        ) : (
          <div className="space-y-4">
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
        onClose={() => {
          console.log("Modal closing");
          setIsModalOpen(false);
        }}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
};

export default Feed;