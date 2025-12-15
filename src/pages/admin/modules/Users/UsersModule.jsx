import { useState, useEffect } from 'react';
import { IoSearch, IoCreate, IoTrash, IoEye } from 'react-icons/io5';
import { getUsers, createUser, updateUser, deleteUser } from '../../../../services/UsersService';
import { getRoles } from '../../../../services/RolesService';
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
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

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

  useEffect(() => {
    const filtered = users.filter(u => 
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.role && u.role.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

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

        <div className="users-controls">
          <div className="search-wrapper-user">
            <IoSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o rol..."
              className="search-input-user"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <button className="btn btn--primary" onClick={() => handleOpenModal()}>
            + Crear Usuario
          </button>
        </div>
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
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                {usersConfig.columns.map((col) => (
                  <th key={col.key}>{col.title}</th>
                ))}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={usersConfig.columns.length + 1} className="no-data">
                    {`No hay ${usersConfig.moduleNamePlural.toLowerCase()} registrados`}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id}>
                    {usersConfig.columns.map((col) => (
                      <td key={col.key}>
                        {col.render ? col.render(u) : (u[col.key] ?? '')}
                      </td>
                    ))}
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn action-btn--view" title="Ver" onClick={() => handleOpenModal(u)}>
                          <IoEye className="action-icon" />
                        </button>
                        <button className="action-btn action-btn--edit" title="Editar" onClick={() => handleOpenModal(u)}>
                          <IoCreate className="action-icon" />
                        </button>
                        <button className="action-btn action-btn--delete" title="Eliminar" onClick={() => handleDelete(u.id)}>
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
