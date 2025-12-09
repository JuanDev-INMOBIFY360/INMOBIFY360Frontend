export const typesConfig = {
  moduleName: 'Tipo de Propiedad',
  moduleNamePlural: 'Tipos de Propiedad',
  columns: [
    { key: 'name', label: 'Nombre', visible: true, sortable: true },
    { key: 'description', label: 'Descripción', visible: true, sortable: false }
  ],
  formFields: [
    { name: 'name', type: 'text', label: 'Nombre', required: true, validation: (v) => !v.trim() ? 'Requerido' : null },
    { name: 'description', type: 'textarea', label: 'Descripción', required: false }
  ],
  defaultValues: { name: '', description: '' },
  messages: {
    create: 'Crear Nuevo Tipo',
    edit: 'Editar Tipo',
    delete: '¿Eliminar este tipo?',
    deleteSuccess: 'Tipo eliminado',
    createSuccess: 'Tipo creado',
    updateSuccess: 'Tipo actualizado',
    error: 'Error en tipo'
  }
};
