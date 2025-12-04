import { useActionIcons } from '../../../../hooks/useActionIcons';
export default function TypesTable({ items, loading, onEdit, onDelete }) {
  const { EditIcon, DeleteIcon } = useActionIcons();
  if (loading) return <div className="types-table-container"><div className="loading">Cargando tipos...</div></div>;
  if (!items || items.length === 0) return <div className="types-table-container"><div className="empty-state">No hay tipos registrados</div></div>;
  return (
    <div className="types-table-container">
      <table className="types-table">
        <thead><tr><th>ID</th><th>Nombre</th><th>Descripción</th><th>Acciones</th></tr></thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.description || '-'}</td>
              <td><div className="action-buttons"><EditIcon onClick={() => onEdit(item)} /><DeleteIcon onClick={() => onDelete(item.id)} /></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
