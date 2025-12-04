import api from './api';

export const getSignature = async () => {
  const res = await api.get('/api/cloudinary/sign');
  return res.data; // { timestamp, signature, api_key, cloud_name }
};

export const uploadToCloudinary = (file, { api_key, cloud_name, timestamp, signature }, folder = 'inmobify360/properties', onProgress) => {
  return new Promise((resolve, reject) => {
    const url = `https://api.cloudinary.com/v1_1/${cloud_name}/upload`;
    const form = new FormData();
    form.append('file', file);
    form.append('api_key', api_key);
    form.append('timestamp', timestamp);
    form.append('signature', signature);
    form.append('folder', folder);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && typeof onProgress === 'function') {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const resp = JSON.parse(xhr.responseText);
          resolve(resp);
        } catch (err) {
          reject(err);
        }
      } else {
        reject(new Error(`Cloudinary upload failed: ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during Cloudinary upload'));
    xhr.send(form);
  });
};

export const attachImageMetadata = async (propertyId, cloudJson) => {
  // cloudJson: response from Cloudinary
  const payload = {
    url: cloudJson.secure_url,
    public_id: cloudJson.public_id,
    resource_type: cloudJson.resource_type
  };
  const res = await api.post(`/api/properties/${propertyId}/images/meta`, payload);
  return res.data;
};

export const removeImage = async (propertyId, public_id) => {
  const payload = { public_id };
  // axios delete with body: pass { data: payload }
  const res = await api.delete(`/api/properties/${propertyId}/images`, { data: payload });
  return res.data;
};
