/**
 * Parsea y normaliza imágenes desde diferentes formatos
 * Las imágenes pueden venir como:
 * - JSON string: '[{"url": "...", "public_id": "..."}]'
 * - Array de objetos: [{url: "...", public_id: "..."}]
 * - Array de strings: ["url1", "url2"]
 * 
 * @param {string|array} images - Imágenes en cualquier formato
 * @returns {array} Array normalizado de objetos imagen
 */
export const parseImages = (images) => {
  try {
    if (!images) return [];
    
    // Si es string, parsear como JSON
    if (typeof images === 'string') {
      return JSON.parse(images);
    }
    
    // Si es array, retornar tal cual
    if (Array.isArray(images)) {
      return images;
    }
    
    return [];
  } catch (error) {
    console.error('❌ Error parsing images:', error);
    return [];
  }
};

/**
 * Obtiene la URL de una imagen normalizada
 * @param {string|object} image - Imagen en cualquier formato
 * @returns {string|null} URL de la imagen o null
 */
export const getImageUrl = (image) => {
  if (!image) return null;
  
  // Si es string, es la URL directa
  if (typeof image === 'string') return image;
  
  // Si es objeto, obtener la propiedad url
  if (typeof image === 'object' && image.url) return image.url;
  
  return null;
};

/**
 * Obtiene la primera imagen de un array
 * @param {string|array} images - Imágenes en cualquier formato
 * @returns {string|null} URL de la primera imagen o null
 */
export const getFirstImageUrl = (images) => {
  const parsed = parseImages(images);
  if (parsed.length === 0) return null;
  return getImageUrl(parsed[0]);
};

/**
 * Valida si hay imágenes disponibles
 * @param {string|array} images - Imágenes en cualquier formato
 * @returns {boolean} True si hay al menos una imagen
 */
export const hasImages = (images) => {
  const parsed = parseImages(images);
  return Array.isArray(parsed) && parsed.length > 0;
};
