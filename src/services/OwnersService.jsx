import api from './api';

export const getOwners = async () => {
  try {
    const res = await api.get('/api/owners');
    return res.data;
  } catch (err) {
    console.error('❌ Error fetching owners:', err);
    throw err;
  }
};

export const getOwner = async (id) => {
  const res = await api.get(`/api/owners/${id}`);
  return res.data;
};

export const createOwner = async (payload) => {
  const res = await api.post('/api/owners', payload);
  return res.data;
};

export const updateOwner = async (id, payload) => {
  const res = await api.put(`/api/owners/${id}`, payload);
  return res.data;
};

export const deleteOwner = async (id) => {
  const res = await api.delete(`/api/owners/${id}`);
  return res.data;
};
