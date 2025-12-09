import { useState, useEffect } from 'react';
import { getNeighborhoods, createNeighborhood, updateNeighborhood, deleteNeighborhood } from '../../../../services/NeighborhoodsService';
import { getCities } from '../../../../services/CitiesService';
import { useModal } from '../../../../hooks/useModal';
import { usePagination } from '../../../../hooks/usePagination';
import TablesModule from '../../../../components/TablesModule/';
import Pagination from '../../../../components/Pagination';
import NeighborhoodsForm from './NeighborhoodsForm';
import { neighborhoodsConfig } from './config';
import ErrorMessage from '../../../../components/ErrorMessage';
import LoadingSpinner from '../../../../components/Loading';
import './styles/neighborhoods.css';

export default function NeighborhoodsModule() {
  const { isOpen, onOpen, onClose } = useModal();
  const [items, setItems] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pagination = usePagination(items, 10);
  const paginatedItems = pagination.paginatedItems;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [neighborhoodsData, citiesData] = await Promise.all([
        getNeighborhoods(),
        getCities()
      ]);
      setItems(neighborhoodsData || []);
      setCities(citiesData || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error cargando barrios');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    onOpen();
  };

  const handleCloseModal = () => {
    onClose();
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
        <h2>{neighborhoodsConfig.moduleNamePlural}</h2>
        <button className="btn btn--primary" onClick={() => handleOpenModal()}>
          + Crear {neighborhoodsConfig.moduleName}
        </button>
      </div>

      {error && <ErrorMessage message={error} />}
      {loading && !items.length && <LoadingSpinner />}

      {!loading && (
        <TablesModule
          data={items}
          columns={neighborhoodsConfig.columns.map(col => (
            col.key === 'city' 
              ? {
                  ...col,
                  render: (row) => row.city?.name || '-'
                }
              : col
          ))}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          loading={loading}
          emptyMessage={neighborhoodsConfig.messages.empty}
        />
      )}

      {isOpen && (
        <NeighborhoodsForm 
          item={editingItem} 
          onSave={handleSave} 
          onClose={handleCloseModal} 
          isSubmitting={isSubmitting}
          cities={cities}
        />
      )}
    </section>
  );
}
