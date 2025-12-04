import { useActionIcons } from '../../../../hooks/useActionIcons';

export default function UsersTable({ users, loading, onEdit, onDelete }) {
  const { EditIcon, DeleteIcon } = useActionIcons();

  if (loading) {
    return (
      <div className="users-table-container">
        <div className="loading">Cargando usuarios...</div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="users-table-container">
        <div className="empty-state">No hay usuarios registrados</div>
      </div>
    );
  }

  return (
    <div className="users-table-container">
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                <span className="user-name">{user.name}</span>
              </td>
              <td>{user.email}</td>
              <td>
                <span className="role-badge">{user.role?.name || '-'}</span>
              </td>
              <td>
                <div className="action-buttons">
                  <EditIcon onClick={() => onEdit(user)} />
                  <DeleteIcon onClick={() => onDelete(user.id)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
