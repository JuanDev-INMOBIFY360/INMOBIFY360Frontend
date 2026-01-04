import React, { useState, useEffect } from "react";
import { CircleX, Upload, X, Star, Plus, Trash2 } from "lucide-react";
import { getCountries, getDepartments } from "../../../../services/LocationsService";
import { getOwners } from "../../../../services/OwnersService";
import { getTypes } from "../../../../services/TypesService";
import { fileToBase64 } from "../../../../services/propertyService";
import { getCommonAreas } from "../../../../services/commonArea";
import { getNearbyPlaces } from "../../../../services/nearbyPlace";
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
    ciudad: "",
    barrio: "",
    direccion: "",
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
  const [commonAreas, setCommonAreas] = useState([]);
  const [selectedCommonAreas, setSelectedCommonAreas] = useState([]);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [propertyNearby, setPropertyNearby] = useState([]);
  const [selectedNearby, setSelectedNearby] = useState("");
  const [distance, setDistance] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        const [countriesData, ownersData, typesData, commonAreasData, nearbyData] = await Promise.all([
          getCountries(),
          getOwners(),
          getTypes(),
          getCommonAreas(),
          getNearbyPlaces(),
        ]);
        setCountries(countriesData);
        setOwners(ownersData);
        setTypes(typesData);
        setCommonAreas(commonAreasData);
        setNearbyPlaces(nearbyData);
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
      setFormData(prev => ({ ...prev, departmentId: "" }));
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
      ciudad: "",
      barrio: "",
      direccion: "",
      countryId: "",
      departmentId: "",
      ownerId: "",
      typePropertyId: "",
    });
    setImages([]);
    setImagePreviews([]);
    setSelectedCommonAreas([]);
    setPropertyNearby([]);
    setSelectedNearby("");
    setDistance("");
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

  const toggleCommonArea = (id) => {
    setSelectedCommonAreas((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const addNearbyPlace = () => {
    if (!selectedNearby || !distance || parseFloat(distance) <= 0) {
      setErrors({ nearby: "Selecciona un lugar y una distancia válida" });
      return;
    }

    const alreadyAdded = propertyNearby.find(
      (p) => p.nearbyPlaceId === Number(selectedNearby)
    );

    if (alreadyAdded) {
      setErrors({ nearby: "Este lugar ya fue agregado" });
      return;
    }

    setPropertyNearby((prev) => [
      ...prev,
      {
        nearbyPlaceId: Number(selectedNearby),
        distance: parseFloat(distance),
      },
    ]);

    setSelectedNearby("");
    setDistance("");
    setErrors((prev) => ({ ...prev, nearby: "" }));
  };

  const removeNearbyPlace = (nearbyPlaceId) => {
    setPropertyNearby((prev) => prev.filter((p) => p.nearbyPlaceId !== nearbyPlaceId));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 20) {
      setErrors({ images: "Máximo 20 imágenes permitidas" });
      return;
    }

    const validFiles = [];
    const newPreviews = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setErrors({ images: "Solo se permiten archivos de imagen" });
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors({ images: "Cada imagen debe ser menor a 5MB" });
        continue;
      }

      try {
        const base64 = await fileToBase64(file);
        validFiles.push({
          base64,
          isPrimary: images.length === 0 && validFiles.length === 0,
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

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    if (images[index].isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }

    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const setPrimary = (index) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    setImages(newImages);
  };

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

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        commonAreaIds: selectedCommonAreas,
        nearbyPlaces: propertyNearby,
        precio: parseFloat(formData.precio),
        habitaciones: formData.habitaciones ? parseInt(formData.habitaciones) : undefined,
        banos: formData.banos ? parseInt(formData.banos) : undefined,
        parqueaderos: formData.parqueaderos ? parseInt(formData.parqueaderos) : undefined,
        areaConstruida: formData.areaConstruida ? parseFloat(formData.areaConstruida) : undefined,
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

          {/* Operación y Precio */}
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

          {/* Información Adicional */}
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
          </section>

          {/* Áreas Comunes */}
          <section className="form-section">
            <h3 className="section-title">Áreas Comunes</h3>
            <div className="checkbox-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {commonAreas.map((area) => (
                <label key={area.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedCommonAreas.includes(area.id)}
                    onChange={() => toggleCommonArea(area.id)}
                    disabled={isSubmitting}
                  />
                  <span>{area.name}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Lugares Cercanos */}
          <section className="form-section">
            <h3 className="section-title">Lugares Cercanos</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nearbyPlace">Lugar</label>
                <select
                  id="nearbyPlace"
                  value={selectedNearby}
                  onChange={(e) => setSelectedNearby(e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="">Seleccionar lugar</option>
                  {nearbyPlaces.map((place) => (
                    <option key={place.id} value={place.id}>
                      {place.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="distance">Distancia (km)</label>
                <input
                  id="distance"
                  type="number"
                  step="0.1"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="1.5"
                />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  type="button"
                  onClick={addNearbyPlace}
                  disabled={isSubmitting}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: '#00A7FF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  <Plus size={18} />
                  Agregar
                </button>
              </div>
            </div>

            {errors.nearby && <span className="error-text">{errors.nearby}</span>}

            {propertyNearby.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Lugar</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Distancia</th>
                      <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600', width: '80px' }}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {propertyNearby.map((item) => {
                      const place = nearbyPlaces.find((p) => p.id === item.nearbyPlaceId);
                      return (
                        <tr key={item.nearbyPlaceId} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '12px', fontSize: '14px' }}>{place?.name}</td>
                          <td style={{ padding: '12px', fontSize: '14px' }}>{item.distance} km</td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => removeNearbyPlace(item.nearbyPlaceId)}
                              disabled={isSubmitting}
                              style={{
                                padding: '6px',
                                backgroundColor: '#fee2e2',
                                color: '#ef4444',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
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