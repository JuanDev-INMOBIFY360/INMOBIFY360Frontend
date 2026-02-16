import api from './api';

export const getPrivileges = async () => {
  try {
    const res = await api.get('/api/privileges');
    return res.data;
  } catch (err) {
    console.error('Error fetching privileges:', err);
    throw err;
  }
};

export const getPrivilege = async (id) => {
  const res = await api.get(`/api/privileges/${id}`);
  return res.data;
};

export const createPrivilege = async (payload) => {
  const res = await api.post('/api/privileges', payload);
  return res.data;
};

export const updatePrivilege = async (id, payload) => {
  const res = await api.put(`/api/privileges/${id}`, payload);
  return res.data;
};

export const deletePrivilege = async (id) => {
  const res = await api.delete(`/api/privileges/${id}`);
  return res.data;
};
