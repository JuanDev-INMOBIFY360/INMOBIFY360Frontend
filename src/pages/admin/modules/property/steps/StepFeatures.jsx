export default function StepFeatures({
  commonAreas,
  selectedCommonAreas,
  setSelectedCommonAreas,
  nearbyPlaces,
  propertyNearby,
  setPropertyNearby,
}) {
  const toggleCommonArea = (id) => {
    setSelectedCommonAreas((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleNearbyPlace = (placeId) => {
    setPropertyNearby((prev) => {
      const exists = prev.find((p) => p.nearbyPlaceId === placeId);
      if (exists) {
        return prev.filter((p) => p.nearbyPlaceId !== placeId);
      } else {
        return [...prev, { nearbyPlaceId: placeId, distance: 1 }];
      }
    });
  };

  const isNearbyPlaceSelected = (placeId) => {
    return propertyNearby.some((p) => p.nearbyPlaceId === placeId);
  };

  return (
    <section className="form-step">
      <h3 className="step-heading">Características</h3>

      <div className="subsection">
        <h4 className="subsection-title">Áreas Comunes</h4>
        <div className="amenities-grid">
          {commonAreas.map((area) => (
            <label key={area.id} className="amenity-checkbox">
              <input
                type="checkbox"
                checked={selectedCommonAreas.includes(area.id)}
                onChange={() => toggleCommonArea(area.id)}
              />
              <span className="amenity-label">{area.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="subsection">
        <h4 className="subsection-title">Lugares Cercanos</h4>
        <div className="amenities-grid">
          {nearbyPlaces.map((place) => (
            <label key={place.id} className="amenity-checkbox">
              <input
                type="checkbox"
                checked={isNearbyPlaceSelected(place.id)}
                onChange={() => toggleNearbyPlace(place.id)}
              />
              <span className="amenity-label">{place.name}</span>
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}