import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { getUser, getUserPosts } from "../services/api";

const ProfilePage = ({ username, setIsAuthed, setUsername }) => {
  const [user, setUser] = useState({
    bio: "Loading bio...",
    profilePicture: "/logo.png",
  });
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await getUser(username);
        setUser({
          bio: res.data.bio || "No bio yet",
          profilePicture:
            res.data.profilePicture || "/logo.png",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const res = await getUserPosts(username);
        setPosts(res.data || []);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };

    if (username) {
      fetchUserData();
      fetchUserPosts();
    }
  }, [username]);

  return (
    <>
      <Header
        username={username}
        setIsAuthed={setIsAuthed}
        setUsername={setUsername}
      />
      <div className="max-w-3xl mx-auto p-6">
        {/* Bio */}
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={user.profilePicture}
            alt="Profile Picture"
            className="w-24 h-24 rounded-2xl object-cover shadow-lg"
          />
          <div>
            <h1 className="text-2xl font-bold">{username}</h1>
            <p className="text-gray-600">{user.bio}</p>
          </div>
        </div>

        {/* Posts */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {posts.map((post) => (
              <div key={post.id} className="rounded-lg overflow-hidden shadow">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-40 object-cover"
                />
                <p className="p-2 text-center text-sm">{post.title}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No posts yet.</p>
        )}

        {/* Footer */}
        <div className="p-4 bg-blue-500 text-white rounded-lg text-center">
          <p>PR / Stats placeholder</p>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
