import React from "react";
import "../propertyForm.css";

export default function StepBasic({ formData, onChange, types, errors }) {
  return (
    <section className="form-step">
      <h3 className="step-heading">Información Básica</h3>

      <div className="form-row">
        <div className="form-group">
          <label>Título *</label>
          <input
            name="titulo"
            value={formData.titulo}
            onChange={onChange}
            className={errors?.titulo ? "input-error" : ""}
            placeholder="Apartamento en el norte"
          />
          {errors?.titulo && (
            <span className="error-text">{errors.titulo}</span>
          )}
        </div>

        <div className="form-group">
          <label>Tipo de Propiedad *</label>
          <select
            name="typePropertyId"
            value={formData.typePropertyId}
            onChange={onChange}
            className={errors?.typePropertyId ? "input-error" : ""}
          >
            <option value="">Seleccionar tipo</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          {errors?.typePropertyId && (
            <span className="error-text">{errors.typePropertyId}</span>
          )}
        </div>
      </div>

      <div className="form-group">
        <label>Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={onChange}
          placeholder="Descripción detallada de la propiedad"
          rows={4}
        />
      </div>
    </section>
  );
}
