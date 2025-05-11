import axios from "axios";

// Create axios instance with base config
export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Add request interceptor to inject auth token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle auth errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }

    // Handle registration specific errors
    if (error.response?.status === 422) {
      const message = error.response.data?.message || "Validation error";
      error.message = message;
    }

    return Promise.reject(error);
  }
);

// Fetch kos data with proper error handling
export const fetchKosData = async (adminId = null) => {
  try {
    const response = await API.get("/kosans");

    if (!response.data?.data) {
      throw new Error("Invalid response format");
    }

    const kosData = response.data.data;

    if (adminId) {
      return kosData.filter((kos) => String(kos.admin_id) === String(adminId));
    }

    return kosData;
  } catch (error) {
    console.error("Failed to fetch kos data:", error);
    throw error;
  }
};

export const getFeaturedKos = async () => {
  try {
    const kosData = await fetchKosData();
    if (!Array.isArray(kosData) || kosData.length === 0) {
      console.warn("No kos data available");
      return [];
    }

    // Urutkan berdasarkan harga tertinggi
    return [...kosData].sort((a, b) => b.price - a.price).slice(0, 3);
  } catch (error) {
    console.error("Error in getFeaturedKos:", error);
    return [];
  }
};

export const deleteKos = async (id) => {
  try {
    const response = await API.delete(`/kosans/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete kos:", error);
    throw new Error("Failed to delete kos");
  }
};

export const checkAdminAuth = async () => {
  try {
    const response = await API.get("/auth/check-admin");
    return response.data?.is_admin === true;
  } catch (error) {
    console.error("Admin auth check failed:", error);
    return false;
  }
};
