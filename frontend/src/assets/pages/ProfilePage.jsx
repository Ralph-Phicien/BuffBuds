import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Post from "../components/Post";
import { getUser, getUserPosts } from "../services/api";

const ProfilePage = ({ userId, setIsAuthed, setUsername }) => {
  const { username } = useParams();
  const [user, setUser] = useState({
    bio: "Loading bio...",
    profilePicture: "/logo.png",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await getUser(username);
        setUser({
          bio: res.data.bio || "No bio yet",
          profilePicture: res.data.profilePicture || "/logo.png",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const res = await getUserPosts(username);
        const raw = Array.isArray(res.data) ? res.data : [];
        const formatted = raw.map((p) => ({
          ...p,
          username: p.user_profile?.username || username, // ✅ flatten the join
        }));
        formatted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setPosts(formatted);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUserData();
      fetchUserPosts();
    }
  }, [username]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        username={username}
        setIsAuthed={setIsAuthed}
        setUsername={setUsername}
      />

      {/* Profile Section */}
      <section className="max-w-3xl mx-auto p-6">
        <div className="flex justify-evenly items-center gap-18">
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-2xl object-cover shadow-lg"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">@{username}</h1>
            <p className="text-gray-600">{user.bio}</p>
          </div>
        </div>
      </section>

      {/* Scrollable Posts */}
      <main className="flex-1 overflow-y-auto px-6 pb-6 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          {loading ? (
            <p className="text-gray-500 text-center">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-500 text-center">No posts yet.</p>
          ) : (
            posts.map((post) => <Post key={post.id} post={post} currentUser={userId}/>)
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 bg-blue-500 text-white text-center">
        <p>PR / Stats placeholder</p>
      </footer>
    </div>
  );
};

export default ProfilePage;
