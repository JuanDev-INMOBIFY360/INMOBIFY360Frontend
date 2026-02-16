import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, MapPin, Bed, Bath, Car, Maximize2, Eye, Home, Tag, Info, ChevronDown } from 'lucide-react';
import { getProperties } from '../../../services/propertyService';
import { getCountries, getDepartments } from '../../../services/LocationsService';
import { normalizeForSearch } from '../../../utils/removeAccents';
import './SearchResults.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// Helper para obtener ciudades y barrios únicos de las propiedades
const extractLocationsFromProperties = (properties) => {
  const cities = new Set();
  const neighborhoods = new Set();
  
  properties.forEach(p => {
    if (p.ciudad || p.city?.name) {
      cities.add(JSON.stringify({
        id: p.cityId || p.city?.id || p.ciudad,
        name: p.ciudad || p.city?.name
      }));
    }
    if (p.barrio || p.neighborhood?.name) {
      neighborhoods.add(JSON.stringify({
        id: p.neighborhoodId || p.neighborhood?.id || p.barrio,
        name: p.barrio || p.neighborhood?.name,
        cityId: p.cityId || p.city?.id
      }));
    }
  });
  
  return {
    cities: Array.from(cities).map(c => JSON.parse(c)),
    neighborhoods: Array.from(neighborhoods).map(n => JSON.parse(n))
  };
};

const formatPrice = (price) => {
  if (!price) return 'Consultar';
  return new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP', 
    minimumFractionDigits: 0 
  }).format(price);
};

