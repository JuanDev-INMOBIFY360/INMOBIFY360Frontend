/* ============================================
   GUÍA DE ESTILOS CENTRALIZADOS
   ============================================

   Este proyecto ahora tiene estilos centralizados para mantener consistencia
   y evitar duplicación de código.

   ARCHIVOS CENTRALIZADOS:
   ========================

   1. src/styles/theme.css
      - Variables de colores (--color-primary, --color-danger, etc)
      - Paletas de colores por contexto (home, admin)

   2. src/styles/tables.css
      - Estilos para TODAS las tablas
      - Class name: .admin-table
      - Uso: <table class="admin-table">...</table>

   3. src/styles/action-buttons.css
      - Estilos para botones de acción CRUD
      - Classes: .action-btn, .action-btn--edit, .action-btn--delete, .action-btn--view
      - Iconos: Editar, Eliminar, Ver (14px compactos y profesionales)

   ARCHIVOS ESPECÍFICOS POR MÓDULO:
   =================================

   Cada módulo (Users, Roles, Departments, etc) tiene su propio archivo:
   - src/pages/admin/modules/{ModuleName}/styles/{modulename}.css

   ESTOS ARCHIVOS DEBEN CONTENER:
   - Estilos específicos del módulo (headers, containers, modales, etc)
   - NO deben duplicar estilos de tablas ni botones de acción
   - Pueden extender/personalizar colores o espacios si es necesario

   CÓMO USAR:
   ===========

   En OwnersTable.jsx o cualquier tabla:
   ```jsx
   import "./styles/owners.css"; // estilos específicos
   
   export default function OwnersTable({ items }) {
     return (
       <table className="admin-table">  // <-- class estandarizado
         <thead>
           <tr>
             <th>ID</th>
             <th>Nombre</th>
             <th>Acciones</th>
           </tr>
         </thead>
         <tbody>
           {items.map(item => (
             <tr key={item.id}>
               <td>{item.id}</td>
               <td>{item.name}</td>
               <td>
                 <div className="action-buttons">  // <-- botones estándar
                   <EditIcon onClick={() => onEdit(item)} />
                   <DeleteIcon onClick={() => onDelete(item.id)} />
                 </div>
               </td>
             </tr>
           ))}
         </tbody>
       </table>
     );
   }
   ```

  HOOK useActionIcons: (DEPRECATED)
    ==================================

    The `useActionIcons` hook is deprecated and has been archived. The project
    now prefers per-module inline action buttons so that each module can
    customize markup, accessibility attributes, and spacing independently.

    Recommended pattern (example for a row actions cell):
    ```jsx
    import { IoCreate, IoTrash, IoSearch } from 'react-icons/io5';

    <div className="action-buttons">
      <button className="action-btn action-btn--edit" title="Editar" aria-label="Editar" onClick={() => onEdit(item)}>
        <IoCreate className="action-icon" />
      </button>
      <button className="action-btn action-btn--delete" title="Eliminar" aria-label="Eliminar" onClick={() => onDelete(item.id)}>
        <IoTrash className="action-icon" />
      </button>
    </div>
    ```

    For backwards compatibility, a backup of the original hook implementation
    is kept at `_archived/hooks/useActionIcons.jsx` in case you need to reference it.

   VENTAJAS:
   =========
   ✓ Todos los módulos se ven igual de profesionales
   ✓ Cambios globales en un solo lugar
   ✓ Íconos compactos y optimizados (14px)
   ✓ Sin duplicación de estilos
   ✓ Fácil de mantener y escalable

============================================ */
