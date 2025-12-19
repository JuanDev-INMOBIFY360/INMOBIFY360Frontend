export function parsePropertyImages(value) {
  if (!value) return [];
  try {
    if (typeof value === 'string') {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    }
    return Array.isArray(value) ? value : [];
  } catch (err) {
    console.error('Error parsing property images:', err);
    return [];
  }
}

export function getPrimaryImage(images) {
  const imgs = parsePropertyImages(images);
  if (imgs.length === 0) return null;
  const first = imgs[0];
  return first?.url || first || null;
}
