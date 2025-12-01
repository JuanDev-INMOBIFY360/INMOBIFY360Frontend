import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Bed, Bath, Car, Maximize } from 'lucide-react';
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

  useEffect(() => {
    getProperties()
      .then((data) => {
        console.log("✅ Propiedades recibidas:", data);
        
        // Transformar datos de la API al formato del componente
        const transformedProperties = data.map(prop => ({
          id: prop.id,
          precio: prop.precio,
          area: prop.area,
          habitaciones: prop.habitaciones || 0,
          banos: prop.banos || 0,
          parqueaderos: prop.parqueaderos || 0,
          direccion: prop.direccion || 'Dirección no disponible',
          // Guardamos nombre legible y también los ids para búsquedas consistentes
          ciudad: `${prop.city?.name || ''}, ${prop.department?.name || ''}`.trim() || 'Ciudad no disponible',
          cityId: prop.city?.id ?? prop.cityId ?? null,
          departmentId: prop.department?.id ?? prop.departmentId ?? null,
          tipo: prop.typeProperty?.name || 'Propiedad',
          imagen: prop.imagenes?.[0]?.url || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"
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
  const formatPrice = (price) => new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price);

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
                      <img src={prop.imagen} alt={prop.direccion} className="property-image" loading="lazy" />
                          <button className="property-badge" onClick={() => navigate(searchByType(prop.tipo))} style={{background:'transparent',border:'none',cursor:'pointer',fontWeight:'bold'}} aria-label={`Filtrar por ${prop.tipo}`}>
                        {prop.tipo}
                      </button>
                      <div className="property-image-overlay" aria-hidden="true"></div>
                    </div>
                    
                    {/* Contenido */}
                    <div className="property-card-content">
                      {/* Ubicación */}
                      <address className="property-location">
                        <MapPin className="property-location-icon" aria-hidden="true" />
                        <div>
                          <p className="property-address">{prop.direccion}</p>
                          <button
                            className="property-city"
                            onClick={() => {
                              // Navegar usando el id de la ciudad si está disponible, si no, enviar el nombre
                              const value = prop.cityId ? prop.cityId : prop.ciudad.split(',')[0];
                              navigate(searchByCity(value));
                            }}
                            style={{background:'transparent',border:'none',cursor:'pointer',color:'#6b7280',padding:0,textAlign:'left'}}
                            aria-label={`Filtrar por ${prop.ciudad.split(',')[0]}`}
                          >
                            {prop.ciudad}
                          </button>
                        </div>
                      </address>
                      
                      {/* Características */}
                      <ul className="property-features" aria-label="Características del inmueble">
                        <li className="property-feature">
                          <Maximize className="property-feature-icon" aria-hidden="true" />
                          <span>{prop.area}m²</span>
                        </li>
                        <li className="property-feature">
                          <Bed className="property-feature-icon" aria-hidden="true" />
                          <span>{prop.habitaciones}</span>
                        </li>
                        <li className="property-feature">
                          <Bath className="property-feature-icon" aria-hidden="true" />
                          <span>{prop.banos}</span>
                        </li>
                        <li className="property-feature">
                          <Car className="property-feature-icon" aria-hidden="true" />
                          <span>{prop.parqueaderos}</span>
                        </li>
                      </ul>
                      
                      {/* Footer */}
                      <footer className="property-footer">
                        <div>
                          <span className="property-price-label">Precio</span>
                          <p className="property-price">{formatPrice(prop.precio)}</p>
                        </div>
                        <button
                          className="property-btn"
                          onClick={() => navigate(`/properties/${prop.id}`)}
                          aria-label={`Ver detalles de ${prop.direccion}`}
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

        {/* Indicadores */}
        <nav className="carousel-indicators" aria-label="Páginas del carrusel">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`carousel-indicator ${idx === currentIndex ? 'carousel-indicator--active' : ''}`}
              aria-current={idx === currentIndex ? 'page' : 'false'}
              aria-label={`Ir a página ${idx + 1}`}
            />
          ))}
        </nav>

        {/* CTA */}
        <div className="carousel-cta">
          <button className="carousel-cta-btn" onClick={() => navigate('/search')} aria-label="Ver todas las propiedades disponibles">Ver Todas las Propiedades</button>
        </div>
      </div>
    </section>
  );
};

export default PropertyCarousel;