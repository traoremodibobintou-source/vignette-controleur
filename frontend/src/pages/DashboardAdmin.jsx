import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DashboardAdmin() {
  const navigate = useNavigate();

  const API_URL = "https://vignette-controleur.onrender.com/api";

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
          fetch(`${API_URL}/vehicules`, {
            headers: {
              Accept: "application/json",
            },
          }),
          fetch(`${API_URL}/proprietaires`, {
            headers: {
              Accept: "application/json",
            },
          }),
          fetch(`${API_URL}/vignettes`, {
            headers: {
              Accept: "application/json",
            },
          }),
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
