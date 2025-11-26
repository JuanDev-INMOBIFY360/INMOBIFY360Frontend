import React, { useState } from "react";
import Navbar from "../../../layaouts/public/navbar";
import { FiSearch } from "react-icons/fi";

import "./homeStyles.css"
import video from "../../../assets/video.mp4"
export default function Home() {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Buscar:", query);
  };

  return (
    <section className="home-container">
      <Navbar />

  <video
  autoPlay
  loop
  muted
  playsInline
  className="bg-video"
  src={video}>
  
</video>

      <article className="overlay-home">
        <div className="home-content">
          <h1 className="title-home">INMOBIFY <span className="title-accent">360</span></h1>

          <p className="subtitle-home">
            Conectamos personas con espacios y oportunidades
          </p>
        </div>
         <form onSubmit={handleSearch} className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="Buscar proyectos, zonas, nombres..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="search-button" type="submit"> <FiSearch size={20} /></button>
          </form>
      </article>
    </section>
  );
}
