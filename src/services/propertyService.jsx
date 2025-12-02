import api from "./api";

export const getProperties = async () =>{
    try {
        const response = await api.get("api/properties");
        return response.data;
    } catch (error) {
        console.error("Error fetching properties:", error);
        throw error;
    }
};

export const getProperty = async (id) => {
    try {
        const res = await api.get(`/api/properties/${id}`);
        return res.data;
    } catch (err) {
        console.error('❌ Error fetching property:', err);
        throw err;
    }
};

export const createProperty = async (payload) => {
    try {
        const res = await api.post('/api/properties', payload);
        return res.data;
    } catch (err) {
        console.error('❌ Error creating property:', err);
        throw err;
    }
};

export const updateProperty = async (id, payload) => {
    try {
        const res = await api.put(`/api/properties/${id}`, payload);
        return res.data;
    } catch (err) {
        console.error('❌ Error updating property:', err);
        throw err;
    }
};

export const deleteProperty = async (id) => {
    try {
        const res = await api.delete(`/api/properties/${id}`);
        return res.data;
    } catch (err) {
        console.error('❌ Error deleting property:', err);
        throw err;
    }
};