import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { LogOut, Home, Users, Building, Settings } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de cerrar sesión?')) {
      logout();
    }
  };

  return (
    <div className="dashboard-layout">
      
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-content">
            <h1>Panel de Administración</h1>
            <div className="header-actions">
              <div className="user-info">
                <span className="user-name">{user?.name || user?.email}</span>
                <span className="user-role">{user?.role}</span>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                <LogOut size={18} />
                Salir
              </button>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon home">
                <Home size={24} />
              </div>
              <div className="stat-info">
                <h3>Propiedades</h3>
                <p className="stat-value">24</p>
                <span className="stat-label">Activas</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon users">
                <Users size={24} />
              </div>
              <div className="stat-info">
                <h3>Clientes</h3>
                <p className="stat-value">156</p>
                <span className="stat-label">Registrados</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon building">
                <Building size={24} />
              </div>
              <div className="stat-info">
                <h3>Proyectos</h3>
                <p className="stat-value">8</p>
                <span className="stat-label">En curso</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon settings">
                <Settings size={24} />
              </div>
              <div className="stat-info">
                <h3>Configuración</h3>
                <p className="stat-value">-</p>
                <span className="stat-label">Sistema</span>
              </div>
            </div>
          </div>

          <div className="welcome-section">
            <h2>Bienvenido, {user?.name || 'Administrador'}</h2>
            <p>Desde aquí puedes gestionar todas las operaciones de Inmobify360</p>
          </div>
        </div>
      </main>
    </div>
  );
}