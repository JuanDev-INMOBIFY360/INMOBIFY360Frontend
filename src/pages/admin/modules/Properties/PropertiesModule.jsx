import React, { useEffect, useState } from 'react';
import { getProperties, createProperty, updateProperty, deleteProperty } from '../../../../services/propertyService';
import { getCountries } from '../../../../services/CountriesService';
import { getDepartments } from '../../../../services/DepartamentsService';
import { getCities } from '../../../../services/CitiesService';
import { getNeighborhoods } from '../../../../services/NeighborhoodsService';
import { getTypes } from '../../../../services/TypesService';
import { getOwners } from '../../../../services/OwnersService';
import PropertiesStepsForm from './PropertiesStepsForm';
import { propertiesConfig } from './config';
import ErrorMessage from '../../../../components/ErrorMessage';
import LoadingSpinner from '../../../../components/Loading';
import Pagination from '../../../../components/Pagination';
import { Edit2, Trash2, MapPin, Bed, Bath, Maximize } from 'lucide-react';
import { usePagination } from '../../../../hooks/usePagination';
import './styles/properties.css';

export default function PropertiesModule() {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
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
  
  const pagination = usePagination(items, 6);
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
              const owner = owners.find(o => o.id === property.ownerId);
              
              let imageUrl = null;
              try {
                const images = property.imagenes 
                  ? (typeof property.imagenes === 'string' ? JSON.parse(property.imagenes) : property.imagenes)
                  : [];
                imageUrl = Array.isArray(images) && images.length > 0 ? images[0].url || images[0] : null;
              } catch (e) {
                console.error('Error parsing images:', e);
              }

              return (
                <article key={property.id} className="property-card">
                  {/* IMAGEN CON OVERLAY */}
                  <div className="property-card__image-wrapper">
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt={property.titulo || property.address}
                        className="property-card__image"
                      />
                    ) : (
                      <div className="property-card__no-image">
                        Sin imagen
                      </div>
                    )}
                    <div className="property-card__overlay"></div>
                    
                    {/* BADGE DEL TIPO */}
                    {propType && (
                      <span className="property-card__badge">{propType.name}</span>
                    )}
                  </div>

                  {/* CONTENIDO */}
                  <div className="property-card__content">
                    {/* TÍTULO */}
                    <h3 className="property-card__title">
                      {property.titulo || property.address}
                    </h3>

                    {/* UBICACIÓN */}
                    <div className="property-card__location">
                      <MapPin size={18} className="property-card__location-icon" />
                      <div className="property-card__location-text">
                        <p className="property-card__address">
                          {property.address || property.direccion}
                        </p>
                        <p className="property-card__city">
                          {neighborhood?.name || ''}{neighborhood?.name && city?.name ? ', ' : ''}{city?.name || ''}
                        </p>
                      </div>
                    </div>

                    {/* CARACTERÍSTICAS */}
                    <div className="property-card__features">
                      {property.bedrooms || property.habitaciones ? (
                        <div className="property-card__feature">
                          <Bed size={16} />
                          <span>{property.bedrooms || property.habitaciones}</span>
                        </div>
                      ) : null}
                      
                      {property.bathrooms || property.banos ? (
                        <div className="property-card__feature">
                          <Bath size={16} />
                          <span>{property.bathrooms || property.banos}</span>
                        </div>
                      ) : null}
                      
                      {property.area ? (
                        <div className="property-card__feature">
                          <Maximize size={16} />
                          <span>{property.area} m²</span>
                        </div>
                      ) : null}
                    </div>

                    {/* FOOTER CON PRECIO Y ACCIONES */}
                    <div className="property-card__footer">
                      <div className="property-card__price-section">
                        <span className="property-card__price-label">Precio</span>
                        <p className="property-card__price">
                          ${(property.price || property.precio)?.toLocaleString('es-CO') || '0'}
                        </p>
                        {owner && (
                          <p className="property-card__owner">{owner.name}</p>
                        )}
                      </div>
                      
                      <div className="property-card__actions">
                        <button 
                          className="action-btn action-btn--edit"
                          onClick={() => handleOpenModal(property)}
                          title="Editar"
                          type="button"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          className="action-btn action-btn--delete"
                          onClick={() => handleDelete(property.id)}
                          title="Eliminar"
                          type="button"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

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