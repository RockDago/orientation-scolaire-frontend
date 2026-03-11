import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createContext, useContext, useState } from "react";
import InstallPWA from "./InstallPWA.jsx";

import LoadingPage from "./pages/acceuil/loadingPage.jsx";
import Acceuil from "./pages/acceuil/acceuil.jsx";
import Login from "./pages/auth/login.jsx";
import DashboardAdmin from "./pages/dashboard/dashboardadmin.jsx";
import ProfileView from "./pages/dashboard/view/profileView.jsx";
import DashboardAdminView from "./pages/dashboard/view/dashboardadminView.jsx";
import MetiersView from "./pages/dashboard/view/metiersView.jsx";
import ParcoursView from "./pages/dashboard/view/parcoursView.jsx";
import MentionsView from "./pages/dashboard/view/mentionsView.jsx";
import SeriesView from "./pages/dashboard/view/seriesView.jsx";
import EtablissementsView from "./pages/dashboard/view/etablissementsView.jsx";
import NotFound404 from "../src/pages/error/NotFound404.jsx";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const userRole =
      localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
    const userData =
      localStorage.getItem("user") || sessionStorage.getItem("user");

    if (token && userRole) {
      return {
        token,
        role: userRole,
        ...(userData ? JSON.parse(userData) : {}),
      };
    }
    return null;
  });

  const login = (token, role, rememberMe = false, userData = {}) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("token", token);
    storage.setItem("userRole", role);
    storage.setItem("user", JSON.stringify(userData));
    setUser({ token, role, ...userData });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("user");
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const ProtectedRoute = ({ children, requireAdmin = true }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/acceuil" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Route racine : publique */}
          <Route path="/" element={<LoadingPage />} />

          {/* Routes publiques */}
          <Route path="/acceuil/*" element={<Acceuil />} />
          <Route path="/login" element={<Login />} />

          {/* Routes protégées - Dashboard Admin */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute>
                <DashboardAdmin />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardAdminView />} />
            <Route path="profile" element={<ProfileView />} />
            <Route path="parametres/metier" element={<MetiersView />} />
            <Route path="parametres/parcours" element={<ParcoursView />} />
            <Route path="parametres/mention" element={<MentionsView />} />
            <Route path="parametres/serie" element={<SeriesView />} />
            <Route
              path="parametres/etablissement"
              element={<EtablissementsView />}
            />
          </Route>

          {/* Page 404 */}
          <Route path="*" element={<NotFound404 />} />
        </Routes>
      </BrowserRouter>

      <InstallPWA />
    </AuthProvider>
  );
}

export default App;
