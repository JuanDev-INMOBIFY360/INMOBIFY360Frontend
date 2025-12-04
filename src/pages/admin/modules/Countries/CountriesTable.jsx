import { useActionIcons } from '../../../../hooks/useActionIcons';

export default function CountriesTable({ items, loading, onEdit, onDelete }) {
  const { EditIcon, DeleteIcon } = useActionIcons();

  if (loading) {
    return (
      <div className="countries-table-container">
        <div className="loading">Cargando países...</div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="countries-table-container">
        <div className="empty-state">No hay países registrados</div>
      </div>
    );
  }

  return (
    <div className="countries-table-container">
      <table className="countries-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Código</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.code || '-'}</td>
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
