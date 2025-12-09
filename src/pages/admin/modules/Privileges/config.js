export const privilegesConfig = {
  moduleName: 'Privilegio',
  moduleNamePlural: 'Privilegios',
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
    create: 'Crear Nuevo Privilegio',
    edit: 'Editar Privilegio',
    delete: '¿Eliminar este privilegio?',
    deleteSuccess: 'Privilegio eliminado',
    createSuccess: 'Privilegio creado',
    updateSuccess: 'Privilegio actualizado',
    error: 'Error en privilegio'
  }
};
