import './ErrorMessage.css';
import { AlertCircle } from 'lucide-react';

export default function ErrorMessage({ 
  message = 'Algo salió mal', 
  details = null, 
  onRetry = null,
  type = 'error' // 'error', 'warning', 'info'
}) {
  return (
    <div className={`error-message error-message--${type}`}>
      <div className="error-message__header">
        <AlertCircle size={20} className="error-message__icon" />
        <p className="error-message__title">{message}</p>
      </div>
      {details && (
        <p className="error-message__details">{details}</p>
      )}
      {onRetry && (
        <button className="error-message__retry" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  );
}
