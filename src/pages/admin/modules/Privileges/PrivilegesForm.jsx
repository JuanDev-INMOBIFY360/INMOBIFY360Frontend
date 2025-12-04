import { useState, useEffect } from 'react';
import '../styles/privileges.css';

export default function PrivilegesForm({ item, onSave, onClose, isSubmitting }) {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({ name: item.name || '', description: item.description || '' });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await onSave(formData);
  };

  return (
    <div className="privileges-modal">
      <div className="privileges-form-container">
        <div className="privileges-form-header">
          <h3>{item ? 'Editar Privilegio' : 'Crear Privilegio'}</h3>
          <button className="privileges-form-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="privileges-form">
          <div className="privileges-form-group">
            <label htmlFor="name">Nombre *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'input--error' : ''}
              placeholder="Nombre del privilegio"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="privileges-form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción del privilegio"
              rows="3"
            />
          </div>

          <div className="privileges-form-actions">
            <button type="button" className="btn btn--secondary" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </button>
            <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
