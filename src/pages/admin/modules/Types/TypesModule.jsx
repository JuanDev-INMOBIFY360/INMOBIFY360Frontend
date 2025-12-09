import { useState, useEffect } from 'react';
import { getTypes, createType, updateType, deleteType } from '../../../../services/TypesService';
import { useModal } from '../../../../hooks/useModal';
import TablesModule from '../../../../components/TablesModule/';
import TypesForm from './TypesForm';
import { typesConfig } from './config';
import ErrorMessage from '../../../../components/ErrorMessage';
import LoadingSpinner from '../../../../components/Loading';
import './styles/types.css';

export default function TypesModule() {
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
        <h2>{typesConfig.moduleNamePlural}</h2>
        <button className="btn btn--primary" onClick={() => handleOpenModal()}>
          + Crear {typesConfig.moduleName}
        </button>
      </div>

      {error && <ErrorMessage message={error} />}
      {loading && !items.length && <LoadingSpinner />}

      {!loading && (
        <TablesModule
          data={items}
          columns={typesConfig.columns}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          loading={loading}
          emptyMessage={typesConfig.messages.empty}
        />
      )}

      {isOpen && (
        <TypesForm 
          item={editingItem} 
          onSave={handleSave} 
          onClose={handleCloseModal} 
          isSubmitting={isSubmitting} 
        />
      )}
    </section>
  );
}
