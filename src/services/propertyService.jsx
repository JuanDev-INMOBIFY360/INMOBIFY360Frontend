import api from "./api";

export const getProperties = async () =>{
    try {
        const response = await api.get("/api/properties");
        return response.data;
    } catch (error) {
        console.error("Error fetching properties:", error);
        throw error;
    }
};

export const getProperty = async (id) => {
    try {
        const res = await api.get(`/api/properties/${id}`);
        return res.data;
    } catch (err) {
        console.error('❌ Error fetching property:', err);
        throw err;
    }
};

export const createProperty = async (payload) => {
    try {
        const formData = new FormData();
        
        // Agregar campos normales (excluir imagenes y campos cliente-only)
        const clientOnlyFields = ['uploadedImages', 'deletedImages', 'tempFiles', 'file'];
        Object.keys(payload).forEach(key => {
            if (key !== 'imagenes' && !clientOnlyFields.includes(key)) {
                const value = payload[key];
                // Solo agregar si tiene valor
                if (value !== undefined && value !== null && value !== '') {
                    formData.append(key, value);
                }
            }
        });
        
        // Agregar imágenes (solo archivos nuevos)
        if (payload.imagenes && payload.imagenes.length > 0) {
            payload.imagenes.forEach((img, index) => {
                if (img.file) {
                    formData.append(`imagenes`, img.file);
                }
            });
        }
        
        // Permitir que axios configure el Content-Type con boundary para multipart/form-data
        const res = await api.post('/api/properties', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    } catch (err) {
        console.error('❌ Error creating property:', err);
        throw err;
    }
};

export const updateProperty = async (id, payload) => {
    try {
        const formData = new FormData();
        
        // Agregar campos normales (excluir imagenes y campos cliente-only)
        const clientOnlyFields = ['uploadedImages', 'deletedImages', 'tempFiles', 'file'];
        Object.keys(payload).forEach(key => {
            if (key !== 'imagenes' && !clientOnlyFields.includes(key)) {
                const value = payload[key];
                // Solo agregar si tiene valor
                if (value !== undefined && value !== null && value !== '') {
                    formData.append(key, value);
                }
            }
        });
        
        // Agregar imágenes (solo archivos nuevos)
        if (payload.imagenes && payload.imagenes.length > 0) {
            payload.imagenes.forEach((img, index) => {
                if (img.file) {
                    formData.append(`imagenes`, img.file);
                }
            });
        }
        
        // Permitir que axios configure el Content-Type con boundary para multipart/form-data
        const res = await api.put(`/api/properties/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    } catch (err) {
        console.error('❌ Error updating property:', err);
        throw err;
    }
};
  
export const deleteProperty = async (id) => {
    try {
        const res = await api.delete(`/api/properties/${id}`);
        return res.data;
    } catch (err) {
        console.error('❌ Error deleting property:', err);
        throw err;
    }
};