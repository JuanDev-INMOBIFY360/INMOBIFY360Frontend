import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropertyCard from "./PropertyCard";
import { getProperties, getProperty, createProperty, updateProperty, deleteProperty } from "../../../../services/propertyService";
import FormProperty from "./propertyForm.jsx";
import "../../GlobalStyles/globalStyles.css";
import "./propertyCards.css";

export default function TableProperty() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    const filtered = properties.filter(
      (p) =>
        p.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.barrio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.ciudad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.propietario?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProperties(filtered);
  }, [searchTerm, properties]);

  const fetchProperties = async () => {
    try {
      const data = await getProperties();
      setProperties(data || []);
      setFilteredProperties(data || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = async (property = null) => {
    if (property?.id) {
      // Obtener datos completos de la propiedad
      try {
        setLoading(true);
        const fullProperty = await getProperty(property.id);
        setPropertyToEdit(fullProperty);
        setModalOpen(true);
      } catch (error) {
        console.error("Error cargando propiedad:", error);
        alert("Error al cargar los datos de la propiedad");
      } finally {
        setLoading(false);
      }
    } else {
      setPropertyToEdit(null);
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setPropertyToEdit(null);
  };

  const handleSaveProperty = async (payload) => {
    try {
      if (propertyToEdit?.id) {
        // Actualizar propiedad existente
        await updateProperty(propertyToEdit.id, payload);
      } else {
        // Crear nueva propiedad
        await createProperty(payload);
      }
      await fetchProperties();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving property:", error);
      throw error; // Re-throw para que el formulario maneje el error
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta propiedad? Esta acción no se puede deshacer.")) {
      try {
        setLoading(true);
        await deleteProperty(propertyId);
        await fetchProperties();
      } catch (error) {
        console.error("Error deleting property:", error);
        alert("Error al eliminar la propiedad");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <p>Cargando propiedades...</p>;

  return (
    <section className="container-module">
      <header className="header-module">
        <h1 className="title-module">Gestión de Propiedades</h1>
      </header>

      <div className="controls">
        <div className="search-container">
          <input
            type="search"
            placeholder="Buscar propiedades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-module"
          />
        </div>

        <button className="btn-add" onClick={() => handleOpenModal()}>
          <span className="btn-add-icon">+</span>
          Agregar Propiedad
        </button>
      </div>

      {filteredProperties.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          {searchTerm
            ? `No se encontraron propiedades que coincidan con "${searchTerm}"`
            : "No hay propiedades registradas"}
        </div>
      ) : (
        <div className="property-grid">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onEdit={() => handleOpenModal(property)}
              onView={() => navigate(`/properties/${property.id}`)}
              onDelete={() => handleDeleteProperty(property.id)}
            />
          ))}
        </div>
      )}

      <FormProperty
        isOpen={modalOpen}
        onClose={handleCloseModal}
        propertyToEdit={propertyToEdit}
        onSave={handleSaveProperty}
      />
    </section>
  );
}