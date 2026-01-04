import React, { useState, useEffect } from "react";
import {
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty,
} from "../../../../services/propertyService";
import FormProperty from "./propertyForm";
import { SquarePen, Trash } from "lucide-react";
import "../../GlobalStyles/globalStyles.css";

export default function TableProperty() {
  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    const f = properties.filter(
      (p) =>
        p.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.ciudad?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(f);
  }, [searchTerm, properties]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const data = await getProperties();
      setProperties(data);
      setFiltered(data);
    } catch (error) {
      console.error("Error fetching properties", error);
      alert("Error cargando propiedades");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (property = null) => {
    setPropertyToEdit(property);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPropertyToEdit(null);
  };

  const handleSave = async (payload) => {
    try {
      if (propertyToEdit) {
        await updateProperty(propertyToEdit.id, payload);
      } else {
        await createProperty(payload);
      }
      await fetchProperties();
    } catch (err) {
      throw err;
    }
  };

  const handleDelete = async (id, titulo) => {
    if (!window.confirm(`¿Deseas eliminar la propiedad "${titulo}"?`)) return;
    try {
      await deleteProperty(id);
      await fetchProperties();
    } catch (err) {
      console.error(err);
      alert("Error eliminando propiedad");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) return <p>Cargando propiedades...</p>;

  return (
    <>
      <section className="container-module">
        <header className="header-module">
          <h1 className="title-module">Gestión de Propiedades</h1>
        </header>

        <div className="controls">
          <div>
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

        <div className="table-wrapper">
          <table className="table-module">
            <thead>
              <tr>
                <th>Código</th>
                <th>Título</th>
                <th>Ciudad</th>
                <th>Precio</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data-module">
                    {searchTerm
                      ? `No hay propiedades que coincidan con "${searchTerm}"`
                      : "No hay propiedades registradas"}
                  </td>
                </tr>
              ) : (
                filtered.map((property) => (
                  <tr key={property.id}>
                    <td>{property.codigo}</td>
                    <td>{property.titulo}</td>
                    <td>{property.ciudad}</td>
                    <td>{formatPrice(property.precio)}</td>
                    <td>{property.typeProperty?.name || "—"}</td>
                    <td>
                      <span
                        className={`status-badge status-${property.estado.toLowerCase()}`}
                      >
                        {property.estado}
                      </span>
                    </td>
                    <td className="col-actions">
                      <button
                        type="button"
                        className="btn-edit"
                        aria-label={`Editar propiedad ${property.titulo}`}
                        onClick={() => handleOpenModal(property)}
                      >
                        <SquarePen size={16} />
                      </button>

                      <button
                        type="button"
                        className="btn-delete"
                        aria-label={`Eliminar propiedad ${property.titulo}`}
                        onClick={() => handleDelete(property.id, property.titulo)}
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <FormProperty
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        propertyToEdit={propertyToEdit}
        onSave={handleSave}
      />
    </>
  );
}