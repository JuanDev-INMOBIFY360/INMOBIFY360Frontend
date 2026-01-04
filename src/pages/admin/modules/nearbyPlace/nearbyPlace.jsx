import React, { useState, useEffect } from "react";
import { Trash, SquarePen } from "lucide-react";
import {
  getNearbyPlaces,
  addNearbyPlace,
  updateNearbyPlace,
  deleteNearbyPlace,
} from "../../../../services/nearbyPlace";
import FormNearbyPlace from "./FormNearbyPlace";
import "../../GlobalStyles/globalStyles.css";

export default function TableNearbyPlace() {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchPlaces();
  }, []);

  useEffect(() => {
    const filtered = places.filter(
      (p) =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPlaces(filtered);
  }, [searchTerm, places]);

  const fetchPlaces = async () => {
    const data = await getNearbyPlaces();
    setPlaces(data);
    setFilteredPlaces(data);
  };

  const handleSave = async (data) => {
    if (data.id) {
      await updateNearbyPlace(data.id, {
        name: data.name,
        type: data.type,
        distance: data.distance,
      });
    } else {
      await addNearbyPlace({
        name: data.name,
        type: data.type,
        distance: data.distance,
      });
    }
    fetchPlaces();
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`¿Eliminar "${name}"?`)) {
      await deleteNearbyPlace(id);
      fetchPlaces();
    }
  };

  return (
    <>
      <section className="container-module">
        <header className="header-module">
          <h1 className="title-module">Gestión de Lugares Cercanos</h1>
        </header>

        {/* CONTROLES */}
        <div className="controls">
          <div className="search-container">
            <input
              type="search"
              placeholder="Buscar lugares cercanos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-module"
            />
          </div>

          <button className="btn-add" onClick={() => setModalOpen(true)}>
            + Agregar Lugar
          </button>
        </div>

        {/* TABLA */}
        <div className="table-wrapper">
          <table className="table-module">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredPlaces.length === 0 ? (
                <tr>
                  <td colSpan="4" className="no-data-module">
                    {searchTerm
                      ? `No hay lugares que coincidan con "${searchTerm}"`
                      : "No hay lugares cercanos registrados"}
                  </td>
                </tr>
              ) : (
                filteredPlaces.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.type}</td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => {
                          setSelected(p);
                          setModalOpen(true);
                        }}
                      >
                        <SquarePen size={16} />
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(p.id, p.name)}
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

      <FormNearbyPlace
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelected(null);
        }}
        placeToEdit={selected}
        onSave={handleSave}
      />
    </>
  );
}
