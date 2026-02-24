import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="landing-footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} Inmobify360. Todos los derechos reservados.</p>
        <nav className="footer-nav">
          <a href="/" aria-label="Inicio">Inicio</a>
          <a href="/faq" aria-label="Preguntas frecuentes">FAQ</a>
          <a href="/contact" aria-label="Contacto">Contacto</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
