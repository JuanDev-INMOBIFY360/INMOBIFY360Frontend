import api from './api';

/**
 * Obtener todas las propiedades
 */
export const getProperties = async (params = {}) => {
  try {
    const res = await api.get('/api/properties', { params });
    return res.data.data || res.data;
  } catch (err) {
    console.error('❌ Error fetching properties:', err);
    throw err;
  }
};

/**
 * Obtener una propiedad por ID
 */
export const getProperty = async (id) => {
  const res = await api.get(`/api/properties/${id}`);
  return res.data;
};

/**
 * Crear una propiedad con imágenes
 */
export const createProperty = async (payload) => {
  const res = await api.post('/api/properties', payload);
  return res.data;
};

/**
 * Actualizar una propiedad
 */
export const updateProperty = async (id, payload) => {
  const res = await api.put(`/api/properties/${id}`, payload);
  return res.data;
};

/**
 * Eliminar una propiedad
 */
export const deleteProperty = async (id) => {
  const res = await api.delete(`/api/properties/${id}`);
  return res.data;
};

/**
 * Subir imágenes adicionales a una propiedad existente
 */
export const uploadPropertyImages = async (propertyId, images) => {
  const res = await api.post(`/api/properties/${propertyId}/images`, { images });
  return res.data;
};

/**
 * Eliminar una imagen de una propiedad
 */
export const deletePropertyImage = async (propertyId, imageId) => {
  const res = await api.delete(`/api/properties/${propertyId}/images/${imageId}`);
  return res.data;
};

/**
 * Establecer una imagen como primaria
 */
export const setPrimaryImage = async (propertyId, imageId) => {
  const res = await api.patch(`/api/properties/${propertyId}/images/${imageId}/primary`);
  return res.data;
};

/**
 * Convertir archivo a base64
 * @param {File} file - Archivo de imagen
 * @returns {Promise<string>} - String base64
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};