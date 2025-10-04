import React, { useState, useEffect } from "react";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);

    const fetchUserData = () => {
        return Promise.resolve({
            username: "johndoe123",
            name:"John Doe",
            bio: "Lifting is Life",
            age: 27,
            profilePicture: "/defaultpfp.jpeg",

        });
    };
    const fetchUserPosts = () => {
    const posts = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        title: `Placeholder caption/title`,
        image: "/defaultpost.jpeg",
    }));

    return Promise.resolve(posts);
    };


    useEffect(() => {
        const loadData = async () => {
            const userData = await fetchUserData();
            const userPosts = await fetchUserPosts();
            setUser(userData);
            setPosts(userPosts);
        };
        loadData();
    }, []);

    if (!user) return <div>Loading profile...</div>

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <img
          src={user.profilePicture}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <div>
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <p className="text-gray-600">{user.bio}</p>
        </div>
      </div>

      
      {/* Posts */}
      <h2 className="text-xl font-semibold mb-4">Posts</h2>
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

      {/* Footer */}
      <div className="p-4 bg-blue-500 text-white rounded-lg text-center">
        <p>PR / Stats placeholder</p>
      </div>
    </div>
  );
};

export default ProfilePage
