import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DashboardAdmin() {
  const navigate = useNavigate();

  const [vehicules, setVehicules] = useState([]);
  const [proprietaires, setProprietaires] = useState([]);
  const [vignettes, setVignettes] = useState([]);

  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    const chargerDonnees = async () => {
      try {
        const [
          responseVehicules,
          responseProprietaires,
          responseVignettes,
        ] = await Promise.all([
          fetch("http://127.0.0.1:8001/api/vehicules"),
          fetch("http://127.0.0.1:8001/api/proprietaires"),
          fetch("http://127.0.0.1:8001/api/vignettes"),
        ]);

        const [
          dataVehicules,
          dataProprietaires,
          dataVignettes,
        ] = await Promise.all([
          responseVehicules.json(),
          responseProprietaires.json(),
          responseVignettes.json(),
        ]);

        if (!responseVehicules.ok) {
          throw new Error(
            dataVehicules.message ||
              "Impossible de charger les véhicules."
          );
        }

        if (!responseProprietaires.ok) {
          throw new Error(
            dataProprietaires.message ||
              "Impossible de charger les propriétaires."
          );
        }

        if (!responseVignettes.ok) {
          throw new Error(
            dataVignettes.message ||
              "Impossible de charger les vignettes."
          );
        }

        setVehicules(dataVehicules);
        setProprietaires(dataProprietaires);
        setVignettes(dataVignettes);
      } catch (error) {
        setErreur(error.message);
      } finally {
        setChargement(false);
      }
    };

    chargerDonnees();
  }, []);

  const vehiculesSignales = vehicules.filter(
    (vehicule) => vehicule.statut_vol === "signale"
  );

  return (
    <div className="dashboard-page">

      {/* En-tête de la page */}
      <section className="page-header">
        <div>
          <h1>Dashboard Administrateur</h1>

          <p>
            Gérez les véhicules, les propriétaires et les vignettes
            de la plateforme.
          </p>
        </div>
      </section>

      {/* Message d'erreur */}
      {erreur && (
        <div className="alert alert-error">
          {erreur}
        </div>
      )}

      {/* Statistiques */}
      <section className="dashboard-section">

        <div className="section-heading">
          <div>
            <h2>Vue d'ensemble</h2>
            <p>
              Statistiques générales de la plateforme
            </p>
          </div>
        </div>

        {chargement ? (
          <div className="loading-card">
            <p>Chargement des statistiques...</p>
          </div>
        ) : (
          <div className="stats-grid">

            <div className="stat-card">
              <div className="stat-card-icon">
                🚗
              </div>

              <div className="stat-card-content">
                <span className="stat-card-label">
                  Véhicules
                </span>

                <strong className="stat-card-value">
                  {vehicules.length}
                </strong>

                <span className="stat-card-description">
                  Véhicules enregistrés
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon">
                👤
              </div>

              <div className="stat-card-content">
                <span className="stat-card-label">
                  Propriétaires
                </span>

                <strong className="stat-card-value">
                  {proprietaires.length}
                </strong>

                <span className="stat-card-description">
                  Propriétaires enregistrés
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon">
                🎫
              </div>

              <div className="stat-card-content">
                <span className="stat-card-label">
                  Vignettes
                </span>

                <strong className="stat-card-value">
                  {vignettes.length}
                </strong>

                <span className="stat-card-description">
                  Vignettes enregistrées
                </span>
              </div>
            </div>

            <div className="stat-card stat-card-warning">
              <div className="stat-card-icon">
                ⚠️
              </div>

              <div className="stat-card-content">
                <span className="stat-card-label">
                  Véhicules signalés
                </span>

                <strong className="stat-card-value">
                  {vehiculesSignales.length}
                </strong>

                <span className="stat-card-description">
                  Véhicules signalés comme volés
                </span>
              </div>
            </div>

          </div>
        )}
      </section>

      {/* Actions rapides */}
      <section className="dashboard-section">

        <div className="section-heading">
          <div>
            <h2>Actions rapides</h2>

            <p>
              Accédez rapidement aux principales fonctions
              d'administration.
            </p>
          </div>
        </div>

        <div className="quick-actions-grid">

          <button
            type="button"
            className="action-card"
            onClick={() => navigate("/gestion-vehicules")}
          >
            <span className="action-card-icon">
              🚗
            </span>

            <span className="action-card-content">
              <strong>Gérer les véhicules</strong>

              <small>
                Consulter, modifier ou supprimer un véhicule
              </small>
            </span>

            <span className="action-card-arrow">
              →
            </span>
          </button>

          <button
            type="button"
            className="action-card"
            onClick={() => navigate("/ajouter-vehicule")}
          >
            <span className="action-card-icon">
              ➕
            </span>

            <span className="action-card-content">
              <strong>Ajouter un véhicule</strong>

              <small>
                Enregistrer un nouveau véhicule
              </small>
            </span>

            <span className="action-card-arrow">
              →
            </span>
          </button>

          <button
            type="button"
            className="action-card"
            onClick={() => navigate("/proprietaires")}
          >
            <span className="action-card-icon">
              👤
            </span>

            <span className="action-card-content">
              <strong>Gérer les propriétaires</strong>

              <small>
                Consulter et gérer les propriétaires
              </small>
            </span>

            <span className="action-card-arrow">
              →
            </span>
          </button>

          <button
            type="button"
            className="action-card"
            onClick={() => navigate("/vignettes")}
          >
            <span className="action-card-icon">
              🎫
            </span>

            <span className="action-card-content">
              <strong>Gérer les vignettes</strong>

              <small>
                Consulter, modifier ou supprimer une vignette
              </small>
            </span>

            <span className="action-card-arrow">
              →
            </span>
          </button>

        </div>
      </section>

    </div>
  );
}

export default DashboardAdmin;