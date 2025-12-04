import React, { createContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);
  const [modules, setModules] = useState([]);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        
        // Verificar si el token ha expirado
        if (decoded.exp * 1000 < Date.now()) {
          console.warn("Token expirado");
          logout();
        } else {
          setUser(decoded);
          setPermissions(decoded.permissions || []);
          setModules(decoded.modules || []);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setPermissions([]);
    setModules([]);
  };

  const hasModule = (moduleName) => {
    return modules.includes(moduleName);
  };

  const hasPermission = (moduleName, action) => {
    const permission = permissions.find(p => p.name === moduleName);
    if (!permission) return false;
    return permission.privileges.some(priv => priv.action === action);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      loading,
      permissions,
      modules,
      hasModule,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};