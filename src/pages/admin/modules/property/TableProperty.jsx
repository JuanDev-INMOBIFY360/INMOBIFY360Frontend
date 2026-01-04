import { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";
import { getProperties } from "../../../../services/propertyService";
import "./propertyCards.css";
import PropertyForm from "./propertyForm.jsx";
export default function TableProperty() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState(null);
  const [step, setStep] = useState(1);

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
            placeholder="Buscar zonas comunes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-module"
          />
        </div>

        <button className="btn-add" onClick={() => setModalOpen(true)}>
          + Agregar Zona
        </button>
      </div>
      <div className="property-grid">
        {filteredProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
      <PropertyForm
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setPropertyToEdit(null);
        }}
        propertyToEdit={propertyToEdit}
        onSave={async (payload) => {
          await createProperty(payload); 
          await fetchProperties();
        }}
      />

      <div className="form-actions">
  {step > 1 && (
    <button className="btn-cancel" onClick={() => setStep(step - 1)}>
      Anterior
    </button>
  )}

  {step < 5 ? (
    <button className="btn-submit" onClick={() => setStep(step + 1)}>
      Siguiente
    </button>
  ) : (
    <button
      className="btn-submit"
      onClick={handleSubmit}
      disabled={isSubmitting}
    >
      {isSubmitting ? "Guardando..." : "Guardar Propiedad"}
    </button>
  )}
</div>
    </section>
  );
}
