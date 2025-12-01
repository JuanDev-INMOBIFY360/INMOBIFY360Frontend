import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './admin.css';

const Sidebar = ({ onLogout }) => {
  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">INMOBIFY360</div>
      <nav className="admin-nav">
        <NavLink to="/admin" end className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>Dashboard</NavLink>
        <NavLink to="/admin/properties" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>Propiedades</NavLink>
        <NavLink to="/admin/users" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>Usuarios</NavLink>
        <NavLink to="/admin/settings" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>Ajustes</NavLink>
      </nav>
      <div className="admin-sidebar-footer">
        <button className="btn-logout" onClick={onLogout}>Cerrar sesión</button>
      </div>
    </aside>
  );
};

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // limpieza local: intentar usar localStorage y redirigir al login
    try { localStorage.removeItem('token'); } catch (e) {}
    navigate('/admin/login');
  };

  return (
    <div className="admin-root">
      <Sidebar onLogout={handleLogout} />
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
