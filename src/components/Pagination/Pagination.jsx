import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

export default function Pagination({ 
  currentPage = 1, 
  totalPages = 1, 
  itemsPerPage = 10,
  totalItems = 0,
  onPageChange = () => {},
  isLoading = false
}) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevious = () => {
    if (currentPage > 1 && !isLoading) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages && !isLoading) onPageChange(currentPage + 1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      
      <button 
        className="pagination-btn pagination-nav" 
        onClick={handlePrevious}
        disabled={currentPage === 1 || isLoading}
        title="Página anterior"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="pagination-pages">
        {getPageNumbers().map((page, idx) => 
          page === '...' ? (
            <span key={`dots-${idx}`} className="pagination-dots">...</span>
          ) : (
            <button
              key={page}
              className={`pagination-btn ${currentPage === page ? 'pagination-btn--active' : ''}`}
              onClick={() => onPageChange(page)}
              disabled={currentPage === page || isLoading}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button 
        className="pagination-btn pagination-nav" 
        onClick={handleNext}
        disabled={currentPage === totalPages || isLoading}
        title="Página siguiente"
      >
        <ChevronRight size={18} />
      </button>

      {totalItems > 0 && (
        <span className="pagination-info">
          {startItem}-{endItem} de {totalItems}
        </span>
      )}
    </div>
  );
}
