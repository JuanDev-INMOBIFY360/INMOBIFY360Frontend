import React, { useState } from 'react';
import { Search, MapPin, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = ({ initialValue = '', variant = 'hero' }) => {
  const [query, setQuery] = useState(initialValue);
  const [searchType, setSearchType] = useState('all'); // 'all', 'city', 'type'
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    const params = new URLSearchParams();
    params.set('q', q);
    if (searchType !== 'all') {
      params.set('type', searchType);
    }
    
    navigate(`/search?${params.toString()}`);
  };

  if (variant === 'hero') {
    return (
      <form className="search-bar search-bar--hero" onSubmit={onSubmit}>
        <div className="search-bar__input-group">
          <Search className="search-bar__icon" size={20} aria-hidden="true" />
          <input
            className="search-bar__input"
            type="text"
            placeholder="Busca por dirección, zona o nombre..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar propiedades"
          />
        </div>
        <button className="search-bar__button" type="submit" aria-label="Buscar propiedades">
          <span>Buscar</span>
        </button>
      </form>
    );
  }

  // Variant compacto para otros lugares
  return (
    <form className="search-bar search-bar--compact" onSubmit={onSubmit}>
      <input
        className="search-bar__input search-bar__input--compact"
        type="text"
        placeholder="Buscar..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Buscar propiedades"
      />
      <button className="search-bar__button search-bar__button--compact" type="submit" aria-label="Buscar">
        <Search size={18} />
      </button>
    </form>
  );
};

export default SearchBar;
