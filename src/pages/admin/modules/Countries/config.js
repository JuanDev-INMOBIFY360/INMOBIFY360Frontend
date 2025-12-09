export const countriesConfig = {
  moduleName: 'País',
  moduleNamePlural: 'Países',
  columns: [
    { key: 'name', label: 'Nombre', visible: true, sortable: true },
    { key: 'code', label: 'Código', visible: true, sortable: true }
  ],
  formFields: [
    { name: 'name', type: 'text', label: 'Nombre del País', required: true, validation: (v) => !v.trim() ? 'Requerido' : null },
    { name: 'code', type: 'text', label: 'Código (Opcional)', required: false }
  ],
  defaultValues: { name: '', code: '' },
  messages: {
    create: 'Crear Nuevo País',
    edit: 'Editar País',
    delete: '¿Eliminar este país?',
    deleteSuccess: 'País eliminado',
    createSuccess: 'País creado',
    updateSuccess: 'País actualizado',
    error: 'Error en país'
  }
};
