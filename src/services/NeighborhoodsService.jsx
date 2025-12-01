import api from "./api";

export const getNeighborhoods = async () => {
  try {
    const response = await api.get("/api/neighborhoods");
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching neighborhoods:", error);
    throw error;
  }
};