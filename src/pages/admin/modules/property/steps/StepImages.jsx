import React, { useRef } from "react";
import { Star, Trash2, Upload } from "lucide-react";
import "../propertyForm.css";

export default function StepImages({ images, previews, onAddImages, onRemoveImage, onSetPrimary }) {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddImages(e.target.files);
      e.target.value = ""; // Reset input
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = "#3b82f6";
    e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.08)";
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = "#cbd5e1";
    e.currentTarget.style.backgroundColor = "linear-gradient(135deg, #f9fafb 0%, #f0f4f8 100%)";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = "#cbd5e1";
    e.currentTarget.style.backgroundColor = "linear-gradient(135deg, #f9fafb 0%, #f0f4f8 100%)";
    if (e.dataTransfer.files) {
      onAddImages(e.dataTransfer.files);
    }
  };

  return (
    <section className="form-step">
      <h3 className="step-heading">Imágenes de la Propiedad</h3>

      <div className="upload-area">
        <div
          className="upload-label"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleUploadClick}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleUploadClick();
            }
          }}
          style={{ cursor: "pointer" }}
        >
          <Upload size={40} color="#3b82f6" strokeWidth={1.5} />
          <p>Arrastra imágenes aquí o haz clic para seleccionar</p>
          <span>Puedes cargar múltiples imágenes (máximo 20, PNG, JPG, WEBP)</span>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="upload-input"
          />
        </div>
      </div>

      {images.length > 0 && (
        <div className="images-section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h4 className="subsection-title" style={{ margin: 0 }}>
              Imágenes cargadas ({images.length} / 20)
            </h4>
            {images.length < 20 && (
              <button
                type="button"
                onClick={handleUploadClick}
                style={{
                  padding: "8px 14px",
                  fontSize: "12px",
                  fontWeight: "600",
                  background: "#f0f4f8",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  cursor: "pointer",
                  color: "#3b82f6",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#e2e8f0";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#f0f4f8";
                }}
              >
                + Agregar más
              </button>
            )}
          </div>

          <div className="images-preview">
            {images.map((img, index) => (
              <div key={index} className="image-preview-item">
                <img 
                  src={previews[index]} 
                  alt={`Preview ${index + 1}`}
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f0f4f8' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='16' fill='%23718096' text-anchor='middle' dy='.3em'%3ESin imagen%3C/text%3E%3C/svg%3E";
                  }}
                />
                
                {img.isPrimary && (
                  <div className="primary-badge">
                    <Star size={12} fill="#ffffff" />
                    Primaria
                  </div>
                )}

                <div className="image-actions">
                  <button
                    type="button"
                    className="btn-set-primary"
                    onClick={() => onSetPrimary(index)}
                    title="Establecer como imagen primaria"
                    aria-label="Establecer como imagen primaria"
                  >
                    <Star size={16} />
                  </button>

                  <button
                    type="button"
                    className="btn-remove-image"
                    onClick={() => onRemoveImage(index)}
                    title="Eliminar imagen"
                    aria-label="Eliminar imagen"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="image-info-text">
            ⭐ <strong>La primera imagen será la portada</strong> de la propiedad. Haz clic en la estrella para cambiar cuál es la imagen primaria.
          </p>
        </div>
      )}
    </section>
  );
}
