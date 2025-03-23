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
    // The interceptor returns response.data directly, not the whole response object
    return response;
  } catch (error: any) {
    // The error is already transformed by the interceptor
    throw new Error(error.message || "Failed to login");
  }
};

export const registerApi = async (data: SignUpData) =>
  Api.post("/auth/register", data);

// Google OAuth URL
export const getGoogleAuthUrl = () => `${Api.defaults.baseURL}/auth/google`;

// Check if the user is authenticated after Google OAuth callback
export const checkGoogleAuthStatus = async () => {
  try {
    const response = await Api.get("/auth/me"); // Assuming you have an endpoint to check auth status
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to verify authentication");
  }
};
