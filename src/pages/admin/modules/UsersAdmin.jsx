import React, { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../../../services/UsersService';
import { getRoles } from '../../../services/RolesService';
import Modal from '../../../components/Modal';
import { Edit, Trash2, Plus } from 'lucide-react';

export default function UsersAdmin() {
  const [items, setItems] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', roleId: '' });

  const load = async () => {
    setLoading(true);
    try {
      const [usersData, rolesData] = await Promise.all([getUsers(), getRoles()]);
      setItems(usersData || []);
      setRoles(rolesData || []);
      setError(null);
    } catch (err) {
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
      setFormData({ name: item.name, email: item.email, password: '', roleId: item.roleId || '' });
    } else {
      setEditingId(null);
      setFormData({ name: '', email: '', password: '', roleId: '' });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        const payload = { name: formData.name, email: formData.email, roleId: formData.roleId };
        if (formData.password) payload.password = formData.password;
        await updateUser(editingId, payload);
      } else {
        await createUser({ ...formData, roleId: formData.roleId || null });
      }
      await load();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error submitting user', err);
      setError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm('¿Eliminar usuario?')) return;
    try {
      await deleteUser(id);
      await load();
    } catch (err) {
      console.error('Error deleting user', err);
      setError(err);
    }
  };

  return (
    <section className="admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>Usuarios</h2>
        <button className="btn" onClick={() => onOpenModal()}>
          <Plus size={16} style={{ marginRight: 6 }} /> Crear Usuario
        </button>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-danger">Error al cargar usuarios</p>}
      {!loading && !error && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items && items.length ? (
              items.map((it) => (
                <tr key={it.id}>
                  <td>{it.id}</td>
                  <td>{it.name}</td>
                  <td>{it.email}</td>
                  <td>{roles.find(r => r.id === it.roleId)?.name || '-'}</td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-sm" onClick={() => onOpenModal(it)}><Edit size={14} /></button>
                    <button className="btn btn-sm btn-danger" onClick={() => onDelete(it.id)}><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No hay usuarios</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <Modal isOpen={isModalOpen} title={editingId ? 'Editar Usuario' : 'Crear Usuario'} onClose={() => setIsModalOpen(false)} onSubmit={onSubmit} isLoading={isSubmitting}>
        <div className="form-group">
          <label>Nombre</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Contraseña {editingId && '(dejar vacío para no cambiar)'}</label>
          <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="••••••••" />
        </div>
        <div className="form-group">
          <label>Rol</label>
          <select value={formData.roleId} onChange={(e) => setFormData({...formData, roleId: e.target.value})}>
            <option value="">Seleccionar rol</option>
            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
      </Modal>
    </section>
  );
}
