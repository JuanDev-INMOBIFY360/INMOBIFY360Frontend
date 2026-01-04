import React from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

/* ===== ADMIN ===== */
import Login from "./pages/admin/auth/Login";
import AdminLayout from "./layaouts/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import TableOwners from "./pages/admin/modules/owners/TableOwners.jsx";
import TableRoles from "./pages/admin/modules/roles/TableRoles.jsx";
import TableUsers from "./pages/admin/modules/users/TableUsers.jsx";
import TableTypes from "./pages/admin/modules/types/TableTypes.jsx";
import TableProperty from "./pages/admin/modules/property/TableProperty.jsx";
import TableCommonArea from "./pages/admin/modules/commonArea/TableCommonArea.jsx";
import TableNearbyPlace from "./pages/admin/modules/nearbyPlace/nearbyPlace.jsx";
/* ===== PUBLIC ===== */
import PublicLayout from "./layaouts/PublicLayout";
import Home from "./pages/client/landing/home";
import PropertyDetail from "./pages/client/properties/detailsProperties/PropertyDetails";
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

          {/* ================= PUBLIC ================= */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/properties/:id" element={<PropertyDetailWrapper />} />
            <Route path="/search" element={<SearchResults />} />
          </Route>

          {/* ================= AUTH ================= */}
          <Route path="/admin/login" element={<Login />} />

          {/* ================= ADMIN ================= */}
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
              path="owners"
              element={
                <ProtectedRoute requiredModule="owner">
                  <TableOwners />
                </ProtectedRoute>
              }
            />

            <Route
              path="roles"
              element={
                <ProtectedRoute requiredModule="role">
                  <TableRoles />
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
              path="properties"
              element={
                <ProtectedRoute requiredModule="property">
                  <TableProperty />
                </ProtectedRoute>
              }

            />
            <Route
              path="common-areas"
              element={
                <ProtectedRoute requiredModule="commonArea">
                  <TableCommonArea />
                </ProtectedRoute>
              }
            />
            <Route
              path="nearby-places"
              element={
                <ProtectedRoute requiredModule="nearbyPlace">
                  <TableNearbyPlace />
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
