import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = ({ initialValue = '' }) => {
  const [query, setQuery] = useState(initialValue);
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    // Navegar a la página de resultados con el query como parámetro
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <form className="inm-search" onSubmit={onSubmit}>
      <input
        className="inm-search-input"
        placeholder="Buscar proyectos, zonas, nombres..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Buscar propiedades"
      />
      <button className="inm-search-btn" type="submit" aria-label="Buscar">
        <FiSearch size={18} />
      </button>
    </form>
  );
};

export default SearchBar;
