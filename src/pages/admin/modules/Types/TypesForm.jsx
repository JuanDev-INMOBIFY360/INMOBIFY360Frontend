import { useState, useEffect } from 'react';
export default function TypesForm({ item, onSave, onClose, isSubmitting }) {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});
  useEffect(() => {
    setFormData({ name: item?.name || '', description: item?.description || '' });
    setErrors({});
  }, [item]);
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="types-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{item ? 'Editar Tipo' : 'Crear Nuevo Tipo'}</h3>
          <button className="modal-close" onClick={onClose} type="button">×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre del Tipo</label>
            <input id="name" type="text" name="name" className={`form-input ${errors.name ? 'error' : ''}`} placeholder="Ej: Casa" value={formData.name} onChange={handleChange} />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea name="description" id="description" className="form-input" placeholder="Descripción opcional" rows="3" value={formData.description} onChange={handleChange} />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn--secondary" onClick={onClose} disabled={isSubmitting}>Cancelar</button>
            <button type="submit" className="btn btn--primary" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
