export const ownersConfig = {
  moduleName: 'Propietario',
  moduleNamePlural: 'Propietarios',
  columns: [
    { key: 'name', label: 'Nombre', visible: true, sortable: true },
    { key: 'email', label: 'Email', visible: true, sortable: true },
    { key: 'phone', label: 'Teléfono', visible: true, sortable: false }
  ],
  formFields: [
    { name: 'name', type: 'text', label: 'Nombre', required: true, validation: (v) => !v.trim() ? 'Requerido' : null },
    { name: 'email', type: 'email', label: 'Email', required: false, validation: (v) => v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Email inválido' : null },
    { name: 'phone', type: 'tel', label: 'Teléfono', required: false }
  ],
  defaultValues: { name: '', email: '', phone: '' },
  messages: {
    create: 'Crear Nuevo Propietario',
    edit: 'Editar Propietario',
    delete: '¿Eliminar este propietario?',
    deleteSuccess: 'Propietario eliminado',
    createSuccess: 'Propietario creado',
    updateSuccess: 'Propietario actualizado',
    error: 'Error en propietario'
  }
};
