import React from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/admin/auth/Login";
import AdminLayout from "./layaouts/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import { RolesModule } from './pages/admin/modules/Roles';
import { UsersModule } from './pages/admin/modules/Users';
import { OwnersModule } from './pages/admin/modules/Owners';
import { PropertiesModule } from './pages/admin/modules/Properties';
import { CountriesModule } from './pages/admin/modules/Countries';
import { DepartmentsModule } from './pages/admin/modules/Departments';
import { CitiesModule } from './pages/admin/modules/Cities';
import { NeighborhoodsModule } from './pages/admin/modules/Neighborhoods';
import { TypesModule } from './pages/admin/modules/Types';
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
                  <PropertiesModule />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="roles" 
              element={
                <ProtectedRoute requiredModule="roles">
                  <RolesModule />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="owners" 
              element={
                <ProtectedRoute requiredModule="owner">
                  <OwnersModule />
                </ProtectedRoute>
              } 
            />
      
            <Route 
              path="countries" 
              element={
                <ProtectedRoute requiredModule="country">
                  <CountriesModule />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="departments" 
              element={
                <ProtectedRoute requiredModule="department">
                  <DepartmentsModule />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="cities" 
              element={
                <ProtectedRoute requiredModule="city">
                  <CitiesModule />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="neighborhoods" 
              element={
                <ProtectedRoute requiredModule="neighborhood">
                  <NeighborhoodsModule />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="users" 
              element={
                <ProtectedRoute requiredModule="user">
                  <UsersModule />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="types" 
              element={
                <ProtectedRoute requiredModule="typeproperty">
                  <TypesModule />
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