import { useState, useEffect } from 'react';
import { getTypes, createType, updateType, deleteType } from '../../../../services/TypesService';
import { IoCreate, IoTrash, IoSearch } from 'react-icons/io5';
import TypesForm from './TypesForm';
import { typesConfig } from './config';
import ErrorMessage from '../../../../components/ErrorMessage';
import LoadingSpinner from '../../../../components/Loading';
import './styles/types.css';

export default function TypesModule() {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const filtered = items.filter(i =>
      i.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (i.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, items]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

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

        <div className="types-controls">
          <div className="search-wrapper-types">
            <IoSearch className="search-icon" />
            <input
              type="text"
              placeholder={`Buscar ${typesConfig.moduleNamePlural.toLowerCase()}...`}
              className="search-input-types"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <button className="btn btn--primary" onClick={() => handleOpenModal()}>
            + Crear {typesConfig.moduleName}
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}
      {loading && !items.length && <LoadingSpinner />}

      {!loading && (
        <div className="types-table-container">
          <table className="types-table">
            <thead>
              <tr>
                {typesConfig.columns.map(c => (
                  <th key={c.key}>{c.title}</th>
                ))}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={typesConfig.columns.length + 1} className="no-data">{typesConfig.messages.empty}</td>
                </tr>
              ) : (
                filteredItems.map(item => (
                  <tr key={item.id}>
                    {typesConfig.columns.map(col => (
                      <td key={col.key}>{col.render ? col.render(item) : (item[col.key] ?? '')}</td>
                    ))}
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn action-btn--edit" title="Editar" onClick={() => handleOpenModal(item)}>
                          <IoCreate className="action-icon" />
                        </button>
                        <button className="action-btn action-btn--delete" title="Eliminar" onClick={() => handleDelete(item.id)}>
                          <IoTrash className="action-icon" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
