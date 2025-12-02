import React, { useEffect, useState } from 'react';
import { getTypes, createType, updateType, deleteType } from '../../../services/TypesService';
import Modal from '../../../components/Modal';
import { Edit, Trash2, Plus } from 'lucide-react';

export default function TypesAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '' });

  const load = async () => {
    setLoading(true);
    try {
      const data = await getTypes();
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
      setFormData({ name: item.name });
    } else {
      setEditingId(null);
      setFormData({ name: '' });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateType(editingId, formData);
      } else {
        await createType(formData);
      }
      await load();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error submitting type', err);
      setError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm('¿Eliminar tipo?')) return;
    try {
      await deleteType(id);
      await load();
    } catch (err) {
      console.error('Error deleting type', err);
      setError(err);
    }
  };

  return (
    <section className="admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>Tipos de Propiedad</h2>
        <button className="btn" onClick={() => onOpenModal()}>
          <Plus size={16} style={{ marginRight: 6 }} /> Crear Tipo
        </button>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-danger">Error al cargar tipos</p>}
      {!loading && !error && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items && items.length ? (
              items.map((it) => (
                <tr key={it.id}>
                  <td>{it.id}</td>
                  <td>{it.name}</td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-sm" onClick={() => onOpenModal(it)}><Edit size={14} /></button>
                    <button className="btn btn-sm btn-danger" onClick={() => onDelete(it.id)}><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>No hay tipos</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <Modal isOpen={isModalOpen} title={editingId ? 'Editar Tipo' : 'Crear Tipo'} onClose={() => setIsModalOpen(false)} onSubmit={onSubmit} isLoading={isSubmitting}>
        <div className="form-group">
          <label>Nombre del Tipo</label>
          <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        </div>
      </Modal>
    </section>
  );
}
