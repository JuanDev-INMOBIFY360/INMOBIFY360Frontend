import { useState, useEffect } from 'react';
import { getOwners, createOwner, updateOwner, deleteOwner } from '../../../../services/OwnersService';
import OwnersTable from './OwnersTable';
import OwnersForm from './OwnersForm';
import './styles/owners.css';

export default function OwnersModule() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getOwners();
      setItems(data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error cargando propietarios');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSave = async (formData) => {
    try {
      setIsSubmitting(true);
      if (editingItem) {
        await updateOwner(editingItem.id, formData);
      } else {
        await createOwner(formData);
      }
      await loadData();
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Error guardando propietario');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este propietario?')) {
      return;
    }
    try {
      await deleteOwner(id);
      await loadData();
    } catch (err) {
      setError(err.message || 'Error eliminando propietario');
    }
  };

  return (
    <section className="owners-module">
      <div className="owners-header">
        <h2>Propietarios</h2>
        <button className="btn btn--primary" onClick={() => handleOpenModal()}>
          + Crear Propietario
        </button>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <OwnersTable items={items} loading={loading} onEdit={handleOpenModal} onDelete={handleDelete} />

      {isModalOpen && (
        <OwnersForm item={editingItem} onSave={handleSave} onClose={handleCloseModal} isSubmitting={isSubmitting} />
      )}
    </section>
  );
}
