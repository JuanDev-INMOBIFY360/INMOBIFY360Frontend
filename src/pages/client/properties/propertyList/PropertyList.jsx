import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { getProperties } from '../../../../services/propertyService';
import { searchByType, searchByCity } from '../../../../utils/searchHelpers';
import './PropertyCarousel.css';
import { useNavigate } from 'react-router-dom';

const PropertyCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23e2e8f0%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2218%22 font-weight=%22600%22 fill=%22%23718096%22 text-anchor=%22middle%22 dy=%22.3em%22%3ESin imagen%3C/text%3E%3C/svg%3E';

  useEffect(() => {
    getProperties()
      .then((data) => {
        console.log("✅ Propiedades recibidas:", data);
        
        // Filtrar solo propiedades publicadas
        const publishedProperties = Array.isArray(data) 
          ? data.filter(prop => prop.publicada !== false)
          : [];

        const transformedProperties = publishedProperties.map(prop => ({
          id: prop.id,
          titulo: prop.titulo || 'Propiedad',
          precio: prop.precio || 0,
          areaConstruida: prop.areaConstruida || 0,
          habitaciones: prop.habitaciones || 0,
          banos: prop.banos || 0,
          parqueaderos: prop.parqueaderos || 0,
          direccion: prop.direccion || 'Dirección no disponible',
          ciudad: prop.ciudad || 'Ciudad no disponible',
          barrio: prop.barrio || '',
          operacion: prop.operacion || 'SALE',
          typeProperty: prop.typeProperty?.name || 'Propiedad',
          imagen: prop.images?.find(img => img.isPrimary)?.url || 
                  prop.images?.[0]?.url || 
                  PLACEHOLDER_IMAGE
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
      setItemsPerView(width < 768 ? 1 : width < 1024 ? 2 : 3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, properties.length - itemsPerView);
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <section className="carousel-section">
        <div className="carousel-container">
          <p className="carousel-loading">Cargando propiedades...</p>
        </div>
      </section>
    );
  }

  if (error) {
      return (
      <section className="carousel-section">
        <div className="carousel-container">
          <p className="carousel-loading carousel-loading--error">
            Error: {error}. Por favor, intenta nuevamente.
          </p>
        </div>
      </section>
    );
  }

  if (properties.length === 0) {
    return (
      <section className="carousel-section">
        <div className="carousel-container">
          <p className="carousel-loading">No hay propiedades disponibles en este momento.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="carousel-section">
      <div className="carousel-container">
        {/* Header */}
        <header className="carousel-header">
          <h2 className="carousel-title">Últimos Proyectos Publicados</h2>
          <div className="carousel-title-underline"></div>
          <p className="carousel-subtitle">Descubre las mejores oportunidades inmobiliarias</p>
        </header>
        
        {/* Carousel */}
        <div className="carousel-wrapper" role="region" aria-label="Carrusel de propiedades">
          {/* Botón Anterior */}
          <button
            onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
            disabled={currentIndex === 0}
            className={`carousel-nav-btn carousel-nav-btn--prev ${currentIndex === 0 ? 'carousel-nav-btn--disabled' : ''}`}
            aria-label="Propiedades anteriores"
          >
            <ChevronLeft aria-hidden="true" />
          </button>

          {/* Track */}
          <div className="carousel-track-container">
            <div 
              className="carousel-track"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
              role="list"
            >
              {properties.map((prop) => (
                <article 
                  key={prop.id} 
                  className="property-card"
                  style={{ width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 24 / itemsPerView}px)` }}
                  role="listitem"
                >
                  <div className="property-card-inner">
                    {/* Imagen */}
                    <div className="property-image-wrapper">
                      <img 
                        src={prop.imagen} 
                        alt={prop.titulo} 
                        className="property-image" 
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = PLACEHOLDER_IMAGE;
                        }}
                      />
                      <div className="property-image-overlay" aria-hidden="true"></div>
                    </div>
                    
                    {/* Contenido */}
                    <div className="property-card-content">
                      {/* Agencia y tipo */}
                      <button 
                        className="property-badge" 
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(searchByType(prop.typeProperty));
                        }}
                        aria-label={`Filtrar por ${prop.typeProperty}`}
                      >
                        {prop.typeProperty.toUpperCase()} | DISPONIBLE
                      </button>

                      {/* Título */}
                      <h3 className="property-title" title={prop.titulo}>
                        {prop.titulo.length > 50 ? prop.titulo.substring(0, 50) + '...' : prop.titulo}
                      </h3>

                      {/* Ubicación */}
                      <address className="property-location">
                        <MapPin className="property-location-icon" aria-hidden="true" size={16} />
                        <div>
                          <p className="property-address">{prop.direccion}</p>
                          <p className="property-city">
                            {prop.barrio ? `${prop.barrio}, ` : ''}{prop.ciudad}
                          </p>
                        </div>
                      </address>
                      
                      {/* Características */}
                      <ul className="property-features-inline" aria-label="Características del inmueble">
                        {prop.areaConstruida > 0 && (
                          <li>{prop.areaConstruida}m²</li>
                        )}
                        {prop.habitaciones > 0 && (
                          <li>{prop.habitaciones} bed</li>
                        )}
                        {prop.banos > 0 && (
                          <li>{prop.banos} bath</li>
                        )}
                        {prop.parqueaderos > 0 && (
                          <li>{prop.parqueaderos} car</li>
                        )}
                      </ul>
                      
                      {/* Footer */}
                      <footer className="property-footer">
                        <div>
                          <span className="property-price-label">
                            {prop.operacion === 'SALE' ? 'Venta' : 'Renta'}
                          </span>
                          <p className="property-price">{formatPrice(prop.precio)}</p>
                        </div>
                        <button
                          className="property-btn"
                          onClick={() => navigate(`/properties/${prop.id}`)}
                          aria-label={`Ver detalles de ${prop.titulo}`}
                        >
                          Ver más
                        </button>
                      </footer>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Botón Siguiente */}
          <button
            onClick={() => setCurrentIndex(prev => Math.min(prev + 1, maxIndex))}
            disabled={currentIndex === maxIndex}
            className={`carousel-nav-btn carousel-nav-btn--next ${currentIndex === maxIndex ? 'carousel-nav-btn--disabled' : ''}`}
            aria-label="Próximas propiedades"
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      
        <div className="carousel-cta">
          <button className="carousel-cta-btn" onClick={() => navigate('/search')} aria-label="Ver todas las propiedades disponibles">Ver Todas las Propiedades</button>
        </div>
      </div>
    </section>
  );
};

export default PropertyCarousel;