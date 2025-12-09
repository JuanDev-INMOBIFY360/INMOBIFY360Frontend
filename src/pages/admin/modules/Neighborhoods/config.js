export const neighborhoodsConfig = {
  moduleName: 'Barrio',
  moduleNamePlural: 'Barrios',
  columns: [
    { key: 'name', label: 'Nombre', visible: true, sortable: true },
    { key: 'cityId', label: 'Ciudad', visible: true, sortable: false, render: (row) => row.cityName || 'N/A' }
  ],
  formFields: [
    { name: 'name', type: 'text', label: 'Nombre del Barrio', required: true, validation: (v) => !v.trim() ? 'Requerido' : null },
    { name: 'cityId', type: 'select', label: 'Ciudad', required: true, options: [], validation: (v) => !v ? 'Requerido' : null }
  ],
  defaultValues: { name: '', cityId: '' },
  messages: {
    create: 'Crear Nuevo Barrio',
    edit: 'Editar Barrio',
    delete: '¿Eliminar este barrio?',
    deleteSuccess: 'Barrio eliminado',
    createSuccess: 'Barrio creado',
    updateSuccess: 'Barrio actualizado',
    error: 'Error en barrio'
  }
};
