import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function GestionVehicules() {
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

  const supprimerVehicule = async (id) => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer ce véhicule ?"
    );

    if (!confirmation) {
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8001/api/vehicules/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Impossible de supprimer le véhicule."
        );
      }

      setVehicules((anciensVehicules) =>
        anciensVehicules.filter((vehicule) => vehicule.id !== id)
      );
    } catch (error) {
      setErreur(error.message);
    }
  };

  return (
    <div className="page-container gestion-page">

      {/* En-tête */}
      <div className="page-header">
        <div>
          <span className="hero-badge">
            ADMINISTRATION
          </span>

          <h1>Gestion des véhicules</h1>

          <p>
            Consultez et gérez les véhicules enregistrés
            dans la base de données.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => navigate("/ajouter-vehicule")}
        >
          + Ajouter un véhicule
        </button>
      </div>

      {/* Erreur */}
      {erreur && (
        <div className="alert alert-error">
          {erreur}
        </div>
      )}

      {/* Liste */}
      <section className="data-section">

        <div className="section-heading">
          <div>
            <h2>Liste des véhicules</h2>

            {!chargement && !erreur && (
              <p>
                {vehicules.length} véhicule(s) enregistré(s)
              </p>
            )}
          </div>
        </div>

        {chargement && (
          <div className="loading-card">
            Chargement des véhicules...
          </div>
        )}

        {!chargement && !erreur && vehicules.length === 0 && (
          <div className="empty-card">
            <h3>Aucun véhicule enregistré</h3>

            <p>
              Commencez par ajouter un véhicule dans la base
              de données.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={() => navigate("/ajouter-vehicule")}
            >
              + Ajouter un véhicule
            </button>
          </div>
        )}

        {!chargement && !erreur && vehicules.length > 0 && (
          <div className="table-container">

            <table className="data-table">

              <thead>
                <tr>
                  <th>Plaque</th>
                  <th>Type</th>
                  <th>Marque</th>
                  <th>Modèle</th>
                  <th>Propriétaire</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {vehicules.map((vehicule) => (
                  <tr key={vehicule.id}>

                    <td>
                      <strong className="plate-number">
                        {vehicule.plaque}
                      </strong>
                    </td>

                    <td>
                      {vehicule.type}
                    </td>

                    <td>
                      {vehicule.marque || "—"}
                    </td>

                    <td>
                      {vehicule.modele || "—"}
                    </td>

                    <td>
                      {vehicule.proprietaire
                        ? `${vehicule.proprietaire.prenom} ${vehicule.proprietaire.nom}`
                        : "Non renseigné"}
                    </td>

                    <td>
                      {vehicule.statut_vol === "signale" ? (
                        <span className="status-badge status-danger">
                          ⚠ Signalé
                        </span>
                      ) : (
                        <span className="status-badge status-ok">
                          ✓ Non signalé
                        </span>
                      )}
                    </td>

                    <td>
                      <div className="table-actions">

                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() =>
                            navigate(
                              `/detail-vehicule?id=${vehicule.id}`
                            )
                          }
                        >
                          Voir
                        </button>

                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() =>
                            navigate(
                              `/ajouter-vehicule?id=${vehicule.id}`
                            )
                          }
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          className="danger-button"
                          onClick={() =>
                            supprimerVehicule(vehicule.id)
                          }
                        >
                          Supprimer
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}

      </section>

    </div>
  );
}

export default GestionVehicules;