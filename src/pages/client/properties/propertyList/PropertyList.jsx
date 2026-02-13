import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Bed,
  Bath,
  Car,
  MapPin,
  Home,
} from "lucide-react";
import { getProperties } from "../../../../services/propertyService";
import { useNavigate } from "react-router-dom";
import "./PropertyCarousel.css";

const PropertyCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const PLACEHOLDER_IMAGE =
    "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23f5f5f5%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2218%22 font-weight=%22600%22 fill=%22%23666666%22 text-anchor=%22middle%22 dy=%22.3em%22%3ESin imagen%3C/text%3E%3C/svg%3E";

  useEffect(() => {
    getProperties()
      .then((data) => {
        console.log("✅ Propiedades recibidas:", data);

        const publishedProperties = Array.isArray(data)
          ? data.filter((prop) => prop.publicada !== false)
          : [];

        const transformedProperties = publishedProperties.map((prop) => ({
          id: prop.id,
          titulo: prop.titulo || "Propiedad",
          precio: prop.precio || 0,
          areaConstruida: prop.areaConstruida || 0,
          habitaciones: prop.habitaciones || 0,
          banos: prop.banos || 0,
          parqueaderos: prop.parqueaderos || 0,
          direccion: prop.direccion || "Dirección no disponible",
          ciudad: prop.ciudad || "Ciudad no disponible",
          barrio: prop.barrio || "",
          operacion: prop.operacion || "SALE",
          typeProperty: prop.typeProperty?.name || "Propiedad",
          companyName: "Inmobify360",
          imagen:
            prop.images?.find((img) => img.isPrimary)?.url ||
            prop.images?.[0]?.url ||
            PLACEHOLDER_IMAGE,
        }));

        setProperties(transformedProperties);
      })
      .catch((err) => {
        console.error("❌ Error cargando propiedades:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setItemsPerView(width < 768 ? 1 : width < 1024 ? 2 : 4);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, properties.length - itemsPerView);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // ✅ CORRECCIÓN: Navegación correcta a la ruta /properties/:id
  const handleViewMore = (propertyId) => {
    console.log("🔗 Navegando a propiedad:", propertyId);
    navigate(`/properties/${propertyId}`);
  };

  // ✅ CORRECCIÓN: Búsqueda por tipo
  const handleSearchByType = (typeName) => {
    console.log("🔍 Buscando por tipo:", typeName);
    navigate(`/search?type=${encodeURIComponent(typeName)}`);
  };

  if (loading) {
    return (
      <section className="section-property-carousel-client">
        <div className="container-property-carousel-client">
          <p className="loading-property-carousel-client">
            Cargando propiedades...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-property-carousel-client">
        <div className="container-property-carousel-client">
          <p className="loading-property-carousel-client loading-error-property-carousel-client">
            Error: {error}. Por favor, intenta nuevamente.
          </p>
        </div>
      </section>
    );
  }

  if (properties.length === 0) {
    return (
      <section className="section-property-carousel-client">
        <div className="container-property-carousel-client">
          <p className="loading-property-carousel-client">
            No hay propiedades disponibles en este momento.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section-property-carousel-client">
      <div className="container-property-carousel-client">
        {/* Header */}
        <header className="header-property-carousel-client">
          <h2 className="title-property-carousel-client">
            Últimos Proyectos Publicados
          </h2>
          <p className="subtitle-property-carousel-client">
            Descubre las mejores oportunidades inmobiliarias
          </p>
        </header>

        {/* Carousel */}
        <div
          className="wrapper-property-carousel-client"
          role="region"
          aria-label="Carrusel de propiedades"
        >
          {/* Botón Anterior */}
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
            disabled={currentIndex === 0}
            className={`nav-btn-property-carousel-client nav-btn-prev-property-carousel-client ${currentIndex === 0 ? "nav-btn-disabled-property-carousel-client" : ""}`}
            aria-label="Propiedades anteriores"
          >
            <ChevronLeft aria-hidden="true" />
          </button>

          {/* Track */}
          <div className="track-container-property-carousel-client">
            <div
              className="track-property-carousel-client"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
              role="list"
            >
              {properties.map((prop) => (
                <article
                  key={prop.id}
                  className="card-property-client"
                  role="listitem"
                >
                  <div className="card-inner-property-client">
                    {/* Imagen */}
                    <div className="image-wrapper-property-client">
                      <img
                        src={prop.imagen}
                        alt={prop.titulo}
                        className="image-property-client"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = PLACEHOLDER_IMAGE;
                        }}
                      />

                      {/* Overlay con botón Ver Más */}
                      <div
                        className="image-overlay-property-client"
                        aria-hidden="true"
                      >
                        <button
                          className="view-more-btn-property-client"
                          onClick={() => handleViewMore(prop.id)}
                          aria-label={`Ver más detalles de ${prop.titulo}`}
                        >
                          Ver Más
                        </button>
                      </div>

                      {/* Badge tipo - ahora clickeable para buscar */}
                      <button
                        className="badge-property-client"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSearchByType(prop.typeProperty);
                        }}
                        aria-label={`Filtrar por ${prop.typeProperty}`}
                      >
                        {prop.typeProperty.toUpperCase()} | DISPONIBLE
                      </button>
                    </div>

                    {/* Contenido */}
                    <div className="content-property-client">
                      {/* Company Tag */}
                      <div className="company-tag-property-client">
                        <div className="company-icon-property-client">
                          <Home size={12} aria-hidden="true" />
                        </div>
                        <span className="company-name-property-client">
                          {prop.companyName}
                        </span>
                        <span className="company-status-property-client">
                          | {prop.operacion === "SALE" ? "Usado" : "Alquiler"}
                        </span>
                      </div>

                      <h3 className="title-property-client" title={prop.titulo}>
                        {prop.titulo.length > 40
                          ? prop.titulo.substring(0, 40) + "..."
                          : prop.titulo}
                      </h3>

                      {/* Ubicación */}
                      <div className="location-property-client">
                        <MapPin aria-hidden="true" />
                        <span>
                          {prop.barrio ? `${prop.barrio}, ` : ""}
                          {prop.ciudad}
                        </span>
                      </div>

                      {/* Características */}
                      <ul
                        className="features-inline-property-client"
                        aria-label="Características del inmueble"
                      >
                        {prop.areaConstruida > 0 && (
                          <li>
                            <Maximize2 aria-hidden="true" />
                            {prop.areaConstruida} m² |
                          </li>
                        )}
                        {prop.habitaciones > 0 && (
                          <li>
                            <Bed aria-hidden="true" />
                            {prop.habitaciones} hab |
                          </li>
                        )}
                        {prop.banos > 0 && (
                          <li>
                            <Bath aria-hidden="true" />
                            {prop.banos} baños |
                          </li>
                        )}
                        {prop.parqueaderos > 0 && (
                          <li>
                            <Car aria-hidden="true" />
                            {prop.parqueaderos}
                          </li>
                        )}
                      </ul>

                      {/* Footer - Precio y Etiqueta */}
                      <footer className="footer-property-client">
                        <div className="price-container-property-client">
                          <p className="price-property-client">
                            {formatPrice(prop.precio)}
                          </p>
                          <span
                            className={`type-label-property-client ${prop.operacion === "SALE" ? "venta" : "renta"}`}
                          >
                            {prop.operacion === "SALE" ? "VENTA" : "RENTA"}
                          </span>
                        </div>
                      </footer>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Botón Siguiente */}
          <button
            onClick={() =>
              setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
            }
            disabled={currentIndex === maxIndex}
            className={`nav-btn-property-carousel-client nav-btn-next-property-carousel-client ${currentIndex === maxIndex ? "nav-btn-disabled-property-carousel-client" : ""}`}
            aria-label="Próximas propiedades"
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>

        {/* Dots Pagination */}
        <div className="dots-pagination-property-client">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              className={`dot-property-client ${currentIndex === index ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Ir a página ${index + 1}`}
            />
          ))}
        </div>

        {/* CTA Ver todas */}
        <div className="cta-property-carousel-client">
          <button
            className="cta-btn-property-carousel-client"
            onClick={() => navigate("/search")}
            aria-label="Ver todas las propiedades disponibles"
          >
            Ver Todas las Propiedades
          </button>
        </div>
      </div>
    </section>
  );
};

export default PropertyCarousel;