import { useState, useEffect } from 'react';
import './styles/properties.css';

export default function PropertiesStepsForm({
  item,
  countries,
  departments,
  cities,
  neighborhoods,
  types,
  owners,
  uploadedImages,
  setUploadedImages,
  primaryImageId,
  setPrimaryImageId,
  onSave,
  onClose,
  isSubmitting
}) {
  const stepLabels = ['Datos Básicos', 'Ubicación', 'Características', 'Imágenes', 'Resumen'];
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    precio: '',
    area: '',
    habitaciones: '',
    banos: '',
    parqueaderos: '',
    estrato: '',
    direccion: '',
    ownerId: '',
    countryId: '',
    departmentId: '',
    cityId: '',
    neighborhoodId: '',
    typePropertyId: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({
        titulo: item.titulo || '',
        descripcion: item.descripcion || '',
        precio: item.precio || '',
        area: item.area || '',
        habitaciones: item.habitaciones || '',
        banos: item.banos || '',
        parqueaderos: item.parqueaderos || '',
        estrato: item.estrato || '',
        direccion: item.direccion || '',
        ownerId: item.ownerId || '',
        countryId: item.countryId || '',
        departmentId: item.departmentId || '',
        cityId: item.cityId || '',
        neighborhoodId: item.neighborhoodId || '',
        typePropertyId: item.typePropertyId || ''
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    switch (step) {
      case 0: // Datos Básicos
        if (!formData.titulo.trim()) newErrors.titulo = 'Título requerido';
        if (!formData.precio) newErrors.precio = 'Precio requerido';
        if (!formData.typePropertyId) newErrors.typePropertyId = 'Tipo requerido';
        if (!formData.ownerId) newErrors.ownerId = 'Dueño requerido';
        break;
      case 1: // Ubicación
        if (!formData.direccion.trim()) newErrors.direccion = 'Dirección requerida';
        if (!formData.countryId) newErrors.countryId = 'País requerido';
        if (!formData.departmentId) newErrors.departmentId = 'Departamento requerido';
        if (!formData.cityId) newErrors.cityId = 'Ciudad requerida';
        if (!formData.neighborhoodId) newErrors.neighborhoodId = 'Barrio requerido';
        break;
      case 3: // Imágenes
        if (uploadedImages.length === 0) newErrors.imagenes = 'Se requiere al menos una imagen';
        if (uploadedImages.length > 0 && !primaryImageId) newErrors.primaryImage = 'Selecciona imagen principal';
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, stepLabels.length - 1));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage = event.target.result;
        setUploadedImages((prev) => [...prev, newImage]);
        if (uploadedImages.length === 0) setPrimaryImageId(newImage);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index) => {
    const removedImage = uploadedImages[index];
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    if (primaryImageId === removedImage) {
      setPrimaryImageId(uploadedImages.length > 1 ? uploadedImages[0] : null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;
    if (currentStep < stepLabels.length - 1) {
      handleNextStep();
    } else {
      await onSave(formData);
    }
  };

  const filteredDepartments = formData.countryId
    ? departments.filter((d) => d.countryId === parseInt(formData.countryId))
    : [];
  const filteredCities = formData.departmentId
    ? cities.filter((c) => c.departmentId === parseInt(formData.departmentId))
    : [];
  const filteredNeighborhoods = formData.cityId
    ? neighborhoods.filter((n) => n.cityId === parseInt(formData.cityId))
    : [];

  return (
    <div className="properties-modal">
      <div className="properties-form-container">
        <div className="properties-form-header">
          <h3>{item ? 'Editar Propiedad' : 'Crear Propiedad'}</h3>
          <button className="properties-form-close" onClick={onClose}>×</button>
        </div>

        <div className="properties-steps-indicator">
          {stepLabels.map((label, idx) => (
            <div
              key={idx}
              className={`step ${idx === currentStep ? 'active' : ''} ${idx < currentStep ? 'completed' : ''}`}
            >
              {idx + 1}
            </div>
          ))}
        </div>
        <div className="properties-step-label">{stepLabels[currentStep]}</div>

        <form onSubmit={handleSubmit} className="properties-form">
          {currentStep === 0 && (
            <>
              <div className="properties-form-group">
                <label>Título *</label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  className={errors.titulo ? 'input--error' : ''}
                  placeholder="Título de la propiedad"
                />
                {errors.titulo && <span className="error-message">{errors.titulo}</span>}
              </div>

              <div className="properties-form-group">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Descripción detallada"
                  rows="3"
                />
              </div>

              <div className="properties-form-row">
                <div className="properties-form-group">
                  <label>Precio *</label>
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    className={errors.precio ? 'input--error' : ''}
                    placeholder="Precio"
                  />
                  {errors.precio && <span className="error-message">{errors.precio}</span>}
                </div>

                <div className="properties-form-group">
                  <label>Tipo de Propiedad *</label>
                  <select
                    name="typePropertyId"
                    value={formData.typePropertyId}
                    onChange={handleChange}
                    className={errors.typePropertyId ? 'input--error' : ''}
                  >
                    <option value="">Seleccionar</option>
                    {types.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  {errors.typePropertyId && <span className="error-message">{errors.typePropertyId}</span>}
                </div>

                <div className="properties-form-group">
                  <label>Dueño *</label>
                  <select
                    name="ownerId"
                    value={formData.ownerId}
                    onChange={handleChange}
                    className={errors.ownerId ? 'input--error' : ''}
                  >
                    <option value="">Seleccionar</option>
                    {owners.map((o) => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
                  {errors.ownerId && <span className="error-message">{errors.ownerId}</span>}
                </div>
              </div>
            </>
          )}

          {currentStep === 1 && (
            <>
              <div className="properties-form-group">
                <label>Dirección *</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className={errors.direccion ? 'input--error' : ''}
                  placeholder="Dirección"
                />
                {errors.direccion && <span className="error-message">{errors.direccion}</span>}
              </div>

              <div className="properties-form-row">
                <div className="properties-form-group">
                  <label>País *</label>
                  <select
                    name="countryId"
                    value={formData.countryId}
                    onChange={handleChange}
                    className={errors.countryId ? 'input--error' : ''}
                  >
                    <option value="">Seleccionar</option>
                    {countries.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {errors.countryId && <span className="error-message">{errors.countryId}</span>}
                </div>

                <div className="properties-form-group">
                  <label>Departamento *</label>
                  <select
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleChange}
                    className={errors.departmentId ? 'input--error' : ''}
                    disabled={!formData.countryId}
                  >
                    <option value="">Seleccionar</option>
                    {filteredDepartments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  {errors.departmentId && <span className="error-message">{errors.departmentId}</span>}
                </div>

                <div className="properties-form-group">
                  <label>Ciudad *</label>
                  <select
                    name="cityId"
                    value={formData.cityId}
                    onChange={handleChange}
                    className={errors.cityId ? 'input--error' : ''}
                    disabled={!formData.departmentId}
                  >
                    <option value="">Seleccionar</option>
                    {filteredCities.map((ci) => (
                      <option key={ci.id} value={ci.id}>{ci.name}</option>
                    ))}
                  </select>
                  {errors.cityId && <span className="error-message">{errors.cityId}</span>}
                </div>

                <div className="properties-form-group">
                  <label>Barrio *</label>
                  <select
                    name="neighborhoodId"
                    value={formData.neighborhoodId}
                    onChange={handleChange}
                    className={errors.neighborhoodId ? 'input--error' : ''}
                    disabled={!formData.cityId}
                  >
                    <option value="">Seleccionar</option>
                    {filteredNeighborhoods.map((n) => (
                      <option key={n.id} value={n.id}>{n.name}</option>
                    ))}
                  </select>
                  {errors.neighborhoodId && <span className="error-message">{errors.neighborhoodId}</span>}
                </div>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <div className="properties-form-row">
              <div className="properties-form-group">
                <label>Habitaciones</label>
                <input
                  type="number"
                  name="habitaciones"
                  value={formData.habitaciones}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>

              <div className="properties-form-group">
                <label>Baños</label>
                <input
                  type="number"
                  name="banos"
                  value={formData.banos}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>

              <div className="properties-form-group">
                <label>Parqueaderos</label>
                <input
                  type="number"
                  name="parqueaderos"
                  value={formData.parqueaderos}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>

              <div className="properties-form-group">
                <label>Área (m²)</label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>

              <div className="properties-form-group">
                <label>Estrato</label>
                <select name="estrato" value={formData.estrato} onChange={handleChange}>
                  <option value="">Seleccionar</option>
                  {[1, 2, 3, 4, 5, 6].map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <>
              <div className="properties-form-group">
                <label>Imágenes {uploadedImages.length > 0 && <span>({uploadedImages.length})</span>}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAddImage}
                  className="file-input"
                />
                {errors.imagenes && <span className="error-message">{errors.imagenes}</span>}
              </div>

              {uploadedImages.length > 0 && (
                <div className="properties-images-gallery">
                  {uploadedImages.map((img, idx) => (
                    <div
                      key={idx}
                      className={`properties-image-item ${primaryImageId === img ? 'primary' : ''}`}
                      onClick={() => setPrimaryImageId(img)}
                    >
                      <img src={img} alt={`Preview ${idx}`} />
                      <button
                        type="button"
                        className="properties-image-remove"
                        onClick={(e) => { e.stopPropagation(); handleRemoveImage(idx); }}
                      >
                        ×
                      </button>
                      {primaryImageId === img && <div className="properties-image-badge">Principal</div>}
                    </div>
                  ))}
                </div>
              )}
              {errors.primaryImage && <span className="error-message">{errors.primaryImage}</span>}
            </>
          )}

          {currentStep === 4 && (
            <div className="properties-summary">
              <h4>Resumen de la Propiedad</h4>
              <div className="properties-summary-grid">
                <div><strong>Título:</strong> {formData.titulo}</div>
                <div><strong>Precio:</strong> ${formData.precio?.toLocaleString()}</div>
                <div><strong>Dirección:</strong> {formData.direccion}</div>
                <div><strong>Habitaciones:</strong> {formData.habitaciones || 0}</div>
                <div><strong>Baños:</strong> {formData.banos || 0}</div>
                <div><strong>Área:</strong> {formData.area} m²</div>
                <div><strong>Imágenes:</strong> {uploadedImages.length}</div>
              </div>
            </div>
          )}

          <div className="properties-form-actions">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={currentStep === 0 ? onClose : handlePrevStep}
              disabled={isSubmitting}
            >
              {currentStep === 0 ? 'Cancelar' : 'Anterior'}
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : currentStep === stepLabels.length - 1 ? 'Guardar' : 'Siguiente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
