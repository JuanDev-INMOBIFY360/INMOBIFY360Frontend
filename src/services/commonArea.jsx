import api from "./api";

export const getCommonAreas = async () => {
  try {
    const response = await api.get("/api/common-areas");
    return response.data;
  } catch (error) {
    console.error("Error fetching common areas:", error);
    throw error;
  }
};
export const addCommonArea = async (area) => {
  try {
    const response = await api.post("/api/common-areas", area);
    return response.data;
  } catch (error) {
    console.error("Error adding common area:", error);
    throw error;
  }
};
export const updateCommonArea = async (id, area) => {
  try {
    const response = await api.put(`/api/common-areas/${id}`, area);
    return response.data;
  } catch (error) {
    console.error("Error updating common area:", error);
    throw error;
  }
};
export const deleteCommonArea = async (id) => {
  try {
    const response = await api.delete(`/api/common-areas/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting common area:", error);
    throw error;
  }
};
