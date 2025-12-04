import { useActionIcons } from '../../../../hooks/useActionIcons';
import './styles/properties.css';

export default function PropertiesTable({ items, loading, onEdit, onDelete }) {
  const { EditIcon, DeleteIcon } = useActionIcons();

  if (loading) return <div className="properties-table__loading">Cargando...</div>;

  return (
    <div className="properties-grid">
      {items.length === 0 ? (
        <div className="properties-grid__empty">No hay propiedades registradas</div>
      ) : (
        items.map((item) => (
          <div key={item.id} className="property-card">
            <div className="property-card__image">
              {item.imagenes && JSON.parse(typeof item.imagenes === 'string' ? item.imagenes : JSON.stringify(item.imagenes)).length > 0 ? (
                <img src={JSON.parse(typeof item.imagenes === 'string' ? item.imagenes : JSON.stringify(item.imagenes))[0]} alt={item.titulo} />
              ) : (
                <div className="property-card__no-image">Sin imagen</div>
              )}
            </div>
            <div className="property-card__content">
              <h3>{item.titulo}</h3>
              <p className="property-card__price">${item.precio?.toLocaleString()}</p>
              <p className="property-card__desc">{item.descripcion?.substring(0, 100)}...</p>
              <div className="property-card__details">
                <span>{item.habitaciones} 🛏️</span>
                <span>{item.banos} 🚿</span>
                <span>{item.area} m²</span>
              </div>
              <div className="property-card__actions">
                <EditIcon onClick={() => onEdit(item)} />
                <DeleteIcon onClick={() => onDelete(item.id)} />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
