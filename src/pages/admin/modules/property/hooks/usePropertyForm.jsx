import { useState, useEffect } from "react";

export function usePropertyForm(propertyToEdit) {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    operacion: "SALE",
    precio: "",
    moneda: "COP",
    habitaciones: "",
    banos: "",
    parqueaderos: "",
    areaConstruida: "",
    ciudad: "",
    barrio: "",
    direccion: "",
    countryId: "",
    departmentId: "",
    ownerId: "",
    typePropertyId: "",
  });

  useEffect(() => {
    if (propertyToEdit) {
      setFormData({
        titulo: propertyToEdit.titulo || "",
        descripcion: propertyToEdit.descripcion || "",
        operacion: propertyToEdit.operacion || "SALE",
        precio: propertyToEdit.precio || "",
        moneda: propertyToEdit.moneda || "COP",
        habitaciones: propertyToEdit.habitaciones || "",
        banos: propertyToEdit.banos || "",
        parqueaderos: propertyToEdit.parqueaderos || "",
        areaConstruida: propertyToEdit.areaConstruida || "",
        ciudad: propertyToEdit.ciudad || "",
        barrio: propertyToEdit.barrio || "",
        direccion: propertyToEdit.direccion || "",
        countryId: propertyToEdit.countryId || "",
        departmentId: propertyToEdit.departmentId || "",
        ownerId: propertyToEdit.ownerId || "",
        typePropertyId: propertyToEdit.typePropertyId || "",
      });
    }
  }, [propertyToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return { formData, setFormData, handleChange };
}
