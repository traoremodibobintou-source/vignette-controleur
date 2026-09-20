import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Accueil from "./pages/Accueil";
import Connexion from "./pages/Connexion";
import Recherche from "./pages/Recherche";
import DashboardControleur from "./pages/DashboardControleur";
import DetailVehicule from "./pages/DetailVehicule";
import DashboardAdmin from "./pages/DashboardAdmin";
import GestionVehicules from "./pages/GestionVehicules";
import AjouterVehicule from "./pages/AjouterVehicule";
import Proprietaires from "./pages/Proprietaires";
import Vignettes from "./pages/Vignettes";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Pages publiques */}
          <Route path="/" element={<Accueil />} />
          <Route path="/connexion" element={<Connexion />} />

          {/* Pages accessibles au contrôleur et à l'administrateur */}
          <Route
            path="/recherche"
            element={
              <ProtectedRoute roles={["admin", "controleur"]}>
                <Recherche />
              </ProtectedRoute>
            }
          />

          <Route
            path="/detail-vehicule"
            element={
              <ProtectedRoute roles={["admin", "controleur"]}>
                <DetailVehicule />
              </ProtectedRoute>
            }
          />

          {/* Espace contrôleur */}
          <Route
            path="/dashboard-controleur"
            element={
              <ProtectedRoute roles={["controleur"]}>
                <DashboardControleur />
              </ProtectedRoute>
            }
          />

          {/* Espace administrateur */}
          <Route
            path="/dashboard-admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <DashboardAdmin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/gestion-vehicules"
            element={
              <ProtectedRoute roles={["admin"]}>
                <GestionVehicules />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ajouter-vehicule"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AjouterVehicule />
              </ProtectedRoute>
            }
          />

          <Route
            path="/proprietaires"
            element={
              <ProtectedRoute roles={["admin"]}>
                <Proprietaires />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vignettes"
            element={
              <ProtectedRoute roles={["admin"]}>
                <Vignettes />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;