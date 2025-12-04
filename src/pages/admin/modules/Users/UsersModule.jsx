import { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../../../../services/UsersService';
import { getRoles } from '../../../../services/RolesService';
import UsersTable from './UsersTable';
import UsersForm from './UsersForm';
import './styles/users.css';

export default function UsersModule() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, rolesData] = await Promise.all([getUsers(), getRoles()]);
      setUsers(usersData || []);
      setRoles(rolesData || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error cargando usuarios');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este usuario?')) {
      return;
    }
    try {
      await deleteUser(id);
      await loadData();
    } catch (err) {
      setError(err.message || 'Error eliminando usuario');
      console.error('Error:', err);
    }
  };

  return (
    <section className="users-module">
      <div className="users-header">
        <h2>Usuarios</h2>
        <button className="btn btn--primary" onClick={() => handleOpenModal()}>
          + Crear Usuario
        </button>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <UsersTable
        users={users}
        loading={loading}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
      />

      {isModalOpen && (
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
