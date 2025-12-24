import React, { useState, useEffect } from "react";
import { X, Save, Eye, Plus, SquarePen, Trash, Repeat } from "lucide-react";
import { getPermissions } from "../../../../services/permissionsService";
import { getPrivileges } from "../../../../services/privilegesService";
import { createRole, updateRole, getRole } from "../../../../services/RolesService";

export default function RoleFormModal({ isOpen, onClose, roleToEdit = null }) {
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: ""
  });
  
  const [permissions, setPermissions] = useState([]);
  const [privileges, setPrivileges] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Cargar permisos y privilegios al montar el componente
  useEffect(() => {
    if (isOpen) {
      fetchPermissionsAndPrivileges();
    }
  }, [isOpen]);

  // Si hay un rol para editar, cargar sus datos
  useEffect(() => {
    if (roleToEdit) {
      loadRoleData();
    } else {
      resetForm();
    }
  }, [roleToEdit]);

  const fetchPermissionsAndPrivileges = async () => {
    try {
      setLoading(true);
      const [permissionsData, privilegesData] = await Promise.all([
        getPermissions(),
        getPrivileges()
      ]);

      // permissionsData: array of Permissions (modules)
      setPermissions(permissionsData);

      // privilegesData: array of Privilege rows (many per permission). We need unique actions for columns.
      // Only include standard CRUD actions in this specific order
      const actionOrder = ['CREATE', 'READ', 'UPDATE', 'DELETE'];
      // Get unique actions from DB, but restrict to allowed CRUD actions
      const uniqActions = Array.from(new Set(privilegesData.map((p) => p.action)))
        .filter((a) => actionOrder.includes(a));
      uniqActions.sort((a, b) => actionOrder.indexOf(a) - actionOrder.indexOf(b));

      const labelMap = {
        READ: 'Ver',
        CREATE: 'Crear',
        UPDATE: 'Editar',
        DELETE: 'Eliminar'
      };

      let mappedPrivileges = uniqActions.map((action) => ({
        id: action,
        action,
        display_name: labelMap[action] || action,
      }));

      // Fallback to default set if there are no privileges in DB
      if (mappedPrivileges.length === 0) {
        mappedPrivileges = actionOrder.map((action) => ({
          id: action,
          action,
          display_name: labelMap[action]
        }));
      }

      setPrivileges(mappedPrivileges);

    } catch (error) {
      console.error("Error fetching permissions/privileges:", error);
      alert("Error al cargar permisos y privilegios");
    } finally {
      setLoading(false);
    }
  };

  const loadRoleData = async () => {
    try {
      setLoading(true);
      const role = await getRole(roleToEdit.id);
      setFormData({
        id: role.id,
        name: role.name || "",
        description: role.description || ""
      });

      // Build selectedPermissions map: { permissionId: { ACTION: true } }
      const next = {};
      (role.permissions || []).forEach((perm) => {
        next[perm.id] = {};
        (perm.privileges || []).forEach((priv) => {
          next[perm.id][priv.action] = true;
        });
      });

      setSelectedPermissions(next);

    } catch (error) {
      console.error("Error loading role data:", error);
      alert("Error al cargar los datos del rol");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setSelectedPermissions({});
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const togglePermission = (permissionId, privilegeId) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [permissionId]: {
        ...prev[permissionId],
        [privilegeId]: !prev[permissionId]?.[privilegeId],
      },
    }));
  };

  const toggleAllPrivileges = (permissionId) => {
    const allSelected = privileges.every(
      (priv) => selectedPermissions[permissionId]?.[priv.id]
    );
    
    setSelectedPermissions((prev) => ({
      ...prev,
      [permissionId]: privileges.reduce(
        (acc, priv) => ({
          ...acc,
          [priv.id]: !allSelected,
        }),
        {}
      ),
    }));
  };

  // Toggle a whole column (privilege) across all permissions
  const togglePrivilegeColumn = (privilegeId) => {
    const allSelected = permissions.every(
      (perm) => selectedPermissions[perm.id]?.[privilegeId]
    );

    setSelectedPermissions((prev) => {
      const next = { ...prev };
      permissions.forEach((perm) => {
        next[perm.id] = { ...(next[perm.id] || {}), [privilegeId]: !allSelected };
      });
      return next;
    });
  };

  const isPrivilegeSelectedForAll = (privilegeId) => {
    if (!permissions || permissions.length === 0) return false;
    return permissions.every((perm) => selectedPermissions[perm.id]?.[privilegeId]);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre del rol es obligatorio";
    }

    // Validar que al menos un permiso esté seleccionado
    const hasPermissions = Object.values(selectedPermissions).some((perms) =>
      Object.values(perms).some((val) => val === true)
    );

    if (!hasPermissions) {
      newErrors.permissions = "Debe seleccionar al menos un permiso";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Preparar datos para enviar
      const roleData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        permissions: selectedPermissions,
      };

      if (roleToEdit) {
        await updateRole(roleToEdit.id, roleData);
        console.log("Actualizando rol:", roleToEdit.id, roleData);
        alert("Rol actualizado exitosamente");
      } else {
        await createRole(roleData);
        console.log("Creando rol:", roleData);
        alert("Rol creado exitosamente");
      }

      onClose();
      resetForm();
      // Aquí podrías llamar a una función para refrescar la tabla
    } catch (error) {
      console.error("Error saving role:", error);
      alert("Error al guardar el rol");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-container" onClick={handleClose}>
      <div className="module-container roles-modal" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <header className="module-header">
            <div className="header-left">
              <div className="header-icon" aria-hidden="true">🛡️</div>
              <h2 className="modal-title">
                {roleToEdit ? "Editar Rol" : "Crear Nuevo Rol"}
              </h2>
            </div>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="close-button"
              aria-label="Cerrar modal"
            >
              <X size={24} />
            </button>
          </header>

          {/* Body */}
          <div className="module-body">
            {/* Información básica */}
            <section className="form-section">
              <div className="form-group">
                <label htmlFor="role-name" className="form-label required">
                  Nombre del Rol
                </label>
                <input
                  id="role-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej: Administrador, Editor, Visualizador"
                  className={`form-input ${errors.name ? "error" : ""}`}
                  disabled={loading}
                  required
                />
                {errors.name && (
                  <span className="error-message">{errors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="role-description" className="form-label">
                  Descripción
                </label>
                <textarea
                  id="role-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe las responsabilidades de este rol..."
                  rows="3"
                  className="form-textarea"
                  disabled={loading}
                />
              </div>
            </section>

            {/* Permisos y Privilegios */}
            <section className="permissions-section">
              <h3 className="section-title">Permisos y Privilegios</h3>
              
              {errors.permissions && (
                <div className="error-message">{errors.permissions}</div>
              )}

              {loading ? (
                <div className="loading-state">Cargando permisos...</div>
              ) : (
                <div className="permissions-table-wrapper">
                  <table className="permissions-table" style={{ minWidth: '720px' }} >
                    <thead>
                      <tr className="permissions-header">
                        <th scope="col">Módulo</th>
                        {privileges.map((priv) => (
                          <th key={priv.id} scope="col">
                            <div className="priv-header">
                              <div className="priv-label"><strong>{priv.display_name}</strong></div>
                              <div className="priv-icon" aria-hidden>
                                {(() => {
                                  switch (priv.action) {
                                    case 'READ':
                                      return <Eye size={18} />;
                                    case 'CREATE':
                                      return <Plus size={18} />;
                                    case 'UPDATE':
                                      return <SquarePen size={18} />;
                                    case 'DELETE':
                                      return <Trash size={18} />;
                                    default:
                                      return null;
                                  }
                                })()}
                              </div>
                              <label className="switch header-switch" title={`Seleccionar todos ${priv.display_name}`}>
                                <input
                                  type="checkbox"
                                  checked={isPrivilegeSelectedForAll(priv.id)}
                                  onChange={() => togglePrivilegeColumn(priv.id)}
                                  aria-label={`Seleccionar todos ${priv.display_name}`}
                                />
                                <span className="slider" />
                              </label>
                            </div>
                          </th>
                        ))}
                        <th scope="col">Todos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {permissions.map((perm) => (
                        <tr key={perm.id}>
                          <td>
                            <strong>{perm.name || perm.display_name}</strong>
                          </td>
                          {privileges.map((priv) => (
                            <td key={priv.id}>
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={
                                    selectedPermissions[perm.id]?.[priv.id] ||
                                    false
                                  }
                                  onChange={() =>
                                    togglePermission(perm.id, priv.id)
                                  }
                                  disabled={loading}
                                  aria-label={`${perm.name || perm.display_name} - ${priv.display_name}`}
                                />
                                <span className="slider" />
                              </label>
                            </td>
                          ))}
                          <td>
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={privileges.every(
                                  (priv) =>
                                    selectedPermissions[perm.id]?.[priv.id]
                                )}
                                onChange={() => toggleAllPrivileges(perm.id)}
                                disabled={loading}
                                aria-label={`Todos los privilegios de ${perm.name || perm.display_name}`}
                              />
                              <span className="slider" />
                            </label>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>

          {/* Footer */}
          <footer className="module-footer">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="btn-cancel"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-submit"
            >
              {loading ? (
                "Guardando..."
              ) : (
                <>
                  <Save size={18} />
                  {roleToEdit ? "Actualizar Rol" : "Crear Rol"}
                </>
              )}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}