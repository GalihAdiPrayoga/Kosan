import axios from "axios";

// Create axios instance with base config
export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor to inject auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Modified fetchKosData function
export const fetchKosData = async () => {
  try {
    const response = await API.get("/kosans");
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch kos data:", error);
    throw error;
  }
};

// Modified getFeaturedKos function
export const getFeaturedKos = async () => {
  try {
    const response = await API.get("/kosans");
    const kosData = response.data.data;

    if (!Array.isArray(kosData)) {
      console.warn("Invalid kos data format");
      return [];
    }

    const processedKosData = kosData.map((kos) => ({
      id: kos.id,
      name: kos.nama_kosan,
      type: kos.kategori?.nama || "Unknown", // Get kategori name
      location: kos.alamat,
      price: kos.harga_per_bulan,
      facilities: kos.deskripsi
        ? kos.deskripsi.split(",").map((f) => f.trim())
        : [],
      images: kos.galeri ? JSON.parse(kos.galeri) : [],
      kategori: kos.kategori, // Add full kategori object
      deskripsi: kos.deskripsi,
    }));

    return processedKosData;
  } catch (error) {
    console.error("Error in getFeaturedKos:", error);
    return [];
  }
};

// Delete kosan
export const deleteKos = async (id) => {
  try {
    if (!id) {
      throw new Error("Kos ID is required to delete");
    }
    const response = await API.delete(`/kosans/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete kos:", error);
    throw new Error("Failed to delete kos");
  }
};

// Check if admin is authenticated
export const checkAdminAuth = async () => {
  try {
    const response = await API.get("/auth/check-admin");
    return response.data?.is_admin === true;
  } catch (error) {
    console.error("Admin auth check failed:", error);
    return false;
  }
};
