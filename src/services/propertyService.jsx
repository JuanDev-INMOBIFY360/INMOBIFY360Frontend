import api from "./api";

export const getProperties = async (params = {}) => {
    try { 
        const response = await api.get("/properties", { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching properties:", error);
        throw error;
    }
};