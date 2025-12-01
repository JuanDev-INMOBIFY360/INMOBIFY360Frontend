import api from "./api";

export const getDepartments = async () => {
  try {
    const response = await api.get("/api/departaments");
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching departments:", error);
    throw error;
  }
};