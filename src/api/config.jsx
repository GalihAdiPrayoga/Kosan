import axios from "axios";

export const API = axios.create({
  baseURL: "https://galihadiprayoga.github.io/kosan-app",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchKosData = async () => {
  try {
    const response = await API.get("/db.json");
    return response.data.kos;
  } catch (error) {
    throw new Error("Failed to fetch kos data");
  }
};

export const getFeaturedKos = async () => {
  try {
    const kosData = await fetchKosData();
    // Sort by price descending
    return kosData.sort((a, b) => b.price - a.price).slice(0, 3);
  } catch (error) {
    throw error;
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
