import Api from "../config/apiClient";
import { ForgetPasswordData } from "../types/Types";

export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export interface SignInData {
  email: string;
  password: string;
}

export const login = async (data: SignInData) => {
  try {
    const response = await Api.post("/auth/login", data);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to login");
  }
};

// LogOut functionality
export const logout = async () => {
  try {
    await Api.delete("/auth/logout");
  } catch (error: any) {
    throw new Error(error.message || "Failed to log out");
  }
};

export const registerApi = async (data: SignUpData) => {
  try {
    const response = await Api.post("/auth/register", data);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to register");
  }
};

// Forget Password API
export const forgetPassword = async (data: ForgetPasswordData) => {
  try {
    const response = await Api.post("/auth/forgetpassword", data);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to send the Email");
  }
};

export const getUser = async () => {
  try {
    const response = await Api.get("/user");
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch user");
  }
};
// Google OAuth URL
export const getGoogleAuthUrl = () => `${Api.defaults.baseURL}/auth/google`;
console.log("Google Auth URL:", getGoogleAuthUrl());

// Check if the user is authenticated after Google OAuth callback
export const checkGoogleAuthStatus = async () => {
  try {
    const response = await Api.get("/user");
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to verify authentication");
  }
};

// Projects Api
export const createProject = async (data: any) => {
  try {
    const response = await Api.post("/projects", data);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create project");
  }
};

export const getProjects = async () => {
  try {
    const response = await Api.get("/projects");
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch projects");
  }
};

export const getProjectById = async (id: string) => {
  try {
    const response = await Api.get(`/projects/${id}`);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch project details");
  }
};

export const updateProject = async (id: string, newData: any) => {
  try {
    const response = await Api.put(`/projects/${id}`,  newData );
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to update project");
  }
};

export const deleteProject = async (id: string) => {
  try {
    const response = await Api.delete(`/projects/${id}`);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete project");
  }
};

// tasks api

export const createTask = async (data: any) => {
  try {
    const response = await Api.post("/tasks", data);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create task");
  }
};

export const getTask = async (id: string) => {
  try {
    const response = await Api.get(`/tasks/${id}`);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch task");
  }
};

export const updateTask = async (id: string, newData: any) => {
  try {
    const response = await Api.put(`/tasks/${id}`, newData);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to update task");
  }
};

export const deleteTask = async (id: string) => {
  try {
    const response = await Api.delete(`/tasks/${id}`);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete task");
  }
};
