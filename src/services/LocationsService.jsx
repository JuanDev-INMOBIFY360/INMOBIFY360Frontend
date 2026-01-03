import api from "./api";

/* =========================
   GETTERS
========================= */

export const getCountries = async () => {
  const res = await api.get("/api/locations/countries");
  return res.data;
};

export const getDepartments = async (countryId) => {
  const res = await api.get("/api/locations/departments", {
    params: countryId ? { countryId } : {},
  });
  return res.data;
};





