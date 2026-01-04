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
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const loadData = async () => {
    const data = await getCommonAreas();
    setAreas(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (data) => {
    if (data.id) {
      await updateCommonArea(data.id, { name: data.name });
    } else {
      await addCommonArea({ name: data.name });
    }
    loadData();
  };

  const handleDelete = async (id, name) => {
    if (confirm(`¿Eliminar "${name}"?`)) {
      await deleteCommonArea(id);
      loadData();
    }
  };

  return (
    <>
      <section className="container-module">
        <header className="header-module">
          <h1 className="title-module">Zonas Comunes</h1>
        </header>

        <button className="btn-add" onClick={() => setModalOpen(true)}>
          + Agregar Zona
        </button>

        <table className="table-module">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {areas.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.name}</td>
                <td>
                  <button onClick={() => { setSelected(a); setModalOpen(true); }}>
                    <SquarePen size={16} />
                  </button>
                  <button onClick={() => handleDelete(a.id, a.name)}>
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <FormCommonArea
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelected(null); }}
        areaToEdit={selected}
        onSave={handleSave}
      />
    </>
  );
}
