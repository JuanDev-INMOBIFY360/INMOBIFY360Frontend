import React, { useState, useEffect } from "react";
import "./propertyForm.css";

// hooks
import { usePropertyForm } from "./hooks/usePropertyForm";
import { usePropertySteps } from "./hooks/usePropertySteps";
import { usePropertyImages } from "./hooks/usePropertyImages";

// utils
import { buildPropertyPayload } from "./utils/utils";

// services
import { getCountries, getDepartments } from "../../../../services/LocationsService";
import { getOwners } from "../../../../services/OwnersService";
import { getTypes } from "../../../../services/TypesService";
import { getCommonAreas } from "../../../../services/commonArea";
import { getNearbyPlaces } from "../../../../services/nearbyPlace";

// steps
import StepBasic from "./steps/StepBasic";
import StepPrice from "./steps/StepPrice";
import StepLocation from "./steps/StepLocation";
import StepFeatures from "./steps/StepFeatures";
import StepImages from "./steps/StepImages";

export default function FormProperty({ isOpen, onClose, propertyToEdit, onSave }) {
  // steps
  const totalSteps = 5;
  const { currentStep, next, prev } = usePropertySteps(totalSteps);

  // form
  const { formData, handleChange, setFormData } =
    usePropertyForm(propertyToEdit);

  // images
  const {
    images,
    previews,
    addImages,
    removeImage,
    setPrimary,
  } = usePropertyImages(propertyToEdit?.images);

  // extra state
  const [countries, setCountries] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [owners, setOwners] = useState([]);
  const [types, setTypes] = useState([]);
  const [commonAreas, setCommonAreas] = useState([]);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);

  const [selectedCommonAreas, setSelectedCommonAreas] = useState([]);
  const [propertyNearby, setPropertyNearby] = useState([]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // load catalogs
  useEffect(() => {
    const loadData = async () => {
      const [
        countriesData,
        ownersData,
        typesData,
        commonAreasData,
        nearbyData,
      ] = await Promise.all([
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
    };

    loadData().catch(console.error);
  }, []);

  // Inicializar zonas comunes y lugares cercanos cuando se edita
  useEffect(() => {
    if (propertyToEdit) {
      // Cargar zonas comunes seleccionadas
      if (propertyToEdit.commonAreas && Array.isArray(propertyToEdit.commonAreas)) {
        setSelectedCommonAreas(
          propertyToEdit.commonAreas.map(ca => ca.commonAreaId || ca.id)
        );
      }

      // Cargar lugares cercanos seleccionados
      if (propertyToEdit.properties && Array.isArray(propertyToEdit.properties)) {
        setPropertyNearby(
          propertyToEdit.properties.map(p => ({
            nearbyPlaceId: p.nearbyPlaceId,
            distance: p.distance,
          }))
        );
      }
    }
  }, [propertyToEdit]);

  // departments by country
  useEffect(() => {
    if (!formData.countryId) {
      setDepartments([]);
      return;
    }

    getDepartments(formData.countryId)
      .then(setDepartments)
      .catch(console.error);
  }, [formData.countryId]);

  // submit
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const payload = buildPropertyPayload({
        formData,
        images,
        selectedCommonAreas,
        propertyNearby,
        isEdit: Boolean(propertyToEdit),
      });

      await onSave(payload);
      onClose();
    } catch (error) {
      setErrors({
        submit:
          error.response?.data?.message ||
          "Error al guardar la propiedad",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-container" onClick={onClose}>
      <div
        className="module-container-property"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="module-header">
          <h2>
            {propertyToEdit ? "Editar Propiedad" : "Crear Propiedad"}
          </h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </header>

        <div className="module-body-property">
          {currentStep === 1 && (
            <StepBasic
              formData={formData}
              errors={errors}
              onChange={handleChange}
              types={types}
            />
          )}

          {currentStep === 2 && (
            <StepPrice
              formData={formData}
              errors={errors}
              onChange={handleChange}
            />
          )}

          {currentStep === 3 && (
            <StepLocation
              formData={formData}
              errors={errors}
              onChange={handleChange}
              countries={countries}
              departments={departments}
              owners={owners}
            />
          )}

          {currentStep === 4 && (
            <StepFeatures
              commonAreas={commonAreas}
              selectedCommonAreas={selectedCommonAreas}
              setSelectedCommonAreas={setSelectedCommonAreas}
              nearbyPlaces={nearbyPlaces}
              propertyNearby={propertyNearby}
              setPropertyNearby={setPropertyNearby}
            />
          )}

          {currentStep === 5 && (
            <StepImages
              images={images}
              previews={previews}
              onAddImages={addImages}
              onRemoveImage={removeImage}
              onSetPrimary={setPrimary}
            />
          )}

          {errors.submit && (
            <div className="error-text submit-error">
              {errors.submit}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={currentStep === 1 ? onClose : prev}
            disabled={isSubmitting}
          >
            {currentStep === 1 ? "Cancelar" : "Anterior"}
          </button>

          {currentStep < totalSteps ? (
            <button type="button" onClick={next}>
              Siguiente
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
