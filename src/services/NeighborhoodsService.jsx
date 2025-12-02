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

export const getNeighborhood = async (id) => {
  try {
    const res = await api.get(`/api/neighborhoods/${id}`);
    return res.data;
  } catch (err) {
    console.error('❌ Error fetching neighborhood:', err);
    throw err;
  }
};

export const createNeighborhood = async (payload) => {
  try {
    const res = await api.post('/api/neighborhoods', payload);
    return res.data;
  } catch (err) {
    console.error('❌ Error creating neighborhood:', err);
    throw err;
  }
};

export const updateNeighborhood = async (id, payload) => {
  try {
    const res = await api.put(`/api/neighborhoods/${id}`, payload);
    return res.data;
  } catch (err) {
    console.error('❌ Error updating neighborhood:', err);
    throw err;
  }
};

export const deleteNeighborhood = async (id) => {
  try {
    const res = await api.delete(`/api/neighborhoods/${id}`);
    return res.data;
  } catch (err) {
    console.error('❌ Error deleting neighborhood:', err);
    throw err;
  }
};