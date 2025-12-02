import React from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/admin/auth/Login";
import AdminLayout from "./layaouts/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import RolesAdmin from './pages/admin/modules/RolesAdmin';
import OwnersAdmin from './pages/admin/modules/OwnersAdmin';
import UsersAdmin from './pages/admin/modules/UsersAdmin';
import PropertiesAdmin from './pages/admin/modules/PropertiesAdmin';
import TypesAdmin from './pages/admin/modules/TypesAdmin';
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
            <Route 
              path="properties" 
              element={
                <ProtectedRoute requiredModule="property">
                  <PropertiesAdmin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="roles" 
              element={
                <ProtectedRoute requiredModule="roles">
                  <RolesAdmin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="owners" 
              element={
                <ProtectedRoute requiredModule="owner">
                  <OwnersAdmin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="users" 
              element={
                <ProtectedRoute requiredModule="user">
                  <UsersAdmin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="types" 
              element={
                <ProtectedRoute requiredModule="tyeproperty">
                  <TypesAdmin />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;