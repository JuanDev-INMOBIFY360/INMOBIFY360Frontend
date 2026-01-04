import api from "./api";

export const getNearbyPlaces = async () => {
    try {
        const response = await api.get("/api/nearby-places");
        return response.data;
    } catch (error) {
        console.error("Error fetching nearby places:", error);
        throw error;
    }
}

export const addNearbyPlace = async (place) => {
    try {
        const response = await api.post("/api/nearby-places", place);
        return response.data;
    } catch (error) {
        console.error("Error adding nearby place:", error);
        throw error;
    }
}

export const updateNearbyPlace = async (id, place) => {
    try {
        const response = await api.put(`/api/nearby-places/${id}`, place);
        return response.data;
    } catch (error) {
        console.error("Error updating nearby place:", error);
        throw error;
    }
}

export const deleteNearbyPlace = async (id) => {
    try {
        const response = await api.delete(`/api/nearby-places/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting nearby place:", error);
        throw error;
    }
}
