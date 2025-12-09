export const usersConfig = {
  moduleName: 'Usuario',
  moduleNamePlural: 'Usuarios',

  columns: [
    { key: 'name', label: 'Nombre', visible: true, sortable: true },
    { 
      key: 'email', 
      label: 'Email', 
      visible: true, 
      sortable: true,
      render: (row) => row.email || 'N/A'
    },
    { 
      key: 'roleId', 
      label: 'Rol', 
      visible: true,
      sortable: false,
      render: (row, allData) => {
        // Será pasado desde el módulo
        return row.roleName || 'N/A';
      }
    }
  ],

  formFields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nombre',
      required: true,
      validation: (value) => {
        if (!value.trim()) return 'El nombre es requerido';
        return null;
      }
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
      validation: (value) => {
        if (!value.trim()) return 'El email es requerido';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email inválido';
        return null;
      }
    },
    {
      name: 'password',
      type: 'password',
      label: 'Contraseña',
      required: false,
      validation: (value, isEditing) => {
        if (!isEditing && !value.trim()) return 'La contraseña es requerida';
        return null;
      }
    },
    {
      name: 'roleId',
      type: 'select',
      label: 'Rol',
      required: true,
      options: [], // Se llena desde el módulo
      validation: (value) => {
        if (!value) return 'El rol es requerido';
        return null;
      }
    }
  ],

  defaultValues: {
    name: '',
    email: '',
    password: '',
    roleId: ''
  },

  messages: {
    create: 'Crear Nuevo Usuario',
    edit: 'Editar Usuario',
    delete: '¿Está seguro de que desea eliminar este usuario?',
    deleteSuccess: 'Usuario eliminado correctamente',
    createSuccess: 'Usuario creado correctamente',
    updateSuccess: 'Usuario actualizado correctamente',
    error: 'Error al procesar usuario'
  }
};
