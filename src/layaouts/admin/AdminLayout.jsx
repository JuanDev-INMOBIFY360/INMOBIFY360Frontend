import React, { useContext } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { ADMIN_MODULES, getVisibleModules } from "../../constants/moduleConfig";
import "./admin.css";
import logo from "../../assets/logo.png";

const Sidebar = ({ onLogout, userModules }) => {
  const visibleModules = getVisibleModules(userModules);

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <div className="brand-wrap">
          <img src={logo} alt="INMOBIFY360" />
          <div className="brand-text">INMOBIFY360</div>
        </div>
      </div>

      <nav className="admin-nav">
        {visibleModules.map((m) => (
          <NavLink
            key={m.to}
            to={m.to}
            end={m.exact}
            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          >
            <m.Icon size={16} style={{ marginRight: 8 }} /> {m.label}
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <button className="btn-logout" onClick={onLogout} aria-label="Cerrar sesión">
          <LogOut size={14} style={{ marginRight: 8 }} /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

const AdminLayout = () => {
  const navigate = useNavigate();
  const { modules, user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    try {
      if (window.confirm("¿Estás seguro de cerrar sesión?")) {
        logout();
        navigate("/admin/login");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="admin-root">
      <Sidebar onLogout={handleLogout} userModules={modules || []} />
      <div className="admin-main">
        {/* <header className="admin-topbar">
          <div className="topbar-left">
            <div className="panel-title">Panel administrativo</div>
          </div>
          <div className="topbar-right">
            Bienvenido&nbsp;
            <span className="user-name">{user?.name || user?.fullName || "Usuario"}</span>
          </div>
        </header> */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

