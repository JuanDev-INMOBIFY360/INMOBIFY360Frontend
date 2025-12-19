import React from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/admin/auth/Login";
import AdminLayout from "./layaouts/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import TableOwners from "./pages/admin/modules/owners/TableOwners.jsx";
import TableRoles from "./pages/admin/modules/roles/TableRoles.jsx";
import TableUsers from "./pages/admin/modules/users/TableUsers.jsx";
import TableTypes from "./pages/admin/modules/types/TableTypes.jsx";
import PropertyModule from "./pages/admin/modules/Properties/PropertyModule.jsx";
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
                  <PropertyModule />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="roles" 
              element={
                <ProtectedRoute requiredModule="roles">
                  <TableRoles />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="owners" 
              element={
                <ProtectedRoute requiredModule="owner">
                  <TableOwners />
                </ProtectedRoute>
              } 
            />
      
            <Route 
              path="users" 
              element={
                <ProtectedRoute requiredModule="user">
                  <TableUsers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="types" 
              element={
                <ProtectedRoute requiredModule="typeproperty">
                  <TableTypes />
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