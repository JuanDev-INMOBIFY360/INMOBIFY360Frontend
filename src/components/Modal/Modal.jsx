import React from 'react';
import { X } from 'lucide-react';
import './modal.css';

export default function Modal({ isOpen, title, children, onClose, submitButtonText = 'Guardar', isSubmitting = false, size = 'normal' }) {
  if (!isOpen) return null;

  const modalClass = size === 'lg' ? 'modal-lg' : '';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content ${modalClass}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose} type="button">
            <X size={24} />
          </button>
        </div>
        <div className="modal-body">
          {children}
          <div className="modal-footer">
            <button type="button" className="btn btn--secondary" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </button>
            <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : submitButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
