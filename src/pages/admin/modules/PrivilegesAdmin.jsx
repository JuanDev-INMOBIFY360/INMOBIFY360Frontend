import React, { useEffect, useState } from 'react';
import { getPrivileges } from '../../../services/PrivilegesService';

export default function PrivilegesAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    getPrivileges()
      .then((data) => mounted && setItems(data))
      .catch((err) => mounted && setError(err))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  return (
    <section className="admin-page">
      <h2>Privilegios</h2>
      {loading && <p>Cargando...</p>}
      {error && <p className="text-danger">Error al cargar privilegios</p>}
      {!loading && !error && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            {items && items.length ? (
              items.map((it) => (
                <tr key={it.id || it._id || JSON.stringify(it)}>
                  <td>{it.id ?? it._id ?? '-'}</td>
                  <td>{it.name ?? it.label ?? JSON.stringify(it)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2}>No hay privilegios</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </section>
  );
}
