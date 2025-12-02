import api from './api';

export const getRoles = async () => {
  try {
    const res = await api.get('/api/roles');
    return res.data;
  } catch (err) {
    console.error('❌ Error fetching roles:', err);
    throw err;
  }
};

export const getRole = async (id) => {
  const res = await api.get(`/api/roles/${id}`);
  return res.data;
};

export const createRole = async (payload) => {
  const res = await api.post('/api/roles', payload);
  return res.data;
};

export const updateRole = async (id, payload) => {
  const res = await api.put(`/api/roles/${id}`, payload);
  return res.data;
};

export const deleteRole = async (id) => {
  const res = await api.delete(`/api/roles/${id}`);
  return res.data;
};
