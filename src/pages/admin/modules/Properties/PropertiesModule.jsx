import React, { useEffect, useState } from 'react';
import { getProperties, createProperty, updateProperty, deleteProperty } from '../../../../services/propertyService';
import { getCountries } from '../../../../services/CountriesService';
import { getDepartments } from '../../../../services/DepartamentsService';
import { getCities } from '../../../../services/CitiesService';
import { getNeighborhoods } from '../../../../services/NeighborhoodsService';
import { getTypes } from '../../../../services/TypesService';
import { getOwners } from '../../../../services/OwnersService';
import PropertiesTable from './PropertiesTable';
import PropertiesStepsForm from './PropertiesStepsForm';
import './styles/properties.css';

export default function PropertiesModule() {
  const [items, setItems] = useState([]);
  const [countries, setCountries] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [types, setTypes] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [primaryImageId, setPrimaryImageId] = useState(null);

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
    setUploadedImages(item?.imagenes ? JSON.parse(typeof item.imagenes === 'string' ? item.imagenes : JSON.stringify(item.imagenes)) : []);
    setPrimaryImageId(item?.primaryImageId || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
        <h2>Propiedades</h2>
        <button className="btn btn--primary" onClick={() => handleOpenModal()}>
          + Crear Propiedad
        </button>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <PropertiesTable items={items} loading={loading} onEdit={handleOpenModal} onDelete={handleDelete} />

      {isModalOpen && (
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
