/**
 * AdminTable - Reusable table component for admin modules
 * 
 * Props:
 * - columns: array of { key, label, render? }
 * - data: array of items
 * - loading: boolean
 * - error: error object
 * - onEdit: (item) => void
 * - onDelete: (id) => void
 * - emptyMessage: string
 * 
 * Usage:
 * <AdminTable
 *   columns={[
 *     { key: 'id', label: 'ID' },
 *     { key: 'name', label: 'Nombre' },
 *     { key: 'email', label: 'Email', render: (val) => <a href={`mailto:${val}`}>{val}</a> }
 *   ]}
 *   data={users}
 *   loading={loading}
 *   error={error}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 * />
 */

import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import '../styles/admin-table.css';

export const AdminTable = ({
  columns = [],
  data = [],
  loading = false,
  error = null,
  onEdit,
  onDelete,
  emptyMessage = 'No hay datos disponibles',
}) => {
  if (loading) {
    return <div className="admin-table-loading">Cargando...</div>;
  }

  if (error) {
    return <div className="admin-table-error">Error al cargar los datos</div>;
  }

  if (!data || data.length === 0) {
    return <div className="admin-table-empty">{emptyMessage}</div>;
  }

  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              {columns.map((col) => (
                <td key={`${item.id}-${col.key}`}>
                  {col.render ? col.render(item[col.key], item) : item[col.key]}
                </td>
              ))}
              <td className="admin-table-actions">
                {onEdit && (
                  <button
                    className="admin-table-btn admin-table-btn--edit"
                    onClick={() => onEdit(item)}
                    title="Editar"
                    aria-label={`Editar ${item.name || item.id}`}
                  >
                    <Edit size={14} />
                  </button>
                )}
                {onDelete && (
                  <button
                    className="admin-table-btn admin-table-btn--delete"
                    onClick={() => onDelete(item.id)}
                    title="Eliminar"
                    aria-label={`Eliminar ${item.name || item.id}`}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
