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

export const registerApi = async (data: SignUpData) => {
  try {
    const response = await Api.post("/auth/register", data);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to register");
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

// Check if user is logged in based on token presence
export const isAuthenticated = () => {
  return !!localStorage.getItem("authToken");
};

// Logout function
export const logout = () => {
  localStorage.removeItem("authToken");
};

// Get current user profile
export const getUserProfile = async () => {
  try {
    const response = await Api.get("/users/profile");
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch user profile");
  }
};
