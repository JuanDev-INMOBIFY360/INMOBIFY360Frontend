import { useState, useMemo } from 'react';

/**
 * Hook para manejar paginación de datos
 * @param {Array} items - Lista de items a paginar
 * @param {Number} itemsPerPage - Cantidad de items por página
 * @returns {Object} Objeto con datos paginados y funciones de control
 */
export const usePagination = (items = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => {
    return Math.ceil(items.length / itemsPerPage);
  }, [items.length, itemsPerPage]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    const validPage = Math.max(1, Math.min(page, totalPages || 1));
    setCurrentPage(validPage);
    // Scroll al top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToFirstPage = () => handlePageChange(1);
  const goToLastPage = () => handlePageChange(totalPages);
  const goToNextPage = () => handlePageChange(currentPage + 1);
  const goToPreviousPage = () => handlePageChange(currentPage - 1);

  return {
    currentPage,
    totalPages,
    paginatedItems,
    handlePageChange,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPreviousPage,
    startIndex: (currentPage - 1) * itemsPerPage + 1,
    endIndex: Math.min(currentPage * itemsPerPage, items.length),
    totalItems: items.length
  };
};
