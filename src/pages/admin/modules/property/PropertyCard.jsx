import "./propertyCards.css";
import { useState, useEffect } from "react";
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Car,
  Trash2,
  Search,
  Edit,
  Home,
} from "lucide-react";

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23e2e8f0%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2218%22 font-weight=%22600%22 fill=%22%718096%718096%718096%718096" text-anchor=%71middle%71 dy=%71.3em%71> Sin imagen </text> </svg>';

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
          className={loaded ? "loaded" : ""}
          src={imgSrc}
          alt={property.titulo}
          decoding="async"
          onLoad={() => {
            setLoaded(true);
          }}
          onError={(e) => {
            if (imgSrc !== PLACEHOLDER_IMAGE) {
              setImgSrc(PLACEHOLDER_IMAGE);
              setLoaded(true);
            }
          }}
        />
        <p className="property-location-overlay">
          <MapPin size={12} /> {property.ciudad}
        </p>
        {/* Badge tipo propiedad */}
        <span className="property-type-badge-image">
          {property.typeProperty?.name?.toUpperCase() ||
            property.tipo?.toUpperCase() ||
            "PROPIEDAD"}{" "}
          | DISPONIBLE
        </span>
      </div>

      {/* Contenido */}
      <div className="property-content">
        {/* Company Tag */}
        <div className="company-tag-property">
          <div className="company-icon-property">
            <Home size={11} />
          </div>
          <span className="company-name-property">Inmobify360</span>
          <span className="company-status-property">
            | {property.operacion === "SALE" ? "Venta" : "Alquiler"}
          </span>
        </div>

        <h3 className="property-title">{property.titulo}</h3>

        {/* Features Inline */}
        <div className="property-features-inline">
          {property.areaConstruida > 0 && (
            <span>
              <Maximize2 size={12} className="property-icon" />
              {property.areaConstruida} m²
            </span>
          )}
          {property.habitaciones > 0 && (
            <span>
              <Bed size={12} className="property-icon" />
              {property.habitaciones} hab
            </span>
          )}
          {property.banos > 0 && (
            <span>
              <Bath size={12} className="property-icon" />
              {property.banos} baños
            </span>
          )}
          {property.parqueaderos > 0 && (
            <span>
              <Car size={12} className="property-icon" />
              {property.parqueaderos}
            </span>
          )}
        </div>

        <div className="property-footer-search">
          <p className="property-price">${property.precio.toLocaleString()}</p>
          <span
            className={`property-type-badge ${property.operacion === "SALE" ? "venta" : "renta"}`}
          >
            {property.operacion === "SALE" ? "VENTA" : "RENTA"}
          </span>
        </div>

        <div className="property-actions">
          <button className="property-btn btn-outline" onClick={onView}>
            <Search size={18} />
          </button>
          <button className="property-btn btn-primary" onClick={onEdit}>
            <Edit size={18} />
          </button>
          <button className="property-btn btn-danger" onClick={onDelete}>
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
