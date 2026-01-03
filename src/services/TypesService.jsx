import api from './api';

export const getTypes = async () => {
  try {
    const res = await api.get('/api/types');
    return res.data.data || res.data;
  } catch (err) {
    console.error('❌ Error fetching types:', err);
    throw err;
  }
};

export const getType = async (id) => {
  const res = await api.get(`/api/types/${id}`);
  return res.data;
};

export const createType = async (payload) => {
  const res = await api.post('/api/types', payload);
  return res.data;
};

export const updateType = async (id, payload) => {
  const res = await api.put(`/api/types/${id}`, payload);
  return res.data;
};

export const deleteType = async (id) => {
  const res = await api.delete(`/api/types/${id}`);
  return res.data;
};
