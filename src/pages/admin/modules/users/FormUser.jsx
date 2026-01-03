import React, { useEffect, useState } from "react";
import "../../GlobalStyles/globalStyles.css";
import "./users.css";
import { CircleX, Eye, EyeOff } from "lucide-react";
import { getRoles } from "../../../../services/RolesService";

export default function FormUser({ isOpen, onClose, userToEdit, onSave }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    roleId: null,
    password: "",
    confirmPassword: "",
    status: true,
  });
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const data = await getRoles();
        setRoles(data);
      } catch (err) {
        console.error("Error loading roles", err);
      }
    };
    loadRoles();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    if (userToEdit) {
      setForm({
        name: userToEdit.name || "",
        email: userToEdit.email || "",
        roleId: userToEdit.role?.id || null,
        password: "",
        confirmPassword: "",
        status: userToEdit.status ?? true,
      });
    } else {
      setForm({
        name: "",
        email: "",
        roleId: null,
        password: "",
        confirmPassword: "",
        status: true,
      });
    }
    setErrors({});
    setIsSubmitting(false);
  }, [isOpen, userToEdit]);

  if (!isOpen) return null;

 const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  setForm((prev) => ({
    ...prev,
    [name]:
      type === "checkbox"
        ? checked
        : name === "roleId"
        ? (value ? Number(value) : null) // 👈 CLAVE
        : value,
  }));

  if (errors[name]) {
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }
};

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "El nombre es requerido";
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!form.email.trim() || !emailRegex.test(form.email))
      e.email = "Email inválido";

    if (!userToEdit) {
      if (!form.password) e.password = "La contraseña es requerida";
      else if (form.password.length < 6)
        e.password = "La contraseña debe tener al menos 6 caracteres";
      if (form.password !== form.confirmPassword)
        e.confirmPassword = "Las contraseñas no coinciden";
    } else {
      // if editing and password provided, validate it
      if (form.password && form.password.length < 6)
        e.password = "La contraseña debe tener al menos 6 caracteres";
      if (form.password && form.password !== form.confirmPassword)
        e.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      roleId: form.roleId,
      status: form.status,
    };
    if (form.password) payload.password = form.password;

    try {
      await onSave(userToEdit ? userToEdit.id : null, payload);
      onClose();
    } catch (err) {
      console.error("Error saving user", err);
      setErrors({ submit: "Error al guardar el usuario" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="modal-container" onClick={handleClose}>

        <div className="module-container user-module" onClick={(e) => e.stopPropagation()}>
        <header className="module-header">
          <h2>{userToEdit ? "Editar Usuario" : "Registrar Nuevo Usuario"}</h2>
          <button
            className="close-button"
            onClick={handleClose}
            aria-label="Cerrar modal"
          >
            <CircleX />
          </button>
        </header>

        <div className="module-body">
          <div className="row-two">
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={isSubmitting}
                className={errors.name ? "input-error" : ""}
              />
              {errors.name && <div className="error-text">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                disabled={isSubmitting}
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && <div className="error-text">{errors.email}</div>}
            </div>
          </div>


          <div className="row-two" style={{ marginTop: 8 }}>
            <div className="form-group">
              <label htmlFor="password">Contraseña {userToEdit ? "(dejar vacío para mantener)" : ""}</label>
              <div className="password-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={errors.password ? "input-error" : ""}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <div className="error-text">{errors.password}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <div className="password-wrapper">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={errors.confirmPassword ? "input-error" : ""}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  aria-label={showConfirmPassword ? "Ocultar confirmar contraseña" : "Mostrar confirmar contraseña"}
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <div className="error-text">{errors.confirmPassword}</div>}
            </div> 
          </div>

          <div className="row-two" style={{ marginTop: 8 }}>
            <div className="form-group">
              <label htmlFor="roleId">Rol</label>
              <select
                id="roleId"
                name="roleId"
                value={form.roleId ?? ""}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="">— Seleccionar Rol —</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Estado</label>
              <div>
                <label className="switch">
                  <input
                    type="checkbox"
                    name="status"
                    checked={!!form.status}
                    onChange={handleChange}
                  />
                  <span className="slider" />
                </label>
              </div>
            </div>
          </div>
          {errors.submit && <div className="error-text submit-error">{errors.submit}</div>}

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleClose} disabled={isSubmitting}>
              Cancelar
            </button>
            <button type="button" className="btn-submit" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : userToEdit ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
