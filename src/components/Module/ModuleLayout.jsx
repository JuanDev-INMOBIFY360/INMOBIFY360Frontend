import LoadingSpinner from '../Loading/LoadingSpinner';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import './ModuleLayout.css';

export default function ModuleLayout({
  title,
  onCreateClick,
  loading,
  error,
  onRetry,
  children,
  isEmpty = false,
  emptyMessage = 'No hay registros'
}) {
  return (
    <section className="module-layout">
      <div className="module-layout__header">
        <h2 className="module-layout__title">{title}</h2>
        {onCreateClick && (
          <button className="btn btn--primary" onClick={onCreateClick}>
            + Crear
          </button>
        )}
      </div>

      {error && (
        <ErrorMessage 
          message="Error cargando datos" 
          details={error}
          onRetry={onRetry}
          type="error"
        />
      )}

      {loading && (
        <LoadingSpinner message={`Cargando ${title.toLowerCase()}...`} />
      )}

      {!loading && isEmpty && (
        <div className="module-layout__empty">
          <p>{emptyMessage}</p>
        </div>
      )}

      {!loading && !isEmpty && children}
    </section>
  );
}
