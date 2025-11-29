import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Post from "../components/Post";
import { 
  getUser, 
  getUserPosts, 
  getUserPRs, 
  updateUser, 
  getWorkoutSessions,
  getFollowers, 
  getFollowing,
  followUser,
  unfollowUser
} from "../services/api";
import { Edit2, Camera, Save, X, TrendingUp, Dumbbell, Award, UserPlus, UserMinus } from "lucide-react";

const ProfilePage = ({ userId, isAdmin, setIsAuthed, setUsername }) => {
  const { username } = useParams();
  const [user, setUser] = useState({
    bio: "Loading bio...",
    profilePicture: "/logo.png",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBio, setEditingBio] = useState(false);
  const [newBio, setNewBio] = useState("");
  const [editingPicture, setEditingPicture] = useState(false);
  const [newPictureUrl, setNewPictureUrl] = useState("");
  
  // Stats
  const [stats, setStats] = useState({
    totalVolume: 0,
    workoutsThisMonth: 0,
    benchPR: 0,
    squatPR: 0,
    deadliftPR: 0
  });

  // Followers/Following
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showModal, setShowModal] = useState({ type: null, visible: false });
  const [isFollowing, setIsFollowing] = useState(false);

  // Check if current user is viewing their own profile
  const storedUser = localStorage.getItem("user");
  const currentUsername = storedUser ? JSON.parse(storedUser).username : null;
  const isOwnProfile = currentUsername === username;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await getUser(username);
        if (res.data.user) {
          const userData = {
            bio: res.data.user.user_bio || "No bio yet",
            profilePicture: res.data.user.profile_picture || "/logo.png",
          };
          setUser(userData);
          setNewBio(userData.bio);
          setNewPictureUrl(userData.profilePicture);
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
        const [fRes, flRes] = await Promise.all([
          getFollowers(username), 
          getFollowing(username)
        ]);
        setFollowers(fRes.data.followers || []);
        setFollowing(flRes.data.following || []);
        
        // Check if current user is following this profile
        if (currentUsername && !isOwnProfile) {
          const currentUserFollowing = await getFollowing(currentUsername);
          setIsFollowing(currentUserFollowing.data.following?.includes(username) || false);
        }
      } catch (error) {
        console.error("Error fetching followers/following:", error);
      }
    };

    const fetchWorkoutStats = async () => {
      try {
        // Fetch PRs (available for all profiles)
        const prsRes = await getUserPRs(username);
        const prs = prsRes.data;
        
        // Only fetch workout sessions if viewing own profile (requires auth)
        if (isOwnProfile) {
          const res = await getWorkoutSessions();
          const sessions = res.data || [];
          
          // Calculate total volume
          const totalVol = sessions.reduce((sum, session) => sum + (session.total_volume || 0), 0);
          
          // Calculate workouts this month
          const now = new Date();
          const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const workoutsThisMonth = sessions.filter(session => {
            const sessionDate = new Date(session.created_at);
            return sessionDate >= firstDayOfMonth;
          }).length;
          
          setStats({
            totalVolume: Math.round(totalVol),
            workoutsThisMonth: workoutsThisMonth,
            benchPR: prs.bench_pr || 0,
            squatPR: prs.squat_pr || 0,
            deadliftPR: prs.deadlift_pr || 0
          });
        } else {
          // For other users, just show PRs
          setStats({
            totalVolume: 0,
            workoutsThisMonth: 0,
            benchPR: prs.bench_pr || 0,
            squatPR: prs.squat_pr || 0,
            deadliftPR: prs.deadlift_pr || 0
          });
        }
      } catch (error) {
        console.error("Error fetching workout stats:", error);
      }
    };

    if (username) {
      fetchUserData();
      fetchUserPosts();
      fetchFollowersAndFollowing();
      fetchWorkoutStats();
    }
  }, [username, isOwnProfile]);

  const handleUpdateBio = async () => {
    try {
      await updateUser(username, { user_bio: newBio });
      setUser({ ...user, bio: newBio });
      setEditingBio(false);
      alert("Bio updated successfully!");
    } catch (error) {
      console.error("Error updating bio:", error);
      alert("Failed to update bio");
    }
  };

  const handleUpdatePicture = async () => {
    try {
      await updateUser(username, { profile_picture: newPictureUrl });
      setUser({ ...user, profilePicture: newPictureUrl });
      setEditingPicture(false);
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error updating profile picture:", error);
      alert("Failed to update profile picture");
    }
  };

  const handleFollow = async () => {
    try {
      await followUser(username);
      setIsFollowing(true);
      setFollowers([...followers, currentUsername]);
    } catch (error) {
      console.error("Error following user:", error);
      alert("Failed to follow user");
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUser(username);
      setIsFollowing(false);
      setFollowers(followers.filter(f => f !== currentUsername));
    } catch (error) {
      console.error("Error unfollowing user:", error);
      alert("Failed to unfollow user");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header
        username={currentUsername}
        isAdmin={isAdmin}
        setIsAuthed={setIsAuthed}
        setUsername={setUsername}
      />

      {/* Profile Section */}
      <section className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-5xl mx-auto p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {/* Profile Picture */}
            <div className="relative group">
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-xl ring-4 ring-blue-100"
              />
              {isOwnProfile && (
                <button
                  onClick={() => setEditingPicture(true)}
                  className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-lg transition opacity-0 group-hover:opacity-100"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">@{username}</h1>
                
                {/* Follow/Unfollow Button - Only show when viewing someone else's profile */}
                {!isOwnProfile && (
                  <button
                    onClick={isFollowing ? handleUnfollow : handleFollow}
                    className={`${
                      isFollowing
                        ? "bg-gray-500 hover:bg-gray-600"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition shadow-md sm:self-start`}
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="w-4 h-4" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Follow
                      </>
                    )}
                  </button>
                )}
              </div>
              
              {/* Bio Section */}
              {editingBio ? (
                <div className="space-y-2">
                  <textarea
                    value={newBio}
                    onChange={(e) => setNewBio(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none text-sm"
                    rows="2"
                    placeholder="Tell us about yourself..."
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateBio}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-semibold flex items-center gap-2 transition text-sm"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingBio(false);
                        setNewBio(user.bio);
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg font-semibold flex items-center gap-2 transition text-sm"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative group/bio">
                  <p className="text-gray-600 mb-2 text-sm">{user.bio}</p>
                  {isOwnProfile && (
                    <button
                      onClick={() => setEditingBio(true)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1 opacity-0 group-hover/bio:opacity-100 transition"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Bio
                    </button>
                  )}
                </div>
              )}

              {/* Stats */}
              <div className="flex gap-4 sm:gap-6 mt-3 justify-center sm:justify-start">
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold text-gray-800">{posts.length}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Posts</p>
                </div>
                <div 
                  className="text-center cursor-pointer hover:opacity-75 transition"
                  onClick={() => setShowModal({ type: "followers", visible: true })}
                >
                  <p className="text-xl sm:text-2xl font-bold text-gray-800">{followers.length}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Followers</p>
                </div>
                <div 
                  className="text-center cursor-pointer hover:opacity-75 transition"
                  onClick={() => setShowModal({ type: "following", visible: true })}
                >
                  <p className="text-xl sm:text-2xl font-bold text-gray-800">{following.length}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Following</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Picture URL Modal */}
      {editingPicture && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Update Profile Picture</h3>
            <input
              type="text"
              value={newPictureUrl}
              onChange={(e) => setNewPictureUrl(e.target.value)}
              placeholder="Enter image URL..."
              className="w-full px-4 py-2 border-2 border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleUpdatePicture}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={() => {
                  setEditingPicture(false);
                  setNewPictureUrl(user.profilePicture);
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Followers/Following Modal */}
      {showModal.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {showModal.type === "followers" ? "Followers" : "Following"}
              </h3>
              <button
                onClick={() => setShowModal({ type: null, visible: false })}
                className="text-gray-500 hover:text-gray-800 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <ul className="space-y-2">
              {(showModal.type === "followers" ? followers : following).map((user) => (
                <li key={user}>
                  <Link
                    to={`/profile/${user}`}
                    className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-blue-600 hover:text-blue-700 transition"
                    onClick={() => setShowModal({ type: null, visible: false })}
                  >
                    @{user}
                  </Link>
                </li>
              ))}
              {(showModal.type === "followers" ? followers : following).length === 0 && (
                <li className="text-center text-gray-500 py-4">
                  No {showModal.type === "followers" ? "followers" : "following"} yet
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Scrollable Posts */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Dumbbell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No posts yet.</p>
            </div>
          ) : (
            posts.map((post) => (
              <Post 
                key={post.id} 
                post={post} 
                currentUserId={userId} 
                currentUsername={currentUsername} 
              />
            ))
          )}
        </div>
      </main>

      {/* Sticky Footer with Stats */}
      <footer className="sticky bottom-0 bg-gradient-to-r from-[var(--bg)] to-gray-700 shadow-2xl">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 py-3">
          <div className={`grid ${isOwnProfile ? 'grid-cols-4' : 'grid-cols-3'} gap-1 sm:gap-3 text-center`}>
            {isOwnProfile && (
              <div className="bg-white bg-opacity-20 rounded-xl p-2 sm:p-3 backdrop-blur-sm">
                <div className="flex items-center justify-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                  <TrendingUp className="w-3 h-3 sm:w-5 sm:h-5 text-blue-400" />
                  <p className="font-bold text-sm sm:text-lg text-gray-900">{stats.totalVolume.toLocaleString()}</p>
                </div>
                <p className="text-[9px] sm:text-xs font-semibold text-gray-800">Total Volume</p>
              </div>
            )}
            <div className="bg-white bg-opacity-20 rounded-xl p-2 sm:p-3 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                <Award className="w-3 h-3 sm:w-5 sm:h-5 text-yellow-400" />
                <p className="font-bold text-sm sm:text-lg text-gray-900">{stats.benchPR}</p>
              </div>
              <p className="text-[9px] sm:text-xs font-semibold text-gray-800">Bench PR</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-2 sm:p-3 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                <Award className="w-3 h-3 sm:w-5 sm:h-5 text-yellow-400" />
                <p className="font-bold text-sm sm:text-lg text-gray-900">{stats.squatPR}</p>
              </div>
              <p className="text-[9px] sm:text-xs font-semibold text-gray-800">Squat PR</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-2 sm:p-3 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                <Award className="w-3 h-3 sm:w-5 sm:h-5 text-yellow-400" />
                <p className="font-bold text-sm sm:text-lg text-gray-900">{stats.deadliftPR}</p>
              </div>
              <p className="text-[9px] sm:text-xs font-semibold text-gray-800">Deadlift PR</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProfilePage;
