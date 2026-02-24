import React, { useState, useEffect } from "react";
import {
  Home,
  Key,
  Building2,
  Building,
  BarChart3,
  Scale,
  CircleDollarSign,
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
    href: "/nosotros",
  },
  {
    id: "contacto",
    label: "Contacto",
    href: "/faq",
  },
];

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [closeTimeout, setCloseTimeout] = useState(null);

  useEffect(() => {
    document.body.classList.add("has-navbar");
    return () => {
      document.body.classList.remove("has-navbar");
      // Limpiar timeout al desmontar
      if (closeTimeout) {
        clearTimeout(closeTimeout);
      }
    };
  }, [closeTimeout]);

  const handleMouseEnter = (itemId) => {
    // Cancelar cualquier cierre pendiente
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setActiveDropdown(itemId);
  };

  const handleMouseLeave = () => {
    // Agregar un pequeño delay antes de cerrar (200ms)
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
    setCloseTimeout(timeout);
  };

  return (
    <header className="navbar" role="banner">
      <nav className="navbar-container" aria-label="Menú principal">
        {/* LOGO IZQUIERDA */}
        <div className="logo">
          <a href="/" aria-label="Ir a inicio - Inmobify360">
            <img src={logos} alt="Logo Inmobify360" className="image-logo" />
          </a>
        </div>

        {/* MENÚ CENTRAL */}
        <ul className="nav-menu center-menu" role="menubar">
          {MENU_CONFIG.map((item) => {
            const hasDropdown = item.dropdown && item.dropdown.length > 0;
            const isActive = activeDropdown === item.id;

            return (
              <li
                key={item.id}
                className="nav-item"
                onMouseEnter={() => hasDropdown && handleMouseEnter(item.id)}
                onMouseLeave={() => hasDropdown && handleMouseLeave()}
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
                    >
                      {item.label}
                      <ChevronDown
                        size={16}
                        className={isActive ? "rotated" : ""}
                        aria-hidden="true"
                      />
                    </button>
                    
                    {isActive && (
                      <div className="dropdown" role="menu">
                        {item.dropdown.map((sub, i) => (
                          <a 
                            key={i} 
                            href={sub.href} 
                            className="dropdown-item"
                            role="menuitem"
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
                    role="menuitem"
                  >
                    {item.label}
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        {/* FAQ DERECHA */}
        <nav className="faq-right" aria-label="Ayuda">
          <a href="/faq" className="faq-link" aria-label="Ver preguntas frecuentes">
            <HelpCircle size={18} aria-hidden="true" /> 
            <span>Preguntas frecuentes</span>
          </a>
        </nav>
      </nav>
    </header>
  );
};

export default Navbar;