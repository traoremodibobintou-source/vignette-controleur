import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function DetailVehicule() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const id = searchParams.get("id");

  const [vehicule, setVehicule] = useState(null);
  const [vignette, setVignette] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    const chargerDetails = async () => {
      try {
        const vehiculeResponse = await fetch(
          `http://127.0.0.1:8001/api/vehicules/${id}`
        );

        const vehiculeData = await vehiculeResponse.json();

        if (!vehiculeResponse.ok) {
          throw new Error(
            vehiculeData.message || "Véhicule introuvable."
          );
        }

        setVehicule(vehiculeData);

        const vignettesResponse = await fetch(
          "http://127.0.0.1:8001/api/vignettes"
        );

        const vignettesData = await vignettesResponse.json();

        if (vignettesResponse.ok) {
          const vignetteTrouvee = vignettesData.find(
            (item) => Number(item.vehicule_id) === Number(id)
          );

          setVignette(vignetteTrouvee || null);
        }
      } catch (error) {
        setErreur(error.message);
      } finally {
        setChargement(false);
      }
    };

    if (id) {
      chargerDetails();
    } else {
      setErreur("Aucun véhicule sélectionné.");
      setChargement(false);
    }
  }, [id]);

  if (chargement) {
    return (
      <div className="page-container">
        <div className="loading-card">
          Chargement des informations du véhicule...
        </div>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="page-container">
        <div className="alert alert-error">
          {erreur}
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate("/recherche")}
        >
          ← Retour à la recherche
        </button>
      </div>
    );
  }

  return (
    <div className="page-container detail-page">

      {/* En-tête */}
      <div className="page-heading">
        <div>
          <span className="hero-badge">
            CONSULTATION
          </span>

          <h1>Détail du véhicule</h1>

          <p>
            Informations complètes du véhicule et de son propriétaire.
          </p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate("/recherche")}
        >
          ← Retour
        </button>
      </div>

      {/* Informations principales */}
      <div className="details-grid">

        {/* Véhicule */}
        <section className="detail-card">

          <div className="detail-card-header">
            <div className="detail-icon">
              🚗
            </div>

            <div>
              <h2>Véhicule</h2>
              <p>Informations du véhicule</p>
            </div>
          </div>

          <div className="detail-list">

            <div className="detail-row">
              <span>Numéro de plaque</span>
              <strong className="plate-value">
                {vehicule.plaque}
              </strong>
            </div>

            <div className="detail-row">
              <span>Type</span>
              <strong>{vehicule.type}</strong>
            </div>

            <div className="detail-row">
              <span>Marque</span>
              <strong>
                {vehicule.marque || "Non renseignée"}
              </strong>
            </div>

            <div className="detail-row">
              <span>Modèle</span>
              <strong>
                {vehicule.modele || "Non renseigné"}
              </strong>
            </div>

            <div className="detail-row">
              <span>Couleur</span>
              <strong>
                {vehicule.couleur || "Non renseignée"}
              </strong>
            </div>

            <div className="detail-row">
              <span>Année</span>
              <strong>
                {vehicule.annee || "Non renseignée"}
              </strong>
            </div>

            <div className="detail-row">
              <span>Statut</span>

              {vehicule.statut_vol === "signale" ? (
                <span className="status-badge status-danger">
                  ⚠ Signalé
                </span>
              ) : (
                <span className="status-badge status-ok">
                  ✓ Non signalé
                </span>
              )}
            </div>

          </div>
        </section>

        {/* Propriétaire */}
        <section className="detail-card">

          <div className="detail-card-header">
            <div className="detail-icon">
              👤
            </div>

            <div>
              <h2>Propriétaire</h2>
              <p>Informations du propriétaire</p>
            </div>
          </div>

          {vehicule.proprietaire ? (
            <div className="detail-list">

              <div className="detail-row">
                <span>Nom complet</span>
                <strong>
                  {vehicule.proprietaire.prenom}{" "}
                  {vehicule.proprietaire.nom}
                </strong>
              </div>

              <div className="detail-row">
                <span>Téléphone</span>
                <strong>
                  {vehicule.proprietaire.telephone}
                </strong>
              </div>

              <div className="detail-row">
                <span>Adresse</span>
                <strong>
                  {vehicule.proprietaire.adresse}
                </strong>
              </div>

            </div>
          ) : (
            <p>
              Aucun propriétaire renseigné.
            </p>
          )}
        </section>

      </div>

      {/* Vignette */}
      <section className="detail-card vignette-detail-card">

        <div className="detail-card-header">
          <div className="detail-icon">
            🎫
          </div>

          <div>
            <h2>Vignette</h2>
            <p>Informations de la vignette associée</p>
          </div>
        </div>

        {vignette ? (
          <div className="detail-list">

            <div className="detail-row">
              <span>Numéro de vignette</span>
              <strong>
                {vignette.numero_vignette}
              </strong>
            </div>

            <div className="detail-row">
              <span>Date de délivrance</span>
              <strong>
                {vignette.date_delivrance}
              </strong>
            </div>

            <div className="detail-row">
              <span>Date d'expiration</span>
              <strong>
                {vignette.date_expiration}
              </strong>
            </div>

            <div className="detail-row">
              <span>Statut</span>

              <span
                className={
                  vignette.statut === "valide"
                    ? "status-badge status-ok"
                    : "status-badge status-danger"
                }
              >
                {vignette.statut === "valide"
                  ? "✓ Valide"
                  : "⚠ Expirée"}
              </span>
            </div>

          </div>
        ) : (
          <p>
            Aucune vignette associée à ce véhicule.
          </p>
        )}

      </section>

      {/* Alerte véhicule signalé */}
      {vehicule.statut_vol === "signale" && (
        <section className="vehicle-alert">
          <div className="vehicle-alert-icon">
            ⚠️
          </div>

          <div>
            <h2>Véhicule signalé</h2>

            <p>
              Ce véhicule est actuellement signalé dans
              la base de données. Consultez les informations
              disponibles avant toute intervention.
            </p>
          </div>
        </section>
      )}

      {/* Accès consultation */}
      <section className="consultation-notice">

        🔒 <strong>Accès en consultation</strong>

        <p>
          Cette page permet uniquement de consulter les
          informations du véhicule. Les opérations de
          modification et de suppression sont réservées
          à l'administrateur.
        </p>

      </section>

    </div>
  );
}

export default DetailVehicule;