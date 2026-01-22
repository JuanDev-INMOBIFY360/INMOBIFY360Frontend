export default function StepPrice({ formData, errors, onChange }) {
  return (
    <section className="form-step">
      <h3 className="step-heading">Precio y Operación</h3>

      <div className="form-row">
        <div className="form-group">
          <label>Operación *</label>
          <select
            name="operacion"
            value={formData.operacion}
            onChange={onChange}
          >
            <option value="SALE">Venta</option>
            <option value="RENT">Arriendo</option>
          </select>
        </div>

        <div className="form-group">
          <label>Precio *</label>
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={onChange}
            className={errors.precio ? "input-error" : ""}
          />
          {errors.precio && (
            <span className="error-text">{errors.precio}</span>
          )}
        </div>

        <div className="form-group">
          <label>Moneda</label>
          <select
            name="moneda"
            value={formData.moneda}
            onChange={onChange}
          >
            <option value="COP">COP</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Habitaciones</label>
          <input
            type="number"
            name="habitaciones"
            value={formData.habitaciones}
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <label>Baños</label>
          <input
            type="number"
            name="banos"
            value={formData.banos}
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <label>Parqueaderos</label>
          <input
            type="number"
            name="parqueaderos"
            value={formData.parqueaderos}
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <label>Área Construida (m²)</label>
          <input
            type="number"
            step="0.01"
            name="areaConstruida"
            value={formData.areaConstruida}
            onChange={onChange}
          />
        </div>
      </div>
    </section>
  );
}
