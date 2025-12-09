import React, { useState, useEffect } from 'react';
import { getSignature, uploadToCloudinary, attachImageMetadata } from '../../services/cloudinaryService';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function CloudinaryUploader({ propertyId, onDone }) {
  const [files, setFiles] = useState([]);
  const [items, setItems] = useState([]); // { file, preview, progress, error }
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // cleanup previews on unmount
    return () => {
      items.forEach(i => URL.revokeObjectURL(i.preview));
    };
  }, [items]);

  const onFilesChange = (e) => {
    const selected = Array.from(e.target.files || []);
    const mapped = selected.map(file => {
      const preview = URL.createObjectURL(file);
      let error = null;
      if (!ALLOWED_TYPES.includes(file.type)) error = 'Tipo no permitido';
      if (file.size > MAX_FILE_SIZE) error = 'Archivo muy grande (máx 10MB)';
      return { file, preview, progress: 0, error };
    });
    setItems(prev => [...prev, ...mapped]);
    setFiles(prev => [...prev, ...selected]);
  };

  const removeLocalItem = (index) => {
    const it = items[index];
    if (it) URL.revokeObjectURL(it.preview);
    const newItems = items.slice();
    newItems.splice(index, 1);
    setItems(newItems);
    const newFiles = files.slice();
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const onUpload = async () => {
    if (!items.length) return alert('Seleccione al menos un archivo');
    // stop if any error
    const hasError = items.some(i => i.error);
    if (hasError) return alert('Corrige los errores de archivos antes de subir');

    setLoading(true);
    try {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        // update progress
        setItems(prev => prev.map((p, idx) => idx === i ? { ...p, progress: 1 } : p));

        // 1) pedir firma
        const sig = await getSignature();

        // 2) subir directo a Cloudinary con progress callback
        const cloudRes = await uploadToCloudinary(item.file, sig, `inmobify360/properties/${propertyId}`, (percent) => {
          setItems(prev => prev.map((p, idx) => idx === i ? { ...p, progress: percent } : p));
        });

        // 3) notificar al backend para adjuntar la metadata
        await attachImageMetadata(propertyId, cloudRes);
      }

      alert('Imágenes subidas correctamente');
      // cleanup
      items.forEach(i => URL.revokeObjectURL(i.preview));
      setItems([]);
      setFiles([]);
      if (onDone) onDone();
    } catch (err) {
      console.error(err);
      alert('Error subiendo imágenes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <input type="file" multiple accept="image/*" onChange={onFilesChange} />
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {items.map((it, idx) => (
          <div key={idx} style={{ width: 160, border: '1px solid #ddd', padding: 6 }}>
            <div style={{ width: '100%', height: 90, overflow: 'hidden' }}>
              <img src={it.preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ fontSize: 12, marginTop: 6 }}>{it.file.name}</div>
            {it.error ? (
              <div style={{ color: 'red', fontSize: 12 }}>{it.error}</div>
            ) : (
              <div style={{ marginTop: 6 }}>
                <div style={{ height: 8, background: '#f0f0f0' }}>
                  <div style={{ height: 8, width: `${it.progress}%`, background: '#4caf50' }} />
                </div>
                <div style={{ fontSize: 11 }}>{it.progress}%</div>
              </div>
            )}
            <div style={{ marginTop: 6 }}>
              <button onClick={() => removeLocalItem(idx)} disabled={loading}>Quitar</button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <button onClick={onUpload} disabled={loading || items.length === 0}>{loading ? 'Subiendo...' : 'Subir al Cloud (Directo firmado)'}</button>
      </div>
    </div>
  );
}
