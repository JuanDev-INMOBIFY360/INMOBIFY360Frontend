import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  Key,
  Scale,
  ClipboardList,
  ChevronDown,
  HelpCircle,
} from "lucide-react";

import logos from "../../assets/Logos.png";
import "./navbarPublic.css";

const MENU_CONFIG = [
  {
    id: "inicio",
    label: "Inicio",
    href: "/",
  },
  {
    id: "propiedades",
    label: "Propiedades",
    href: "/search",
    dropdown: [
      { label: "Venta", href: "/search?category=Venta", icon: <Home size={18} /> },
      { label: "Arriendo", href: "/search?category=Arriendo", icon: <Key size={18} /> },
    ],
  },
  {
    id: "servicios",
    label: "Servicios",
    dropdown: [
      { label: "Asesoría Legal", href: "/faq", icon: <Scale size={18} /> },
   
      {
        label: "Administración",
        href: "/administracion",
        icon: <ClipboardList size={18} />,
      },
    ],
  },
  {
    id: "nosotros",
    label: "Nosotros",
    href: "#nosotros-section",
  },
  {
    id: "contacto",
    label: "Contacto",
    href: "/faq",
  },
];

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const closeTimeoutRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScrollToSection = (href) => {
    // Si es un ancla (nosotros), hacer scroll a esa sección
    if (href === '#nosotros-section') {
      const section = document.getElementById('nosotros-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
      }
    } else {
      // Si no, navegar normalmente
      window.location.href = href;
      setMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    document.body.classList.add("has-navbar");
    return () => {
      document.body.classList.remove("has-navbar");
      // Limpiar timeout al desmontar
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuOpen) {
        const navbar = document.querySelector('.navbar');
        if (!navbar?.contains(e.target)) {
          setMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

  const handleMouseEnter = (itemId) => {
    // Cancelar cualquier cierre pendiente
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setActiveDropdown(itemId);
  };

  const handleMouseLeave = () => {
    // Agregar un pequeño delay antes de cerrar (200ms)
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  return (
    <header className="navbar" role="banner">
      <nav className="navbar-container" aria-label="Menú principal">
        {/* LOGO IZQUIERDA */}
        <div className="logo" onClick={() => setMobileMenuOpen(false)}>
          <a href="/" aria-label="Ir a inicio - Inmobify360">
            <img src={logos} alt="Logo Inmobify360" className="image-logo" />
          </a>
        </div>

        {/* MENÚ CENTRAL */}
        <ul className={`nav-menu center-menu ${mobileMenuOpen ? 'mobile-open' : ''}`} role="menubar">
          {MENU_CONFIG.map((item) => {
            const hasDropdown = item.dropdown && item.dropdown.length > 0;
            const isActive = activeDropdown === item.id;

            return (
              <li
                key={item.id}
                className="nav-item"
                onClick={() => {
                  if (hasDropdown && mobileMenuOpen) {
                    setActiveDropdown(activeDropdown === item.id ? null : item.id);
                  }
                }}
                role="none"
              >
                {hasDropdown ? (
                  <>
                    <button 
                      className="nav-link"
                      role="menuitem"
                      aria-haspopup="true"
                      aria-expanded={isActive}
                      aria-label={`${item.label} - Submenú`}
                      onMouseEnter={() => handleMouseEnter(item.id)}
                      onMouseLeave={() => handleMouseLeave()}
                      onClick={(e) => {
                        if (mobileMenuOpen) {
                          e.preventDefault();
                        }
                      }}
                    >
                      {item.label}
                      <ChevronDown
                        size={16}
                        className={isActive ? "rotated" : ""}
                        aria-hidden="true"
                      />
                    </button>
                    
                    {isActive && (
                      <div
                        className="dropdown"
                        role="menu"
                        onMouseEnter={() => {
                          if (closeTimeoutRef.current) {
                            clearTimeout(closeTimeoutRef.current);
                          }
                        }}
                        onMouseLeave={() => handleMouseLeave()}
                      >
                        {item.dropdown.map((sub, i) => (
                          <a 
                            key={i} 
                            href={sub.href} 
                            className="dropdown-item"
                            role="menuitem"
                            onClick={() => {
                              setActiveDropdown(null);
                              setMobileMenuOpen(false);
                            }}
                          >
                            <span aria-hidden="true">{sub.icon}</span>
                            <span>{sub.label}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <a 
                    className="nav-link" 
                    href={item.href}
                    onClick={(e) => {
                      if (item.href.startsWith('#')) {
                        e.preventDefault();
                        handleScrollToSection(item.href);
                      } else {
                        setMobileMenuOpen(false);
                      }
                    }}
                    role="menuitem"
                  >
                    {item.label}
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        {/* FAQ DERECHA + MOBILE TOGGLE */}
        <nav className="faq-right" aria-label="Ayuda">
          <a href="/faq" className="faq-link" aria-label="Ver preguntas frecuentes" onClick={() => setMobileMenuOpen(false)}>
            <HelpCircle size={18} aria-hidden="true" /> 
            <span>Preguntas frecuentes</span>
          </a>
          
          <button
            className={`mobile-toggle ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileMenuOpen}
          >
            <span className="hamburger"></span>
            <span className="hamburger"></span>
            <span className="hamburger"></span>
          </button>
        </nav>
      </nav>
    </header>
  );
};

export default Navbar;