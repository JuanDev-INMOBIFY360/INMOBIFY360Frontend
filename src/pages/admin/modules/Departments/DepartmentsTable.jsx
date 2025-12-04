import { useActionIcons } from '../../../../hooks/useActionIcons';

export default function DepartmentsTable({ items, loading, onEdit, onDelete }) {
  const { EditIcon, DeleteIcon } = useActionIcons();

  if (loading) {
    return (
      <div className="departments-table-container">
        <div className="loading">Cargando departamentos...</div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="departments-table-container">
        <div className="empty-state">No hay departamentos registrados</div>
      </div>
    );
  }

  return (
    <div className="departments-table-container">
      <table className="departments-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>País</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.country?.name || '-'}</td>
              <td>
                <div className="action-buttons">
                  <EditIcon onClick={() => onEdit(item)} />
                  <DeleteIcon onClick={() => onDelete(item.id)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
