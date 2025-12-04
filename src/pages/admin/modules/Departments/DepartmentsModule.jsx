import { useState, useEffect } from 'react';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../../../../services/DepartamentsService';
import DepartmentsTable from './DepartmentsTable';
import DepartmentsForm from './DepartmentsForm';
import './styles/departments.css';

export default function DepartmentsModule() {
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
      const data = await getDepartments();
      setItems(data || []);
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
        <h2>Departamentos</h2>
        <button className="btn btn--primary" onClick={() => handleOpenModal()}>
          + Crear Departamento
        </button>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <DepartmentsTable
        items={items}
        loading={loading}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
      />

      {isModalOpen && (
        <DepartmentsForm
          item={editingItem}
          onSave={handleSave}
          onClose={handleCloseModal}
          isSubmitting={isSubmitting}
        />
      )}
    </section>
  );
}
