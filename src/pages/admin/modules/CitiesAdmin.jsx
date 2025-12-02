import React, { useEffect, useState } from 'react';
import { getCities, createCity, deleteCity } from '../../../services/CitiesService';

export default function CitiesAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getCities();
      setItems(data || []);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) load();
    return () => (mounted = false);
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const created = await createCity({ name: newName.trim() });
      // refresh list
      await load();
      setNewName('');
    } catch (err) {
      console.error('Error creating city', err);
      setError(err);
    } finally {
      setCreating(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm('¿Eliminar ciudad?')) return;
    try {
      await deleteCity(id);
      await load();
    } catch (err) {
      console.error('Error deleting city', err);
      setError(err);
    }
  };

  return (
    <section className="admin-page">
      <h2>Ciudades</h2>

      <form onSubmit={onCreate} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          placeholder="Nombre de la ciudad"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="input"
        />
        <button type="submit" className="btn" disabled={creating}>{creating ? 'Creando...' : 'Crear'}</button>
      </form>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-danger">Error al cargar ciudades</p>}
      {!loading && !error && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items && items.length ? (
              items.map((it) => (
                <tr key={it.id || it._id || JSON.stringify(it)}>
                  <td>{it.id ?? it._id ?? '-'}</td>
                  <td>{it.name ?? it.nombre ?? JSON.stringify(it)}</td>
                  <td>
                    <button className="btn btn-sm" onClick={() => onDelete(it.id ?? it._id)}>Eliminar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>No hay ciudades</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </section>
  );
}
