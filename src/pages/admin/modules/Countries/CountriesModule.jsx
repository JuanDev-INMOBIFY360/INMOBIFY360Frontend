import { useState, useEffect } from 'react';
import { getCountries, createCountry, updateCountry, deleteCountry } from '../../../../services/CountriesService';
import CountriesTable from './CountriesTable';
import CountriesForm from './CountriesForm';
import './styles/countries.css';

export default function CountriesModule() {
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
      const data = await getCountries();
      setItems(data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error cargando países');
      console.error('Error:', err);
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
        await updateCountry(editingItem.id, formData);
      } else {
        await createCountry(formData);
      }
      await loadData();
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Error guardando país');
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este país?')) {
      return;
    }
    try {
      await deleteCountry(id);
      await loadData();
    } catch (err) {
      setError(err.message || 'Error eliminando país');
      console.error('Error:', err);
    }
  };

  return (
    <section className="countries-module">
      <div className="countries-header">
        <h2>Países</h2>
        <button className="btn btn--primary" onClick={() => handleOpenModal()}>
          + Crear País
        </button>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <CountriesTable
        items={items}
        loading={loading}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
      />

      {isModalOpen && (
        <CountriesForm
          item={editingItem}
          onSave={handleSave}
          onClose={handleCloseModal}
          isSubmitting={isSubmitting}
        />
      )}
    </section>
  );
}
