import React, { useState, useEffect } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../../../services/UsersService";
import "../../GlobalStyles/globalStyles.css";
import "./users.css";
import { SquarePen, Trash } from "lucide-react";
import FormUser from "./FormUser";

export default function TableUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setfilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
 
    const f = users.filter(
      (u) =>
        (u.name || "").toLowerCase().includes(searchTerm) ||
        (u.email || "").toLowerCase().includes(searchTerm)
    );
    setfilteredUsers(f);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
      setfilteredUsers(data);
    } catch (error) {
      console.error("Error fetching Users", error);
      setUsers([]);
      setfilteredUsers([]);
      alert("Error cargando Usuarios");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUserToEdit(null);
  };

  const handleSave = async (id, payload) => {
    try {
      if (id) await updateUser(id, payload);
      else await createUser(payload);
      await fetchUsers();
    } catch (err) {
      throw err;
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`¿Deseas eliminar al usuario "${name}"?`)) return;
    try {
      await deleteUser(id);
      await fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Error eliminando usuario");
    }
  };

  if (loading) return <p>Cargando usuarios...</p>;

  return (
    <>
      <section className="container-module">
        <header className="header-module">
          <h1 className="title-module">Gestión de Usuarios</h1>
        </header>
        <div className="controls">
          <div>
            <input
              type="search"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-module"
            />
          </div>
          <button className="btn-add" onClick={() => handleOpenModal()}>
            <span className="btn-add-icon">+</span>
            Agregar Usuario
          </button>
        </div>
        <div className="table-wrapper">
          <table className="table-module">
            <colgroup>
              <col className="col-name" />
              <col className="col-name" />
              <col className="col-name" />
              <col className="col-name" />
              <col className="col-actions" />
            </colgroup>

            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-data-module">
                    {searchTerm
                      ? `No hay usuarios que coincidan con "${searchTerm}"`
                      : "No hay usuarios registrados"}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email || "—"}</td>
                    <td>{user.role?.name || '—'}</td>
                    <td>{user.status ? 'Activo' : 'Inactivo'}</td>
                    <td className="col-actions">
                      <button
                        type="button"
                        className="btn-edit"
                        aria-label={`Editar usuario ${user.name}`}
                        onClick={() => handleOpenModal(user)}
                      >
                        <SquarePen size={16} />
                      </button>

                      <button
                        type="button"
                        className="btn-delete"
                        aria-label={`Eliminar usuario ${user.name}`}
                        onClick={() => handleDelete(user.id, user.name)}
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

      <FormUser
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        userToEdit={userToEdit}
        onSave={handleSave}
      />
    </>
  );
}
