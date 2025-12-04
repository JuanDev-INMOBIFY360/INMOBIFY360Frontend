import React from 'react';
import { X } from 'lucide-react';
import './modal.css';

export default function Modal({ isOpen, title, children, onClose, onSubmit, submitText = 'Guardar', isLoading = false, size = 'normal' }) {
  if (!isOpen) return null;

  const modalClass = size === 'lg' ? 'modal-lg' : '';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content ${modalClass}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="modal-body">
          {children}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? 'Guardando...' : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
