import React, { useState } from "react";
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
} from "lucide-react";
import { IoMdHelpCircleOutline } from "react-icons/io";

import logos from "../../assets/Logos.png";
import "./navbarPublic.css";
const MENU_CONFIG = [
  {
    id: "inicio",
    label: "Inicio",
    href: "#inicio",
  },
  {
    id: "propiedades",
    label: "Propiedades",
    dropdown: [
      { label: "Comprar", href: "#comprar", icon: <Home size={18} /> },
      { label: "Arrendar", href: "#arrendar", icon: <Key size={18} /> },
      {
        label: "Proyectos Nuevos",
        href: "#proyectos",
        icon: <Building2 size={18} />,
      },
      { label: "Comercial", href: "#comercial", icon: <Building size={18} /> },
    ],
  },
  {
    id: "servicios",
    label: "Servicios",
    dropdown: [
      { label: "Avalúos", href: "#avaluos", icon: <BarChart3 size={18} /> },
      { label: "Asesoría Legal", href: "#legal", icon: <Scale size={18} /> },
      {
        label: "Financiamiento",
        href: "#financiamiento",
        icon: <CircleDollarSign size={18} />,
      },
      {
        label: "Administración",
        href: "#administracion",
        icon: <ClipboardList size={18} />,
      },
    ],
  },
  {
    id: "nosotros",
    label: "Nosotros",
    href: "#nosotros",
  },
  {
    id: "contacto",
    label: "Contacto",
    href: "#contacto",
  },
];

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  return (
    <header className="navbar">
      <nav className="navbar-container">
        {/* IZQUIERDA - LOGO */}
        <div className="logo">
          <a href="/">
            <img src={logos} alt="inmobify360" className="image-logo" />
          </a>
        </div>

        {/* CENTRO - MENÚ NORMAL */}
        <ul className="nav-menu center-menu">
          {MENU_CONFIG.map((item) => {
            const hasDropdown = item.dropdown && item.dropdown.length > 0;
            const isActive = activeDropdown === item.id;

            return (
              <li
                key={item.id}
                className="nav-item"
                onMouseEnter={() => hasDropdown && setActiveDropdown(item.id)}
                onMouseLeave={() => hasDropdown && setActiveDropdown(null)}
              >
                {hasDropdown ? (
                  <button className="nav-link">
                    {item.label}
                    <ChevronDown
                      size={16}
                      className={isActive ? "rotated" : ""}
                    />
                  </button>
                ) : (
                  <a className="nav-link" href={item.href}>
                    {item.label}
                  </a>
                )}

                {hasDropdown && isActive && (
                  <div
                    className="dropdown"
                    onMouseEnter={() => setActiveDropdown(item.id)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {item.dropdown.map((sub, i) => (
                      <a key={i} href={sub.href} className="dropdown-item">
                        {sub.icon}
                        <span>{sub.label}</span>
                      </a>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {/* DERECHA - PREGUNTAS FRECUENTES */}
        <div className="faq-right">
          <a href="#faq" className="faq-link">
            <IoMdHelpCircleOutline size={18}/> Preguntas frecuentes
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
