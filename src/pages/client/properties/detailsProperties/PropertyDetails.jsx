import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Bed, Bath, Car, Maximize, Building, 
  Share2, Heart, Phone, Mail, User, CheckCircle
} from 'lucide-react';
import { searchByCategory, searchByType } from '../../../../utils/searchHelpers';
import './PropertyDetail.css';

const PropertyDetail = ({ propertyId }) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
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
    // Simular carga de API - Reemplazar con getPropertyById(propertyId)
    const mockProperty = {
      id: 1,
      titulo: "Apartamento en bogotá, d.c. en bogotá, d.c., san andrés",
      descripcion: "Se vende propiedad ubicada en el Conjunto Residencial Torres de Sevilla, en Bogotá D.C. El apartamento está distribuido en 2 habitaciones, 2 baños, sala, comedor, cocina integral, estudio, zoqan de ropa y salón de eventos. Cuenta con buen acceso, elevador y seguridad privada, en buen estado de conservación y con gastos de administración de $150.000. Ubicado en el barrio San Andrés, Kennedy, con cercanía a escuelas. Una excelente oportunidad de inversión en una zona residencial tranquila y segura.",
      precio: 300000000,
      area: 40.3,
      areaPrivada: 40.3,
      habitaciones: 2,
      banos: 2,
      parqueaderos: 0,
      antiguedad: 15,
      administracion: 150000,
      direccion: "Carrera 68D # 40 0",
      ciudad: "Bogotá, D.C.",
      barrio: "San Andrés",
      tipo: "Apartamento",
      amenidades: [
        "Zona de lavandería",
        "Zonas comunes en general",
        "Parque infantil",
        "Salón social"
      ],
      imagenes: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop"
      ]
    };

    setTimeout(() => {
      setProperty(mockProperty);
      setLoading(false);
    }, 500);
  }, [propertyId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
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

  if (loading) {
    return <div className="detail-loading">Cargando propiedad...</div>;
  }

  if (!property) {
    return <div className="detail-loading">Propiedad no encontrada</div>;
  }

  return (
    <main className="property-detail">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb" aria-label="Navegación de migas de pan">
        <a href="/">Tu360Inmobiliario</a>
        <span>→</span>
        <button className="breadcrumb-link" onClick={() => navigate(searchByCategory('Venta'))} style={{background:'transparent',border:'none',cursor:'pointer',color:'#0066cc',padding:0}} aria-label="Ir a propiedades en venta">Venta</button>
        <span>→</span>
        <button className="breadcrumb-link" onClick={() => navigate(searchByType(property?.tipo || property?.typeProperty?.name))} style={{background:'transparent',border:'none',cursor:'pointer',color:'#0066cc',padding:0}} aria-label={`Ir a ${property?.tipo || 'propiedades'}`}>{property?.tipo || property?.typeProperty?.name || 'Propiedad'}</button>
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
                src={property.imagenes[currentImageIndex]} 
                alt={property.titulo}
                className="gallery-main-image"
              />
              <div className="gallery-badge">
                Más de {property.antiguedad} años de antigüedad
              </div>
              <div className="gallery-controls">
                <button className="gallery-control-btn" aria-label="Ver fotos">Foto</button>
                <button className="gallery-control-btn" aria-label="Ver mapa">Mapa</button>
              </div>
            </div>
            
            <div className="gallery-thumbnails" role="region" aria-label="Miniaturas de imágenes">
              {property.imagenes.map((img, idx) => (
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
                />
              ))}
            </div>
          </section>

          {/* Precio y Ubicación */}
          <header className="property-header">
            <h1 className="property-title">{formatPrice(property.precio)}</h1>
            <h2 className="property-subtitle">{property.titulo}</h2>
            <div className="property-meta" role="doc-subtitle">
              <span className="property-meta-item">
                <Bed size={16} aria-hidden="true" /> {property.habitaciones} hab
              </span>
              <span className="property-meta-separator" aria-hidden="true">|</span>
              <span className="property-meta-item">
                <Bath size={16} aria-hidden="true" /> {property.banos} baños
              </span>
              <span className="property-meta-separator" aria-hidden="true">|</span>
              <span className="property-meta-item">
                <Maximize size={16} aria-hidden="true" /> {property.area} m²
              </span>
            </div>
            <div className="property-location">
              <MapPin size={18} aria-hidden="true" />
              <span>{property.direccion}</span>
            </div>
          </header>

          {/* Características */}
          <section className="characteristics" aria-labelledby="characteristics-title">
            <h3 id="characteristics-title" className="section-title">
              <Building size={20} aria-hidden="true" />
              Características
            </h3>

            <section className="characteristics-section">
              <h4>Descripción</h4>
              <p className="description-text">{property.descripcion}</p>
            </section>

            <section className="characteristics-section">
              <h4>Interior</h4>
              <div className="characteristics-grid">
                <article className="characteristic-item">
                  <Maximize className="characteristic-icon" aria-hidden="true" />
                  <div>
                    <span className="characteristic-label">Área</span>
                    <span className="characteristic-value">{property.area} m²</span>
                  </div>
                </article>
                <article className="characteristic-item">
                  <Maximize className="characteristic-icon" aria-hidden="true" />
                  <div>
                    <span className="characteristic-label">Área construida</span>
                    <span className="characteristic-value">{property.areaPrivada} m²</span>
                  </div>
                </article>
                <article className="characteristic-item">
                  <Bed className="characteristic-icon" aria-hidden="true" />
                  <div>
                    <span className="characteristic-label">Habitaciones</span>
                    <span className="characteristic-value">{property.habitaciones}</span>
                  </div>
                </article>
                <article className="characteristic-item">
                  <Bath className="characteristic-icon" aria-hidden="true" />
                  <div>
                    <span className="characteristic-label">Baños</span>
                    <span className="characteristic-value">{property.banos}</span>
                  </div>
                </article>
              </div>
            </section>

            <section className="characteristics-section">
              <h4>Zonas comunes</h4>
              <ul className="amenities-list">
                {property.amenidades.map((amenidad, idx) => (
                  <li key={idx} className="amenity-item">
                    <CheckCircle size={16} className="amenity-icon" aria-hidden="true" />
                    {amenidad}
                  </li>
                ))}
              </ul>
            </section>
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