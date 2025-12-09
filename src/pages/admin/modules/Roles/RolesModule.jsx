import { useState, useEffect } from "react";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} from "../../../../services/RolesService";
import { useModal } from "../../../../hooks/useModal";
import { usePagination } from "../../../../hooks/usePagination";
import TablesModule from "../../../../components/TablesModule/";
import Pagination from "../../../../components/Pagination";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen, onOpen, onClose } = useModal();
  const pagination = usePagination(roles, 10);
  const paginatedItems = pagination.paginatedItems;

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
        <button className="btn btn--primary" onClick={() => handleOpenModal()}>
          + Crear Rol
        </button>
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
        <>
          <TablesModule
            data={paginatedItems}
            columns={rolesConfig.columns}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
            loading={loading}
            emptyMessage={`No hay ${rolesConfig.moduleNamePlural.toLowerCase()} registrados`}
          />
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={roles.length}
            itemsPerPage={10}
            onPageChange={pagination.handlePageChange}
            isLoading={loading}
          />
        </>
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
