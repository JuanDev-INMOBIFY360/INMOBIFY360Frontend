/**
 * Remueve tildes y acentos de una cadena para facilitar búsquedas
 * @param {string} str - Cadena con posibles acentos
 * @returns {string} - Cadena sin acentos
 */
export const removeAccents = (str) => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

/**
 * Normaliza una cadena para búsqueda (sin tildes y minúsculas)
 * @param {string} str
 * @returns {string}
 */
export const normalizeForSearch = (str) => {
  return removeAccents(str).trim();
};
