export const departmentsConfig = {
  moduleName: 'Departamento',
  moduleNamePlural: 'Departamentos',
  columns: [
    { key: 'name', label: 'Nombre', visible: true, sortable: true },
    { key: 'countryId', label: 'País', visible: true, sortable: false, render: (row) => row.countryName || 'N/A' }
  ],
  formFields: [
    { name: 'name', type: 'text', label: 'Nombre del Departamento', required: true, validation: (v) => !v.trim() ? 'Requerido' : null },
    { name: 'countryId', type: 'select', label: 'País', required: true, options: [], validation: (v) => !v ? 'Requerido' : null }
  ],
  defaultValues: { name: '', countryId: '' },
  messages: {
    create: 'Crear Nuevo Departamento',
    edit: 'Editar Departamento',
    delete: '¿Eliminar este departamento?',
    deleteSuccess: 'Departamento eliminado',
    createSuccess: 'Departamento creado',
    updateSuccess: 'Departamento actualizado',
    error: 'Error en departamento'
  }
};
