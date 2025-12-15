import { useState, useEffect } from 'react';

export default function UsersForm({ user, roles, onSave, onClose, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleId: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        roleId: user.roleId || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        roleId: ''
      });
    }
    setErrors({});
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!user && !formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    }

    if (!formData.roleId) {
      newErrors.roleId = 'El rol es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Si estamos editando y no hay contraseña, no enviarla
      const dataToSend = { ...formData };
      if (user && !dataToSend.password) {
        delete dataToSend.password;
      }
      onSave(dataToSend);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="users-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{user ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h3>
          <button className="modal-close" onClick={onClose} type="button">×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre Completo</label>
            <input
              id="name"
              type="text"
              name="name"
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="Ej: Juan Pérez"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="usuario@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="roleId">Rol</label>
            <select
              id="roleId"
              name="roleId"
              className={`form-select ${errors.roleId ? 'error' : ''}`}
              value={formData.roleId}
              onChange={handleChange}
            >
              <option value="">Seleccionar rol</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            {errors.roleId && <span className="error-message">{errors.roleId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Contraseña {user && '(dejar en blanco para no cambiar)'}
            </label>
            <input
              id="password"
              type="password"
              name="password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
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
