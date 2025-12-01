/**
 * Construye una URL de búsqueda con filtros
 * @param {Object} filters - Objeto con claves de filtro
 * @returns {string} - URL con query string
 */
export const buildSearchUrl = (filters = {}) => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });
  
  return `/search?${params.toString()}`;
};

/**
 * Crea un path para buscar una propiedad por tipo
 */
export const searchByType = (type) => buildSearchUrl({ type });

/**
 * Crea un path para buscar por categoría (Venta, Arriendo, etc)
 */
export const searchByCategory = (category) => buildSearchUrl({ category });

/**
 * Crea un path para buscar por ciudad
 */
export const searchByCity = (city) => buildSearchUrl({ city });
