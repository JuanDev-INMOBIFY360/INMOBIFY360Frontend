import { useState, useEffect } from 'react';
import { getPrivileges, createPrivilege, updatePrivilege, deletePrivilege } from '../../../services/PrivilegesService';
import PrivilegesTable from './PrivilegesTable';
import PrivilegesForm from './PrivilegesForm';
import './styles/privileges.css';

export default function PrivilegesModule() {
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
      const data = await getPrivileges();
      setItems(data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error cargando privilegios');
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
        await updatePrivilege(editingItem.id, formData);
      } else {
        await createPrivilege(formData);
      }
      await loadData();
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Error guardando privilegio');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este privilegio?')) {
      return;
    }
    try {
      await deletePrivilege(id);
      await loadData();
    } catch (err) {
      setError(err.message || 'Error eliminando privilegio');
    }
  };

  return (
    <section className="privileges-module">
      <div className="privileges-header">
        <h2>Privilegios</h2>
        <button className="btn btn--primary" onClick={() => handleOpenModal()}>
          + Crear Privilegio
        </button>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <PrivilegesTable items={items} loading={loading} onEdit={handleOpenModal} onDelete={handleDelete} />

      {isModalOpen && (
        <PrivilegesForm item={editingItem} onSave={handleSave} onClose={handleCloseModal} isSubmitting={isSubmitting} />
      )}
    </section>
  );
}
