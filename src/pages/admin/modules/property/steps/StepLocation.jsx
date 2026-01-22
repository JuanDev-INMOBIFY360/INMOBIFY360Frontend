export default function StepLocation({
  formData,
  errors,
  onChange,
  countries,
  departments,
  owners,
}) {
  return (
    <section className="form-step">
      <h3 className="step-heading">Ubicación</h3>

      <div className="form-row">
        <div className="form-group">
          <label>País *</label>
          <select
            name="countryId"
            value={formData.countryId}
            onChange={onChange}
            className={errors.countryId ? "input-error" : ""}
          >
            <option value="">Seleccionar país</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.countryId && (
            <span className="error-text">{errors.countryId}</span>
          )}
        </div>

        <div className="form-group">
          <label>Departamento *</label>
          <select
            name="departmentId"
            value={formData.departmentId}
            onChange={onChange}
            disabled={!formData.countryId}
            className={errors.departmentId ? "input-error" : ""}
          >
            <option value="">Seleccionar departamento</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          {errors.departmentId && (
            <span className="error-text">{errors.departmentId}</span>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Ciudad *</label>
          <input
            name="ciudad"
            value={formData.ciudad}
            onChange={onChange}
            className={errors.ciudad ? "input-error" : ""}
          />
          {errors.ciudad && (
            <span className="error-text">{errors.ciudad}</span>
          )}
        </div>

        <div className="form-group">
          <label>Barrio</label>
          <input
            name="barrio"
            value={formData.barrio}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Dirección *</label>
        <input
          name="direccion"
          value={formData.direccion}
          onChange={onChange}
          className={errors.direccion ? "input-error" : ""}
        />
        {errors.direccion && (
          <span className="error-text">{errors.direccion}</span>
        )}
      </div>

      <div className="form-group">
        <label>Propietario *</label>
        <select
          name="ownerId"
          value={formData.ownerId}
          onChange={onChange}
          className={errors.ownerId ? "input-error" : ""}
        >
          <option value="">Seleccionar propietario</option>
          {owners.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
        {errors.ownerId && (
          <span className="error-text">{errors.ownerId}</span>
        )}
      </div>
    </section>
  );
}
