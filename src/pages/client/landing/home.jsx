import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import "./homeStyles.css"
import PropertyList from "../properties/propertyList/PropertyList";
import SearchBar from '../../../components/SearchBar/';
import videocasa from "../../../assets/videocasa.mp4"; 
import imagenIA from "../../../assets/IA.jpg"
import Nosotros from "./Nosotros";
import Footer from "./Footer";


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

    <main>

  <section className="properties-section">
    <PropertyList />
  </section>

  <section className="ia-section">
    <div className="ia-layout">

      <div className="ia-content">
        <header className="ia-header">
          <h2>Próximamente: Tu Asistente Inmobiliario</h2>
          <p>
            Responde con precisión, agenda citas y aprende de tus preferencias.
          </p>
        </header>

        <div className="ia-cards">
          <div className="ia-card">
            <h3>Respuestas acertivas</h3>
            <p>El asistente entiende tus gustos y ofrece respuestas personalizadas.</p>
          </div>

          <div className="ia-card">
            <h3>Agendación automática</h3>
            <p>Organiza visitas según tu disponibilidad sin esfuerzo.</p>
          </div>

          <div className="ia-card">
            <h3>Preferencias inteligentes</h3>
            <p>Aprende de tus elecciones para sugerir mejores opciones.</p>
          </div>
        </div>
      </div>

      <figure className="ia-image">
        <img
          src={imagenIA}
          alt="Asistente inmobiliario impulsado por inteligencia artificial"
        />
      </figure>

    </div>
  </section>

  {/* secciones adicionales */}
  <Nosotros />
  <Footer />

</main>

      

    </>
  );
}