import axios from "axios";

export const API = axios.create({
  baseURL: "https://galihadiprayoga.github.io/kosan-app",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchKosData = async (adminId = null) => {
  try {
    const response = await API.get("/db.json");
    
    if (!response.data || !response.data.kos) {
      throw new Error("Invalid data format received from server");
    }

    // If adminId is provided, filter kos by adminId
    if (adminId) {
      return response.data.kos.filter(kos => String(kos.adminId) === String(adminId));
    }

    return response.data.kos;
  } catch (error) {
    console.error("Raw error:", error);
    throw new Error(`Failed to fetch kos data: ${error.message}`);
  }
};

export const getFeaturedKos = async () => {
  try {
    const kosData = await fetchKosData();
    if (!Array.isArray(kosData) || kosData.length === 0) {
      console.warn("No kos data available");
      return [];
    }
    // Create a new array before sorting to avoid mutating the original
    return [...kosData].sort((a, b) => b.price - a.price).slice(0, 3);
  } catch (error) {
    console.error("Error in getFeaturedKos:", error);
    return [];
  }
};

export const deleteKos = async (id) => {
  try {
    const response = await API.delete(`/kos/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete kos");
  }
};

export const checkAdminAuth = async (userId) => {
  try {
    const response = await API.get("/db.json");
    const user = response.data.users.find(u => u.id === userId);
    return user && user.role === "admin" && user.status === "active";
  } catch (error) {
    console.error("Admin auth check failed:", error);
    return false;
  }
};
