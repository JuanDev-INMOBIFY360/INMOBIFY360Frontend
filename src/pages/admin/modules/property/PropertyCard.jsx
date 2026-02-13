import './propertyCards.css';
import { useState, useEffect } from 'react';
import { MapPin, Bed, Bath, Ruler, Car, Trash2, Search, Edit } from 'lucide-react';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23e2e8f0%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2218%22 font-weight=%22600%22 fill=%22%718096%718096%718096%718096" text-anchor=%71middle%71 dy=%71.3em%71> Sin imagen </text> </svg>';

export default function PropertyCard({ property, onEdit, onView, onDelete }) {
  // determine the initial image URL (primary, first or placeholder)
  const computeImage = () => {
    const url =
      property.images?.find((img) => img.isPrimary)?.url ||
      property.images?.[0]?.url ||
      PLACEHOLDER_IMAGE;
    return url;
  };

  const [imgSrc, setImgSrc] = useState(computeImage());
  const [loaded, setLoaded] = useState(false);

  // if the computed url actually changes (not just a new array reference), update
  useEffect(() => {
    const newUrl = computeImage();
    setImgSrc((prev) => {
      if (prev === newUrl) {
        // do not blink if image didn't actually change
        return prev;
      }
      // only clear loaded when changing the url
      setLoaded(false);
      return newUrl;
    });
  }, [property.images]);

  return (
    <div className="property-card">
      {/* Imagen */}
      <div className="property-image">
        <img 
          className={loaded ? 'loaded' : ''}
          src={imgSrc} 
          alt={property.titulo}
          decoding="async"
          onLoad={() => { console.log('image loaded for property', property.id); setLoaded(true);} }
          onError={(e) => {
            console.warn('image load error for property', property.id, imgSrc, e?.target?.src);
            if (imgSrc !== PLACEHOLDER_IMAGE) {
              setImgSrc(PLACEHOLDER_IMAGE);
              setLoaded(true);
            }
          }}
        />

        {/* Barrio */}
        <div className="property-location">
          <MapPin />
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
              <Ruler /> {property.areaConstruida} m²
            </span>
          )}
          {property.habitaciones && (
            <span>
              <Bed /> {property.habitaciones} 
            </span>
          )}
          {property.banos && (
            <span>
              <Bath /> {property.banos} 
            </span>
          )}
          {property.parqueaderos && (
            <span>
              <Car /> {property.parqueaderos} 
            </span>
          )}
        </div>

        <div className="property-footer">
          <div className="property-price-admin">
            ${property.precio.toLocaleString()} 
          </div>

          <div className="property-actions">
            <button className="btn-outline" onClick={onView}>
              <Search className="btn-icon" /> 
            </button>
            <button className="btn-primary" onClick={onEdit}>
              <Edit className="btn-icon" /> 
            </button>
            <button className="btn-danger" onClick={onDelete}>
              <Trash2 className="btn-icon" /> 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}