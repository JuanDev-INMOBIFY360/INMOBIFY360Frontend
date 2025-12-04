import { useActionIcons } from '../../../hooks/useActionIcons';
import '../styles/privileges.css';

export default function PrivilegesTable({ items, loading, onEdit, onDelete }) {
  const { EditIcon, DeleteIcon } = useActionIcons();

  if (loading) return <div className="privileges-table__loading">Cargando...</div>;

  return (
    <table className="privileges-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {items.length === 0 ? (
          <tr>
            <td colSpan="4" className="privileges-table__empty">
              No hay privilegios registrados
            </td>
          </tr>
        ) : (
          items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.description || '-'}</td>
              <td className="privileges-table__actions">
                <EditIcon onClick={() => onEdit(item)} />
                <DeleteIcon onClick={() => onDelete(item.id)} />
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
