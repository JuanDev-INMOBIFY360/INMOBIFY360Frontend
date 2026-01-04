import React, { useState, useEffect } from "react";
import { CircleX, Upload, X, Star } from "lucide-react";
import { getCountries, getDepartments } from "../../../../services/LocationsService";
import { getOwners } from "../../../../services/OwnersService";
import { getTypes } from "../../../../services/TypesService";
import { fileToBase64 } from "../../../../services/propertyService";
import "./property.css";

export default function FormProperty({ isOpen, onClose, propertyToEdit, onSave }) {
  const [formData, setFormData] = useState({
    codigo: "",
    titulo: "",
    descripcion: "",
    operacion: "SALE",
    precio: "",
    moneda: "COP",
    habitaciones: "",
    banos: "",
    parqueaderos: "",
    areaConstruida: "",
    areaPrivada: "",
    ciudad: "",
    barrio: "",
    direccion: "",
    latitud: "",
    longitud: "",
    estado: "AVAILABLE",
    publicada: false,
    destacada: false,
    countryId: "",
    departmentId: "",
    ownerId: "",
    typePropertyId: "",
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [countries, setCountries] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [owners, setOwners] = useState([]);
  const [types, setTypes] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        const [countriesData, ownersData, typesData] = await Promise.all([
          getCountries(),
          getOwners(),
          getTypes(),
        ]);
        setCountries(countriesData);
        setOwners(ownersData);
        setTypes(typesData);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };
    loadData();
  }, []);

  // Cargar departamentos cuando cambia el país
  useEffect(() => {
    if (formData.countryId) {
      getDepartments(formData.countryId)
        .then(setDepartments)
        .catch(console.error);
    } else {
      setDepartments([]);
    }
  }, [formData.countryId]);

  // Resetear formulario cuando se abre/cierra
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      codigo: "",
      titulo: "",
      descripcion: "",
      operacion: "SALE",
      precio: "",
      moneda: "COP",
      habitaciones: "",
      banos: "",
      parqueaderos: "",
      areaConstruida: "",
      areaPrivada: "",
      ciudad: "",
      barrio: "",
      direccion: "",
      latitud: "",
      longitud: "",
      estado: "AVAILABLE",
      publicada: false,
      destacada: false,
      countryId: "",
      departmentId: "",
      ownerId: "",
      typePropertyId: "",
    });
    setImages([]);
    setImagePreviews([]);
    setErrors({});
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  /**
   * Manejar selección de imágenes
   */
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    
    // Validar cantidad
    if (images.length + files.length > 20) {
      setErrors({ images: "Máximo 20 imágenes permitidas" });
      return;
    }

    const validFiles = [];
    const newPreviews = [];

    for (const file of files) {
      // Validar tipo
      if (!file.type.startsWith("image/")) {
        setErrors({ images: "Solo se permiten archivos de imagen" });
        continue;
      }

      // Validar tamaño (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ images: "Cada imagen debe ser menor a 5MB" });
        continue;
      }

      try {
        const base64 = await fileToBase64(file);
        validFiles.push({
          base64,
          isPrimary: images.length === 0 && validFiles.length === 0, // Primera imagen es primaria
          order: images.length + validFiles.length,
        });
        newPreviews.push(URL.createObjectURL(file));
      } catch (error) {
        console.error("Error convirtiendo imagen:", error);
      }
    }

    setImages((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setErrors((prev) => ({ ...prev, images: "" }));
  };

  /**
   * Eliminar una imagen
   */
  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    // Si se elimina la primaria, marcar la primera como primaria
    if (images[index].isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }

    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  /**
   * Establecer imagen como primaria
   */
  const setPrimary = (index) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    setImages(newImages);
  };

  /**
   * Validar formulario
   */
  const validate = () => {
    const newErrors = {};

    if (!formData.codigo.trim()) newErrors.codigo = "Código es requerido";
    if (!formData.titulo.trim()) newErrors.titulo = "Título es requerido";
    if (!formData.precio || parseFloat(formData.precio) <= 0)
      newErrors.precio = "Precio debe ser mayor a 0";
    if (!formData.ciudad.trim()) newErrors.ciudad = "Ciudad es requerida";
    if (!formData.direccion.trim()) newErrors.direccion = "Dirección es requerida";
    if (!formData.countryId) newErrors.countryId = "País es requerido";
    if (!formData.departmentId) newErrors.departmentId = "Departamento es requerido";
    if (!formData.ownerId) newErrors.ownerId = "Propietario es requerido";
    if (!formData.typePropertyId) newErrors.typePropertyId = "Tipo de propiedad es requerido";

    if (images.length === 0) {
      newErrors.images = "Debes subir al menos una imagen";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Enviar formulario
   */
  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);

    try {
     const payload = {
  ...formData,
  precio: parseFloat(formData.precio),
  habitaciones: formData.habitaciones ? parseInt(formData.habitaciones) : undefined,
  banos: formData.banos ? parseInt(formData.banos) : undefined,
  parqueaderos: formData.parqueaderos ? parseInt(formData.parqueaderos) : undefined,
  areaConstruida: formData.areaConstruida ? parseFloat(formData.areaConstruida) : undefined,
  areaPrivada: formData.areaPrivada ? parseFloat(formData.areaPrivada) : undefined,
  ...(formData.latitud && { latitud: parseFloat(formData.latitud) }),
  ...(formData.longitud && { longitud: parseFloat(formData.longitud) }),
  countryId: parseInt(formData.countryId),
  departmentId: parseInt(formData.departmentId),
  ownerId: parseInt(formData.ownerId),
  typePropertyId: parseInt(formData.typePropertyId),
  images,
};


      await onSave(payload);
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error guardando propiedad:", error);
      setErrors({ submit: error.response?.data?.message || "Error al guardar la propiedad" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-container" onClick={onClose}>
      <div className="module-container-property" onClick={(e) => e.stopPropagation()}>
        <header className="module-header">
          <h2>{propertyToEdit ? "Editar Propiedad" : "Crear Propiedad"}</h2>
          <button className="close-button" onClick={onClose}>
            <CircleX size={20} />
          </button>
        </header>

        <div className="module-body-property">
          {/* Información Básica */}
          <section className="form-section">
            <h3 className="section-title">Información Básica</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="codigo">Código *</label>
                <input
                  id="codigo"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  className={errors.codigo ? "input-error" : ""}
                  disabled={isSubmitting}
                  placeholder="PROP-001"
                />
                {errors.codigo && <span className="error-text">{errors.codigo}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="titulo">Título *</label>
                <input
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  className={errors.titulo ? "input-error" : ""}
                  disabled={isSubmitting}
                  placeholder="Apartamento en el norte"
                />
                {errors.titulo && <span className="error-text">{errors.titulo}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                disabled={isSubmitting}
                rows={4}
                placeholder="Descripción detallada de la propiedad"
              />
            </div>
          </section>

          {/* Detalles de Operación */}
          <section className="form-section">
            <h3 className="section-title">Operación y Precio</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="operacion">Operación *</label>
                <select
                  id="operacion"
                  name="operacion"
                  value={formData.operacion}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="SALE">Venta</option>
                  <option value="RENT">Arriendo</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="precio">Precio *</label>
                <input
                  id="precio"
                  name="precio"
                  type="number"
                  value={formData.precio}
                  onChange={handleChange}
                  className={errors.precio ? "input-error" : ""}
                  disabled={isSubmitting}
                  placeholder="350000000"
                />
                {errors.precio && <span className="error-text">{errors.precio}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="moneda">Moneda</label>
                <select
                  id="moneda"
                  name="moneda"
                  value={formData.moneda}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="COP">COP</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
          </section>

          {/* Características */}
          <section className="form-section">
            <h3 className="section-title">Características</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="habitaciones">Habitaciones</label>
                <input
                  id="habitaciones"
                  name="habitaciones"
                  type="number"
                  value={formData.habitaciones}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="banos">Baños</label>
                <input
                  id="banos"
                  name="banos"
                  type="number"
                  value={formData.banos}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="2"
                />
              </div>

              <div className="form-group">
                <label htmlFor="parqueaderos">Parqueaderos</label>
                <input
                  id="parqueaderos"
                  name="parqueaderos"
                  type="number"
                  value={formData.parqueaderos}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="1"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="areaConstruida">Área Construida (m²)</label>
                <input
                  id="areaConstruida"
                  name="areaConstruida"
                  type="number"
                  step="0.01"
                  value={formData.areaConstruida}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="85.5"
                />
              </div>

              <div className="form-group">
                <label htmlFor="areaPrivada">Área Privada (m²)</label>
                <input
                  id="areaPrivada"
                  name="areaPrivada"
                  type="number"
                  step="0.01"
                  value={formData.areaPrivada}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="80.0"
                />
              </div>
            </div>
          </section>

          {/* Ubicación */}
          <section className="form-section">
            <h3 className="section-title">Ubicación</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="countryId">País *</label>
                <select
                  id="countryId"
                  name="countryId"
                  value={formData.countryId}
                  onChange={handleChange}
                  className={errors.countryId ? "input-error" : ""}
                  disabled={isSubmitting}
                >
                  <option value="">Seleccionar país</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.countryId && <span className="error-text">{errors.countryId}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="departmentId">Departamento *</label>
                <select
                  id="departmentId"
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleChange}
                  className={errors.departmentId ? "input-error" : ""}
                  disabled={isSubmitting || !formData.countryId}
                >
                  <option value="">Seleccionar departamento</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                {errors.departmentId && <span className="error-text">{errors.departmentId}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ciudad">Ciudad *</label>
                <input
                  id="ciudad"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  className={errors.ciudad ? "input-error" : ""}
                  disabled={isSubmitting}
                  placeholder="Bogotá"
                />
                {errors.ciudad && <span className="error-text">{errors.ciudad}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="barrio">Barrio</label>
                <input
                  id="barrio"
                  name="barrio"
                  value={formData.barrio}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="Usaquén"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="direccion">Dirección *</label>
              <input
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className={errors.direccion ? "input-error" : ""}
                disabled={isSubmitting}
                placeholder="Calle 123 #45-67"
              />
              {errors.direccion && <span className="error-text">{errors.direccion}</span>}
            </div>
          </section>

          {/* Relaciones */}
          <section className="form-section">
            <h3 className="section-title">Información Adicional</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ownerId">Propietario *</label>
                <select
                  id="ownerId"
                  name="ownerId"
                  value={formData.ownerId}
                  onChange={handleChange}
                  className={errors.ownerId ? "input-error" : ""}
                  disabled={isSubmitting}
                >
                  <option value="">Seleccionar propietario</option>
                  {owners.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
                </select>
                {errors.ownerId && <span className="error-text">{errors.ownerId}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="typePropertyId">Tipo de Propiedad *</label>
                <select
                  id="typePropertyId"
                  name="typePropertyId"
                  value={formData.typePropertyId}
                  onChange={handleChange}
                  className={errors.typePropertyId ? "input-error" : ""}
                  disabled={isSubmitting}
                >
                  <option value="">Seleccionar tipo</option>
                  {types.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                {errors.typePropertyId && <span className="error-text">{errors.typePropertyId}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="estado">Estado</label>
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="AVAILABLE">Disponible</option>
                  <option value="SOLD">Vendida</option>
                  <option value="RENTED">Arrendada</option>
                  <option value="INACTIVE">Inactiva</option>
                </select>
              </div>

              <div className="form-group">
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="publicada"
                      checked={formData.publicada}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                    <span>Publicada</span>
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="destacada"
                      checked={formData.destacada}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                    <span>Destacada</span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Imágenes */}
          <section className="form-section">
            <h3 className="section-title">Imágenes * (Máximo 20)</h3>
            
            <div className="upload-area">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                disabled={isSubmitting || images.length >= 20}
                id="image-upload"
                className="upload-input"
              />
              <label htmlFor="image-upload" className="upload-label">
                <Upload size={32} />
                <p>Click para seleccionar imágenes</p>
                <span>PNG, JPG, GIF hasta 5MB cada una</span>
              </label>
            </div>

            {errors.images && <span className="error-text">{errors.images}</span>}

            {imagePreviews.length > 0 && (
              <div className="images-preview">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={preview} alt={`Preview ${index + 1}`} />
                    
                    {images[index].isPrimary && (
                      <div className="primary-badge">
                        <Star size={16} fill="currentColor" />
                        Primaria
                      </div>
                    )}
                    
                    <div className="image-actions">
                      {!images[index].isPrimary && (
                        <button
                          type="button"
                          onClick={() => setPrimary(index)}
                          className="btn-primary-image"
                          disabled={isSubmitting}
                        >
                          <Star size={16} />
                        </button>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="btn-remove-image"
                        disabled={isSubmitting}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {errors.submit && (
            <div className="error-text submit-error">{errors.submit}</div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn-submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Guardando..." : "Guardar Propiedad"}
          </button>
        </div>
      </div>
    </div>
  );
}