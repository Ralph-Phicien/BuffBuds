import { useState, useEffect } from "react";
import Header from "../components/Header";
import {
  adminGetAllUsers,
  adminDeleteUser,
  adminGetAllPosts,
  adminDeletePost,
  adminGetAllWorkoutPlans,
  adminDeleteWorkoutPlan,
} from "../services/api";
import { Trash2 } from "lucide-react";

const AdminPanel = ({ username, isAdmin, setIsAuthed, setUsername }) => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("AdminPanel mounted, isAdmin:", isAdmin);
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching data for tab:", activeTab);
      
      if (activeTab === "users") {
        const res = await adminGetAllUsers();
        console.log("Users response:", res.data);
        setUsers(res.data || []);
      } else if (activeTab === "posts") {
        const res = await adminGetAllPosts();
        console.log("Posts response:", res.data);
        setPosts(res.data || []);
      } else if (activeTab === "plans") {
        const res = await adminGetAllWorkoutPlans();
        console.log("Workout plans response:", res.data);
        setWorkoutPlans(res.data || []);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      console.error("Error details:", err.response?.data);
      setError(err.response?.data?.error || "Failed to fetch data. You may not have admin permissions.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    try {
      await adminDeleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      alert("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    try {
      await adminDeletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      alert("Post deleted successfully");
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post");
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!confirm("Are you sure you want to delete this workout plan?")) return;
    
    try {
      await adminDeleteWorkoutPlan(planId);
      setWorkoutPlans((prev) => prev.filter((p) => p.id !== planId));
      alert("Workout plan deleted successfully");
    } catch (err) {
      console.error("Error deleting workout plan:", err);
      alert("Failed to delete workout plan");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        username={username}
        isAdmin={isAdmin}
        setIsAuthed={setIsAuthed}
        setUsername={setUsername}
      />

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Debug Info */}
        <div className="bg-blue-100 border border-blue-400 px-4 py-3 rounded mb-4">
          <p><strong>Admin Status:</strong> {String(isAdmin)}</p>
          <p><strong>Active Tab:</strong> {activeTab}</p>
          <p><strong>Loading:</strong> {String(loading)}</p>
          <p><strong>Users Count:</strong> {users.length}</p>
          <p><strong>Posts Count:</strong> {posts.length}</p>
          <p><strong>Plans Count:</strong> {workoutPlans.length}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === "users"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === "posts"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab("plans")}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === "plans"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Workout Plans
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <>
            {/* Users Table */}
            {activeTab === "users" && (
              <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Username</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">User ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Created</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Updated</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Admin</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">@{user.username}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 font-mono text-xs">{user.id.substring(0, 8)}...</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded ${user.admin ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>
                            {user.admin ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-500 hover:text-red-700 transition"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <p className="text-center py-8 text-gray-500">No users found</p>
                )}
              </div>
            )}

            {/* Posts Table */}
            {activeTab === "posts" && (
              <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Title</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Content Preview</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Author</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Likes</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Created</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr key={post.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 max-w-xs truncate">{post.title || "Untitled"}</td>
                        <td className="px-4 py-3 max-w-md">
                          <div className="text-sm text-gray-600 truncate">
                            {post.content ? (post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content) : 'No content'}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          @{post.user_profile?.username || "Unknown"}
                        </td>
                        <td className="px-4 py-3 text-sm">{post.like_count || 0}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(post.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="text-red-500 hover:text-red-700 transition"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {posts.length === 0 && (
                  <p className="text-center py-8 text-gray-500">No posts found</p>
                )}
              </div>
            )}

            {/* Workout Plans Table */}
            {activeTab === "plans" && (
              <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Plan Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Owner</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Exercises</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Created</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workoutPlans.map((plan) => (
                      <tr key={plan.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{plan.plan_name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          @{plan.user_profile?.username || "Unknown"}
                        </td>
                        <td className="px-4 py-3 text-sm">{plan.exercises?.length || 0}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(plan.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleDeletePlan(plan.id)}
                            className="text-red-500 hover:text-red-700 transition"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {workoutPlans.length === 0 && (
                  <p className="text-center py-8 text-gray-500">No workout plans found</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;