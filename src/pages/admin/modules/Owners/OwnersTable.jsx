import { useActionIcons } from '../../../../hooks/useActionIcons';
export default function OwnersTable({ items, loading, onEdit, onDelete }) {
  const { EditIcon, DeleteIcon } = useActionIcons();
  if (loading) return <div className="owners-table-container"><div className="loading">Cargando propietarios...</div></div>;
  if (!items || items.length === 0) return <div className="owners-table-container"><div className="empty-state">No hay propietarios registrados</div></div>;
  return (
    <div className="owners-table-container">
      <table className="owners-table">
        <thead><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Teléfono</th><th>Acciones</th></tr></thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.email || '-'}</td>
              <td>{item.phone || '-'}</td>
              <td><div className="action-buttons"><EditIcon onClick={() => onEdit(item)} /><DeleteIcon onClick={() => onDelete(item.id)} /></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
