export function buildPropertyPayload({
  formData,
  images,
  selectedCommonAreas,
  propertyNearby,
}) {
  // Separar imágenes existentes de las nuevas
  const existingImages = images
    .filter(img => img.isExisting)
    .map(img => ({
      id: img.id,
      url: img.url,
      publicId: img.publicId,
      isPrimary: img.isPrimary,
      order: img.order,
    }));

  const newImages = images
    .filter(img => !img.isExisting && img.base64)
    .map(img => ({
      base64: img.base64,
      isPrimary: img.isPrimary,
    }));

  return {
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
    // Incluir tanto imágenes existentes como nuevas
    existingImages,
    newImages,
  };
}
