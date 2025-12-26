import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Save,
  Eye,
  Plus,
  SquarePen,
  Trash,
  CheckCircle2,
} from "lucide-react";
import { getPermissions } from "../../../../services/permissionsService";
import { getPrivileges } from "../../../../services/privilegesService";
import { createRole, updateRole, getRole } from "../../../../services/RolesService";
import "./Roles.css";

export default function RoleFormModal({ isOpen, onClose, roleToEdit = null, onSaved = null }) {
  const [formData, setFormData] = useState({ id: null, name: "", description: "" });
  const [permissions, setPermissions] = useState([]);
  const [privileges, setPrivileges] = useState([]);
  const [selected, setSelected] = useState({}); // { permissionId: { ACTION: true } }
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Ordered CRUD actions
  const ACTION_ORDER = ["CREATE", "READ", "UPDATE", "DELETE"];
  const ACTION_LABELS = { CREATE: "Crear", READ: "Ver", UPDATE: "Editar", DELETE: "Eliminar" };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [perms, privs] = await Promise.all([getPermissions(), getPrivileges()]);
      setPermissions(perms || []);

      // Filter and order privileges to standard CRUD
      const uniqActions = Array.from(new Set((privs || []).map((p) => p.action))).filter((a) => ACTION_ORDER.includes(a));
      uniqActions.sort((a, b) => ACTION_ORDER.indexOf(a) - ACTION_ORDER.indexOf(b));
      const mapped = uniqActions.map((a) => ({ id: a, action: a, label: ACTION_LABELS[a] || a }));

      // Ensure fallback to CRUD if empty
      setPrivileges(mapped.length ? mapped : ACTION_ORDER.map((a) => ({ id: a, action: a, label: ACTION_LABELS[a] })));
    } catch (err) {
      console.error("Error fetching permissions/privileges:", err);
      setPermissions([]);
      setPrivileges(ACTION_ORDER.map((a) => ({ id: a, action: a, label: ACTION_LABELS[a] })));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) fetchData();
  }, [isOpen, fetchData]);

  useEffect(() => {
    if (roleToEdit) loadRole(roleToEdit.id);
    else reset();
  }, [roleToEdit]);

  const loadRole = async (id) => {
    setLoading(true);
    try {
      const role = await getRole(id);
      setFormData({ id: role.id, name: role.name || "", description: role.description || "" });

      // Normalize role.permissions to selected map
      const next = {};
      (role.permissions || []).forEach((perm) => {
        next[perm.id] = {};
        (perm.privileges || []).forEach((p) => {
          next[perm.id][p.action] = true;
        });
      });
      setSelected(next);
    } catch (err) {
      console.error("Error loading role:", err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFormData({ id: null, name: "", description: "" });
    setSelected({});
    setErrors({});
  };

  const onChangeField = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const toggleCell = (permissionId, action) => {
    setSelected((prev) => ({
      ...prev,
      [permissionId]: { ...(prev[permissionId] || {}), [action]: !prev[permissionId]?.[action] },
    }));
  };

  const toggleRowAll = (permissionId) => {
    const all = privileges.every((p) => selected[permissionId]?.[p.id]);
    setSelected((prev) => ({ ...prev, [permissionId]: Object.fromEntries(privileges.map((p) => [p.id, !all])) }));
  };

  const toggleColAll = (action) => {
    const all = permissions.every((perm) => selected[perm.id]?.[action]);
    setSelected((prev) => {
      const next = { ...prev };
      permissions.forEach((perm) => {
        next[perm.id] = { ...(next[perm.id] || {}) };
        next[perm.id][action] = !all;
      });
      return next;
    });
  };

  const isColAll = (action) => permissions.length > 0 && permissions.every((perm) => selected[perm.id]?.[action]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Nombre del rol es obligatorio";

    const hasAny = Object.values(selected).some((m) => Object.values(m).some(Boolean));
    if (!hasAny) errs.permissions = "Debe seleccionar al menos un permiso";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = async (e) => {
    e?.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = { name: formData.name.trim(), description: formData.description.trim(), permissions: selected };
      if (formData.id) await updateRole(formData.id, payload);
      else await createRole(payload);

      if (onSaved) onSaved();
      onClose();
      reset();
    } catch (err) {
      console.error('Error saving role', err);
      alert('Error al guardar el rol');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      reset();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-container" onClick={handleClose} role="dialog" aria-modal="true" aria-label={formData.id ? 'Editar rol' : 'Crear rol'}>
      <div className="module-container" onClick={(e) => e.stopPropagation()}>
        <form className="roles-form" onSubmit={submit} noValidate>
          <header className="roles-header">
            <div className="roles-title">
              <div className="roles-icon" aria-hidden>
                <CheckCircle2 size={28} />
              </div>
              <div>
                <h2>{formData.id ? 'Editar Rol' : 'Crear Nuevo Rol'}</h2>
                <p className="roles-sub">Define qué puede hacer este rol en cada módulo</p>
              </div>
            </div>
            <div className="roles-actions">
              <button type="button" className="icon-btn" onClick={handleClose} aria-label="Cerrar">
                <X />
              </button>
            </div>
          </header>

          <div className="roles-body">
            <section className="roles-info">
              <label className="field">
                <div className="field-label">Nombre <span className="required">*</span></div>
                <input name="name" value={formData.name} onChange={onChangeField} className={`form-input ${errors.name ? 'input-error' : ''}`} placeholder="Ej: Administrador" disabled={loading} />
                {errors.name && <div className="field-error">{errors.name}</div>}
              </label>

              <label className="field">
                <div className="field-label">Descripción</div>
                <textarea name="description" value={formData.description} onChange={onChangeField} className="form-textarea" rows={3} placeholder="Breve descripción" disabled={loading} />
              </label>
            </section>

            <section className="roles-perms">
              <div className="perms-header">
                <h3>Permisos y privilegios</h3>
                <div className="perms-note">Selecciona por celda, por fila (Todos) o por columna</div>
              </div>

              {errors.permissions && <div className="field-error">{errors.permissions}</div>}

              <div className="permissions-table-wrapper">
                <table className="permissions-table" role="table" aria-label="Matriz de permisos">
                  <thead>
                    <tr>
                      <th className="col-module">Módulo</th>
                      {privileges.map((p) => (
                        <th key={p.id} className="col-action">
                          <div className="col-head">
                            <div className="col-label">{p.label}</div>
                            <div className="col-icon" aria-hidden>
                              {p.action === 'READ' && <Eye size={16} />}
                              {p.action === 'CREATE' && <Plus size={16} />}
                              {p.action === 'UPDATE' && <SquarePen size={16} />}
                              {p.action === 'DELETE' && <Trash size={16} />}
                            </div>
                            <label className="header-switch">
                              <input type="checkbox" checked={isColAll(p.id)} onChange={() => toggleColAll(p.id)} aria-label={`Seleccionar todos ${p.label}`} />
                              <span className="slider" />
                            </label>
                          </div>
                        </th>
                      ))}

                      <th className="col-all">Todos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((perm) => (
                      <tr key={perm.id}>
                        <td className="mod-name">{perm.displayName || perm.name}</td>
                        {privileges.map((p) => (
                          <td key={p.id} className="cell-check">
                            <label className="switch">
                              <input type="checkbox" checked={!!selected[perm.id]?.[p.id]} onChange={() => toggleCell(perm.id, p.id)} aria-label={`${perm.name} - ${p.label}`} />
                              <span className="slider" />
                            </label>
                          </td>
                        ))}

                        <td className="cell-check">
                          <label className="switch">
                            <input type="checkbox" checked={privileges.every((p) => selected[perm.id]?.[p.id])} onChange={() => toggleRowAll(perm.id)} aria-label={`Todos los privilegios de ${perm.name}`} />
                            <span className="slider" />
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <footer className="roles-footer">
            <button type="button" className="btn btn-ghost" onClick={handleClose} disabled={loading}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Guardando...' : (<><Save size={16} /> {formData.id ? 'Actualizar rol' : 'Crear rol'}</>)}</button>
          </footer>
        </form>
      </div>
    </div>
  );
}
