import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DashboardControleur() {
  const navigate = useNavigate();

  const [vehicules, setVehicules] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    const chargerVehicules = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8001/api/vehicules"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Impossible de charger les véhicules."
          );
        }

        setVehicules(data);
      } catch (error) {
        setErreur(error.message);
      } finally {
        setChargement(false);
      }
    };

    chargerVehicules();
  }, []);

  const vehiculesSignales = vehicules.filter(
    (vehicule) => vehicule.statut_vol === "signale"
  );

  const vehiculesNonSignales = vehicules.filter(
    (vehicule) => vehicule.statut_vol !== "signale"
  );

  return (
    <div className="page-container dashboard-page">

      {/* En-tête du dashboard */}
      <div className="dashboard-intro">
        <span className="hero-badge">ESPACE CONTRÔLEUR</span>

        <h1>Dashboard Contrôleur</h1>

        <p>
          Consultez rapidement les informations des véhicules,
          des propriétaires et des vignettes.
        </p>

        <button
          type="button"
          className="primary-button"
          onClick={() => navigate("/recherche")}
        >
          🔎 Rechercher
        </button>
      </div>

      {/* Statistiques */}
      <section className="stats-grid">

        <div className="stat-card">
          <h3>🚗 Véhicules enregistrés</h3>

          {chargement ? (
            <strong>...</strong>
          ) : erreur ? (
            <strong>-</strong>
          ) : (
            <strong>{vehicules.length}</strong>
          )}
        </div>

        <div className="stat-card">
          <h3>⚠️ Véhicules signalés</h3>

          {chargement ? (
            <strong>...</strong>
          ) : erreur ? (
            <strong>-</strong>
          ) : (
            <strong>{vehiculesSignales.length}</strong>
          )}
        </div>

        <div className="stat-card">
          <h3>✓ Véhicules non signalés</h3>

          {chargement ? (
            <strong>...</strong>
          ) : erreur ? (
            <strong>-</strong>
          ) : (
            <strong>{vehiculesNonSignales.length}</strong>
          )}
        </div>

      </section>

      {erreur && (
        <div className="alert alert-error">
          {erreur}
        </div>
      )}

      {/* Zone de recherche */}
      <section className="dashboard-search">

        <h2>Recherche rapide</h2>

        <p>
          Recherchez les informations d’un véhicule à partir
          de son numéro de plaque ou de sa vignette.
        </p>

        <div className="quick-actions">

          <button
            type="button"
            className="primary-button"
            onClick={() => navigate("/recherche")}
          >
            🚗 Par numéro de plaque →
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/recherche")}
          >
            🎫 Par numéro de vignette →
          </button>

        </div>

      </section>

      {/* Consultation uniquement */}
      <section className="consultation-notice">

        🔒 <strong>Accès en consultation uniquement</strong>

        <p>
          Le compte Contrôleur permet uniquement de consulter
          les informations des véhicules et des vignettes.
          Les opérations d'ajout, de modification et de
          suppression sont réservées à l'administrateur.
        </p>

      </section>

    </div>
  );
}

export default DashboardControleur;