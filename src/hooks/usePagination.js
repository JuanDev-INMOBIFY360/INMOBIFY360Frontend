import { useState, useEffect, useMemo } from 'react';

/**
 * Simple pagination hook
 * @param {Array} items - items to paginate
 * @param {number} itemsPerPage - number of items per page
 */
export function usePagination(items = [], itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Reset to first page when items change
    setCurrentPage(1);
  }, [items, itemsPerPage]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil((items?.length || 0) / itemsPerPage)), [items, itemsPerPage]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return (items || []).slice(start, start + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    const next = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(next);
  };

  return {
    currentPage,
    totalPages,
    paginatedItems,
    handlePageChange,
    itemsPerPage,
  };
}
