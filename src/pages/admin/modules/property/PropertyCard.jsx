import './propertyCards.css';
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined } from 'react-icons/fa';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23e2e8f0%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2218%22 font-weight=%22600%22 fill=%22%23718096%22 text-anchor=%22middle%22 dy=%22.3em%22%3ESin imagen%3C/text%3E%3C/svg%3E';

export default function PropertyCard({ property, onEdit, onView }) {
  const image =
    property.images?.find((img) => img.isPrimary)?.url ||
    property.images?.[0]?.url ||
    PLACEHOLDER_IMAGE;

  return (
    <div className="property-card">
      {/* Imagen */}
      <div className="property-image">
        <img 
          src={image} 
          alt={property.titulo}
          onError={(e) => {
            e.target.src = PLACEHOLDER_IMAGE;
          }}
        />

        {/* Barrio */}
        <div className="property-location">
          <FaMapMarkerAlt />
          <span>{property.ciudad}</span>
        </div>

        {/* Estado */}
        <div className={`property-status ${property.operacion === 'SALE' ? 'sale' : 'rent'}`}>
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
            <button className="btn-outline" onClick={onView}>
              Ver
            </button>
            <button className="btn-primary" onClick={onEdit}>
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}