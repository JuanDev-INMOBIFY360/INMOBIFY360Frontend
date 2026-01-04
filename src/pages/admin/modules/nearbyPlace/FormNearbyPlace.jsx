import React, { useState } from "react";


const TYPES = [
  "METRO",
  "SUPERMARKET",
  "HOSPITAL",
  "SCHOOL",
  "PARK",
  "MALL",
  "GYM",
  "OTHER",
];

export default function FormNearbyPlace({ onSave }) {
  const [form, setForm] = useState({
    name: "",
    type: "METRO",
    distance: "",
  });

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    onSave({
      ...form,
      distance: form.distance ? Number(form.distance) : null,
    });
    setForm({ name: "", type: "METRO", distance: "" });
  };

  return (
    <div className="types-form-group">
      <label>Nombre del lugar</label>
      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <label>Tipo</label>
      <select
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
      >
        {TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <label>Distancia (metros)</label>
      <input
        type="number"
        value={form.distance}
        onChange={(e) => setForm({ ...form, distance: e.target.value })}
      />

      <button className="btn-submit" onClick={handleSubmit}>
        Agregar
      </button>
    </div>
  );
}
