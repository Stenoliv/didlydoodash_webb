import axios, { AxiosError } from "axios";
import { useAuthStore } from "@/stores/auth/store";
import { toast } from "react-toastify";

export const BASE_URL = "https://didlydoodash.azurewebsites.net"; // "http://localhost:3000"   

export const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ErrorResponse = async (error: AxiosError<any>): Promise<any> => {
  const { tokens, setTokens, setUser } = useAuthStore.getState();
  if (
    tokens?.refresh &&
    error.response?.status === 401 &&
    error.config &&
    !error.config?.headers._retry
  ) {
    // Set _retry property to prevent infinite loop
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error.config.headers as any)._retry = true;
    try {
      const response = await axios.get(`${BASE_URL}/auth/refresh`, {
        headers: { Authorization: `Bearer ${tokens?.refresh}` },
      });
      // Update the stored access token with the new one
      if (response?.data.tokens) {
        setTokens({ ...response.data.tokens });
        // Retry the original request with updated token
        if (error.config) {
          error.config.headers.Authorization = `Bearer ${response.data.tokens.access}`;
          return API.request(error.config);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (refreshError: any) {
      if (refreshError.response?.status === 401) {
        setTokens(null);
        setUser(null);
        toast.error("Unathorized", { position: "top-left" });
      }
      console.log(refreshError);
      return Promise.reject(error);
    }
  }
  return Promise.reject(error);
};

API.interceptors.response.use((response) => {
  return response;
}, ErrorResponse);
API.interceptors.request.use((config) => {
  const { tokens } = useAuthStore.getState();
  config.headers.Authorization = `Bearer ${tokens?.access}`;
  return config;
});
