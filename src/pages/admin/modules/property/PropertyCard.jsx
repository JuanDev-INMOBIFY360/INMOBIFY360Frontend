import './propertyCards.css';
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined } from 'react-icons/fa';

export default function PropertyCard({ property }) {
  const image =
    property.images?.find((img) => img.isPrimary)?.url ||
    property.images?.[0]?.url ||
    'https://via.placeholder.com/400x300?text=Sin+imagen';

  return (
    <div className="property-card">
      {/* Imagen */}
      <div className="property-image">
        <img src={image} alt={property.titulo} />

        {/* Barrio */}
        <div className="property-location">
          <FaMapMarkerAlt />
          <span>{ property.ciudad}</span>
        </div>

        {/* Estado */}
        <div className={`property-status ${property.operacion.toLowerCase()}`}>
          {property.operacion === 'SALE' ? 'Venta' : 'Renta'}
        </div>
      </div>

      {/* Contenido */}
      <div className="property-content">
        <h3 className="property-title">{property.titulo}</h3>

        <div className="property-meta">
          {property.areaConstruida && (
            <span>
              <FaRulerCombined /> {property.areaConstruida} m²
            </span>
          )}
          {property.habitaciones && (
            <span>
              <FaBed /> {property.habitaciones} hab
            </span>
          )}
          {property.banos && (
            <span>
              <FaBath /> {property.banos} baños
            </span>
          )}
        </div>

        <div className="property-footer">
          <div className="property-price">
            ${property.precio.toLocaleString()} {property.moneda}
          </div>

          <div className="property-actions">
            <button className="btn-outline">Ver</button>
            <button className="btn-primary">Editar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
