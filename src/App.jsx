import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute"; 
import AuthLogin from "./pages/admin/auth/AuthLogin";
import Home from "./pages/client/landing/home";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          
          {/* Login admin (público) */}

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requireAdmin>
                          <Route path="/admin/login" element={<AuthLogin />} />

              </ProtectedRoute>
            }
          />
        
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;