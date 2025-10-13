import { useEffect, useState } from "react";
import Header from "../components/Header";
import Post from "../components/Post";
import { getPosts } from "../services/api";

const Feed = ({ username, setIsAuthed, setUsername }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getPosts();
        // Flatten nested Supabase join (user_profile.username, etc.)
        console.log("getPosts response:", res.data);

        const formatted = (res.data || []).map((p) => ({
          ...p,
          username: p.user_profile?.username || "Unknown",
          bio: p.user_profile?.user_bio || "",
        }));

        // Sort by newest first
        formatted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setPosts(formatted);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        username={username}
        setIsAuthed={setIsAuthed}
        setUsername={setUsername}
      />

      {/* Feed content */}
      <main className="flex-1 flex flex-col items-center p-6">

        {loading ? (
          <p className="text-gray-500">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-500">No posts yet. Be the first to post!</p>
        ) : (
          posts.map((post) => <Post key={post.id} post={post} />)
        )}
      </main>
    </div>
  );
};

export default Feed;