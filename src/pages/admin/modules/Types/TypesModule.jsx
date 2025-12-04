import { useState, useEffect } from 'react';
import { getTypes, createType, updateType, deleteType } from '../../../../services/TypesService';
import TypesTable from './TypesTable';
import TypesForm from './TypesForm';
import './styles/types.css';

export default function TypesModule() {
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
      const data = await getTypes();
      setItems(data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error cargando tipos');
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
        await updateType(editingItem.id, formData);
      } else {
        await createType(formData);
      }
      await loadData();
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Error guardando tipo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este tipo?')) {
      return;
    }
    try {
      await deleteType(id);
      await loadData();
    } catch (err) {
      setError(err.message || 'Error eliminando tipo');
    }
  };

  return (
    <section className="types-module">
      <div className="types-header">
        <h2>Tipos de Propiedad</h2>
        <button className="btn btn--primary" onClick={() => handleOpenModal()}>
          + Crear Tipo
        </button>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <TypesTable items={items} loading={loading} onEdit={handleOpenModal} onDelete={handleDelete} />

      {isModalOpen && (
        <TypesForm item={editingItem} onSave={handleSave} onClose={handleCloseModal} isSubmitting={isSubmitting} />
      )}
    </section>
  );
}
