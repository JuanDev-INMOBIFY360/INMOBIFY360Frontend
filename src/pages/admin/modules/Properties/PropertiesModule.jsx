import React, { useEffect, useState } from 'react';
import { getProperties, createProperty, updateProperty, deleteProperty } from '../../../../services/propertyService';
import { getCountries } from '../../../../services/CountriesService';
import { getDepartments } from '../../../../services/DepartamentsService';
import { getCities } from '../../../../services/CitiesService';
import { getNeighborhoods } from '../../../../services/NeighborhoodsService';
import { getTypes } from '../../../../services/TypesService';
import { getOwners } from '../../../../services/OwnersService';
import { useModal } from '../../../../hooks/useModal';
import { usePagination } from '../../../../hooks/usePagination';
import PropertiesStepsForm from './PropertiesStepsForm';
import { propertiesConfig } from './config';
import ErrorMessage from '../../../../components/ErrorMessage';
import LoadingSpinner from '../../../../components/Loading';
import Pagination from '../../../../components/Pagination';
import { Edit2, Trash2, MapPin, Bed, Bath, Car, Maximize } from 'lucide-react';
import './styles/properties.css';

export default function PropertiesModule() {
  const { isOpen, onOpen, onClose } = useModal();
  const [items, setItems] = useState([]);
  const [countries, setCountries] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [types, setTypes] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [primaryImageId, setPrimaryImageId] = useState(null);
  
  // Paginación: máximo 10 propiedades por página
  const pagination = usePagination(items, 10);
  const paginatedItems = pagination.paginatedItems;

  const loadData = async () => {
    try {
      setLoading(true);
      const [
        propsData,
        countriesData,
        deptsData,
        citiesData,
        neighData,
        typesData,
        ownersData
      ] = await Promise.all([
        getProperties(),
        getCountries(),
        getDepartments(),
        getCities(),
        getNeighborhoods(),
        getTypes(),
        getOwners()
      ]);
      setItems(propsData || []);
      setCountries(countriesData || []);
      setDepartments(deptsData || []);
      setCities(citiesData || []);
      setNeighborhoods(neighData || []);
      setTypes(typesData || []);
      setOwners(ownersData || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error cargando propiedades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    if (item?.imagenes) {
      try {
        const images = typeof item.imagenes === 'string' ? JSON.parse(item.imagenes) : item.imagenes;
        setUploadedImages(Array.isArray(images) ? images : []);
      } catch (error) {
        console.error('❌ Error parsing images:', error);
        setUploadedImages([]);
      }
    } else {
      setUploadedImages([]);
    }
    setPrimaryImageId(item?.primaryImageId || null);
    onOpen();
  };

  const handleCloseModal = () => {
    onClose();
    setEditingItem(null);
    setUploadedImages([]);
    setPrimaryImageId(null);
  };

  const handleSave = async (formData) => {
    try {
      setIsSubmitting(true);
      const dataWithImages = {
        ...formData,
        imagenes: JSON.stringify(uploadedImages),
        primaryImageId
      };
      if (editingItem) {
        await updateProperty(editingItem.id, dataWithImages);
      } else {
        await createProperty(dataWithImages);
      }
      await loadData();
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Error guardando propiedad');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de que desea eliminar esta propiedad?')) {
      return;
    }
    try {
      await deleteProperty(id);
      await loadData();
    } catch (err) {
      setError(err.message || 'Error eliminando propiedad');
    }
  };

  return (
    <section className="properties-module">
      <div className="properties-header">
        <h2>{propertiesConfig.moduleNamePlural}</h2>
        <button className="btn btn--primary" onClick={() => handleOpenModal()}>
          + Crear {propertiesConfig.moduleName}
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadData} />}
      {loading && <LoadingSpinner message="Cargando propiedades..." />}

      {!loading && items.length === 0 && (
        <div className="empty-state">
          <p>{propertiesConfig.messages.empty}</p>
        </div>
      )}

      {!loading && items.length > 0 && (
        <>
          <div className="properties-grid">
            {paginatedItems.map(property => {
              const propType = types.find(t => t.id === property.typeId);
              const neighborhood = neighborhoods.find(n => n.id === property.neighborhoodId);
              const city = cities.find(c => c.id === property.cityId);
              const imageUrl = property.imagenes 
                ? (typeof property.imagenes === 'string' ? JSON.parse(property.imagenes)[0]?.url : property.imagenes[0]?.url)
                : null;

              return (
                <article key={property.id} className="property-card-wrapper">
                  <div className="property-card-inner">
                    {/* IMAGEN */}
                    <div className="property-image-wrapper">
                      <img 
                        src={imageUrl || 'https://via.placeholder.com/400x300?text=Sin+imagen'} 
                        alt={property.address}
                        className="property-image"
                      />
                      <div className="property-image-overlay"></div>
                      {propType && (
                        <span className="property-badge">{propType.name}</span>
                      )}
                    </div>

                    {/* CONTENIDO */}
                    <div className="property-card-content">
                      {/* UBICACIÓN */}
                      <div className="property-location">
                        <MapPin size={20} className="property-location-icon" />
                        <div className="property-location-text">
                          <p className="property-address">{property.address}</p>
                          <button 
                            className="property-city-btn"
                            style={{background:'transparent',border:'none',cursor:'pointer',color:'#6b7280',padding:0,textAlign:'left'}}
                          >
                            {city?.name || 'Ciudad no disponible'}
                          </button>
                        </div>
                      </div>

                      {/* CARACTERÍSTICAS */}
                      <ul className="property-features">
                        {property.bedrooms && (
                          <li className="property-feature">
                            <Bed size={16} className="property-feature-icon" />
                            <span>{property.bedrooms}</span>
                          </li>
                        )}
                        {property.bathrooms && (
                          <li className="property-feature">
                            <Bath size={16} className="property-feature-icon" />
                            <span>{property.bathrooms}</span>
                          </li>
                        )}
                        <li className="property-feature">
                          <MapPin size={16} className="property-feature-icon" />
                          <span>{neighborhood?.name || 'N/A'}</span>
                        </li>
                      </ul>

                      {/* FOOTER */}
                      <footer className="property-footer">
                        <div>
                          <span className="property-price-label">Precio</span>
                          <p className="property-price">${property.price?.toLocaleString('es-CO') || '0'}</p>
                        </div>
                        <div className="property-actions">
                          <button 
                            className="action-btn action-btn--edit"
                            onClick={() => handleOpenModal(property)}
                            title="Editar"
                            type="button"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            className="action-btn action-btn--delete"
                            onClick={() => handleDelete(property.id)}
                            title="Eliminar"
                            type="button"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </footer>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* PAGINADOR */}
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={items.length}
            itemsPerPage={10}
            onPageChange={pagination.handlePageChange}
            isLoading={loading}
          />
        </>
      )}

      {isOpen && (
        <PropertiesStepsForm
          item={editingItem}
          countries={countries}
          departments={departments}
          cities={cities}
          neighborhoods={neighborhoods}
          types={types}
          owners={owners}
          uploadedImages={uploadedImages}
          setUploadedImages={setUploadedImages}
          primaryImageId={primaryImageId}
          setPrimaryImageId={setPrimaryImageId}
          onSave={handleSave}
          onClose={handleCloseModal}
          isSubmitting={isSubmitting}
        />
      )}
    </section>
  );
}
