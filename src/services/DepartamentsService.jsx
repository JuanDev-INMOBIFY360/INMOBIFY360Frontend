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

export const getDepartment = async (id) => {
  try {
    const res = await api.get(`/api/departaments/${id}`);
    return res.data;
  } catch (err) {
    console.error('❌ Error fetching department:', err);
    throw err;
  }
};

export const createDepartment = async (payload) => {
  try {
    const res = await api.post('/api/departaments', payload);
    return res.data;
  } catch (err) {
    console.error('❌ Error creating department:', err);
    throw err;
  }
};

export const updateDepartment = async (id, payload) => {
  try {
    const res = await api.put(`/api/departaments/${id}`, payload);
    return res.data;
  } catch (err) {
    console.error('❌ Error updating department:', err);
    throw err;
  }
};

export const deleteDepartment = async (id) => {
  try {
    const res = await api.delete(`/api/departaments/${id}`);
    return res.data;
  } catch (err) {
    console.error('❌ Error deleting department:', err);
    throw err;
  }
};