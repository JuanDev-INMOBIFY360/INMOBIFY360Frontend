import React, { useEffect, useState } from 'react';
import { getOwners, createOwner, updateOwner, deleteOwner } from '../../../services/OwnersService';
import Modal from '../../../components/Modal';
import { Edit, Trash2, Plus } from 'lucide-react';

export default function OwnersAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', document: '' });

  const load = async () => {
    setLoading(true);
    try {
      const data = await getOwners();
      setItems(data || []);
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
      setFormData({ name: item.name, email: item.email, phone: item.phone || '', document: item.document || '' });
    } else {
      setEditingId(null);
      setFormData({ name: '', email: '', phone: '', document: '' });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateOwner(editingId, formData);
      } else {
        await createOwner(formData);
      }
      await load();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error submitting owner', err);
      setError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm('¿Eliminar propietario?')) return;
    try {
      await deleteOwner(id);
      await load();
    } catch (err) {
      console.error('Error deleting owner', err);
      setError(err);
    }
  };

  return (
    <section className="admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>Propietarios</h2>
        <button className="btn" onClick={() => onOpenModal()}>
          <Plus size={16} style={{ marginRight: 6 }} /> Crear Propietario
        </button>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-danger">Error al cargar propietarios</p>}
      {!loading && !error && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
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
                  <td>{it.phone || '-'}</td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-sm" onClick={() => onOpenModal(it)}><Edit size={14} /></button>
                    <button className="btn btn-sm btn-danger" onClick={() => onDelete(it.id)}><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No hay propietarios</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <Modal isOpen={isModalOpen} title={editingId ? 'Editar Propietario' : 'Crear Propietario'} onClose={() => setIsModalOpen(false)} onSubmit={onSubmit} isLoading={isSubmitting}>
        <div className="form-group">
          <label>Nombre</label>
          <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Teléfono</label>
          <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Documento</label>
          <input value={formData.document} onChange={(e) => setFormData({...formData, document: e.target.value})} />
        </div>
      </Modal>
    </section>
  );
}
