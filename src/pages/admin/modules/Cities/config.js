export const citiesConfig = {
  moduleName: 'Ciudad',
  moduleNamePlural: 'Ciudades',
  columns: [
    { key: 'name', label: 'Nombre', visible: true, sortable: true },
    { key: 'departmentId', label: 'Departamento', visible: true, sortable: false, render: (row) => row.departmentName || 'N/A' }
  ],
  formFields: [
    { name: 'name', type: 'text', label: 'Nombre de la Ciudad', required: true, validation: (v) => !v.trim() ? 'Requerido' : null },
    { name: 'departmentId', type: 'select', label: 'Departamento', required: true, options: [], validation: (v) => !v ? 'Requerido' : null }
  ],
  defaultValues: { name: '', departmentId: '' },
  messages: {
    create: 'Crear Nueva Ciudad',
    edit: 'Editar Ciudad',
    delete: '¿Eliminar esta ciudad?',
    deleteSuccess: 'Ciudad eliminada',
    createSuccess: 'Ciudad creada',
    updateSuccess: 'Ciudad actualizada',
    error: 'Error en ciudad'
  }
};
