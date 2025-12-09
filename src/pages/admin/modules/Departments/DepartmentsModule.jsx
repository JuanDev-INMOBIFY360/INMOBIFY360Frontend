import { useState, useEffect } from 'react';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../../../../services/DepartamentsService';
import { getCountries } from '../../../../services/CountriesService';
import { useModal } from '../../../../hooks/useModal';
import { usePagination } from '../../../../hooks/usePagination';
import TablesModule from '../../../../components/TablesModule/';
import Pagination from '../../../../components/Pagination';
import DepartmentsForm from './DepartmentsForm';
import { departmentsConfig } from './config';
import ErrorMessage from '../../../../components/ErrorMessage';
import LoadingSpinner from '../../../../components/Loading';
import './styles/departments.css';

export default function DepartmentsModule() {
  const { isOpen, onOpen, onClose } = useModal();
  const [items, setItems] = useState([]);
  const [countries, setCountries] = useState([]);
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
      const [departmentsData, countriesData] = await Promise.all([
        getDepartments(),
        getCountries()
      ]);
      setItems(departmentsData || []);
      setCountries(countriesData || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error cargando departamentos');
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
        await updateDepartment(editingItem.id, formData);
      } else {
        await createDepartment(formData);
      }
      await loadData();
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Error guardando departamento');
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este departamento?')) {
      return;
    }
    try {
      await deleteDepartment(id);
      await loadData();
    } catch (err) {
      setError(err.message || 'Error eliminando departamento');
      console.error('Error:', err);
    }
  };

  return (
    <section className="departments-module">
      <div className="departments-header">
        <h2>{departmentsConfig.moduleNamePlural}</h2>
        <button className="btn btn--primary" onClick={() => handleOpenModal()}>
          + Crear {departmentsConfig.moduleName}
        </button>
      </div>

      {error && <ErrorMessage message={error} />}
      {loading && !items.length && <LoadingSpinner />}

      {!loading && (
        <>
          <TablesModule
            data={paginatedItems}
            columns={departmentsConfig.columns.map(col => (
              col.key === 'country' 
                ? {
                    ...col,
                    render: (row) => row.country?.name || '-'
                  }
                : col
            ))}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
            loading={loading}
            emptyMessage={departmentsConfig.messages.empty}
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
        <DepartmentsForm
          item={editingItem}
          onSave={handleSave}
          onClose={handleCloseModal}
          isSubmitting={isSubmitting}
          countries={countries}
        />
      )}
    </section>
  );
}
