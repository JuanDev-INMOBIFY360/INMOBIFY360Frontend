import React, { useEffect, useState } from "react";
import "./styles/owners.css";
import { IoAdd, IoCreate, IoTrash, IoSearch, IoEye } from "react-icons/io5";
import OwnersForm from './OwnersForm';
import {
  getOwners,
  getOwner,
  createOwner,
  updateOwner,
  deleteOwner,
} from "../../../../services/OwnersService";

export default function OwnersModule() {
  const [owners, setOwners] = useState([]);
  const [filteredOwners, setFilteredOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingOwner, setEditingOwner] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        setLoading(true);
        const data = await getOwners();
        setOwners(data || []);
        setFilteredOwners(data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching owners:", err);
        setError(err.message || 'Error cargando propietarios');
      } finally {
        setLoading(false);
      }
    };
    fetchOwners();
  }, []);

  useEffect(() => {
    const filtered = owners.filter(o =>
      o.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOwners(filtered);
  }, [searchTerm, owners]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleOpenModal = (item = null) => {
    setEditingOwner(item);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setEditingOwner(null);
  };

  const handleSave = async (formData) => {
    try {
      setIsSubmitting(true);
      if (editingOwner) {
        await updateOwner(editingOwner.id, formData);
      } else {
        await createOwner(formData);
      }
      // reload
      const data = await getOwners();
      setOwners(data || []);
      setFilteredOwners(data || []);
      handleCloseModal();
    } catch (err) {
      console.error('Error saving owner:', err);
      setError(err.message || 'Error guardando propietario');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Confirma que desea eliminar este propietario?')) return;
    try {
      await deleteOwner(id);
      const data = await getOwners();
      setOwners(data || []);
      setFilteredOwners(data || []);
    } catch (err) {
      console.error('Error deleting owner:', err);
      setError(err.message || 'Error eliminando propietario');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Cargando propietarios...</p>
      </div>
    );
  }

  return (
    <div className="owners-module">
      <header className="owners-header">
        <div>
          <h2>Gestión de Propietarios</h2>
        </div>

        <div className="owners-controls">
          <div className="search-wrapper-owner">
            <IoSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o teléfono..."
              className="search-input-owner"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <button className="btn-add-owner" onClick={() => handleOpenModal()}>
            <IoAdd /> Agregar Propietario
          </button>
        </div>
      </header>

      {error && (
        <div className="alert alert--error">
          <p>{error}</p>
        </div>
      )}

      <div className="owners-table-container">
        <table className="owners-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredOwners.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">
                  {searchTerm ? `No se encontraron propietarios que coincidan con "${searchTerm}"` : 'No hay propietarios disponibles'}
                </td>
              </tr>
            ) : (
              filteredOwners.map((own) => (
                <tr key={own.id}>
                  <td>{own.id}</td>
                  <td><strong>{own.name}</strong></td>
                  <td><code>{own.email}</code></td>
                  <td>{own.phone || '—'}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn action-btn--view" title="Ver" onClick={() => handleOpenModal(own)}>
                        <IoEye className="action-icon" />
                      </button>
                      <button className="action-btn action-btn--edit" title="Editar" onClick={() => handleOpenModal(own)}>
                        <IoCreate className="action-icon" />
                      </button>
                      <button className="action-btn action-btn--delete" title="Eliminar" onClick={() => handleDelete(own.id)}>
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

      {filteredOwners.length > 0 && (
        <div className="owners-footer">
          <p>Mostrando {filteredOwners.length} de {owners.length} propietarios</p>
        </div>
      )}

      {isOpen && (
        <OwnersForm
          item={editingOwner}
          onSave={handleSave}
          onClose={handleCloseModal}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
