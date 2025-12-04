import { useState, useEffect } from 'react';
import { getCities, createCity, updateCity, deleteCity } from '../../../../services/CitiesService';
import CitiesTable from './CitiesTable';
import CitiesForm from './CitiesForm';
import './styles/cities.css';

export default function CitiesModule() {
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
      const data = await getCities();
      setItems(data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error cargando ciudades');
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
        await updateCity(editingItem.id, formData);
      } else {
        await createCity(formData);
      }
      await loadData();
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Error guardando ciudad');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de que desea eliminar esta ciudad?')) {
      return;
    }
    try {
      await deleteCity(id);
      await loadData();
    } catch (err) {
      setError(err.message || 'Error eliminando ciudad');
    }
  };

  return (
    <section className="cities-module">
      <div className="cities-header">
        <h2>Ciudades</h2>
        <button className="btn btn--primary" onClick={() => handleOpenModal()}>
          + Crear Ciudad
        </button>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <CitiesTable items={items} loading={loading} onEdit={handleOpenModal} onDelete={handleDelete} />

      {isModalOpen && (
        <CitiesForm item={editingItem} onSave={handleSave} onClose={handleCloseModal} isSubmitting={isSubmitting} />
      )}
    </section>
  );
}
