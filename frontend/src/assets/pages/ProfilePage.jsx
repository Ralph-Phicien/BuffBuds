import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Post from "../components/Post";
import { getUser, getUserPosts, getFollowers, getFollowing } from "../services/api";

const ProfilePage = ({ userId, setIsAuthed, setUsername }) => {
  const { username } = useParams();
  const [user, setUser] = useState({
    bio: "Loading bio...",
    profilePicture: "/logo.png",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // New state for followers/following
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showModal, setShowModal] = useState({ type: null, visible: false });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await getUser(username);
        if (res.data.user) {
          setUser({
            bio: res.data.user[0].bio || "No bio yet",
            profilePicture: res.data.user[0].profilePicture || "/logo.png",
          });
        }
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
          username: p.user_profile?.username || username,
        }));
        formatted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setPosts(formatted);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFollowersAndFollowing = async () => {
      try {
        const [fRes, flRes] = await Promise.all([getFollowers(username), getFollowing(username)]);
        setFollowers(fRes.data.followers || []);
        setFollowing(flRes.data.following || []);
      } catch (error) {
        console.error("Error fetching followers/following:", error);
      }
    };

    if (username) {
      fetchUserData();
      fetchUserPosts();
      fetchFollowersAndFollowing();
    }
  }, [username]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <Header username={username} setIsAuthed={setIsAuthed} setUsername={setUsername} />

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

            {/* Followers / Following counts */}
            <div className="flex gap-6 mt-2">
              <div
                className="cursor-pointer text-blue-600 hover:underline"
                onClick={() => setShowModal({ type: "followers", visible: true })}
              >
                <strong>{followers.length}</strong> Followers
              </div>
              <div
                className="cursor-pointer text-blue-600 hover:underline"
                onClick={() => setShowModal({ type: "following", visible: true })}
              >
                <strong>{following.length}</strong> Following
              </div>
            </div>
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
            posts.map((post) => <Post key={post.id} post={post} currentUser={userId} />)
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 bg-blue-500 text-white text-center">
        <p>PR / Stats placeholder</p>
      </footer>

      {/* Followers / Following Modal */}
      {showModal.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-80 max-h-96 overflow-y-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">
                {showModal.type === "followers" ? "Followers" : "Following"}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={() => setShowModal({ type: null, visible: false })}
              >
                ✕
              </button>
            </div>
            <ul className="flex flex-col gap-2">
              {(showModal.type === "followers" ? followers : following).map((user) => (
                <li key={user}>
                  <Link
                    to={`/profile/${user}`}
                    className="text-blue-600 hover:underline"
                    onClick={() => setShowModal({ type: null, visible: false })}
                  >
                    {user}
                  </Link>
                </li>
              ))}
              {(showModal.type === "followers" ? followers : following).length === 0 && (
                <li className="text-gray-500">No users found</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
