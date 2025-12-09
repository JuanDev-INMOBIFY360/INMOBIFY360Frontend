/**
 * GUÍA DE ESTRUCTURA config.js
 * 
 * Este archivo centraliza toda la configuración de un módulo:
 * - Definición de columnas para la tabla
 * - Validaciones de formularios
 * - Reglas de negocio específicas
 * - Valores por defecto
 */

// EJEMPLO COMPLETO PARA ROLES

export const rolesConfig = {
  // Nombre del módulo (para mensajes)
  moduleName: 'Rol',
  moduleNamePlural: 'Roles',

  // Columnas para la tabla genérica
  columns: [
    {
      key: 'id',
      label: 'ID',
      visible: true,
      sortable: true,
      width: '60px'
    },
    {
      key: 'name',
      label: 'Nombre',
      visible: true,
      sortable: true,
      width: 'auto',
      render: (row) => row.name || 'N/A'
    }
  ],

  // Campos del formulario
  formFields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nombre del Rol',
      placeholder: 'Ej: Administrador',
      required: true,
      validation: (value) => {
        if (!value.trim()) return 'El nombre es requerido';
        if (value.length < 3) return 'Mínimo 3 caracteres';
        return null;
      }
    }
  ],

  // Valores por defecto para nuevo item
  defaultValues: {
    name: ''
  },

  // Mensajes personalizados
  messages: {
    create: 'Crear Nuevo Rol',
    edit: 'Editar Rol',
    delete: '¿Está seguro de que desea eliminar este rol?',
    deleteSuccess: 'Rol eliminado correctamente',
    createSuccess: 'Rol creado correctamente',
    updateSuccess: 'Rol actualizado correctamente',
    error: 'Error al procesar rol'
  }
};
