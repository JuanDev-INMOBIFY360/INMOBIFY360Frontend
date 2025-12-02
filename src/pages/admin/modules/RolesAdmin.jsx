import React, { useEffect, useState } from 'react';
import { getRoles, createRole, updateRole, deleteRole } from '../../../services/RolesService';
import Modal from '../../../components/Modal';
import { Edit, Trash2, Plus } from 'lucide-react';

export default function RolesAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', permissionNames: [] });

  const load = async () => {
    setLoading(true);
    try {
      const rolesData = await getRoles();
      setItems(rolesData || []);
      setError(null);
    } catch (err) {
      console.error('Error loading roles:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onOpenModal = (item = null) => {
    if (item) {
      setEditingId(item.id);
      // Extraer nombres de permisos del objeto
      const permNames = (item.permissions || []).map(p => p.name || p);
      setFormData({ name: item.name, permissionNames: permNames });
    } else {
      setEditingId(null);
      setFormData({ name: '', permissionNames: [] });
    }
    setIsModalOpen(true);
  };

  const handlePermissionToggle = (permName) => {
    setFormData((prev) => {
      const perms = prev.permissionNames || [];
      const isSelected = perms.includes(permName);
      return {
        ...prev,
        permissionNames: isSelected 
          ? perms.filter(p => p !== permName) 
          : [...perms, permName]
      };
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        permissions: formData.permissionNames
      };
      if (editingId) {
        await updateRole(editingId, payload);
      } else {
        await createRole(payload);
      }
      await load();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error submitting role', err);
      setError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm('¿Eliminar rol?')) return;
    try {
      await deleteRole(id);
      await load();
    } catch (err) {
      console.error('Error deleting role', err);
      setError(err);
    }
  };

  // Permisos predefinidos basados en entidades principales
  const availablePermissions = [
    'property',
    'user',
    'owner',
    'role',
    'country',
    'city',
    'department',
    'neighborhood',
    'typeProperty'
  ];

  return (
    <section className="admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>Roles</h2>
        <button className="btn" onClick={() => onOpenModal()}>
          <Plus size={16} style={{ marginRight: 6 }} /> Crear Rol
        </button>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-danger">Error al cargar roles</p>}
      {!loading && !error && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Permisos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items && items.length ? (
              items.map((it) => {
                const permCount = (it.permissions || []).length;
                return (
                  <tr key={it.id}>
                    <td>{it.id}</td>
                    <td>{it.name}</td>
                    <td>{permCount > 0 ? `${permCount} permiso(s)` : 'Sin permisos'}</td>
                    <td style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-sm" onClick={() => onOpenModal(it)}><Edit size={14} /></button>
                      <button className="btn btn-sm btn-danger" onClick={() => onDelete(it.id)}><Trash2 size={14} /></button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4}>No hay roles</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <Modal isOpen={isModalOpen} title={editingId ? 'Editar Rol' : 'Crear Rol'} onClose={() => setIsModalOpen(false)} onSubmit={onSubmit} isLoading={isSubmitting}>
        <div className="form-group">
          <label>Nombre del Rol</label>
          <input 
            type="text"
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            placeholder="Ej: Administrador"
            required 
          />
        </div>

        <div className="form-group">
          <label>Permisos</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 200, overflowY: 'auto' }}>
            {availablePermissions.map((permName) => {
              const isSelected = (formData.permissionNames || []).includes(permName);
              return (
                <div key={permName} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    id={`perm-${permName}`}
                    checked={isSelected}
                    onChange={() => handlePermissionToggle(permName)}
                  />
                  <label htmlFor={`perm-${permName}`} style={{ margin: 0, cursor: 'pointer', flex: 1 }}>
                    {permName}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </section>
  );
}
