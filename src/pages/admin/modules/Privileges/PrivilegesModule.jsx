import { useState, useEffect } from 'react';
import { getPrivileges, createPrivilege, updatePrivilege, deletePrivilege } from '../../../../services/PrivilegesService';
import { useModal } from '../../../../hooks/useModal';
import TablesModule from '../../../../components/TablesModule/';
import PrivilegesForm from './PrivilegesForm';
import { privilegesConfig } from './config';
import ErrorMessage from '../../../../components/ErrorMessage';
import LoadingSpinner from '../../../../components/Loading';
import './styles/privileges.css';

export default function PrivilegesModule() {
  const { isOpen, onOpen, onClose } = useModal();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        <h2>{privilegesConfig.moduleNamePlural}</h2>
        <button className="btn btn--primary" onClick={() => handleOpenModal()}>
          + Crear {privilegesConfig.moduleName}
        </button>
      </div>

      {error && <ErrorMessage message={error} />}
      {loading && !items.length && <LoadingSpinner />}

      {!loading && (
        <TablesModule
          data={items}
          columns={privilegesConfig.columns}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          loading={loading}
          emptyMessage={privilegesConfig.messages.empty}
        />
      )}

      {isOpen && (
        <PrivilegesForm 
          item={editingItem} 
          onSave={handleSave} 
          onClose={handleCloseModal} 
          isSubmitting={isSubmitting} 
        />
      )}
    </section>
  );
}
