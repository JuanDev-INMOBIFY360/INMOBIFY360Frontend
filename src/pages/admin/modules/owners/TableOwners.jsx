import React, { useState, useEffect } from 'react';
import { getOwners, createOwner, updateOwner, deleteOwner } from "../../../../services/OwnersService";
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
    if (!Array.isArray(owners)) {
      setFilteredOwners([]);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = owners.filter(
      (o) =>
        (o.name || "").toLowerCase().includes(term) ||
        (o.document || "").toLowerCase().includes(term) ||
        (o.email || "").toLowerCase().includes(term) ||
        (o.phone || "").toLowerCase().includes(term)
    );
    setFilteredOwners(filtered);
  }, [searchTerm, owners]);

  const fetchOwners = async () => {
    try {
      const data = await getOwners();
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.owners)
        ? data.owners
        : [];
      if (!Array.isArray(data) && list.length === 0) {
        console.warn("getOwners returned unexpected shape:", data);
      }
      setOwners(list);
      setFilteredOwners(list);
    } catch (error) {
      console.error("Error fetching owners:", error);
      alert("Error al cargar los propietarios");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (owner = null) => {
    setOwnerToEdit(owner);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setOwnerToEdit(null);
  };

  const handleSaveOwner = async (formData) => {
    try {
      if (formData.id) {
        // Editar: quitar id del payload
        const { id, ...dataToSend } = formData;
        await updateOwner(formData.id, dataToSend);
      } else {
        // Crear: no debería tener id en formData
        await createOwner(formData);
      }
      await fetchOwners();
    } catch (error) {
      console.error("Error saving owner:", error);
      throw error; // Re-lanzar para que FormOwners lo maneje
    }
  };

  const handleDeleteOwner = async (id, name) => {
    if (window.confirm(`¿Estás seguro de eliminar al propietario "${name}"?`)) {
      try {
        await deleteOwner(id);
        await fetchOwners();
      } catch (error) {
        console.error("Error deleting owner:", error);
        alert("Error al eliminar el propietario");
      }
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <>
      <section className="container-module" aria-labelledby="owners-title">
        <header className="header-module">
          <h1 id="owners-title" className="title-module">
            Gestión de Propietarios
          </h1>
        </header>

        <div className="controls" role="toolbar" aria-label="Controles de tabla">
          <div className="search-container" role="search">
            <input
              id="search-owners"
              type="search"
              placeholder="Buscar propietarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-module"
            />
          </div>

          <button
            type="button"
            className="btn-add"
            aria-label="Agregar Propietario"
            onClick={() => handleOpenModal()}
          >
            <span className="btn-add-icon" aria-hidden="true">
              +
            </span>
            Agregar Propietario
          </button>
        </div>

        <div className="table-wrapper">
          <table className="table-module">
            <colgroup>
              <col className="col-id" />
              <col className="col-name" />
              <col className="col-name" />
              <col className="col-name" />
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
                  <td colSpan="6" className="no-data-module">
                    {searchTerm
                      ? `No hay propietarios que coincidan con "${searchTerm}"`
                      : "No hay propietarios registrados"}
                  </td>
                </tr>
              ) : (
                filteredOwners.map((owner) => (
                  <tr key={owner.id}>
                    <td>{owner.id}</td>
                    <td>{owner.document || "N/A"}</td>
                    <td>{owner.name}</td>
                    <td>{owner.email}</td>
                    <td>{owner.phone || "N/A"}</td>
                    <td>
                      <button
                        type="button"
                        className="btn-edit"
                        aria-label={`Editar propietario ${owner.name}`}
                        onClick={() => handleOpenModal(owner)}
                      >
                        <SquarePen size={16} />
                      </button>

                      <button
                        type="button"
                        className="btn-delete"
                        aria-label={`Eliminar propietario ${owner.name}`}
                        onClick={() => handleDeleteOwner(owner.id, owner.name)}
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

      <FormOwners
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        ownerToEdit={ownerToEdit}
        onSave={handleSaveOwner}
      />
    </>
  );
}