import api from "./api";

export const getCountries = async () => {
  try {
    const response = await api.get("/api/countries");
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching countries:", error);
    throw error;
  }
};

export const getCountry = async (id) => {
  try {
    const res = await api.get(`/api/countries/${id}`);
    return res.data;
  } catch (err) {
    console.error('❌ Error fetching country:', err);
    throw err;
  }
};

export const createCountry = async (payload) => {
  try {
    const res = await api.post('/api/countries', payload);
    return res.data;
  } catch (err) {
    console.error('❌ Error creating country:', err);
    throw err;
  }
};

export const updateCountry = async (id, payload) => {
  try {
    const res = await api.put(`/api/countries/${id}`, payload);
    return res.data;
  } catch (err) {
    console.error('❌ Error updating country:', err);
    throw err;
  }
};

export const deleteCountry = async (id) => {
  try {
    const res = await api.delete(`/api/countries/${id}`);
    return res.data;
  } catch (err) {
    console.error('❌ Error deleting country:', err);
    throw err;
  }
};