import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import "./homeStyles.css"
import PropertyList from "../properties/propertyList/PropertyList";
import SearchBar from '../../../components/SearchBar/';
import videocasa from "../../../assets/videocasa.mp4"; 


export default function Home() {
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    api.get("/")
      .then((res) => {
        console.log("API conectada →", res.data);
      })
      .catch((err) => {
        console.error(" API disponible pero sin respuesta de verificación →", err);
      });

    // load property types for select
    import("../../../services/TypesService.jsx").then(({ getTypes }) => {
      getTypes().then(setTypes).catch(console.error);
    });

    // load some properties to extract cities (first batch)
    import("../../../services/propertyService.jsx").then(({ getProperties }) => {
      getProperties({ limit: 50 })
        .then((data) => {
          const unique = [...new Set(data.map((p) => p.ciudad).filter(Boolean))];
          setCities(unique);
        })
        .catch(console.error);
    });
  }, []);
  
  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <header className="home-container home-section">
        {/* VIDEO DE FONDO */}
        <video 
          className="video-background-home"
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src={videocasa} type="video/mp4" />
          Tu navegador no soporta videos HTML5.
        </video>

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
          <SearchBar
            initialValue={query}
            variant="hero"
            cities={cities}
            propertyTypes={types}
          />
        </div>
      </header>

      {/* ===== PROPERTIES SECTION ===== */}
      <main className="home-section properties-section">
        <PropertyList />
      </main>
    </>
  );
}