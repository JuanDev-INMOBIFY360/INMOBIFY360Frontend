import React, { useEffect, useState } from "react";
import {
  getCommonAreas,
  addCommonArea,
  updateCommonArea,
  deleteCommonArea,
} from "../../../../services/commonArea";
import FormCommonArea from "./FormCommonArea";
import { SquarePen, Trash } from "lucide-react";
import "../../GlobalStyles/globalStyles.css";

export default function TableCommonArea() {
  const [areas, setAreas] = useState([]);
  const [filteredAreas, setFilteredAreas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchAreas();
  }, []);

  useEffect(() => {
    const filtered = areas.filter((a) =>
      a.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAreas(filtered);
  }, [searchTerm, areas]);

  const fetchAreas = async () => {
    const data = await getCommonAreas();
    setAreas(data);
    setFilteredAreas(data);
  };

  const handleSave = async (data) => {
    if (data.id) {
      await updateCommonArea(data.id, { name: data.name });
    } else {
      await addCommonArea({ name: data.name });
    }
    fetchAreas();
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`¿Eliminar "${name}"?`)) {
      await deleteCommonArea(id);
      fetchAreas();
    }
  };

  return (
    <>
      <section className="container-module">
        <header className="header-module">
          <h1 className="title-module">Gestión de Zonas Comunes</h1>
        </header>

        {/* CONTROLES */}
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

        {/* TABLA */}
        <div className="table-wrapper">
          <table className="table-module">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredAreas.length === 0 ? (
                <tr>
                  <td colSpan="3" className="no-data-module">
                    {searchTerm
                      ? `No hay zonas que coincidan con "${searchTerm}"`
                      : "No hay zonas comunes registradas"}
                  </td>
                </tr>
              ) : (
                filteredAreas.map((a) => (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>{a.name}</td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => {
                          setSelected(a);
                          setModalOpen(true);
                        }}
                      >
                        <SquarePen size={16} />
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(a.id, a.name)}
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

      <FormCommonArea
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelected(null);
        }}
        areaToEdit={selected}
        onSave={handleSave}
      />
    </>
  );
}
