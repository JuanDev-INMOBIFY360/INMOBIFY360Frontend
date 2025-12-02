import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Home, Box, Users, Globe, MapPin, Layers, Shield, Key, FileText, Archive
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import './admin.css';

const Sidebar = ({ onLogout, userModules }) => {
  // Mapeo de módulos a rutas y iconos
  const allModules = [
    { to: '/admin', label: 'Dashboard', Icon: Home, exact: true, moduleName: null }, // Dashboard siempre visible
    { to: '/admin/properties', label: 'Propiedades', Icon: Box, moduleName: 'property' },
    { to: '/admin/roles', label: 'Roles', Icon: Shield, moduleName: 'roles' },
    { to: '/admin/owners', label: 'Propietarios', Icon: Users, moduleName: 'owner' },
    { to: '/admin/users', label: 'Usuarios', Icon: Users, moduleName: 'user' },
    { to: '/admin/types', label: 'Tipos', Icon: Archive, moduleName: 'tyeproperty' },
  ];

  // Filtrar módulos según permisos del usuario
  const visibleModules = allModules.filter(
    m => m.moduleName === null || userModules.includes(m.moduleName)
  );

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">INMOBIFY360</div>
      <nav className="admin-nav">
        {visibleModules.map((m) => (
          <NavLink
            key={m.to}
            to={m.to}
            end={m.exact}
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            <m.Icon size={16} style={{ marginRight: 8 }} /> {m.label}
          </NavLink>
        ))}
      </nav>
      <div className="admin-sidebar-footer">
        <button className="btn-logout" onClick={onLogout}>Cerrar sesión</button>
      </div>
    </aside>
  );
};

const AdminLayout = () => {
  const navigate = useNavigate();
  const { modules } = useContext(AuthContext);

  const handleLogout = () => {
    // limpieza local: intentar usar localStorage y redirigir al login
    try { localStorage.removeItem('token'); } catch (e) {}
    navigate('/admin/login');
  };

  return (
    <div className="admin-root">
      <Sidebar onLogout={handleLogout} userModules={modules || []} />
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-left">Panel administrativo</div>
          <div className="topbar-right">Bienvenido</div>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
