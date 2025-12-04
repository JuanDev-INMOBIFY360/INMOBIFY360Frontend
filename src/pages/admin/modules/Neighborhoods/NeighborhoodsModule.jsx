import { useState, useEffect } from 'react';
import { getNeighborhoods, createNeighborhood, updateNeighborhood, deleteNeighborhood } from '../../../../services/NeighborhoodsService';
import NeighborhoodsTable from './NeighborhoodsTable';
import NeighborhoodsForm from './NeighborhoodsForm';
import './styles/neighborhoods.css';

export default function NeighborhoodsModule() {
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
      const data = await getNeighborhoods();
      setItems(data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error cargando barrios');
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
        await updateNeighborhood(editingItem.id, formData);
      } else {
        await createNeighborhood(formData);
      }
      await loadData();
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Error guardando barrio');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este barrio?')) {
      return;
    }
    try {
      await deleteNeighborhood(id);
      await loadData();
    } catch (err) {
      setError(err.message || 'Error eliminando barrio');
    }
  };

  return (
    <section className="neighborhoods-module">
      <div className="neighborhoods-header">
        <h2>Barrios</h2>
        <button className="btn btn--primary" onClick={() => handleOpenModal()}>
          + Crear Barrio
        </button>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <NeighborhoodsTable items={items} loading={loading} onEdit={handleOpenModal} onDelete={handleDelete} />

      {isModalOpen && (
        <NeighborhoodsForm item={editingItem} onSave={handleSave} onClose={handleCloseModal} isSubmitting={isSubmitting} />
      )}
    </section>
  );
}
