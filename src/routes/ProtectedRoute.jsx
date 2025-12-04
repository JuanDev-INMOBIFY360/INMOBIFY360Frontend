import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, requireAdmin = false, requiredModule = null }) => {
  const { user, loading, modules } = useContext(AuthContext);

  // Esperando a que se cargue el user
  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando...</div>;
  }

  // Si no hay usuario, redirigir a login
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Si requiere admin, verificar el rol
  if (requireAdmin) {
    const userRole = user?.role || user?.tipo_usuario || user?.tipo || '';
    const isAdmin = userRole.toLowerCase() === 'administrador' || userRole.toLowerCase() === 'admin';
    
    if (!isAdmin) {
      console.warn(`Acceso denegado: rol '${userRole}' no es administrador`);
      return <Navigate to="/" replace />;
    }
  }

  // Verificar si el usuario tiene acceso al módulo específico
  if (requiredModule) {
    const userModulesLower = (modules || []).map((m) => (m || "").toString().toLowerCase());
    const requiredLower = requiredModule.toString().toLowerCase();
    // Manejo simple de plurales: 'roles' -> 'role'
    const requiredSingular = requiredLower.endsWith("s") ? requiredLower.slice(0, -1) : requiredLower;

    const hasAccess = userModulesLower.includes(requiredLower) || userModulesLower.includes(requiredSingular);

    if (!hasAccess) {
      console.warn(`Acceso denegado: usuario no tiene permiso para el módulo '${requiredModule}'`);
      return <Navigate to="/admin" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;