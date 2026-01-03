import React, { useState, useEffect } from "react";
import { getRoles, createRole, updateRole, deleteRole } from "../../../../services/RolesService";
import FormRoles from "./FormRoles";
import "../../GlobalStyles/globalStyles.css";
import { SquarePen, Trash } from "lucide-react";

export default function TableRoles() {
  const [roles, setRoles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    const f = roles.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()) || (r.description || "").toLowerCase().includes(searchTerm.toLowerCase()));
    setFiltered(f);
  }, [searchTerm, roles]);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const data = await getRoles();
      setRoles(data);
      setFiltered(data);
    } catch (err) {
      console.error("Error fetching roles", err);
      alert("Error cargando roles");
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
  };

  const handleSave = async (id, payload) => {
    if (id) {
      await updateRole(id, payload);
    } else {
      await createRole(payload);
    }
    await fetchRoles();
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`¿Deseas eliminar el rol "${name}"?`)) return;
    try {
      await deleteRole(id);
      await fetchRoles();
    } catch (err) {
      console.error(err);
      alert("Error eliminando rol");
    }
  };

  if (loading) return <p>Cargando roles...</p>;

  return (
    <>
      <section className="container-module" aria-labelledby="roles-title">
        <header className="header-module">
          <h1 id="roles-title" className="title-module">Gestión de Roles</h1>
        </header>

        <div className="controls" role="toolbar" aria-label="Controles de tabla">
          <div>
            <input
              type="search"
              placeholder="Buscar roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-module"
            />
          </div>

          <button type="button" className="btn-add" onClick={() => handleOpenModal()}>
            <span className="btn-add-icon">+</span>
            Agregar Rol
          </button>
        </div>

        <div className="table-wrapper">
          <table className="table-module">
            <colgroup>
              <col className="col-name" />
              <col className="col-name" />
              <col className="col-actions" />
            </colgroup>

            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="3" className="no-data-module">{searchTerm ? `No hay roles que coincidan con "${searchTerm}"` : "No hay roles registrados"}</td>
                </tr>
              ) : (
                filtered.map((role) => (
                  <tr key={role.id}>
                    <td>{role.name}</td>
                    <td>{role.description || '—'}</td>
                    <td className="col-actions">
                      <button type="button" className="btn-edit" aria-label={`Editar rol ${role.name}`} onClick={() => handleOpenModal(role)}>
                        <SquarePen size={16} />
                      </button>

                      <button type="button" className="btn-delete" aria-label={`Eliminar rol ${role.name}`} onClick={() => handleDelete(role.id, role.name)}>
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

      <FormRoles
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        roleToEdit={roleToEdit}
        onSave={handleSave}
      />
    </>
  );
}
