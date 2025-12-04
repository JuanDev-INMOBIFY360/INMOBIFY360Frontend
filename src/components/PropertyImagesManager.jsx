import React, { useState } from 'react';
import { removeImage } from '../services/cloudinaryService';

export default function PropertyImagesManager({ propertyId, images = [], onUpdated }) {
  const [loadingId, setLoadingId] = useState(null);

  const onRemove = async (public_id) => {
    if (!confirm('¿Eliminar imagen?')) return;
    try {
      setLoadingId(public_id);
      await removeImage(propertyId, public_id);
      alert('Imagen eliminada');
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error(err);
      alert('Error eliminando imagen');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {images.map(img => (
        <div key={img.public_id} style={{ width: 160, textAlign: 'center' }}>
          <img src={img.url} alt="img" style={{ width: '100%', height: 90, objectFit: 'cover' }} />
          <div>
            <button onClick={() => onRemove(img.public_id)} disabled={loadingId === img.public_id}>
              {loadingId === img.public_id ? 'Borrando...' : 'Eliminar'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
