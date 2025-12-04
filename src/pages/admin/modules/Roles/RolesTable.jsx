import { useActionIcons } from '../../../../hooks/useActionIcons';

export default function RolesTable({ roles, loading, onEdit, onDelete }) {
  const { EditIcon, DeleteIcon } = useActionIcons();

  if (loading) {
    return (
      <div className="roles-table-container">
        <div className="loading">Cargando roles...</div>
      </div>
    );
  }

  if (!roles || roles.length === 0) {
    return (
      <div className="roles-table-container">
        <div className="empty-state">No hay roles registrados</div>
      </div>
    );
  }

  return (
    <div className="roles-table-container">
      <table className="roles-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>{role.id}</td>
              <td>
                <span className="role-name">{role.name}</span>
              </td>
              <td>{role.description || '-'}</td>
              <td>
                <div className="action-buttons">
                  <EditIcon onClick={() => onEdit(role)} />
                  <DeleteIcon onClick={() => onDelete(role.id)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
