import Api from "../config/apiClient";

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
// export const logout = async() => {
//   try {
//     await Api.post("/auth/logout");
//   } catch (error: any) {
//     throw new Error(error.message || "Failed to fetch projects");
//    } 
// };

export const registerApi = async (data: SignUpData) => {
  try {
    const response = await Api.post("/auth/register", data);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to register");
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

// Check if the user is authenticated after Google OAuth callback
export const checkGoogleAuthStatus = async () => {
  try {
    const response = await Api.get("/auth/me");
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
    const response = await Api.put(`/projects/${id}`, { newData });
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
