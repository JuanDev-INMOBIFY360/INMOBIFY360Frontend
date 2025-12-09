import React, { useEffect } from 'react';
import { attachImageMetadata, getSignature } from '../../services/cloudinaryService';

// Widget component (unsigned preset) — requires you to create an unsigned upload preset in Cloudinary
// and set VITE_CLOUDINARY_UPLOAD_PRESET and VITE_CLOUDINARY_CLOUD_NAME in the frontend env (.env).

export default function CloudinaryWidget({ propertyId, onDone }) {
  useEffect(() => {
    // load script if not present
    if (!window.cloudinary) {
      const s = document.createElement('script');
      s.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
      s.async = true;
      s.onload = () => console.log('Cloudinary widget loaded');
      document.body.appendChild(s);
    }
  }, []);

  const openWidget = () => {
    if (!window.cloudinary) return alert('Widget no cargado aún. Intenta de nuevo');

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET; // unsigned preset

    if (!cloudName || !uploadPreset) {
      return alert('Falta configurar VITE_CLOUDINARY_CLOUD_NAME o VITE_CLOUDINARY_UPLOAD_PRESET');
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        sources: ['local', 'url', 'camera'],
        multiple: true,
        folder: `inmobify360/properties/${propertyId}`,
        clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp'],
        maxFileSize: 10 * 1024 * 1024,
      },
      async (error, result) => {
        if (error) {
          console.error('Widget error:', error);
          return;
        }
        if (result && result.event === 'success') {
          try {
            // result.info contains secure_url and public_id
            await attachImageMetadata(propertyId, result.info);
            if (onDone) onDone(result.info);
          } catch (err) {
            console.error('Error attaching metadata:', err);
          }
        }
      }
    );

    widget.open();
  };

  return (
    <div>
      <button onClick={openWidget}>Abrir Upload Widget</button>
    </div>
  );
}
