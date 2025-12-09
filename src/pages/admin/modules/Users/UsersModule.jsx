import { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../../../../services/UsersService';
import { getRoles } from '../../../../services/RolesService';
import { useModal } from '../../../../hooks/useModal';
import { usePagination } from '../../../../hooks/usePagination';
import TablesModule from '../../../../components/TablesModule/';
import Pagination from '../../../../components/Pagination';
import UsersForm from './UsersForm';
import { usersConfig } from './config';
import ErrorMessage from '../../../../components/ErrorMessage';
import LoadingSpinner from '../../../../components/Loading';
import './styles/users.css';

/**
 * MÓDULO USERS - Patrón ESTÁNDAR HÍBRIDO MEJORADO
 */
export default function UsersModule() {
  // ===== STATE =====
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen, onOpen, onClose } = useModal();
  const pagination = usePagination(users, 10);
  const paginatedItems = pagination.paginatedItems;

  // ===== EFFECTS =====
  useEffect(() => {
    loadData();
  }, []);

  // ===== HANDLERS =====
  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, rolesData] = await Promise.all([getUsers(), getRoles()]);
      setUsers(usersData || []);
      setRoles(rolesData || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error cargando usuarios');
      console.error('❌ Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    setEditingUser(user);
    onOpen();
  };

  const handleCloseModal = () => {
    onClose();
    setEditingUser(null);
  };

  const handleSave = async (formData) => {
    try {
      setIsSubmitting(true);
      if (editingUser) {
        const payload = {
          name: formData.name,
          email: formData.email,
          roleId: formData.roleId
        };
        if (formData.password) {
          payload.password = formData.password;
        }
        await updateUser(editingUser.id, payload);
      } else {
        await createUser(formData);
      }
      await loadData();
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Error guardando usuario');
      console.error('❌ Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(usersConfig.messages.delete)) {
      return;
    }
    try {
      await deleteUser(id);
      await loadData();
    } catch (err) {
      setError(err.message || 'Error eliminando usuario');
      console.error('❌ Error:', err);
    }
  };

  // Construir columnas con datos de roles
  const columnsWithRoles = usersConfig.columns.map(col => {
    if (col.key === 'roleId') {
      return {
        ...col,
        render: (row) => {
          const role = roles.find(r => r.id === row.roleId);
          return role ? role.name : 'N/A';
        }
      };
    }
    return col;
  });

  // ===== RENDER =====
  return (
    <section className="users-module">
      <div className="users-header">
        <h2>Usuarios</h2>
        <button className="btn btn--primary" onClick={() => handleOpenModal()}>
          + Crear Usuario
        </button>
      </div>

      {error && (
        <ErrorMessage 
          message="Error en módulo Usuarios" 
          details={error}
          onRetry={loadData}
          type="error"
        />
      )}

      {loading && <LoadingSpinner message="Cargando usuarios..." />}

      {!loading && (
        <>
          <TablesModule
            data={paginatedItems}
            columns={columnsWithRoles}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
            loading={loading}
            emptyMessage={`No hay ${usersConfig.moduleNamePlural.toLowerCase()} registrados`}
          />
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={users.length}
            itemsPerPage={10}
            onPageChange={pagination.handlePageChange}
            isLoading={loading}
          />
        </>
      )}

      {isOpen && (
        <UsersForm
          user={editingUser}
          roles={roles}
          onSave={handleSave}
          onClose={handleCloseModal}
          isSubmitting={isSubmitting}
        />
      )}
    </section>
  );
}
