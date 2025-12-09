import { useState, useEffect } from 'react';
import { getCities, createCity, updateCity, deleteCity } from '../../../../services/CitiesService';
import { getDepartments } from '../../../../services/DepartamentsService';
import { useModal } from '../../../../hooks/useModal';
import { usePagination } from '../../../../hooks/usePagination';
import TablesModule from '../../../../components/TablesModule/';
import Pagination from '../../../../components/Pagination';
import CitiesForm from './CitiesForm';
import { citiesConfig } from './config';
import ErrorMessage from '../../../../components/ErrorMessage';
import LoadingSpinner from '../../../../components/Loading';
import './styles/cities.css';

/**
 * MÓDULO CITIES - Patrón ESTÁNDAR HÍBRIDO MEJORADO
 */
export default function CitiesModule() {
  // ===== STATE =====
  const { isOpen, onOpen, onClose } = useModal();
  const [items, setItems] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pagination = usePagination(items, 10);
  const paginatedItems = pagination.paginatedItems;

  // ===== EFFECTS =====
  useEffect(() => {
    loadData();
  }, []);

  // ===== HANDLERS =====
  const loadData = async () => {
    try {
      setLoading(true);
      const [citiesData, deptsData] = await Promise.all([getCities(), getDepartments()]);
      setItems(citiesData || []);
      setDepartments(deptsData || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error cargando ciudades');
      console.error('❌ Error:', err);
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
        await updateCity(editingItem.id, formData);
      } else {
        await createCity(formData);
      }
      await loadData();
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Error guardando ciudad');
      console.error('❌ Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(citiesConfig.messages.delete)) {
      return;
    }
    try {
      await deleteCity(id);
      await loadData();
    } catch (err) {
      setError(err.message || 'Error eliminando ciudad');
      console.error('❌ Error:', err);
    }
  };

  // Construir columnas con datos de departamentos
  const columnsWithDepts = citiesConfig.columns.map(col => {
    if (col.key === 'departmentId') {
      return {
        ...col,
        render: (row) => {
          const dept = departments.find(d => d.id === row.departmentId);
          return dept ? dept.name : 'N/A';
        }
      };
    }
    return col;
  });

  // ===== RENDER =====
  return (
    <section className="cities-module">
      <div className="cities-header">
        <h2>Ciudades</h2>
        <button className="btn btn--primary" onClick={() => handleOpenModal()}>
          + Crear Ciudad
        </button>
      </div>

      {error && (
        <ErrorMessage
          message="Error en módulo Ciudades"
          details={error}
          onRetry={loadData}
          type="error"
        />
      )}

      {loading && <LoadingSpinner message="Cargando ciudades..." />}

      {!loading && (
        <>
          <TablesModule
            data={paginatedItems}
            columns={columnsWithDepts}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
            loading={loading}
            emptyMessage={`No hay ${citiesConfig.moduleNamePlural.toLowerCase()} registrados`}
          />
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={items.length}
            itemsPerPage={10}
            onPageChange={pagination.handlePageChange}
            isLoading={loading}
          />
        </>
      )}

      {isOpen && (
        <CitiesForm
          item={editingItem}
          departments={departments}
          onSave={handleSave}
          onClose={handleCloseModal}
          isSubmitting={isSubmitting}
        />
      )}
    </section>
  );
}
