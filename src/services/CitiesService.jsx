import api from "./api";

export const getCities = async () => {
  try {
    const response = await api.get("/api/cities");
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching cities:", error);
    throw error;
  }
};

export const getCity = async (id) => {
  try {
    const res = await api.get(`/api/cities/${id}`);
    return res.data;
  } catch (err) {
    console.error('❌ Error fetching city:', err);
    throw err;
  }
};

export const createCity = async (payload) => {
  try {
    const res = await api.post('/api/cities', payload);
    return res.data;
  } catch (err) {
    console.error('❌ Error creating city:', err);
    throw err;
  }
};

export const updateCity = async (id, payload) => {
  try {
    const res = await api.put(`/api/cities/${id}`, payload);
    return res.data;
  } catch (err) {
    console.error('❌ Error updating city:', err);
    throw err;
  }
};

export const deleteCity = async (id) => {
  try {
    const res = await api.delete(`/api/cities/${id}`);
    return res.data;
  } catch (err) {
    console.error('❌ Error deleting city:', err);
    throw err;
  }
};