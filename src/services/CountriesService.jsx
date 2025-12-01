import api from "./api";

export const getCountries = async () => {
  try {
    const response = await api.get("api/countries");
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching countries:", error);
    throw error;
  }
};