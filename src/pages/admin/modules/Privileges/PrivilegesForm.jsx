import { useState, useEffect } from 'react';
import Modal from '../../../../components/Modal/';
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
    <form onSubmit={handleSubmit}>
      <Modal
        isOpen={true}
        title={item ? 'Editar Privilegio' : 'Crear Privilegio'}
        onClose={onClose}
        submitButtonText={isSubmitting ? 'Guardando...' : 'Guardar'}
        isSubmitting={isSubmitting}
      >
        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="Nombre del privilegio"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descripción del privilegio"
            rows="3"
            className="form-input"
          />
        </div>
      </Modal>
    </form>
  );
}
