import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { loginUser } from '../../../services/AuthLoginService';
import './Login.css';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) return setError('Ingrese usuario y contraseña');
    setLoading(true);

    try {
      // Llamada al servicio de autenticación
      const data = await loginUser({ email, password });
      // Esperamos un token en data.token o data.accessToken
      const token = data?.token || data?.accessToken || data?.access_token;
      if (!token) throw new Error('Token no recibido');

      // Guardar token en el contexto (AuthContext lo decodificará si usa jwtDecode)
      login && login(token);
      navigate('/admin', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <header className="login-header">
          <h2>Iniciar sesión - Administrador</h2>
          <p className="login-sub">Accede al panel administrativo</p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@inmobiliaria.com"
            />
          </label>

          <label className="field">
            <span>Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          <button className="btn-login" type="submit" disabled={loading}>
            {loading ? 'Conectando...' : 'Entrar'}
          </button>
        </form>

        <footer className="login-footer">
          <small>¿Problemas para entrar? Contacta al administrador.</small>
        </footer>
      </div>
    </div>
  );
};

export default Login;
