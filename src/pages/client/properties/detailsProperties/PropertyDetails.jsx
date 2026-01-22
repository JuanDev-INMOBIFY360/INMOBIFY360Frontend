import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  MapPin, Bed, Bath, Car, Maximize2, Building, 
  Share2, Heart, Phone, Mail, User, CheckCircle, ChevronLeft, ChevronRight
} from 'lucide-react';
import { getProperty } from '../../../../services/propertyService';
import { searchByCategory, searchByType } from '../../../../utils/searchHelpers';
import './PropertyDetail.css';

const PropertyDetail = () => {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221200%22 height=%22800%22%3E%3Crect fill=%22%23e2e8f0%22 width=%221200%22 height=%22800%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2248%22 font-weight=%22600%22 fill=%22%23718096%22 text-anchor=%22middle%22 dy=%22.3em%22%3ESin imagen disponible%3C/text%3E%3C/svg%3E';

  const [formData, setFormData] = useState({
    nombre: '',
    identificacion: '',
    telefono: '',
    email: '',
    aceptaTerminos: false,
    quiereAsesoria: false,
    aceptaDatos: false
  });

  useEffect(() => {
    if (!propertyId) {
      setLoading(false);
      return;
    }

    const loadProperty = async () => {
      try {
        const data = await getProperty(propertyId);
        console.log("✅ Propiedad cargada:", data);
        setProperty(data);
      } catch (err) {
        console.error("❌ Error cargando propiedad:", err);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [propertyId]);

  const getImages = () => {
    if (!property) return [PLACEHOLDER_IMAGE];
    return property.images?.length > 0 
      ? property.images.map(img => img.url)
      : [PLACEHOLDER_IMAGE];
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulario enviado:', formData);
    // Aquí enviarías los datos a tu API
  };

  const handlePrevImage = () => {
    const images = getImages();
    setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
  };

  const handleNextImage = () => {
    const images = getImages();
    setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
  };

  if (loading) {
    return <div className="detail-loading">Cargando propiedad...</div>;
  }

  if (!property) {
    return (
      <div className="detail-loading">
        <p>Propiedad no encontrada</p>
        <button onClick={() => navigate('/')} style={{marginTop: '20px', padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'}}>
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
        <button className="breadcrumb-link" onClick={() => navigate(`/?operacion=${property.operacion}`)} style={{background:'transparent',border:'none',cursor:'pointer',color:'#0066cc',padding:0}} aria-label={`Ir a propiedades en ${operationType}`}>
          {operationType}
        </button>
        <span>→</span>
        <button className="breadcrumb-link" onClick={() => navigate(searchByType(property?.typeProperty?.name))} style={{background:'transparent',border:'none',cursor:'pointer',color:'#0066cc',padding:0}} aria-label={`Ir a ${property?.typeProperty?.name || 'propiedades'}`}>
          {property?.typeProperty?.name || 'Propiedad'}
        </button>
        <span>→</span>
        <span>{property?.titulo}</span>
      </nav>

      <article className="detail-container">
        {/* Columna Izquierda - Galería e Info */}
        <section className="detail-main">
          {/* Galería de Imágenes */}
          <section className="gallery" aria-label="Galería de imágenes">
            <div className="gallery-main">
              <img 
                src={images[currentImageIndex]} 
                alt={property.titulo}
                className="gallery-main-image"
                onError={(e) => {
                  e.target.src = PLACEHOLDER_IMAGE;
                }}
              />
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
              <div className="gallery-counter">
                {currentImageIndex + 1} de {images.length}
              </div>
            </div>
            
            {images.length > 1 && (
              <div className="gallery-thumbnails" role="region" aria-label="Miniaturas de imágenes">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Foto ${idx + 1}`}
                    className={`gallery-thumbnail ${currentImageIndex === idx ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(idx)}
                    role="button"
                    tabIndex="0"
                    aria-pressed={currentImageIndex === idx}
                    onKeyPress={(e) => e.key === 'Enter' && setCurrentImageIndex(idx)}
                    onError={(e) => {
                      e.target.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Precio y Ubicación */}
          <header className="property-header">
            <h1 className="property-title">{formatPrice(property.precio)}</h1>
            <h2 className="property-subtitle">{property.titulo}</h2>
            <div className="property-meta" role="doc-subtitle">
              {property.areaConstruida > 0 && (
                <>
                  <span className="property-meta-item">
                    <Maximize2 size={16} aria-hidden="true" /> {property.areaConstruida} m²
                  </span>
                  <span className="property-meta-separator" aria-hidden="true">|</span>
                </>
              )}
              {property.habitaciones > 0 && (
                <>
                  <span className="property-meta-item">
                    <Bed size={16} aria-hidden="true" /> {property.habitaciones} hab
                  </span>
                  <span className="property-meta-separator" aria-hidden="true">|</span>
                </>
              )}
              {property.banos > 0 && (
                <>
                  <span className="property-meta-item">
                    <Bath size={16} aria-hidden="true" /> {property.banos} baños
                  </span>
                  <span className="property-meta-separator" aria-hidden="true">|</span>
                </>
              )}
              {property.parqueaderos > 0 && (
                <span className="property-meta-item">
                  <Car size={16} aria-hidden="true" /> {property.parqueaderos} parq.
                </span>
              )}
            </div>
            <div className="property-location">
              <MapPin size={18} aria-hidden="true" />
              <div>
                <span>{property.direccion}</span>
                {property.barrio && <span className="barrio">{property.barrio}</span>}
                <span className="ciudad">{property.ciudad}</span>
              </div>
            </div>
          </header>

          {/* Características */}
          <section className="characteristics" aria-labelledby="characteristics-title">
            <h3 id="characteristics-title" className="section-title">
              <Building size={20} aria-hidden="true" />
              Características
            </h3>

            {property.descripcion && (
              <section className="characteristics-section">
                <h4>Descripción</h4>
                <p className="description-text">{property.descripcion}</p>
              </section>
            )}

            <section className="characteristics-section">
              <h4>Detalles</h4>
              <div className="characteristics-grid">
                {property.areaConstruida > 0 && (
                  <article className="characteristic-item">
                    <Maximize2 className="characteristic-icon" aria-hidden="true" />
                    <div>
                      <span className="characteristic-label">Área construida</span>
                      <span className="characteristic-value">{property.areaConstruida} m²</span>
                    </div>
                  </article>
                )}
                {property.habitaciones > 0 && (
                  <article className="characteristic-item">
                    <Bed className="characteristic-icon" aria-hidden="true" />
                    <div>
                      <span className="characteristic-label">Habitaciones</span>
                      <span className="characteristic-value">{property.habitaciones}</span>
                    </div>
                  </article>
                )}
                {property.banos > 0 && (
                  <article className="characteristic-item">
                    <Bath className="characteristic-icon" aria-hidden="true" />
                    <div>
                      <span className="characteristic-label">Baños</span>
                      <span className="characteristic-value">{property.banos}</span>
                    </div>
                  </article>
                )}
                {property.parqueaderos > 0 && (
                  <article className="characteristic-item">
                    <Car className="characteristic-icon" aria-hidden="true" />
                    <div>
                      <span className="characteristic-label">Parqueaderos</span>
                      <span className="characteristic-value">{property.parqueaderos}</span>
                    </div>
                  </article>
                )}
              </div>
            </section>

            {property.commonAreas && property.commonAreas.length > 0 && (
              <section className="characteristics-section">
                <h4>Zonas comunes</h4>
                <ul className="amenities-list">
                  {property.commonAreas.map((area, idx) => (
                    <li key={idx} className="amenity-item">
                      <CheckCircle size={16} className="amenity-icon" aria-hidden="true" />
                      {area.commonArea?.name || area.name}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {property.properties && property.properties.length > 0 && (
              <section className="characteristics-section">
                <h4>Lugares cercanos</h4>
                <ul className="amenities-list">
                  {property.properties.map((nearby, idx) => (
                    <li key={idx} className="amenity-item">
                      <CheckCircle size={16} className="amenity-icon" aria-hidden="true" />
                      {nearby.nearbyPlace?.name || nearby.name} ({nearby.distance ? `${nearby.distance} m` : 'Distancia no especificada'})
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </section>
        </section>

        {/* Columna Derecha - Formulario */}
        <aside className="detail-sidebar" aria-labelledby="contact-title">
          <section className="contact-card">
            <h3 id="contact-title" className="contact-title">Solicita asesoría</h3>
            
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nombre">Nombre completo</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="identificacion">Tipo y número de identificación</label>
                <input
                  type="text"
                  id="identificacion"
                  name="identificacion"
                  value={formData.identificacion}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefono">Número de teléfono</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <fieldset className="form-checkboxes">
                <legend className="visually-hidden">Opciones adicionales</legend>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="quiereAsesoria"
                    checked={formData.quiereAsesoria}
                    onChange={handleInputChange}
                    className="checkbox-input"
                  />
                  <span>Quiero recibir asesoría financiera para mi inmueble</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="aceptaTerminos"
                    checked={formData.aceptaTerminos}
                    onChange={handleInputChange}
                    className="checkbox-input"
                  />
                  <span>He leído y acepto términos y condiciones y políticas de privacidad</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="aceptaDatos"
                    checked={formData.aceptaDatos}
                    onChange={handleInputChange}
                    className="checkbox-input"
                  />
                  <span>He leído y acepto la autorización para el tratamiento de mis datos personales</span>
                </label>
              </fieldset>

              <button type="submit" className="submit-btn">
                Contactar
              </button>
            </form>
          </section>

          {/* Botones de Acción */}
          <div className="action-buttons">
            <button className="action-btn action-btn--secondary" aria-label="Compartir esta propiedad">
              <Share2 size={20} aria-hidden="true" />
              Compartir
            </button>
            <button className="action-btn action-btn--secondary" aria-label="Guardar esta propiedad">
              <Heart size={20} aria-hidden="true" />
              Guardar
            </button>
          </div>
        </aside>
      </article>
    </main>
  );
};

export default PropertyDetail;