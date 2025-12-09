import './LoadingSpinner.css';

export default function LoadingSpinner({ message = 'Cargando...', fullScreen = false }) {
  const content = (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
      <p className="loading-message">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loading-fullscreen">
        {content}
      </div>
    );
  }

  return content;
}
