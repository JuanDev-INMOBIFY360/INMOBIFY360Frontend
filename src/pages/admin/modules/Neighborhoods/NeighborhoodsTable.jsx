import { useActionIcons } from '../../../../hooks/useActionIcons';

export default function NeighborhoodsTable({ items, loading, onEdit, onDelete }) {
  const { EditIcon, DeleteIcon } = useActionIcons();
  if (loading) return <div className="neighborhoods-table-container"><div className="loading">Cargando barrios...</div></div>;
  if (!items || items.length === 0) return <div className="neighborhoods-table-container"><div className="empty-state">No hay barrios registrados</div></div>;
  return (
    <div className="neighborhoods-table-container">
      <table className="neighborhoods-table">
        <thead><tr><th>ID</th><th>Nombre</th><th>Ciudad</th><th>Acciones</th></tr></thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.city?.name || '-'}</td>
              <td><div className="action-buttons"><EditIcon onClick={() => onEdit(item)} /><DeleteIcon onClick={() => onDelete(item.id)} /></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
