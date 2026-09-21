import { NavLink, useLocation, useNavigate } from "react-router-dom";

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const isConnexionPage = location.pathname === "/connexion";

  const handleLogout = () => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment vous déconnecter ?"
    );

    if (confirmation) {
      localStorage.removeItem("user");

      // Retour à la connexion avec React Router
      navigate("/connexion");
    }
  };

  // La page de connexion est indépendante du menu principal
  if (isConnexionPage) {
    return <>{children}</>;
  }

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="app-logo">
          <span className="app-logo-icon">🛡</span>
          <span>Vignette Contrôleur</span>
        </div>

        <div className="app-header-right">
          <span className="app-role">
            Plateforme de contrôle
          </span>
        </div>
      </header>

      <div className="app-body">
        <aside className="app-sidebar">
          <nav>

            {role && (
              <button
                type="button"
                className="sidebar-link logout-button"
                onClick={handleLogout}
              >
                🚪 Déconnexion
              </button>
            )}

            {role === "controleur" && (
              <>
                <NavLink
                  to="/dashboard-controleur"
                  className="sidebar-link"
                >
                  📊 Dashboard Contrôleur
                </NavLink>

                <NavLink
                  to="/recherche"
                  className="sidebar-link"
                >
                  🔎 Recherche
                </NavLink>
              </>
            )}

            {role === "admin" && (
              <>
                <NavLink
                  to="/dashboard-admin"
                  className="sidebar-link"
                >
                  📊 Dashboard Admin
                </NavLink>

                <NavLink
                  to="/recherche"
                  className="sidebar-link"
                >
                  🔎 Recherche
                </NavLink>

                <NavLink
                  to="/gestion-vehicules"
                  className="sidebar-link"
                >
                  🚗 Gestion véhicules
                </NavLink>

                <NavLink
                  to="/ajouter-vehicule"
                  className="sidebar-link"
                >
                  ➕ Ajouter véhicule
                </NavLink>

                <NavLink
                  to="/proprietaires"
                  className="sidebar-link"
                >
                  👤 Propriétaires
                </NavLink>

                <NavLink
                  to="/vignettes"
                  className="sidebar-link"
                >
                  🎫 Vignettes
                </NavLink>
              </>
            )}

          </nav>
        </aside>

        <main className="app-content">
          {children}
        </main>
      </div>

      <footer className="app-footer">
        <p>© 2026 Vignette Contrôleur</p>
      </footer>
    </div>
  );
}

export default Layout;
