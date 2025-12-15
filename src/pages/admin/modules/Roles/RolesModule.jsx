import { useState, useEffect } from "react";
import { IoSearch, IoCreate, IoTrash } from 'react-icons/io5';
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} from "../../../../services/RolesService";

// Note: Replaced TablesModule + Pagination with inline table and search (Owners pattern)
import RolesForm from "./RolesForm";
import { rolesConfig } from "./config";
import ErrorMessage from "../../../../components/ErrorMessage";
import LoadingSpinner from "../../../../components/Loading";
import "./styles/roles.css";

/**
 * MÓDULO ROLES - Patrón ESTÁNDAR HÍBRIDO MEJORADO
 * 
 * Estructura:
 * 1. State - Datos y UI
 * 2. Effects - Cargar datos al montar
 * 3. Handlers - CRUD operations
 * 4. Render - UI
 */
export default function RolesModule() {
  // ===== STATE =====
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  

  useEffect(() => {
    const filtered = roles.filter(r => r.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredRoles(filtered);
  }, [searchTerm, roles]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  // ===== EFFECTS =====
  useEffect(() => {
    loadRoles();
  }, []);

  // ===== HANDLERS =====
  const loadRoles = async () => {
    try {
      setLoading(true);
      const data = await getRoles();
      setRoles(data || []);
      setError(null);
    } catch (err) {
      setError(err.message || "Error cargando roles");
      console.error("❌ Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (role = null) => {
    setEditingRole(role);
    onOpen();
  };

  const handleCloseModal = () => {
    onClose();
    setEditingRole(null);
  };

  const handleSave = async (payload) => {
    try {
      setIsSubmitting(true);
      if (editingRole) {
        await updateRole(editingRole.id, payload);
      } else {
        await createRole(payload);
      }
      await loadRoles();
      handleCloseModal();
    } catch (err) {
      setError(err.message || "Error guardando rol");
      console.error("❌ Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(rolesConfig.messages.delete)) {
      return;
    }
    try {
      await deleteRole(id);
      await loadRoles();
    } catch (err) {
      setError(err.message || "Error eliminando rol");
      console.error("❌ Error:", err);
    }
  };

  // ===== RENDER =====
  return (
    <section className="roles-module">
      {/* HEADER */}
      <div className="roles-header">
        <h2>Roles</h2>
        <div className="roles-controls">
          <div className="search-wrapper-roles">
            {/* <IoSearch className="search-icon" /> */} 
            <input type="text" className="search-input-roles" placeholder="Buscar roles..." value={searchTerm} onChange={handleSearchChange} />
          </div>
          <button className="btn btn--primary" onClick={() => handleOpenModal()}>
            + Crear Rol
          </button>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <ErrorMessage
          message="Error en módulo Roles"
          details={error}
          onRetry={loadRoles}
          type="error"
        />
      )}

      {/* LOADING */}
      {loading && <LoadingSpinner message="Cargando roles..." />}

      {/* TABLA */}
      {!loading && (
        <div className="roles-table-container">
          <table className="roles-table">
            <thead>
              <tr>
                {rolesConfig.columns.map(c => <th key={c.key}>{c.title}</th>)}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.length === 0 ? (
                <tr>
                  <td colSpan={rolesConfig.columns.length + 1} className="no-data">{`No hay ${rolesConfig.moduleNamePlural.toLowerCase()} registrados`}</td>
                </tr>
              ) : (
                filteredRoles.map(role => (
                  <tr key={role.id}>
                    {rolesConfig.columns.map(col => (
                      <td key={col.key}>{col.render ? col.render(role) : (role[col.key] ?? '')}</td>
                    ))}
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn action-btn--edit" title="Editar" onClick={() => handleOpenModal(role)}>
                          <IoCreate className="action-icon" />
                        </button>
                        <button className="action-btn action-btn--delete" title="Eliminar" onClick={() => handleDelete(role.id)}>
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

      {/* MODAL CON FORM */}
      {isOpen && (
        <RolesForm
          role={editingRole}
          onSave={handleSave}
          onClose={handleCloseModal}
          isSubmitting={isSubmitting}
        />
      )}
    </section>
  );
}
