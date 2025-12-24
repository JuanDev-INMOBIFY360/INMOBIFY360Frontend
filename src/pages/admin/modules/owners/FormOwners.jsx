import React, { useState, useEffect } from "react";
import "./owners.css";
import { CircleX } from "lucide-react";

export default function FormOwners({ isOpen, onClose, ownerToEdit, onSave }) {
  const [formDataOwners, setDataOwners] = useState({
    document: "",
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (ownerToEdit) {
      // Solo cuando editamos incluimos el id
      setDataOwners({
        id: ownerToEdit.id,
        document: ownerToEdit.document || "",
        name: ownerToEdit.name || "",
        email: ownerToEdit.email || "",
        phone: ownerToEdit.phone || "",
      });
    } else {
      setDataOwners({ 
        document: "", 
        name: "", 
        email: "", 
        phone: "" 
      });
    }
    setErrors({});
  }, [ownerToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataOwners((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    if (!formDataOwners.document.trim()) {
      newErrors.document = "El documento del propietario es requerido";
    }
    if (!formDataOwners.name.trim()) {
      newErrors.name = "El nombre del propietario es requerido";
    } else if (formDataOwners.name.trim().length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres";
    }
    if (!formDataOwners.email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else {
      // Validación básica de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formDataOwners.email)) {
        newErrors.email = "El correo electrónico no es válido";
      }
    }
    if (!formDataOwners.phone.trim()) {
      newErrors.phone = "El teléfono es requerido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await onSave(formDataOwners);
      handleClose();
    } catch (error) {
      setErrors({ submit: "Error al guardar. Por favor intenta nuevamente." });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleClose = () => {
    setDataOwners({ 
      document: "", 
      name: "", 
      email: "", 
      phone: "" 
    });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-container" onClick={handleClose}>
      <div className="module-container-owners" onClick={(e) => e.stopPropagation()}>
        <div className="module-header">
          <h2>{ownerToEdit ? "Editar Propietario" : "Agregar Propietario"}</h2>
          <button className="close-button" onClick={handleClose}>
            <CircleX size={20} />
          </button>
        </div>
        <div className="module-body-owners">
          <div className="group-dual">
            <div className="form-group">
              <label htmlFor="document">Documento:</label>
              <input
                id="document"
                type="text"
                name="document"
                placeholder="Ingrese el documento"
                value={formDataOwners.document}
                onChange={handleChange}
                className={errors.document ? "input-error" : ""}
                disabled={isSubmitting}
              />
              {errors.document && <span className="error-text">{errors.document}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="name">Nombre Completo:</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Ingrese el nombre completo"
                value={formDataOwners.name}
                onChange={handleChange}
                className={errors.name ? "input-error" : ""}
                disabled={isSubmitting}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
          </div>


          <div className="form-group">
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="ejemplo@correo.com"
              value={formDataOwners.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
              disabled={isSubmitting}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Teléfono:</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              placeholder="Ingrese el teléfono"
              value={formDataOwners.phone}
              onChange={handleChange}
              className={errors.phone ? "input-error" : ""}
              disabled={isSubmitting}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>
          
          {errors.submit && (
            <div className="error-text submit-error">{errors.submit}</div>
          )}
        </div>
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
            {isSubmitting
              ? "Guardando..."
              : formDataOwners.id
              ? "Actualizar"
              : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}