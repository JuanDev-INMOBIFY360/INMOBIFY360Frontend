import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import "./homeStyles.css"
import PropertyList from "../properties/propertyList/PropertyList";
import SearchBar from '../../../components/SearchBar/';

export default function Home() {
  const [query, setQuery] = useState("");

  useEffect(() => {
    api.get("/")
      .then((res) => {
        console.log("✅ API conectada →", res.data);
      })
      .catch((err) => {
        console.error("⚠️ API disponible pero sin respuesta de verificación →", err);
      });
  }, []);
  
  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <header className="home-container home-section">
        <div className="overlay-home"></div>

        <div className="home-content">
          <h1 className="title-home">
            INMOBIFY <span className="title-accent">360</span>
          </h1>
          <p className="subtitle-home">
            Encuentra tu hogar o inversión perfecta con facilidad
          </p>
        </div>
        
        <div className="search-box">
          <SearchBar initialValue={query} variant="hero" />
        </div>
      </header>

      {/* ===== PROPERTIES SECTION ===== */}
      <main className="home-section properties-section">
        <PropertyList />
      </main>
    </>
  );
}