import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:5000" : "https://buffbuds-production.up.railway.app");

export const API = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

/* AUTH */
export const login = (data) => API.post("/auth/login", data);
export const signup = (data) => API.post("/auth/signup", data);
export const logout = () => API.post("/auth/logout");
export const checkStatus = () => API.get("/auth/status");
export const resetPassword = (email) => API.post("/auth/reset-password-request", { email });

/* POSTS */
export const createPost = (data) => API.post("/posts", data);
export const getPosts = () => API.get("/posts");
export const getPost = (id) => API.get(`/posts/${id}`);
export const likePost = (id) => API.post(`/posts/${id}/like`);
export const unlikePost = (id) => API.put(`/posts/${id}/unlike`);
export const commentOnPost = (id, data) => API.post(`/posts/${id}/comment`, data, {headers: {"Content-Type": "application/json"}});
export const deleteComment = (postId, commentIndex) => API.delete(`/posts/${postId}/comment/${commentIndex}`);
export const updatePost = (id, data) => API.put(`/posts/${id}`, data);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const getUserPosts = (username) => API.get(`/posts/user/${username}`);

/* USERS */
export const getUsers = () => API.get("/user/users");
export const getUser = (username) => API.get(`/user/users/${username}`);
export const getUserPRs = (username) => API.get(`/user/users/${username}/prs`);
export const updateUser = (username, data) => API.put(`/user/users/${username}`, data);
export const deleteUser = (username) => API.delete(`/user/users/${username}`);

/* WORKOUTS */
export const createWorkoutPlan = (payload) => API.post("/plans", payload);
export const getWorkoutPlans = () => API.get("/plans");
export const getWorkoutPlan = (id) => API.get(`/plans/${id}`);
export const updateWorkoutPlan = (id, data) => API.put(`/plans/${id}`, data);
export const deleteWorkoutPlan = (id) => API.delete(`/plans/${id}`);

/* WORKOUT SESSIONS */
export const createWorkoutSession = (data) => API.post("/sessions", data);
export const getWorkoutSessions = () => API.get("/sessions");
export const updateWorkoutSession = (id, data) => API.put(`/sessions/${id}`, data);

/* ANALYTICS */
export const getVolumeHistory = () => API.get("/user/volume-history");

/* FOLLOW SYSTEM */
export const followUser = (username) => API.post(`/user/follow/${username}`);
export const unfollowUser = (username) => API.post(`/user/unfollow/${username}`);
export const getFollowers = (username) => API.get(`/user/${username}/followers`);
export const getFollowing = (username) => API.get(`/user/${username}/following`);
/* ADMIN */
export const adminGetAllUsers = () => API.get("/admin/users");
export const adminDeleteUser = (userId) => API.delete(`/admin/users/${userId}`);
export const adminGetAllPosts = () => API.get("/admin/posts");
export const adminDeletePost = (postId) => API.delete(`/admin/posts/${postId}`);
export const adminGetAllWorkoutPlans = () => API.get("/admin/workout-plans");
export const adminDeleteWorkoutPlan = (planId) => API.delete(`/admin/workout-plans/${planId}`);
