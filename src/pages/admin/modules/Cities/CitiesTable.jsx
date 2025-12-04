import { useActionIcons } from '../../../../hooks/useActionIcons';

export default function CitiesTable({ items, loading, onEdit, onDelete }) {
  const { EditIcon, DeleteIcon } = useActionIcons();

  if (loading) {
    return <div className="cities-table-container"><div className="loading">Cargando ciudades...</div></div>;
  }

  if (!items || items.length === 0) {
    return <div className="cities-table-container"><div className="empty-state">No hay ciudades registradas</div></div>;
  }

  return (
    <div className="cities-table-container">
      <table className="cities-table">
        <thead><tr><th>ID</th><th>Nombre</th><th>Departamento</th><th>Acciones</th></tr></thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.department?.name || '-'}</td>
              <td><div className="action-buttons"><EditIcon onClick={() => onEdit(item)} /><DeleteIcon onClick={() => onDelete(item.id)} /></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
