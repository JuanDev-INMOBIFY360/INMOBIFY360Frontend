import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import AuthLogin from "../src/pages/admin/auth/AuthLogin";
import home from "./pages/client/home";

function app() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/propiedades" element={<PropertyList />} />
          <Route path="/propiedades/:id" element={<PropertyDetail />} />

          {/* Login admin (público) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Rutas protegidas admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/propiedades"
            element={
              <ProtectedRoute requireAdmin>
                <AdminProperties />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
