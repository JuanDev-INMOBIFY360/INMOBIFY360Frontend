import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import BackgroundImage from '../../../assets/fondo-login.jpeg';
import axios from 'axios';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import './login.css';

export default function AuthLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirigir al admin si ya está logueado
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/admin');
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });

      login(response.data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Sección de la imagen */}
      <div className="login-image-section">
        <img src={BackgroundImage} alt="Fondo INMOBIFY360" className="login-background-image" />
        <div className="login-image-overlay"></div>
      </div>

      {/* Sección del formulario */}
      <div className="login-form-section">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">INMOBIFY360</h1>
            <p className="login-subtitle">Panel Administrativo</p>
          </div>

          {error && (
            <div className="error-alert">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
            
                <span>Correo Electrónico</span>
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="admin@inmobify360.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
               
                <span>Contraseña</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          <div className="login-footer">
            <a href="/" className="back-link">← Volver al inicio</a>
          </div>
        </div>
      </div>
    </div>
  );
}