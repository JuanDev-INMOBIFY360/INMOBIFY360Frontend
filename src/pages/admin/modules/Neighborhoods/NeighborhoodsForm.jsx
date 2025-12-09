import { useState, useEffect } from 'react';
import Modal from '../../../../components/Modal/';

export default function NeighborhoodsForm({ item, onSave, onClose, isSubmitting }) {
  const [formData, setFormData] = useState({ name: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({ name: item?.name || '' });
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
    <form onSubmit={handleSubmit}>
      <Modal
        isOpen={true}
        title={item ? 'Editar Barrio' : 'Crear Nuevo Barrio'}
        onClose={onClose}
        submitButtonText={isSubmitting ? 'Guardando...' : 'Guardar'}
        isSubmitting={isSubmitting}
      >
        <div className="form-group">
          <label htmlFor="name">Nombre del Barrio</label>
          <input id="name" type="text" name="name" className={`form-input ${errors.name ? 'error' : ''}`} placeholder="Ej: Centro" value={formData.name} onChange={handleChange} />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>
      </Modal>
    </form>
  );
}
