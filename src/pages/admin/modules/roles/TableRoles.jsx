import React, { useState, useEffect } from "react";
import "./Roles.css";
import { getRoles, deleteRole } from "../../../../services/RolesService";
import { SquarePen, Trash } from "lucide-react";
import RoleFormModal from "./FormRoles.jsx";

export default function TableRoles() {
  const [roles, setRoles] = useState([]); 
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    const filtered = roles.filter((r) =>
      r.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRoles(filtered);
  }, [searchTerm, roles]);

  const fetchRoles = async () => {
    try {
      setLoading(true); 
      const data = await getRoles();
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
      alert("Error al cargar los roles");
    } finally {
      setLoading(false); 
    }
  };

   const handleOpenModal = (role = null) => {
    setRoleToEdit(role);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setRoleToEdit(null);
    fetchRoles(); // Refrescar la tabla
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Deseas eliminar este rol? Esta acción no se puede deshacer.')) return;
    try {
      setLoading(true);
      await deleteRole(id);
      await fetchRoles();
    } catch (error) {
      console.error("Error deleting role:", error);
      alert("Error al eliminar el rol");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <>
      <section className="container-module">
        <header className="header-module">
          <h1 className="title-module">Gestión de Roles</h1>
        </header>

        <div className="controls">
          <div className="search-container">
            <input
              id="search-roles"
              type="text"
              placeholder="Buscar roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-module"
            />
          </div>
          <button
            type="button"
            className="btn-add"
            aria-label="Agregar Rol"
            onClick={() => handleOpenModal()}
          >
            <span className="btn-add-icon" aria-hidden="true">
              +
            </span>
            Agregar Rol
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
                <th scope="col">Nombre del Rol</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.length === 0 ? (
                <tr>
                  <td colSpan="3" className="no-data-module">
                    {searchTerm
                      ? `No hay roles que coincidan con "${searchTerm}"`
                      : "No hay roles registrados"}
                  </td>
                </tr>
              ) : (
                filteredRoles.map((role) => (
                  <tr key={role.id}>
                    <td>{role.id}</td>
                    <td>{role.name}</td>
                    <td>
                      <button
                        type="button"
                        className="btn-edit"
                        aria-label={`Editar rol ${role.name}`}
                        onClick={() => handleOpenModal(role)}
                      >
                        <SquarePen size={16} />
                      </button>
                      <button
                        type="button"
                        className="btn-delete"
                        aria-label={`Eliminar rol ${role.name}`}
                        onClick={() => handleDelete(role.id)}
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
       <RoleFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        roleToEdit={roleToEdit}
      />
    </>
  );
}