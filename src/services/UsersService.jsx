import api from './api';

export const getUsers = async () => {
  try {
    const res = await api.get('/api/users');
    return res.data;
  } catch (err) {
    console.error('❌ Error fetching users:', err);
    throw err;
  }
};

export const getUser = async (id) => {
  const res = await api.get(`/api/users/${id}`);
  return res.data;
};

export const createUser = async (payload) => {
  const res = await api.post('/api/users', payload);
  return res.data;
};

export const updateUser = async (id, payload) => {
  const res = await api.put(`/api/users/${id}`, payload);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/api/users/${id}`);
  return res.data;
};
