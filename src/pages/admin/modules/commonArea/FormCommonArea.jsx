import React, { useState, useEffect } from "react";
import { CircleX } from "lucide-react";
import "../types/types.css";

export default function FormCommonArea({ isOpen, onClose, areaToEdit, onSave }) {
  const [formData, setFormData] = useState({ id: null, name: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (areaToEdit) {
      setFormData(areaToEdit);
    } else {
      setFormData({ id: null, name: "" });
    }
    setErrors({});
  }, [areaToEdit, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = "El nombre es obligatorio";
    } else if (formData.name.length < 3) {
      errs.name = "Debe tener al menos 3 caracteres";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-container" onClick={onClose}>
      <div className="module-container" onClick={(e) => e.stopPropagation()}>
        <header className="module-header">
          <h2>{formData.id ? "Editar Zona Común" : "Nueva Zona Común"}</h2>
          <button className="close-button" onClick={onClose}>
            <CircleX />
          </button>
        </header>

        <div className="module-body">
          <div className="types-form-group">
            <label>Nombre</label>
            <input
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-actions">
            <button className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn-submit" onClick={handleSubmit}>
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}