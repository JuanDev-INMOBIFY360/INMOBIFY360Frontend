import { useState, useEffect } from 'react';
import PropertiesStepsForm from './PropertiesStepsForm';

export default function PropertiesForm({
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
  return (
    <PropertiesStepsForm
      item={item}
      countries={countries}
      departments={departments}
      cities={cities}
      neighborhoods={neighborhoods}
      types={types}
      owners={owners}
      uploadedImages={uploadedImages}
      setUploadedImages={setUploadedImages}
      primaryImageId={primaryImageId}
      setPrimaryImageId={setPrimaryImageId}
      onSave={onSave}
      onClose={onClose}
      isSubmitting={isSubmitting}
    />
  );
}
