import { useState, useEffect } from 'react';
import { getRoles, createRole, updateRole, deleteRole } from '../../../../services/RolesService';
import RolesTable from './RolesTable';
import RolesForm from './RolesForm';
import './styles/roles.css';

export default function RolesModule() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const data = await getRoles(); // Asegúrate de usar getRoles
      setRoles(data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error cargando roles');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (role = null) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
  };

  const handleSave = async (payload) => {
    try {
      setIsSubmitting(true);
      if (editingRole) {
        // Actualizar rol
        await updateRole(editingRole.id, payload);  // Usa updateRole
      } else {
        // Crear nuevo rol
        await createRole(payload);  // Usa createRole
      }
      await loadRoles();
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Error guardando rol');
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este rol?')) {
      return;
    }
    try {
      await deleteRole(id);  // Usa deleteRole
      await loadRoles();
    } catch (err) {
      setError(err.message || 'Error eliminando rol');
      console.error('Error:', err);
    }
  };

  return (
    <section className="roles-module">
      <div className="roles-header">
        <h2>Roles</h2>
        <button className="btn btn--primary" onClick={() => handleOpenModal()}>
          + Crear Rol
        </button>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <RolesTable
        roles={roles}
        loading={loading}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
      />

      {isModalOpen && (
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
