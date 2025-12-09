import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import '../../styles/action-buttons.css';
import '../../styles/tables.css';

/**
 * COMPONENTE GENÉRICO DE TABLA REUTILIZABLE
 * 
 * Soporta cualquier tipo de datos y configuración.
 * La configuración viene del config.js de cada módulo.
 * 
 * @param {Array} data - Datos a mostrar
 * @param {Array} columns - Columnas del config.js
 * @param {Function} onEdit - Callback editar
 * @param {Function} onDelete - Callback eliminar
 * @param {boolean} loading - Estado cargando
 * @param {string} emptyMessage - Mensaje cuando vacío
 * @param {boolean} showActions - Mostrar botones edit/delete (default: true)
 */
export default function TablesModule({
  data = [],
  columns = [],
  onEdit = () => {},
  onDelete = () => {},
  loading = false,
  emptyMessage = 'No hay registros',
  showActions = true
}) {
  // Estado: cargando
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>
        Cargando registros...
      </div>
    );
  }

  // Estado: vacío
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--color-text-secondary)' }}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  // Filtrar solo columnas visibles
  const visibleColumns = columns.filter(col => col.visible !== false);

  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            {visibleColumns.map((col) => (
              <th 
                key={col.key}
                style={{ width: col.width || 'auto' }}
              >
                {col.label}
              </th>
            ))}
            {showActions && (
              <th style={{ minWidth: '100px', textAlign: 'center' }}>Acciones</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.id || idx}>
              {visibleColumns.map((col) => (
                <td key={`${row.id || idx}-${col.key}`}>
                  {col.render ? col.render(row, data) : (row[col.key] || 'N/A')}
                </td>
              ))}
              {showActions && (
                <td style={{ textAlign: 'center' }}>
                  <div className="action-buttons">
                    <button
                      className="action-btn action-btn--edit"
                      onClick={() => onEdit(row)}
                      title="Editar"
                      type="button"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="action-btn action-btn--delete"
                      onClick={() => onDelete(row.id)}
                      title="Eliminar"
                      type="button"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
