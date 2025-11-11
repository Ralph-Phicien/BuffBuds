import axios from "axios";
import { supabase } from "./supabaseClient";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:5000" : "https://buffbuds-production.up.railway.app");

export const API = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

console.log(import.meta.env.VITE_API_BASE);


/* AUTH */
export const login = (data) => API.post("/auth/login", data);
export const signup = (data) => API.post("/auth/signup", data);
export const logout = () => API.post("/auth/logout");
export const checkStatus = () => API.get("/auth/status");
export const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: import.meta.env.VITE_PASSWORD_RESET_REDIRECT || "http://localhost:5173/reset-password",
  });
  return { data, error };
};

/* POSTS */
export const createPost = (data) => API.post("/posts", data);
export const getPosts = () => API.get("/posts");
export const getPost = (id) => API.get(`/posts/${id}`);
export const likePost = (id) => API.post(`/posts/${id}/like`);
export const unlikePost = (id) => API.put(`/posts/${id}/unlike`);
export const commentOnPost = (id, data) => API.post(`/posts/${id}/comment`, data);
export const updatePost = (id, data) => API.put(`/posts/${id}`, data);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const getUserPosts = (username) => API.get(`/posts/user/${username}`);

/* USERS */
export const getUsers = () => API.get("/user/users");
export const getUser = (username) => API.get(`/user/users/${username}`);
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

