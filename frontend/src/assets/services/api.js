import axios from "axios";

const API_BASE = import.meta.env?.VITE_API_BASE_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

/* AUTH */
export const login = (data) => API.post("/auth/login", data);
export const signup = (data) => API.post("/auth/signup", data);
export const logout = () => API.post("/auth/logout");
export const checkStatus = () => API.get("/auth/status");

/* POSTS */
export const createPost = (data) => API.post("/api/posts", data);
export const getPosts = () => API.get("/api/posts");
export const getPost = (id) => API.get(`/api/posts/${id}`);
export const likePost = (id) => API.post(`/api/posts/${id}/like`);
export const commentOnPost = (id, data) => API.post(`/api/posts/${id}/comment`, data);
export const updatePost = (id, data) => API.put(`/api/posts/${id}`, data);
export const deletePost = (id) => API.delete(`/api/posts/${id}`);

/* USERS */
export const getUsers = () => API.get("/user/users");
export const getUser = (username) => API.get(`/user/users/${username}`);
export const updateUser = (username, data) => API.put(`/user/users/${username}`, data);
export const deleteUser = (username) => API.delete(`/user/users/${username}`);
