

import {
  Home,
  Box,
  Users,
  Globe,
  MapPin,
  Layers,
  Shield,
  Archive,
} from "lucide-react";

export const ADMIN_MODULES = [
  {
    to: "/admin",
    label: "Dashboard",
    Icon: Home,
    exact: true,
    moduleName: null, // Dashboard no require permission
  },
  {
    to: "/admin/properties",
    label: "Propiedades",
    Icon: Box,
    moduleName: "property",
  },
  {
    to: "/admin/roles",
    label: "Roles",
    Icon: Shield,
    moduleName: "role",
  },
  {
    to: "/admin/owners",
    label: "Propietarios",
    Icon: Users,
    moduleName: "owner",
  },
  {
    to: "/admin/users",
    label: "Usuarios",
    Icon: Users,
    moduleName: "user",
  },
  {
    to: "/admin/types",
    label: "Tipos",
    Icon: Archive,
    moduleName: "typeProperty",
  },
  {
    to: "/admin/countries",
    label: "Países",
    Icon: Globe,
    moduleName: "country",
  },
  {
    to: "/admin/departments",
    label: "Departamentos",
    Icon: Layers,
    moduleName: "department",
  },
  {
    to: "/admin/cities",
    label: "Ciudades",
    Icon: MapPin,
    moduleName: "city",
  },
  {
    to: "/admin/neighborhoods",
    label: "Barrios",
    Icon: Layers,
    moduleName: "neighborhood",
  },
];

/**
 * Get modules visible to user based on permissions
 * @param {string[]} userModules - Array of module names user has access to
 * @returns {object[]} Filtered module list
 */
export const getVisibleModules = (userModules = []) => {
  const userModulesLower = userModules.map((u) => (u || "").toString().toLowerCase());
  
  return ADMIN_MODULES.filter((m) => {
    if (!m.moduleName) return true; // Dashboard always visible
    const mod = m.moduleName.toString().toLowerCase();
    return userModulesLower.includes(mod);
  });
};
