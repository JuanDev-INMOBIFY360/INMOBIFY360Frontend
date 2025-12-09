/**
 * GUÍA DE ESTANDARIZACIÓN DE MÓDULOS ADMIN
 * 
 * Esta guía explica cómo utilizar los componentes estandarizados
 * en todos los módulos del panel administrativo.
 */

// ============================================
// COMPONENTES DISPONIBLES
// ============================================

// 1. LoadingSpinner - Indicador de carga
//    Ubicación: src/components/LoadingSpinner.jsx
//    Uso:
//    <LoadingSpinner message="Cargando..." />
//    <LoadingSpinner message="Cargando..." fullScreen={true} />

// 2. ErrorMessage - Mensaje de error estandarizado
//    Ubicación: src/components/ErrorMessage.jsx
//    Uso:
//    <ErrorMessage 
//      message="Error cargando datos" 
//      details={error}
//      onRetry={handleRetry}
//      type="error"  // 'error', 'warning', 'info'
//    />

// 3. Pagination - Paginación para tablas/cards
//    Ubicación: src/components/Pagination.jsx
//    Uso:
//    <Pagination
//      currentPage={currentPage}
//      totalPages={totalPages}
//      totalItems={items.length}
//      itemsPerPage={10}
//      onPageChange={setCurrentPage}
//      isLoading={loading}
//    />

// 4. ModuleLayout - Wrapper para módulos
//    Ubicación: src/components/ModuleLayout.jsx
//    Uso:
//    <ModuleLayout
//      title="Usuarios"
//      onCreateClick={handleCreate}
//      loading={loading}
//      error={error}
//      onRetry={loadData}
//      isEmpty={items.length === 0}
//    >
//      <YourTableOrContent />
//    </ModuleLayout>

// ============================================
// HOOKS DISPONIBLES
// ============================================

// 1. usePagination - Hook para manejar paginación
//    Ubicación: src/hooks/usePagination.js
//    Uso:
//    const pagination = usePagination(items, 10);
//    // Retorna: currentPage, totalPages, paginatedItems, handlePageChange, etc.

// 2. useActionIcons - Hook para iconos de acciones CRUD
//    Ubicación: src/hooks/useActionIcons.jsx
//    Uso:
//    const { EditIcon, DeleteIcon, ViewIcon, CreateIcon } = useActionIcons();

// ============================================
// CONSTANTES DE LÍMITES
// ============================================

// Para tablas/filas: 10 items por página
const ITEMS_PER_PAGE_TABLE = 10;

// Para cards/grillas: 6 items por página
const ITEMS_PER_PAGE_CARDS = 6;

// ============================================
// EJEMPLO DE IMPLEMENTACIÓN
// ============================================

/*
import { useState, useEffect } from 'react';
import { getUsers } from './api';
import { usePagination } from 'hooks/usePagination';
import LoadingSpinner from 'components/Loading';
import ErrorMessage from 'components/ErrorMessage';
import Pagination from 'components/Pagination';
import ModuleLayout from 'components/Module';
import UsersTable from './UsersTable';

const ITEMS_PER_PAGE = 10;

export default function UsersModule() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setItems(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <ModuleLayout
      title="Usuarios"
      onCreateClick={handleCreate}
      loading={loading}
      error={error}
      onRetry={loadData}
      isEmpty={items.length === 0 && !loading}
    >
      <UsersTable items={paginatedItems} />
      
      {items.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={items.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          isLoading={loading}
        />
      )}
    </ModuleLayout>
  );
}
*/

// ============================================
// ESTRUCTURA CSS ESTANDARIZADA
// ============================================

/*
Todos los módulos deben usar variables CSS globales:
- --color-primary: #3b82f6 (azul)
- --color-danger: #ef4444 (rojo)
- --color-secondary: #06b6d4 (cyan)
- --color-bg: fondo principal
- --color-surface: fondo de cards/inputs
- --color-text: texto principal
- --color-text-secondary: texto secundario
- --color-border: bordes
- --color-success: #10b981 (verde)

Iconos:
- Tamaño estándar: 16px (edit, delete, view)
- Tamaño botón crear: 20px
- Botones de acción: 44x44px con hover effects
- Border radius estándar: 8px

Tablas:
- Padding filas: 12px 14px
- Font size: 13px
- Límite: 10 items por página

Cards:
- Grid: repeat(auto-fill, minmax(320px, 1fr))
- Gap: 24px
- Límite: 6 items por página
*/
