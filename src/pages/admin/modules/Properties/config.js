/**
 * CONFIGURACIÓN DEL MÓDULO PROPERTIES
 * 
 * Centraliza columnas, validaciones y configuración específica
 * de propiedades inmobiliarias
 */

export const propertiesConfig = {
  // Nombre del módulo
  moduleName: 'Propiedad',
  moduleNamePlural: 'Propiedades',

  // Columnas para la tabla (si se usara tabla en lugar de cards)
  columns: [
    {
      key: 'id',
      label: 'ID',
      visible: true,
      width: '60px'
    },
    {
      key: 'address',
      label: 'Dirección',
      visible: true,
      width: 'auto',
      render: (row) => row.address || 'N/A'
    },
    {
      key: 'price',
      label: 'Precio',
      visible: true,
      width: '150px',
      render: (row) => `$${row.price?.toLocaleString('es-CO') || '0'}`
    },
    {
      key: 'typeId',
      label: 'Tipo',
      visible: true,
      width: '150px'
    },
    {
      key: 'neighborhoodId',
      label: 'Barrio',
      visible: true,
      width: '150px'
    },
    {
      key: 'bedrooms',
      label: 'Habitaciones',
      visible: true,
      width: '120px'
    },
    {
      key: 'bathrooms',
      label: 'Baños',
      visible: true,
      width: '100px'
    }
  ],

  // Campos del formulario
  formFields: [
    {
      name: 'address',
      type: 'text',
      label: 'Dirección',
      placeholder: 'Ej: Calle 50 # 10-20',
      required: true
    },
    {
      name: 'price',
      type: 'number',
      label: 'Precio',
      placeholder: 'Ej: 350000000',
      required: true
    },
    {
      name: 'typeId',
      type: 'select',
      label: 'Tipo de Propiedad',
      required: true
    },
    {
      name: 'neighborhoodId',
      type: 'select',
      label: 'Barrio',
      required: true
    },
    {
      name: 'cityId',
      type: 'select',
      label: 'Ciudad',
      required: true
    },
    {
      name: 'ownerId',
      type: 'select',
      label: 'Propietario',
      required: true
    },
    {
      name: 'bedrooms',
      type: 'number',
      label: 'Habitaciones',
      placeholder: '3',
      required: false
    },
    {
      name: 'bathrooms',
      type: 'number',
      label: 'Baños',
      placeholder: '2',
      required: false
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción',
      placeholder: 'Describe la propiedad...',
      required: false
    },
    {
      name: 'imagenes',
      type: 'file',
      label: 'Imágenes',
      multiple: true,
      required: false
    }
  ],

  // Valores por defecto
  defaultValues: {
    address: '',
    price: '',
    typeId: '',
    neighborhoodId: '',
    cityId: '',
    ownerId: '',
    bedrooms: '',
    bathrooms: '',
    description: '',
    imagenes: []
  },

  // Mensajes del módulo
  messages: {
    empty: 'No hay propiedades registradas',
    delete: '¿Está seguro de que desea eliminar esta propiedad?',
    deleteSuccess: 'Propiedad eliminada correctamente',
    createSuccess: 'Propiedad creada correctamente',
    updateSuccess: 'Propiedad actualizada correctamente',
    error: 'Error procesando propiedad'
  }
};
