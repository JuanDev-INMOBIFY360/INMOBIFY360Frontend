import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import "./homeStyles.css"
// import video from "../../../assets"
import PropertyList from "../properties/propertyList/PropertyList";
import SearchBar from '../../../components/SearchBar';

export default function Home() {
  const [query, setQuery] = useState("");

  useEffect(() => {
    api.get("/")
      .then((res) => {
        console.log("OK →", res.data);
      })
      .catch((err) => {
        console.error("ERROR →", err);
      });
  }, []);
  
  return (
    <>
      <header className="home-container">
        {/* <video
          autoPlay
          loop
          muted
          playsInline
          className="bg-video"
          src={video}
          aria-hidden="true"
        /> */}

        <div className="overlay-home">
          <section className="home-content">
            <h1 className="title-home">INMOBIFY <span className="title-accent">360</span></h1>
            <p className="subtitle-home">
              Conectamos personas con espacios y oportunidades
            </p>
          </section>
          
          <div className="search-box">
            <SearchBar initialValue={query} />
          </div>
        </div>
      </header>

      <main>
        <PropertyList />
      </main>
    </>
  );
}