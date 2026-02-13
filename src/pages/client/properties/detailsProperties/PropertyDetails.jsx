import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  MapPin, Bed, Bath, Car, Maximize2, 
  Share2, Heart, ChevronLeft, ChevronRight, MessageCircle
} from 'lucide-react';
import { getProperty } from '../../../../services/propertyService';
import './PropertyDetail.css';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221200%22 height=%22800%22%3E%3Crect fill=%22%23F8F8F8%22 width=%221200%22 height=%22800%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2248%22 font-weight=%22600%22 fill=%22%23999999%22 text-anchor=%22middle%22 dy=%22.3em%22%3ESin imagen disponible%3C/text%3E%3C/svg%3E';

  // Número de WhatsApp para contacto
  const WHATSAPP_NUMBER = '+573101234567';

  useEffect(() => {
    console.log('🔍 PropertyDetail montado con ID:', id);
    
    if (!id) {
      console.error('❌ No hay id en los params');
      setLoading(false);
      return;
    }

    const loadProperty = async () => {
      try {
        console.log('📡 Llamando a getProperty con ID:', id);
        const data = await getProperty(id);
        console.log('✅ Propiedad cargada:', data);
        
        if (!data) {
          console.error('❌ getProperty retornó null o undefined');
          setProperty(null);
        } else {
          setProperty(data);
        }
      } catch (err) {
        console.error('❌ Error cargando propiedad:', err);
        console.error('❌ Error details:', err.response?.data || err.message);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  const getImages = () => {
    if (!property) return [PLACEHOLDER_IMAGE];
    
    if (!property.images || !Array.isArray(property.images) || property.images.length === 0) {
      console.log('⚠️ No hay imágenes, usando placeholder');
      return [PLACEHOLDER_IMAGE];
    }
    
    const urls = property.images.map(img => img.url || img).filter(Boolean);
    console.log('🖼️ URLs de imágenes:', urls);
    return urls.length > 0 ? urls : [PLACEHOLDER_IMAGE];
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  const handleOpenWhatsApp = () => {
    const message = `Hola, me interesa la propiedad: ${property.titulo}`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePrevImage = () => {
    const images = getImages();
    setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
  };

  const handleNextImage = () => {
    const images = getImages();
    setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
  };

  const handleSearchByType = (typeName) => {
    navigate(`/search?type=${encodeURIComponent(typeName)}`);
  };

  const handleSearchByOperation = (operation) => {
    const category = operation === 'SALE' ? 'Venta' : 'Arriendo';
    navigate(`/search?category=${encodeURIComponent(category)}`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.titulo,
          text: `Mira esta propiedad: ${property.titulo}`,
          url: window.location.href
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('✓ Enlace copiado al portapapeles');
  };

  if (loading) {
    return (
      <div className="detail-loading">
        <p>Cargando propiedad...</p>
        <p style={{fontSize: '13px', color: '#999', marginTop: '8px'}}>
          ID: {id}
        </p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="detail-loading">
        <p style={{fontSize: '16px', fontWeight: '600', marginBottom: '12px'}}>
          ❌ Propiedad no encontrada
        </p>
        <p style={{fontSize: '14px', color: '#666', marginBottom: '24px'}}>
          ID: {id}
        </p>
        <p style={{fontSize: '13px', color: '#999', marginBottom: '32px'}}>
          Verifica que el ID sea correcto y que la propiedad esté publicada.
        </p>
        <button 
          onClick={() => navigate('/')} 
          style={{
            padding: '14px 32px', 
            background: '#000', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '6px', 
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.background = '#1a1a1a'}
          onMouseOut={(e) => e.target.style.background = '#000'}
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  const images = getImages();
  const operationType = property.operacion === 'SALE' ? 'Venta' : 'Renta';

  return (
    <main className="property-detail">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb" aria-label="Navegación de migas de pan">
        <a href="/">INMOBIFY 360</a>
        <span>→</span>
        <button 
          className="breadcrumb-link" 
          onClick={() => handleSearchByOperation(property.operacion)}
          style={{background:'transparent',border:'none',cursor:'pointer',color:'#000',padding:0}} 
          aria-label={`Ir a propiedades en ${operationType}`}
        >
          {operationType}
        </button>
        <span>→</span>
        <button 
          className="breadcrumb-link" 
          onClick={() => handleSearchByType(property?.typeProperty?.name)}
          style={{background:'transparent',border:'none',cursor:'pointer',color:'#000',padding:0}} 
          aria-label={`Ir a ${property?.typeProperty?.name || 'propiedades'}`}
        >
          {property?.typeProperty?.name || 'Propiedad'}
        </button>
        <span>→</span>
        <span>{property?.titulo}</span>
      </nav>

      <article className="detail-container">
        {/* CONTENIDO PRINCIPAL */}
        <div className="detail-main-content">
          {/* GALERÍA - Grid: 1 imagen grande + 4 pequeñas */}
          <section className="gallery-section">
            <div className="gallery-wrapper">
              {/* Imagen Principal - Lado Izquierdo */}
              <div className="gallery-main-wrapper">
                <div className="gallery-main">
                  <img 
                    src={images[currentImageIndex]} 
                    alt={property.titulo}
                    className="gallery-main-image"
                    onError={(e) => { 
                      console.error('❌ Error cargando imagen:', e.target.src);
                      e.target.src = PLACEHOLDER_IMAGE; 
                    }}
                  />

                  {/* Header con contador */}
                  <div className="gallery-header">
                    <div className="gallery-counter">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </div>

                  {/* Navegación */}
                  {images.length > 1 && (
                    <div className="gallery-nav-buttons">
                      <button 
                        className="gallery-nav-btn" 
                        onClick={handlePrevImage}
                        aria-label="Imagen anterior"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button 
                        className="gallery-nav-btn" 
                        onClick={handleNextImage}
                        aria-label="Siguiente imagen"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Grid de 4 Miniaturas - Lado Derecho */}
              {images.length > 1 && (
                <div className="mini-gallery">
                  {images.slice(1, 5).map((img, idx) => {
                    const actualIndex = idx + 1;
                    const isLast = idx === 3;
                    const hasMore = images.length > 5;
                    const remaining = images.length - 5;
                    
                    return (
                      <div
                        key={actualIndex}
                        className={`mini-gallery-item ${actualIndex === currentImageIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(actualIndex)}
                      >
                        <img 
                          src={img} 
                          alt={`Vista ${actualIndex + 1}`} 
                          onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }} 
                        />
                        {isLast && hasMore && (
                          <div className="mini-gallery-overlay">
                            +{remaining}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* INFORMACIÓN - Precio, Título, Specs, Ubicación */}
          <section className="info-section">
            <div className="info-header">
              {/* Precio */}
              <h1 className="property-price-details">{formatPrice(property.precio)} COP</h1>
              
              {/* Nombre de la propiedad */}
              <h2 className="property-name">{property.titulo}</h2>
              
              {/* Especificaciones en línea */}
              <div className="specs-inline">
                {property.habitaciones > 0 && (
                  <span>
                    <Bed size={16} />
                    {property.habitaciones} {property.habitaciones === 1 ? 'habitación' : 'habitaciones'}
                  </span>
                )}
                {property.banos > 0 && (
                  <span>
                    <Bath size={16} />
                    {property.banos} {property.banos === 1 ? 'baño' : 'baños'}
                  </span>
                )}
                {property.areaConstruida > 0 && (
                  <span>
                    <Maximize2 size={16} />
                    {property.areaConstruida} m²
                  </span>
                )}
                {property.parqueaderos > 0 && (
                  <span>
                    <Car size={16} />
                    {property.parqueaderos} {property.parqueaderos === 1 ? 'parqueadero' : 'parqueaderos'}
                  </span>
                )}
              </div>
            </div>

            {/* Ubicación */}
            <div className="location-info">
              <MapPin size={18} />
              <p className="location-address">{property.direccion}</p>
              <p className="location-area">
                {property.barrio || 'Barrio'} • {property.ciudad || property.city?.name || 'Ciudad'}
              </p>
            </div>
          </section>

          {/* CONTENEDOR FLEX - Características y Contacto */}
          <div className="content-wrapper">
            {/* CARACTERÍSTICAS */}
            <section className="characteristics-section">
              <div className="section-header">
                <h3>Características de la propiedad</h3>
              </div>
              
              <div className="section-content">
                {/* Descripción */}
                {property.descripcion && (
                  <div className="description-block">
                    <h4>Descripción</h4>
                    <p className="description-text">{property.descripcion}</p>
                  </div>
                )}

                {/* Interior - Grid mejorado */}
                <div className="features-block">
                  <h4>Detalles del inmueble</h4>
                  <div className="features-grid">
                    {property.areaConstruida > 0 && (
                      <div className="feature-item">
                        <div className="feature-icon">
                          <Maximize2 size={20} />
                        </div>
                        <div className="feature-info">
                          <span className="feature-label">Área total</span>
                          <span className="feature-value">{property.areaConstruida} m²</span>
                        </div>
                      </div>
                    )}
                    {property.habitaciones > 0 && (
                      <div className="feature-item">
                        <div className="feature-icon">
                          <Bed size={20} />
                        </div>
                        <div className="feature-info">
                          <span className="feature-label">Habitaciones</span>
                          <span className="feature-value">{property.habitaciones}</span>
                        </div>
                      </div>
                    )}
                    {property.banos > 0 && (
                      <div className="feature-item">
                        <div className="feature-icon">
                          <Bath size={20} />
                        </div>
                        <div className="feature-info">
                          <span className="feature-label">Baños</span>
                          <span className="feature-value">{property.banos}</span>
                        </div>
                      </div>
                    )}
                    {property.parqueaderos > 0 && (
                      <div className="feature-item">
                        <div className="feature-icon">
                          <Car size={20} />
                        </div>
                        <div className="feature-info">
                          <span className="feature-label">Parqueaderos</span>
                          <span className="feature-value">{property.parqueaderos}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Zonas Comunes - SIN ICONOS */}
                {property.commonAreas && property.commonAreas.length > 0 && (
                  <div className="amenities-block">
                    <h4>Zonas comunes</h4>
                    <ul className="simple-list">
                      {property.commonAreas.map((area, idx) => (
                        <li key={idx}>{area.commonArea?.name || area.name}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Lugares Cercanos - SIN ICONOS */}
                {property.properties && property.properties.length > 0 && (
                  <div className="nearby-block">
                    <h4>Lugares cercanos</h4>
                    <ul className="simple-list">
                      {property.properties.map((nearby, idx) => (
                        <li key={idx}>{nearby.nearbyPlace?.name || nearby.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>

            {/* MINI CARD - CONTACTO */}
            <aside className="contact-sidebar">
              <div className="contact-box">
                <h3>Contactar Asesor</h3>
                <p className="contact-desc">
                  Obtén información detallada sobre esta propiedad y agenda una visita
                </p>
                
                <button 
                  className="whatsapp-button"
                  onClick={handleOpenWhatsApp}
                >
                  <MessageCircle size={20} />
                  Enviar WhatsApp
                </button>
                
                <p className="availability">Disponible Lunes - Domingo</p>

                <div className="action-icons">
                  <button 
                    className="icon-btn"
                    onClick={handleShare}
                    title="Compartir propiedad"
                  >
                    <Share2 size={20} />
                  </button>
                  <button 
                    className="icon-btn"
                    onClick={() => alert('Función de guardado próximamente')}
                    title="Guardar en favoritos"
                  >
                    <Heart size={20} />
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </main>
  );
};

export default PropertyDetail;