import api from './api';

export const getPermissions = async () => {
  try {
    const res = await api.get('/api/permissions');
    return res.data;
  } catch (err) {
    console.error('❌ Error fetching permissions:', err);
    throw err;
  }
};

export const getPermission = async (id) => {
  const res = await api.get(`/api/permissions/${id}`);
  return res.data;
};

export const createPermission = async (payload) => {
  const res = await api.post('/api/permissions', payload);
  return res.data;
};

export const updatePermission = async (id, payload) => {
  const res = await api.put(`/api/permissions/${id}`, payload);
  return res.data;
};

export const deletePermission = async (id) => {
  const res = await api.delete(`/api/permissions/${id}`);
  return res.data;
};