const SearchResults = () => {
  const query = useQuery();
  const q = query.get('q') || '';
  const [all, setAll] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Datos de ubicación
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);

  // Estado de filtros
  const [filters, setFilters] = useState({
    category: query.get('category') || '',
    type: query.get('type') || '',
    city: query.get('city') || '',
    department: query.get('department') || '',
    barrio: query.get('barrio') || '',
    minPrice: query.get('minPrice') || '',
    maxPrice: query.get('maxPrice') || '',
    habitaciones: query.get('habitaciones') || '',
    estado: query.get('estado') || ''
  });

  // Estado para mostrar/ocultar filtros adicionales
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    setLoading(true);
    Promise.all([
      getProperties(),
      getCountries()
    ])
      .then(async ([propsData, countriesData]) => {
        if (Array.isArray(propsData)) {
          console.log('Propiedades cargadas:', propsData.length, propsData.slice(0, 2));
          setAll(propsData);
          
          // Extraer ciudades y barrios de las propiedades
          const { cities: extractedCities, neighborhoods: extractedNeighborhoods } = 
            extractLocationsFromProperties(propsData);
          
          setCities(extractedCities);
          setNeighborhoods(extractedNeighborhoods);
        }
        
        // Obtener Colombia (país por defecto)
        if (Array.isArray(countriesData) && countriesData.length > 0) {
          const colombia = countriesData.find(c => c.name === 'Colombia') || countriesData[0];
          if (colombia) {
            try {
              const deptData = await getDepartments(colombia.id);
              if (Array.isArray(deptData)) setDepartments(deptData);
            } catch (err) {
              console.error('Error cargando departamentos:', err);
            }
          }
        }
      })
      .catch((err) => {
        console.error('Error cargando datos:', err);
        setError(err.message || 'Error cargando datos');
      })
      .finally(() => setLoading(false));
  }, []);

  // Opciones únicas para filtros
  const options = useMemo(() => {
    return {
      categories: [...new Set(all.map(p => {
        const op = p.operacion || p.operation?.name || '';
        return op === 'SALE' ? 'Venta' : op === 'RENT' ? 'Arriendo' : op;
      }).filter(Boolean))],
      types: [...new Set(all.map(p => p.typeProperty?.name || p.tipo || '').filter(Boolean))],
      estados: [...new Set(all.map(p => p.estado || 'Usado').filter(Boolean))],
    };
  }, [all]);

  // Aplicar filtros
  useEffect(() => {
    const term = normalizeForSearch(q);
    const filtered = all.filter(p => {
      // Búsqueda por texto
      if (term) {
        const haystack = normalizeForSearch(
          `${p.titulo || ''} ${p.direccion || ''} ${p.ciudad || p.city?.name || ''} ${p.barrio || ''} ${p.typeProperty?.name || ''}`
        );
        if (!haystack.includes(term)) return false;
      }

      // Filtro por categoría (Venta/Arriendo)
      if (filters.category) {
        const propCat = p.operacion === 'SALE' ? 'Venta' : p.operacion === 'RENT' ? 'Arriendo' : p.operacion;
        if (normalizeForSearch(propCat) !== normalizeForSearch(filters.category)) return false;
      }

      // Filtro por tipo
      if (filters.type) {
        const t = normalizeForSearch(p.typeProperty?.name || p.tipo || '');
        if (!t.includes(normalizeForSearch(filters.type))) return false;
      }

      // Filtro por ciudad
      if (filters.city) {
        const propCity = normalizeForSearch(p.ciudad || p.city?.name || '');
        if (!propCity.includes(normalizeForSearch(filters.city))) return false;
      }

      // Filtro por departamento
      if (filters.department) {
        const propDept = normalizeForSearch(p.department?.name || '');
        if (!propDept.includes(normalizeForSearch(filters.department))) return false;
      }

      // Filtro por barrio
      if (filters.barrio) {
        const propBarrio = normalizeForSearch(p.barrio || p.neighborhood?.name || '');
        if (!propBarrio.includes(normalizeForSearch(filters.barrio))) return false;
      }

      // Filtro por estado
      if (filters.estado) {
        if (normalizeForSearch(p.estado || 'Usado') !== normalizeForSearch(filters.estado)) return false;
      }

      // Filtro por habitaciones
      if (filters.habitaciones) {
        const h = Number(p.habitaciones || 0);
        if (h < Number(filters.habitaciones)) return false;
      }

      // Filtro por precio
      if (filters.minPrice) {
        const price = Number(p.precio || 0);
        if (price < Number(filters.minPrice)) return false;
      }
      if (filters.maxPrice) {
        const price = Number(p.precio || 0);
        if (price > Number(filters.maxPrice)) return false;
      }

      return true;
    });
    setResults(filtered);
  }, [all, q, filters]);

  // Limpiar todos los filtros
  const clearFilters = () => {
    setFilters({
      category: '',
      type: '',
      city: '',
      department: '',
      barrio: '',
      minPrice: '',
      maxPrice: '',
      habitaciones: '',
      estado: ''
    });
  };

  // Filtros activos para mostrar badges
  const activeFilters = Object.entries(filters).filter(([_, v]) => v);

  // Ciudades filtradas por departamento
  const filteredCities = useMemo(() => {
    if (!filters.department) return cities;
    const dept = departments.find(d => d.name === filters.department);
    if (!dept) return cities;
    return cities.filter(c => c.departmentId === dept.id);
  }, [filters.department, cities, departments]);

  // Barrios filtrados por ciudad
  const filteredNeighborhoods = useMemo(() => {
    if (!filters.city) return neighborhoods;
    const city = cities.find(c => c.name === filters.city);
    if (!city) return neighborhoods;
    return neighborhoods.filter(n => n.cityId === city.id);
  }, [filters.city, neighborhoods, cities]);

  const handleViewProperty = (id) => {
    console.log('Navigating to property:', id);
    navigate(`/properties/${id}`);
  };

  if (loading) return <div className="search-loading">Cargando propiedades...</div>;
  if (error) return <div className="search-error">Error: {error}</div>;

  return (
    <main className="search-results-page">
      <div className="search-results-container">
        {/* Sidebar de Filtros */}
        <aside className="search-sidebar">
          {/* Header */}
          <div className="sidebar-header">
            <div className="sidebar-title">
              <h1>Buscar por ciudad</h1>
             
            </div>
          </div>

          {/* City Search Input */}
          <div className="city-search-box">
            <input
              type="text"
              placeholder="Ingresa una ciudad"
              value={filters.city}
              onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value, barrio: '' }))}
              className="city-search-input"
            />
          </div>

          {/* Contador de resultados */}
          <div className="results-count">
            <span className="count-text">Inmuebles encontrados</span>
            <span className="count-number">{results.length}</span>
          </div>

          {/* Limpiar filtros */}
          {activeFilters.length > 0 && (
            <button className="clear-all-btn" onClick={clearFilters}>
              Borrar Filtros
            </button>
          )}

          {/* Categorías */}
          <section className="filter-section">
            <h3 className="filter-section-title">Categorías</h3>
            <div className="filter-chips">
              {options.categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-chip ${filters.category === cat ? 'active' : ''}`}
                  onClick={() => setFilters(prev => ({ ...prev, category: prev.category === cat ? '' : cat }))}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* Tipo de inmueble */}
          <section className="filter-section">
            <h3 className="filter-section-title">Tipo de inmueble</h3>
            <div className="filter-chips">
              {options.types.map((t) => (
                <button
                  key={t}
                  className={`filter-chip ${filters.type === t ? 'active' : ''}`}
                  onClick={() => setFilters(prev => ({ ...prev, type: prev.type === t ? '' : t }))}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>

          {/* Estado del inmueble */}
          <section className="filter-section">
            <h3 className="filter-section-title">Estado del inmueble</h3>
            <div className="filter-chips">
              {options.estados.map((e) => (
                <button
                  key={e}
                  className={`filter-chip ${filters.estado === e ? 'active' : ''}`}
                  onClick={() => setFilters(prev => ({ ...prev, estado: prev.estado === e ? '' : e }))}
                >
                  {e}
                </button>
              ))}
            </div>
          </section>

          {/* Botón de Filtros Avanzados */}
          <button 
            className="advanced-filters-toggle"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <span>Filtros avanzados</span>
            <ChevronDown 
              size={16} 
              className={`chevron ${showAdvancedFilters ? 'rotated' : ''}`}
            />
          </button>

          {/* Filtros Avanzados */}
          {showAdvancedFilters && (
            <div className="advanced-filters">
              {/* Departamento */}
              <section className="filter-section">
                <label className="filter-label">Departamento</label>
                <select
                  value={filters.department}
                  onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value, city: '', barrio: '' }))}
                  className="filter-select"
                >
                  <option value="">Todos</option>
                  {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </section>

              {/* Ciudad */}
              <section className="filter-section">
                <label className="filter-label">Ciudad</label>
                <select
                  value={filters.city}
                  onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value, barrio: '' }))}
                  className="filter-select"
                >
                  <option value="">Todas</option>
                  {filteredCities.map(c => <option key={c.id || c.name} value={c.name}>{c.name}</option>)}
                </select>
              </section>

              {/* Rango de precios */}
              <section className="filter-section">
                <label className="filter-label">Rango de precios</label>
                <div className="price-inputs-vertical">
                  <input
                    type="number"
                    placeholder="Precio mínimo"
                    value={filters.minPrice}
                    onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                    className="price-input"
                  />
                  <input
                    type="number"
                    placeholder="Precio máximo"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                    className="price-input"
                  />
                </div>
              </section>

              {/* Habitaciones */}
              <section className="filter-section">
                <label className="filter-label">Habitaciones mínimas</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={filters.habitaciones}
                  onChange={(e) => setFilters(prev => ({ ...prev, habitaciones: e.target.value }))}
                  className="filter-select"
                />
              </section>
            </div>
          )}
        </aside>

        {/* Contenido Principal */}
        <section className="search-main">
          {/* Filtros Activos */}
          {activeFilters.length > 0 && (
            <div className="active-filters-bar">
              <span className="active-filters-label">Filtros:</span>
              <div className="active-filters-list">
                {activeFilters.map(([key, value]) => (
                  <button
                    key={key}
                    className="filter-badge"
                    onClick={() => {
                      if (key === 'department') {
                        setFilters(prev => ({ ...prev, department: '', city: '', barrio: '' }));
                      } else if (key === 'city') {
                        setFilters(prev => ({ ...prev, city: '', barrio: '' }));
                      } else {
                        setFilters(prev => ({ ...prev, [key]: '' }));
                      }
                    }}
                  >
                    <span>{value}</span>
                    <X size={14} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Resultados */}
          {results.length === 0 ? (
            <div className="no-results">
              <h2>No se encontraron propiedades</h2>
              <p>Intenta ajustar los filtros para ver más resultados</p>
            </div>
          ) : (
            <div className="properties-grid">
              {results.map((p) => {
                return (
                  <article key={p.id} className="property-card">
                    <div className="property-image">
                      <img
                        src={
                          p.images?.find(img => img.isPrimary)?.url ||
                          p.images?.[0]?.url ||
                          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
                        }
                        alt={p.titulo}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23e2e8f0%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2218%22 fill=%22%23718096%22 text-anchor=%22middle%22%3ESin imagen%3C/text%3E%3C/svg%3E';
                        }}
                        onLoad={() => {}}
                      />
                      <p className="property-location-overlay">
                        <MapPin size={12} /> {p.ciudad || p.city?.name}
                      </p>
                      {/* Badge tipo propiedad */}
                      <span className="property-type-badge-image">{p.typeProperty?.name?.toUpperCase() || 'PROPIEDAD'} | DISPONIBLE</span>
                    </div>
                    <div className="property-content">
                      {/* Company Tag */}
                      <div className="company-tag-property">
                        <div className="company-icon-property">
                          <Home size={11} />
                        </div>
                        <span className="company-name-property">Inmobify360</span>
                        <span className="company-status-property">| {p.operacion === 'SALE' ? 'Venta' : 'Alquiler'}</span>
                      </div>

                      <h3 className="property-title">{p.titulo || p.typeProperty?.name || 'Propiedad'}</h3>
                      
                      {/* Features Inline */}
                      <div className="property-features-inline">
                        {p.areaConstruida > 0 && <span>{p.areaConstruida}m² |</span>}
                        {p.habitaciones > 0 && <span>{p.habitaciones} hab |</span>}
                        {p.banos > 0 && <span>{p.banos} baños |</span>}
                        {p.parqueaderos > 0 && <span>{p.parqueaderos}</span>}
                      </div>

                      <div className="property-footer-search">
                        <p className="property-price">{formatPrice(p.precio)}</p>
                        <span className={`property-type-badge ${p.operacion === 'SALE' ? 'venta' : 'renta'}`}>
                          {p.operacion === 'SALE' ? 'VENTA' : 'RENTA'}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default SearchResults;