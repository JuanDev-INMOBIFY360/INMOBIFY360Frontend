import React, { useState, useEffect } from "react";
import { CircleX } from "lucide-react";
import "../types/types.css";

const TYPES = [
  "METRO",
  "SUPERMARKET",
  "HOSPITAL",
  "SCHOOL",
  "PARK",
  "MALL",
  "GYM",
  "OTHER",
];

export default function FormNearbyPlace({
  isOpen,
  onClose,
  placeToEdit,
  onSave,
}) {
  const [form, setForm] = useState({
    id: null,
    name: "",
    type: "METRO",
   
  });

  useEffect(() => {
    if (placeToEdit) {
      setForm({
        id: placeToEdit.id,
        name: placeToEdit.name,
        type: placeToEdit.type,
      });
    } else {
      setForm({ id: null, name: "", type: "METRO" });
    }
  }, [placeToEdit, isOpen]);

  const handleSubmit = async () => {
    if (!form.name.trim()) return;

    await onSave({
      id: form.id,
      name: form.name,
      type: form.type,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-container" onClick={onClose}>
      <div className="module-container" onClick={(e) => e.stopPropagation()}>
        <header className="module-header">
          <h2>{form.id ? "Editar Lugar Cercano" : "Nuevo Lugar Cercano"}</h2>
          <button className="close-button" onClick={onClose}>
            <CircleX />
          </button>
        </header>

        <div className="module-body">
          <div className="types-form-group">
            <label>Nombre</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <label>Tipo</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            
          </div>

          <div className="form-actions">
            <button className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn-submit" onClick={handleSubmit}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
