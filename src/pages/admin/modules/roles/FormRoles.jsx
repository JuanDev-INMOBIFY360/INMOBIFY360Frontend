import React, { useEffect, useState } from "react";
import { getRole} from "../../../../services/RolesService";
import { getPermissions } from "../../../../services/permissionsService";
import { getPrivileges } from "../../../../services/privilegesService";
import "../../GlobalStyles/globalStyles.css";

export default function FormRoles({ isOpen, onClose, roleToEdit, onSave }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [selectedSet, setSelectedSet] = useState(new Set());
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const perms = await getPermissions();
      const privs = await getPrivileges();

      // keep only CRUD actions and map privileges into permission
      const allowedActions = ["CREATE", "READ", "UPDATE", "DELETE"];
      const merged = perms.map((p) => ({
        ...p,
        privileges: privs
          .filter((pr) => pr.permissionId === p.id && allowedActions.includes(pr.action))
          .sort((a,b)=> a.action.localeCompare(b.action)),
      }));

      
      setPermissions(merged);
    };

    loadData();
  }, []);

  useEffect(() => {
    // open/close lifecycle
    if (!isOpen) {
      resetForm();
      return;
    }

    if (roleToEdit && roleToEdit.id) {
      // fetch full role details to get assigned privileges
      (async () => {
        try {
          const role = await getRole(roleToEdit.id);
          setName(role.name || "");
          setDescription(role.description || "");

          const selected = new Set();
          // role.rolePermissions -> each has privileges (rolePermissionPrivileges -> privilege)
          if (role.rolePermissions) {
            role.rolePermissions.forEach((rp) => {
              if (rp.privileges) {
                rp.privileges.forEach((rpp) => {
                  if (rpp.privilege && rpp.privilege.id) selected.add(rpp.privilege.id);
                  // some backends may return privilegeId directly
                  if (rpp.privilegeId) selected.add(rpp.privilegeId);
                  if (rpp.privilege && rpp.privilege.id === undefined && rpp.privilegeId) selected.add(rpp.privilegeId);
                });
              }
            });
          }

          // older API shapes might return privileges array directly
          if (role.privileges && Array.isArray(role.privileges)) {
            role.privileges.forEach((p) => selected.add(p.id));
          }

          setSelectedSet(selected);
        } catch (error) {
          console.error("Error fetching role details", error);
        }
      })();
    } else {
      // new role
      setName("");
      setDescription("");
      setSelectedSet(new Set());
    }
  }, [isOpen, roleToEdit]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setSelectedSet(new Set());
    setErrors({});
    setIsSubmitting(false);
  };

  const togglePrivilege = (privId) => {
    setSelectedSet((prev) => {
      const next = new Set(prev);
      if (next.has(privId)) next.delete(privId);
      else next.add(privId);
      return next;
    });
  };

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "El nombre del rol es requerido";
    if (selectedSet.size === 0) e.privileges = "Selecciona al menos un permiso";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
  if (!validate()) return;
  setIsSubmitting(true);

  const payload = {
    name: name.trim(),
    description: description.trim(),
    privileges: Array.from(selectedSet), // 👈 SOLO IDS
  };

  try {
    await onSave(roleToEdit ? roleToEdit.id : null, payload);
    onClose();
    resetForm();
  } catch (err) {
    console.error("Error saving role", err);
    setErrors({ submit: "Error al guardar el rol" });
  } finally {
    setIsSubmitting(false);
  }
};


  if (!isOpen) return null;

  const actions = ["CREATE", "READ", "UPDATE", "DELETE"];

  return (
    <div className="modal-container" onClick={onClose}>
      <div className="module-container" onClick={(e) => e.stopPropagation()}>
        <header className="module-header">
          <h2>{roleToEdit ? "Editar Rol" : "Crear Nuevo Rol"}</h2>
          <button className="close-button" onClick={onClose} aria-label="Cerrar modal">×</button>
        </header>

        <div className="module-body">
          <div className="form-group">
            <label htmlFor="role-name">Nombre</label>
            <input
              id="role-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="role-desc">Descripción</label>
            <textarea
              id="role-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              rows={3}
            />
          </div>

          <div style={{ marginTop: 8 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Permisos (CRUD)</label>

            <div className="table-wrapper">
              <table className="table-module">
                <thead>
                  <tr>
                    <th>Permiso</th>
                    {actions.map((a) => (
                      <th key={a}>{a.toLowerCase()}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {permissions.length === 0 ? (
                    <tr>
                      <td colSpan={1 + actions.length} className="no-data-module">No hay permisos</td>
                    </tr>
                  ) : (
                    permissions.map((perm) => (
                      <tr key={perm.id}>
                        <td>{perm.displayName}</td>
                        {actions.map((a) => {
                          const priv = perm.privileges.find((p) => p.action === a);
                          return (
                            <td key={a} style={{ textAlign: 'center' }}>
                              {priv ? (
                                <input
                                  type="checkbox"
                                  checked={selectedSet.has(priv.id)}
                                  onChange={() => togglePrivilege(priv.id)}
                                  disabled={isSubmitting}
                                  aria-label={`${perm.displayName} ${a}`}
                                />
                              ) : (
                                <span style={{ color: '#9ca3af' }}>—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {errors.privileges && <div className="error-text" style={{ marginTop: 8 }}>{errors.privileges}</div>}
          </div>

          {errors.submit && <div className="error-text submit-error">{errors.submit}</div>}

          <div className="form-actions" style={{ marginTop: 12 }}>
            <button type="button" className="btn-cancel" onClick={onClose} disabled={isSubmitting}>Cancelar</button>
            <button type="button" className="btn-submit" onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : (roleToEdit ? 'Actualizar' : 'Guardar')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

