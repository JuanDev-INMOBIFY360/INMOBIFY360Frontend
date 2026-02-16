import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

const SearchBar = ({
  variant = "hero",
  cities = [],
  propertyTypes = [],
  onSearch,
}) => {
  const [city, setCity] = useState("");
  const [typeProp, setTypeProp] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!city && !typeProp && !category) return;

    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (typeProp) params.set("type", typeProp);
    if (category) params.set("category", category);

    if (onSearch) {
      onSearch({ city, typeProp, category });
    } else {
      navigate(`/search?${params.toString()}`);
    }
  };

  const handleClear = () => {
    setCity("");
    setTypeProp("");
    setCategory("");
  };

  const hasFilters = city || typeProp || category;

  if (variant === "hero") {
    return (
      <form className="search-bar search-bar--hero" onSubmit={handleSubmit}>
        <div className="search-bar__filters">
          <div className="search-bar__filter">
            <label className="search-bar__label">
              <span>Ciudad</span>
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="search-bar__select"
            >
              <option value="">Todas las ciudades</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="search-bar__filter">
            <label className="search-bar__label">
              <span>Tipo</span>
            </label>
            <select
              value={typeProp}
              onChange={(e) => setTypeProp(e.target.value)}
              className="search-bar__select"
            >
              <option value="">Todos los tipos</option>
              {propertyTypes.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="search-bar__filter">
            <label className="search-bar__label">
              <span>Categoría</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="search-bar__select"
            >
              <option value="">Venta o Arriendo</option>
              <option value="Venta">Venta</option>
              <option value="Arriendo">Arriendo</option>
            </select>
          
          </div>
            <div className="search-bar__actions">
              {hasFilters && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="search-bar__button search-bar__button--secondary"
                >
                  Limpiar
                </button>
              )}
              <button
                type="submit"
                className="search-bar__button search-bar__button--primary"
                disabled={!hasFilters}
              >
                Buscar
              </button>
            </div>
        </div>
      </form>
    );
  }
};

export default SearchBar;
