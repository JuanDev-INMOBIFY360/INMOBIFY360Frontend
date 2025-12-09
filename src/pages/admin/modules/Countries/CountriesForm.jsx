import { useState, useEffect } from 'react';
import Modal from '../../../../components/Modal/';

export default function CountriesForm({ item, onSave, onClose, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '',
    code: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        code: item.code || ''
      });
    } else {
      setFormData({
        name: '',
        code: ''
      });
    }
    setErrors({});
  }, [item]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Modal
        isOpen={true}
        title={item ? 'Editar País' : 'Crear Nuevo País'}
        onClose={onClose}
        submitButtonText={isSubmitting ? 'Guardando...' : 'Guardar'}
        isSubmitting={isSubmitting}
      >
        <div className="form-group">
          <label htmlFor="name">Nombre del País</label>
          <input
            id="name"
            type="text"
            name="name"
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="Ej: Colombia"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="code">Código (Opcional)</label>
          <input
            id="code"
            type="text"
            name="code"
            className="form-input"
            placeholder="Ej: CO"
            value={formData.code}
            onChange={handleChange}
            maxLength="3"
          />
        </div>
      </Modal>
    </form>
  );
}
