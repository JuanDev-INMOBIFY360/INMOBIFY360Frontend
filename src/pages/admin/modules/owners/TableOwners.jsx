import React, { useState, useEffect } from 'react';
import { getOwners,createOwner,updateOwner,deleteOwner } from "../../../../services/OwnersService";
import { SquarePen, Trash } from "lucide-react";
import FormOwners from './FormOwners';

export default function TableOwners() {
  const [owners, setOwners] = useState([]);
  const [filteredOwners, setFilteredOwners] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ownerToEdit, setOwnerToEdit] = useState(null);

  useEffect(() => {
    fetchOwners();
  }, []);

  useEffect(() => {
    const filtered = owners.filter(
      (o) =>
        o.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.phone || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOwners(filtered);
  }, [searchTerm, owners]);

  const fetchOwners = async () => {
    try {
      const data = await getOwners();
      setOwners(data);
      setFilteredOwners(data);
    } catch (error) {
      console.error("Error fetching owners:", error);
      alert("Error al cargar los propietarios");
    } finally {
      setLoading(false);
    }
  };

  // placeholders mínimos (no modifican lógica)
  const handleOpenModal = (type=null) => {
    setOwnerToEdit(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setOwnerToEdit(null);
  };
  const [errors, setErrors] = useState({});

  const handleSaveOwner = async (formData) => {
  try {
    if (formData.id) {
      const {id, ...dataToSend} = formData;
      await updateOwner(formData.id, dataToSend);
    } else {
      // quitar id antes de crear
      const { id, ...dataToSend } = formData;
      await createOwner(dataToSend);
    }
    await fetchOwners();
    setErrors({});
  } catch (error) {
    console.error("Error saving owner:", error);
    setErrors({ submit: "Error al guardar. Por favor intenta nuevamente." });
    alert("Error al guardar el propietario.");
  }
};


  const handleDeleteOwner = async (id) =>{
    if (window.confirm(`¿Estás seguro de eliminar el tipo "${name}"?`)) {
      try {
        await deleteOwner(id);
        fetchOwners();
      } catch (error) {
        console.error("Error deleting type:", error);
        alert("Error al eliminar el tipo");
      }
    }
  }
  if (loading) return <div>Loading...</div>;

  return (
    <>
      <section className="container-module">
        <header className="header-module">
          <h1 className="title-module">Gestion de Propietarios</h1>
        </header>

        <div className="controls">
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
                <th scope="col">ID</th>
                <th scope="col">Documento</th>
                <th scope="col">Nombre</th>
                <th scope="col">Email</th>
                <th scope="col">Teléfono</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredOwners.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-data-module">
                    {searchTerm
                      ? `No hay tipos que coincidan con "${searchTerm}"`
                      : "No hay tipos registrados"}
                  </td>
                </tr>
              ) : (
                filteredOwners.map((owner) => (
                  <tr key={owner.id}>
                    <td>{owner.id}</td>
                    <td>{owner.document}</td>
                    <td>{owner.name} {owner.lastName}</td>
                    <td>{owner.email}</td>
                    <td>{owner.phone}</td>
                    <td>
                      <button
                        type="button"
                        className="btn-edit"
                        aria-label="Editar"
                        onClick={() => handleOpenModal(owner)}
                      >
                        <SquarePen />
                      </button>

                      <button
                        type="button"
                        className="btn-delete"
                        aria-label="Eliminar"
                        onClick={() => handleDeleteOwner(owner.id)}
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

      <FormOwners
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      ownerToEdit={ownerToEdit}
      onSave={handleSaveOwner}
      />
    </>
  );
}
