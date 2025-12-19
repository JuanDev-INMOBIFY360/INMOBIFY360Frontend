import React, { useState, useEffect } from "react";
import {
  getTypes,
  createType,
  updateType,
  deleteType,
} from "../../../../services/TypesService";
import FormTypes from "./FormTypes";
import {SquarePen, Trash } from "lucide-react"
import "../../GlobalStyles/globalStyles.css";

export default function TableTypes() {
  const [types, setTypes] = useState([]);
  const [filteredTypes, setFilteredTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [typeToEdit, setTypeToEdit] = useState(null);

  useEffect(() => {
    fetchTypes();
  }, []);

  useEffect(() => {
    const filtered = types.filter(
      (t) =>
        t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.description || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTypes(filtered);
  }, [searchTerm, types]);

  const fetchTypes = async () => {
    try {
      const data = await getTypes();
      setTypes(data);
      setFilteredTypes(data);
    } catch (error) {
      console.error("Error fetching types:", error);
      alert("Error al cargar los tipos");
    }
  };

  const handleOpenModal = (type = null) => {
    setTypeToEdit(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTypeToEdit(null);
  };

  const handleSaveType = async (formData) => {
    try {
      if (formData.id) {
        await updateType(formData.id, { name: formData.name });
      } else {
        await createType({ name: formData.name });
      }
      await fetchTypes();
    } catch (error) {
      console.error("Error saving type:", error);
      throw error;
    }
  };

  const handleDeleteType = async (id, name) => {
    if (window.confirm(`¿Estás seguro de eliminar el tipo "${name}"?`)) {
      try {
        await deleteType(id);
        await fetchTypes();
      } catch (error) {
        console.error("Error deleting type:", error);
        alert("Error al eliminar el tipo");
      }
    }
  };

  return (
    <>
      <section className="container-module" aria-labelledby="types-title">
        <header className="header-module">
          <h1 id="types-title" className="title-module">
            Gestión de Tipos de Propiedad
          </h1>
        </header>

        <div className="controls" role="toolbar" aria-label="Controles de tabla">
          <div className="search-container" role="search">
            <input
              id="search-types"
              type="search"
              placeholder="Buscar tipos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-module"
            />
          </div>

          <button
            type="button"
            className="btn-add"
            aria-label="Agregar Tipo de Propiedad"
            onClick={() => handleOpenModal()}
          >
            <span className="btn-add-icon" aria-hidden="true">
              +
            </span>
            Agregar Tipo
          </button>
        </div>

        <div className="table-wrapper">
          <table className="table-module">
            <colgroup>
              <col className="col-id" />
              <col className="col-name" />
              <col className="col-actions" />
            </colgroup>

            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Nombre</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredTypes.length === 0 ? (
                <tr>
                  <td colSpan="3" className="no-data-module">
                    {searchTerm 
                      ? `No hay tipos que coincidan con "${searchTerm}"`
                      : "No hay tipos registrados"
                    }
                  </td>
                </tr>
              ) : (
                filteredTypes.map((type) => (
                  <tr key={type.id}>
                    <td>{type.id}</td>
                    <td>{type.name}</td>
                    <td>
                      <button
                        type="button"
                        className="btn-edit"
                        aria-label={`Editar tipo ${type.name}`}
                        onClick={() => handleOpenModal(type)}
                      >
                        <SquarePen />
                      </button>

                      <button
                        type="button"
                        className="btn-delete"
                        aria-label={`Eliminar tipo ${type.name}`}
                        onClick={() => handleDeleteType(type.id, type.name)}
                      >
                       <Trash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <FormTypes
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        typeToEdit={typeToEdit}
        onSave={handleSaveType}
      />
    </>
  );
}