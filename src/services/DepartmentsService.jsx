import api from "./api";

export const getDepartments = async () => {
  try {
    const response = await api.get("/api/departments");
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching departments:", error);
    throw error;
  }
};

export const getDepartment = async (id) => {
  try {
    const res = await api.get(`/api/departments/${id}`);
    return res.data;
  } catch (err) {
    console.error('❌ Error fetching department:', err);
    throw err;
  }
};

export const createDepartment = async (payload) => {
  try {
    const res = await api.post('/api/departments', payload);
    return res.data;
  } catch (err) {
    console.error('❌ Error creating department:', err);
    throw err;
  }
};

export const updateDepartment = async (id, payload) => {
  try {
    const res = await api.put(`/api/departments/${id}`, payload);
    return res.data;
  } catch (err) {
    console.error('❌ Error updating department:', err);
    throw err;
  }
};

export const deleteDepartment = async (id) => {
  try {
    const res = await api.delete(`/api/departments/${id}`);
    return res.data;
  } catch (err) {
    console.error('❌ Error deleting department:', err);
    throw err;
  }
};