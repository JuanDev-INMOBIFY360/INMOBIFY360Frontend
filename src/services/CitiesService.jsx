import api from "./api";

export const getCities = async () => {
  try {
    const response = await api.get("api/cities");
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching cities:", error);
    throw error;
  }
};