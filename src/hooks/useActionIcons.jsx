import { Trash2, Edit3, Eye, Plus } from 'lucide-react';

/**
 * Hook que proporciona iconos reutilizables para acciones CRUD
 * Iconos: Editar, Eliminar, Ver Detalle, Crear
 * 
 * @returns {Object} Objeto con iconos y className configurados
 */
export const useActionIcons = () => {
  const iconConfig = {
    size: 16,
    className: 'action-icon'
  };

  return {
    // Icono Editar
    EditIcon: ({ onClick, className = '' }) => (
      <button
        className={`action-btn action-btn--edit ${className}`}
        onClick={onClick}
        title="Editar"
        aria-label="Editar"
      >
        <Edit3 size={iconConfig.size} className={iconConfig.className} />
      </button>
    ),

    // Icono Eliminar
    DeleteIcon: ({ onClick, className = '' }) => (
      <button
        className={`action-btn action-btn--delete ${className}`}
        onClick={onClick}
        title="Eliminar"
        aria-label="Eliminar"
      >
        <Trash2 size={iconConfig.size} className={iconConfig.className} />
      </button>
    ),

    // Icono Ver Detalle
    ViewIcon: ({ onClick, className = '' }) => (
      <button
        className={`action-btn action-btn--view ${className}`}
        onClick={onClick}
        title="Ver detalle"
        aria-label="Ver detalle"
      >
        <Eye size={iconConfig.size} className={iconConfig.className} />
      </button>
    ),

    // Icono Crear/Agregar
    CreateIcon: ({ onClick, className = '' }) => (
      <button
        className={`btn btn--primary ${className}`}
        onClick={onClick}
        title="Crear nuevo"
        aria-label="Crear nuevo"
      >
        <Plus size={20} className="icon-inline" />
        Crear
      </button>
    ),

    // Métodos auxiliares
    getIconSize: () => iconConfig.size,
    getIconClass: () => iconConfig.className,

    // Retorna todos los iconos como componentes sin JSX (función)
    getIcon: (type) => {
      const icons = {
        edit: Edit3,
        delete: Trash2,
        view: Eye,
        create: Plus
      };
      return icons[type] || null;
    }
  };
};

/**
 * Uso en componentes:
 * 
 * import { useActionIcons } from '../hooks/useActionIcons';
 * 
 * function MyModule() {
 *   const { EditIcon, DeleteIcon, ViewIcon, CreateIcon } = useActionIcons();
 *   
 *   return (
 *     <>
 *       <CreateIcon onClick={() => openModal()} />
 *       <EditIcon onClick={() => openModal(item)} />
 *       <DeleteIcon onClick={() => handleDelete(id)} />
 *       <ViewIcon onClick={() => openDetailModal(item)} />
 *     </>
 *   );
 * }
 */
