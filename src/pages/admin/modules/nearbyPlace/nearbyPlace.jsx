import React from "react";
import { Trash } from "lucide-react";

export default function TableNearbyPlace({ places, onDelete }) {
  return (
    <table className="table-module">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Tipo</th>
          <th>Distancia</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {places.map((p) => (
          <tr key={p.id}>
            <td>{p.name}</td>
            <td>{p.type}</td>
            <td>{p.distance ? `${p.distance} m` : "-"}</td>
            <td>
              <button onClick={() => onDelete(p.id)}>
                <Trash size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
