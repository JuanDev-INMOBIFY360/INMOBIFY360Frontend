import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, X } from 'lucide-react';
import { getProperties } from '../../../services/propertyService';
import { getCities } from '../../../services/CitiesService';
import { getDepartments } from '../../../services/DepartamentsService';
import { getNeighborhoods } from '../../../services/NeighborhoodsService';
import { normalizeForSearch } from '../../../utils/removeAccents';
import './SearchResults.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResults = () => {
  const query = useQuery();
  const q = query.get('q') || '';
  const [all, setAll] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // API Data
  const [cities, setCities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);

  // Filters state
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

  // Load initial data
  useEffect(() => {
    setLoading(true);
    Promise.all([
      getProperties(),
      getCities(),
      getDepartments(),
      getNeighborhoods()
    ])
      .then(([propsData, citiesData, deptData, neighborhoodsData]) => {
        if (Array.isArray(propsData)) setAll(propsData);
        if (Array.isArray(citiesData)) setCities(citiesData);
        if (Array.isArray(deptData)) setDepartments(deptData);
        if (Array.isArray(neighborhoodsData)) setNeighborhoods(neighborhoodsData);
      })
      .catch((err) => setError(err.message || 'Error cargando datos'))
      .finally(() => setLoading(false));
  }, []);

  // Compute unique filter options from properties
  const options = useMemo(() => {
    return {
      categories: [...new Set(all.map(p => p.operation?.name || p.tipo || '').filter(Boolean))],
      types: [...new Set(all.map(p => p.typeProperty?.name || p.tipo || '').filter(Boolean))],
      estados: [...new Set(all.map(p => p.estado || 'Nuevo').filter(Boolean))],
    };
  }, [all]);

  // Apply filters + search query
  useEffect(() => {
    const term = normalizeForSearch(q);
    const filtered = all.filter(p => {
      const haystack = normalizeForSearch(
        `${p.titulo || ''} ${p.direccion || ''} ${p.city?.name || ''} ${p.department?.name || ''} ${p.typeProperty?.name || ''}`
      );
      if (term && !haystack.includes(term)) return false;

      if (filters.category) {
        const cat = normalizeForSearch(p.operation?.name || p.tipo || '');
        if (!cat.includes(normalizeForSearch(filters.category))) return false;
      }
      if (filters.type) {
        const t = normalizeForSearch(p.typeProperty?.name || p.tipo || '');
        if (!t.includes(normalizeForSearch(filters.type))) return false;
      }
      if (filters.city) {
        const isId = /^\d+$/.test(String(filters.city));
        if (isId) {
          const cityId = p.city?.id ?? p.cityId ?? p.ciudadId;
          if (!cityId || String(cityId) !== String(filters.city)) return false;
        } else {
          const c = normalizeForSearch(p.city?.name || p.ciudad || '');
          if (!c.includes(normalizeForSearch(filters.city))) return false;
        }
      }
      if (filters.department) {
        const isId = /^\d+$/.test(String(filters.department));
        if (isId) {
          const deptId = p.department?.id ?? p.departmentId;
          if (!deptId || String(deptId) !== String(filters.department)) return false;
        } else {
          const d = normalizeForSearch(p.department?.name || '');
          if (!d.includes(normalizeForSearch(filters.department))) return false;
        }
      }
      if (filters.barrio) {
        const isId = /^\d+$/.test(String(filters.barrio));
        if (isId) {
          const neighId = p.neighborhood?.id ?? p.neighborhoodId ?? p.barrioId ?? null;
          if (!neighId || String(neighId) !== String(filters.barrio)) return false;
        } else {
          const b = normalizeForSearch(p.barrio || p.neighborhood?.name || '');
          if (!b.includes(normalizeForSearch(filters.barrio))) return false;
        }
      }
      if (filters.estado) {
        const e = normalizeForSearch(p.estado || '');
        if (!e.includes(normalizeForSearch(filters.estado))) return false;
      }
      if (filters.habitaciones) {
        const h = Number(p.habitaciones || p.rooms || 0);
        if (isNaN(Number(filters.habitaciones)) || h < Number(filters.habitaciones)) return false;
      }
      if (filters.minPrice) {
        const price = Number(p.precio || p.price || 0);
        if (price < Number(filters.minPrice)) return false;
      }
      if (filters.maxPrice) {
        const price = Number(p.precio || p.price || 0);
        if (price > Number(filters.maxPrice)) return false;
      }

      return true;
    });
    setResults(filtered);
  }, [all, q, filters]);

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

  // Get active filters for display
  const activeFilters = Object.entries(filters).filter(([_, v]) => v);

  // Filtered lists based on selection dependencies
  const filteredCities = useMemo(() => {
    if (!filters.department) return cities;
    return cities.filter(c => {
      // city may have departmentId or department?.id
      const depId = c.departmentId ?? c.department?.id ?? c.departmentId;
      return String(depId) === String(filters.department) || String(c.department?.name) === String(filters.department);
    });
  }, [cities, filters.department]);

  const filteredNeighborhoods = useMemo(() => {
    if (!filters.city) return neighborhoods;
    return neighborhoods.filter(n => {
      const cityId = n.cityId ?? n.city?.id;
      return String(cityId) === String(filters.city) || String(n.city?.name) === String(filters.city);
    });
  }, [neighborhoods, filters.city]);

  const getFilterLabel = (key, value) => {
    if (!value) return '';
    if (key === 'department') {
      const d = departments.find(x => String(x.id) === String(value) || String(x.name) === String(value));
      return d ? d.name : value;
    }
    if (key === 'city') {
      const c = cities.find(x => String(x.id) === String(value) || String(x.name) === String(value));
      return c ? c.name : value;
    }
    if (key === 'barrio') {
      const n = neighborhoods.find(x => String(x.id) === String(value) || String(x.name) === String(value));
      return n ? n.name : value;
    }
    return value;
  };

  if (loading) return <div className="search-results-page"><p>Cargando resultados...</p></div>;
  if (error) return <div className="search-results-page"><p style={{ color: 'red' }}>Error: {error}</p></div>;

  return (
    <main className="search-results-page">
      {/* Header */}
      <header className="search-results-header">
        <h1>{results.length} Inmuebles encontrados</h1>
      </header>

      <div className="search-results-container">
        {/* Sidebar Filters */}
        <aside className="search-filters-sidebar">
          <section className="filters-section">
            <h2 className="filters-title">Encuentra tu Inmueble</h2>
            {activeFilters.length > 0 && (
              <button className="clear-all-btn" onClick={clearFilters}>
                <X size={16} /> Borrar Filtros
              </button>
            )}
          </section>

          {/* Categorías */}
          <section className="filter-group">
            <label className="filter-label">Categorías</label>
            <div className="filter-chips">
              {options.categories.map((c) => (
                <button
                  key={c}
                  className={`chip ${filters.category === c ? 'active' : ''}`}
                  onClick={() => setFilters(prev => ({ ...prev, category: prev.category === c ? '' : c }))}
                >
                  {c}
                </button>
              ))}
            </div>
          </section>

          {/* Tipo de inmueble */}
          <section className="filter-group">
            <label className="filter-label">Tipo de inmueble</label>
            <div className="filter-chips">
              {options.types.map((t) => (
                <button
                  key={t}
                  className={`chip ${filters.type === t ? 'active' : ''}`}
                  onClick={() => setFilters(prev => ({ ...prev, type: prev.type === t ? '' : t }))}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>

          {/* Estado del inmueble */}
          <section className="filter-group">
            <label className="filter-label">Estado del inmueble</label>
            <div className="filter-chips">
              {options.estados.map((e) => (
                <button
                  key={e}
                  className={`chip ${filters.estado === e ? 'active' : ''}`}
                  onClick={() => setFilters(prev => ({ ...prev, estado: prev.estado === e ? '' : e }))}
                >
                  {e}
                </button>
              ))}
            </div>
          </section>

          {/* Zona */}
          <section className="filter-group">
            <label className="filter-label">Departamento</label>
            <select
              value={filters.department}
              onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value, city: '', barrio: '' }))}
              className="filter-select"
            >
              <option value="">Todos los departamentos</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </section>

          {/* Ciudad */}
          <section className="filter-group">
            <label className="filter-label">Ciudad</label>
            <select
              value={filters.city}
              onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value, barrio: '' }))}
              className="filter-select"
            >
              <option value="">Todas las ciudades</option>
              {filteredCities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </section>

          {/* Barrio/Zona */}
          <section className="filter-group">
            <label className="filter-label">Barrio/Zona</label>
            <select
              value={filters.barrio}
              onChange={(e) => setFilters(prev => ({ ...prev, barrio: e.target.value }))}
              className="filter-select"
            >
              <option value="">Todos los barrios</option>
              {filteredNeighborhoods.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
            </select>
          </section>

          {/* Rango de precios */}
          <section className="filter-group">
            <label className="filter-label">Rango de precios (COP)</label>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min $"
                value={filters.minPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                className="price-input"
              />
              <input
                type="number"
                placeholder="Max $"
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                className="price-input"
              />
            </div>
            {filters.minPrice && filters.maxPrice && (
              <p className="price-range-label">Min ${Number(filters.minPrice).toLocaleString()} – Max ${Number(filters.maxPrice).toLocaleString()}</p>
            )}
          </section>

          {/* Habitaciones */}
          <section className="filter-group">
            <label className="filter-label">Habitaciones mínimas</label>
            <input
              type="number"
              min="0"
              value={filters.habitaciones}
              onChange={(e) => setFilters(prev => ({ ...prev, habitaciones: e.target.value }))}
              className="filter-select"
            />
          </section>
        </aside>

        {/* Main Content */}
        <section className="search-results-main">
          {/* Active Filters Display */}
          {activeFilters.length > 0 && (
            <nav className="active-filters" aria-label="Filtros aplicados">
              <strong>Filtros aplicados:</strong>
              {activeFilters.map(([key, value]) => (
                <span key={key} className="filter-badge">
                  {key}: {getFilterLabel(key, value)}
                  <button
                    onClick={() => {
                      if (key === 'department') setFilters(prev => ({ ...prev, department: '', city: '', barrio: '' }));
                      else if (key === 'city') setFilters(prev => ({ ...prev, city: '', barrio: '' }));
                      else setFilters(prev => ({ ...prev, [key]: '' }));
                    }}
                    aria-label={`Remover filtro ${key}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </nav>
          )}

          {/* Sorting */}
          <div className="results-toolbar">
            <div />
            <div className="sort-control">
              <label htmlFor="sort-select">Ordenar por</label>
              <select id="sort-select" className="sort-select">
                <option>Más Relevantes</option>
                <option>Precio: menor a mayor</option>
                <option>Precio: mayor a menor</option>
                <option>Más recientes</option>
              </select>
            </div>
          </div>

          {/* Properties Grid */}
          {results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              No se encontraron propiedades con los filtros seleccionados.
            </div>
          ) : (
            <section className="properties-grid">
              {results.map((p) => (
                <article key={p.id} className="property-card">
                  <div className="property-card-image">
                    <img
                      src={p.imagenes?.[0]?.url || p.imagen || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'}
                      alt={p.direccion || p.titulo}
                    />
                    <span className="property-badge">{p.estado || 'Usado'}</span>
                  </div>
                  <div className="property-card-body">
                    <p className="property-source">Tu360inmobiliario - {p.estado || 'Usado'}</p>
                    <h3 className="property-title">{p.titulo || p.typeProperty?.name || 'Propiedad'}</h3>
                    <p className="property-location">
                      {p.city?.name || p.ciudad} | {p.area}m² | {p.habitaciones || 0} hab
                    </p>
                    <p className="property-price">
                      ${new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0 }).format(p.precio || 0)}
                    </p>
                    <button className="property-btn" onClick={() => navigate(`/properties/${p.id}`)}>
                      Ver detalle
                    </button>
                  </div>
                </article>
              ))}
            </section>
          )}
        </section>
      </div>
    </main>
  );
};

export default SearchResults;