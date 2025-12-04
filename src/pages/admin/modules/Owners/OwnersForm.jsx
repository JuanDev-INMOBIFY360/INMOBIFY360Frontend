import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
export default function OwnersForm({ item, onSave, onClose, isSubmitting }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  useEffect(() => {
    setFormData({ name: item?.name || '', email: item?.email || '', phone: item?.phone || '' });
    setErrors({});
  }, [item]);
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email inválido';
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
    <div className="modal-overlay">
      <div className="owners-modal">
        <div className="modal-header">
          <h3>{item ? 'Editar Propietario' : 'Crear Nuevo Propietario'}</h3>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input id="name" type="text" name="name" className={`form-input ${errors.name ? 'error' : ''}`} placeholder="Nombre completo" value={formData.name} onChange={handleChange} />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="correo@ejemplo.com" value={formData.email} onChange={handleChange} />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="phone">Teléfono</label>
            <input id="phone" type="tel" name="phone" className="form-input" placeholder="+57 123 456 7890" value={formData.phone} onChange={handleChange} />
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
