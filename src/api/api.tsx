import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000", // change to server IP in production
  withCredentials: true,
});

// Example functions
export const fetchProfile = () => api.get("/profile");
export const fetchProjects = () => api.get("/projects");
export const fetchSkills = () => api.get("/skills");
