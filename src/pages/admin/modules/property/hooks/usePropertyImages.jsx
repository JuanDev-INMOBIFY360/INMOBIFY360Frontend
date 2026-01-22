import { useState, useEffect } from "react";
import { fileToBase64 } from "../../../../../services/propertyService";

export function usePropertyImages(existingImages = []) {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  // Inicializar con imágenes existentes si estamos editando
  useEffect(() => {
    if (existingImages && Array.isArray(existingImages) && existingImages.length > 0) {
      setImages(
        existingImages.map(img => ({
          id: img.id, // Preservar el ID para la API
          url: img.url,
          publicId: img.publicId,
          isPrimary: img.isPrimary || false,
          order: img.order || 0,
          isExisting: true, // Marcar como existente para no reuploadear
        }))
      );
      setPreviews(existingImages.map(img => img.url));
    }
  }, [existingImages]);

  const addImages = async (files) => {
    // Convertir FileList a Array si es necesario
    const fileArray = Array.isArray(files) ? files : Array.from(files || []);
    
    if (!fileArray || fileArray.length === 0) return;

    const valid = [];

    for (const file of fileArray) {
      const base64 = await fileToBase64(file);
      valid.push({
        base64,
        isPrimary: images.length === 0 && valid.length === 0,
        isExisting: false,
      });
    }

    setImages(prev => [...prev, ...valid]);
    setPreviews(prev => [...prev, ...fileArray.map(f => URL.createObjectURL(f))]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const setPrimary = (index) => {
    setImages(prev =>
      prev.map((img, i) => ({ ...img, isPrimary: i === index }))
    );
  };

  return { images, previews, addImages, removeImage, setPrimary };
}
