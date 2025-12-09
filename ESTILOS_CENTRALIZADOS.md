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

   HOOK useActionIcons:
   ====================

   El hook retorna componentes de botones configurados:
   - Tamaño de íconos: 14px (compacto y profesional)
   - Colores: Basados en variables CSS (--color-primary, --color-danger, etc)

   Uso:
   ```jsx
   import { useActionIcons } from "../../../../hooks/useActionIcons";

   function MyComponent() {
     const { EditIcon, DeleteIcon, ViewIcon, CreateIcon } = useActionIcons();
     
     return (
       <>
         <CreateIcon onClick={() => openModal()} />
         <EditIcon onClick={() => editItem(item)} />
         <DeleteIcon onClick={() => deleteItem(id)} />
         <ViewIcon onClick={() => viewItem(item)} />
       </>
     );
   }
   ```

   VENTAJAS:
   =========
   ✓ Todos los módulos se ven igual de profesionales
   ✓ Cambios globales en un solo lugar
   ✓ Íconos compactos y optimizados (14px)
   ✓ Sin duplicación de estilos
   ✓ Fácil de mantener y escalable

============================================ */
