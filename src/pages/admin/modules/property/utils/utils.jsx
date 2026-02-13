export function buildPropertyPayload({
  formData,
  images,
  selectedCommonAreas,
  propertyNearby,
  isEdit = false,
}) {
  // imágenes que ya estaban guardadas (solo usadas al editar)
  const existingImages = images
    .filter((img) => img.isExisting)
    .map((img) => ({
      id: img.id,
      url: img.url,
      publicId: img.publicId,
      isPrimary: img.isPrimary,
      order: img.order,
    }));

  // imágenes nuevas que se van a subir (base64)
  const newImages = images
    .filter((img) => !img.isExisting && img.base64)
    .map((img) => ({
      base64: img.base64,
      isPrimary: img.isPrimary,
      order: img.order,
    }));

  const base = {
    ...formData,
    precio: Number(formData.precio),
    habitaciones: Number(formData.habitaciones),
    banos: Number(formData.banos),
    parqueaderos: Number(formData.parqueaderos),
    areaConstruida: Number(formData.areaConstruida),
    countryId: Number(formData.countryId),
    departmentId: Number(formData.departmentId),
    ownerId: Number(formData.ownerId),
    typePropertyId: Number(formData.typePropertyId),
    commonAreaIds: selectedCommonAreas,
    nearbyPlaces: propertyNearby,
  };

  if (isEdit) {
    return {
      ...base,
      existingImages,
      newImages,
    };
  }

  // en creación enviamos solo images para que el servicio las suba
  return {
    ...base,
    images: newImages,
  };
}
