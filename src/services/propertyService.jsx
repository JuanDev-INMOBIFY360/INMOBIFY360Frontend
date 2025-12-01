import api from "./api";

export const getProperties = async () =>{
    try {
        const response = await api.get("api/properties");
        return response.data;
    } catch (error) {
        console.error("Error fetching properties:", error);
    }
}