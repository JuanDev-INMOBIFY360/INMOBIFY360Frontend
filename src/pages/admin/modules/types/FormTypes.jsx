import React, { useState, useEffect } from 'react';
import "./types.css"
import {CircleX } from "lucide-react"

export default function FormTypes({ isOpen, onClose, typeToEdit, onSave }) {
  const [formDataTypes, setDataTypes] = useState({
    id: null,
    name: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeToEdit) {
      setDataTypes({
        id: typeToEdit.id,
        name: typeToEdit.name || ""
      });
    } else {
      setDataTypes({ id: null, name: "" });
    }
    setErrors({});
  }, [typeToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataTypes(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formDataTypes.name.trim()) {
      newErrors.name = "El nombre del tipo es requerido";
    } else if (formDataTypes.name.trim().length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSave(formDataTypes);
      handleClose();
    } catch (error) {
      setErrors({ submit: "Error al guardar. Por favor intenta nuevamente." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setDataTypes({ id: null, name: "" });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-container" onClick={handleClose}>
      <div className="module-container" onClick={(e) => e.stopPropagation()}>
        <header className="module-header">
          <h2>{formDataTypes.id ? "Editar Tipo" : "Registrar Nuevo Tipo"}</h2>
          <button 
            className="close-button" 
            onClick={handleClose}
            type="button"
            aria-label="Cerrar modal"
          >
            <CircleX />
          </button>
        </header>
        
        <div className="module-body">
          <div className="types-form-group">
            <label htmlFor="name">Nombre del tipo</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              placeholder="Nombre del tipo" 
              value={formDataTypes.name}
              onChange={handleChange}
              className={errors.name ? "input-error" : ""}
              disabled={isSubmitting}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          {errors.submit && (
            <div className="error-message submit-error">{errors.submit}</div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button 
              type="button" 
              className="btn-submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : (formDataTypes.id ? "Actualizar" : "Guardar")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}