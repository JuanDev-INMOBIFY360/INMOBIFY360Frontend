import React from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/admin/auth/Login";
import AdminLayout from "./layaouts/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Home from "./pages/client/landing/home";
import PropertyDetail from "./pages/client/properties/detailsProperties/PropertyDetails";
import PublicLayout from "./layaouts/PublicLayout";
import SearchResults from "./pages/client/landing/SearchResults";

function PropertyDetailWrapper() {
  const { id } = useParams();
  return <PropertyDetail propertyId={id} />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas con layout que contiene el navbar */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/properties/:id" element={<PropertyDetailWrapper />} />
            <Route path="/search" element={<SearchResults />} />
          </Route>

          {/* Rutas admin */}
          <Route path="/admin/login" element={<Login />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;