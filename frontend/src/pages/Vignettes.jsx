import { useEffect, useState } from "react";

function Vignettes() {
  const API_URL =
    "https://vignette-controleur.onrender.com/api";

  const [vignettes, setVignettes] = useState([]);
  const [vehicules, setVehicules] = useState([]);

  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [message, setMessage] = useState("");

  const [afficherFormulaire, setAfficherFormulaire] =
    useState(false);

  const [modeModification, setModeModification] =
    useState(false);

  const [vignetteModifieeId, setVignetteModifieeId] =
    useState(null);

  const [numeroVignette, setNumeroVignette] =
    useState("");

  const [vehiculeId, setVehiculeId] =
    useState("");

  const [dateDelivrance, setDateDelivrance] =
    useState("");

  const [dateExpiration, setDateExpiration] =
    useState("");

  const [statut, setStatut] =
    useState("valide");

  /* =====================================================
     CHARGER LES VIGNETTES
  ===================================================== */

  const chargerVignettes = async () => {
    try {
      const response = await fetch(
        `${API_URL}/vignettes`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible de charger les vignettes."
        );
      }

      setVignettes(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      setErreur(error.message);
    }
  };

  /* =====================================================
     CHARGER LES VEHICULES
  ===================================================== */

  const chargerVehicules = async () => {
    try {
      const response = await fetch(
        `${API_URL}/vehicules`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible de charger les véhicules."
        );
      }

      if (!Array.isArray(data)) {
        throw new Error(
          "La réponse des véhicules est invalide."
        );
      }

      setVehicules(data);
    } catch (error) {
      setErreur(error.message);
    }
  };

  /* =====================================================
     CHARGEMENT INITIAL
  ===================================================== */

  useEffect(() => {
    const chargerDonnees = async () => {
      setChargement(true);
      setErreur("");

      await Promise.all([
        chargerVignettes(),
        chargerVehicules(),
      ]);

      setChargement(false);
    };

    chargerDonnees();
  }, []);

  /* =====================================================
     VIDER LE FORMULAIRE
  ===================================================== */

  const viderFormulaire = () => {
    setNumeroVignette("");
    setVehiculeId("");
    setDateDelivrance("");
    setDateExpiration("");
    setStatut("valide");

    setVignetteModifieeId(null);
    setModeModification(false);
  };

  /* =====================================================
     OUVRIR LE FORMULAIRE
  ===================================================== */

  const ouvrirFormulaire = () => {
    viderFormulaire();

    setErreur("");
    setMessage("");

    setAfficherFormulaire(true);
  };

  /* =====================================================
     FERMER LE FORMULAIRE
  ===================================================== */

  const fermerFormulaire = () => {
    viderFormulaire();

    setAfficherFormulaire(false);

    setErreur("");
    setMessage("");
  };

  /* =====================================================
     AJOUTER UNE VIGNETTE
  ===================================================== */

  const ajouterVignette = async (event) => {
    event.preventDefault();

    setErreur("");
    setMessage("");

    if (!vehiculeId) {
      setErreur(
        "Veuillez sélectionner un véhicule."
      );

      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/vignettes`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify({
            numero_vignette: numeroVignette,
            vehicule_id: Number(vehiculeId),
            date_delivrance: dateDelivrance,
            date_expiration: dateExpiration,
            statut: statut,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (
          response.status === 422 &&
          data.errors
        ) {
          const erreurs = Object.values(
            data.errors
          )
            .flat()
            .join(" ");

          throw new Error(erreurs);
        }

        throw new Error(
          data.message ||
            "Erreur lors de l'ajout de la vignette."
        );
      }

      setVignettes((anciennes) => [
        ...anciennes,
        data,
      ]);

      viderFormulaire();
      setAfficherFormulaire(false);

      setMessage(
        "✓ Vignette ajoutée avec succès."
      );
    } catch (error) {
      setErreur(error.message);
    }
  };

  /* =====================================================
     PREPARER LA MODIFICATION
  ===================================================== */

  const preparerModification = (vignette) => {
    setNumeroVignette(
      vignette.numero_vignette || ""
    );

    setVehiculeId(
      String(vignette.vehicule_id || "")
    );

    setDateDelivrance(
      vignette.date_delivrance || ""
    );

    setDateExpiration(
      vignette.date_expiration || ""
    );

    setStatut(
      vignette.statut || "valide"
    );

    setVignetteModifieeId(vignette.id);

    setModeModification(true);

    setAfficherFormulaire(true);

    setErreur("");
    setMessage("");
  };

  /* =====================================================
     MODIFIER UNE VIGNETTE
  ===================================================== */

  const modifierVignette = async (event) => {
    event.preventDefault();

    setErreur("");
    setMessage("");

    if (!vehiculeId) {
      setErreur(
        "Veuillez sélectionner un véhicule."
      );

      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/vignettes/${vignetteModifieeId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify({
            numero_vignette: numeroVignette,
            vehicule_id: Number(vehiculeId),
            date_delivrance: dateDelivrance,
            date_expiration: dateExpiration,
            statut: statut,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (
          response.status === 422 &&
          data.errors
        ) {
          const erreurs = Object.values(
            data.errors
          )
            .flat()
            .join(" ");

          throw new Error(erreurs);
        }

        throw new Error(
          data.message ||
            "Erreur lors de la modification."
        );
      }

      setVignettes((anciennes) =>
        anciennes.map((vignette) =>
          vignette.id === vignetteModifieeId
            ? data
            : vignette
        )
      );

      viderFormulaire();

      setAfficherFormulaire(false);

      setMessage(
        "✓ Vignette modifiée avec succès."
      );
    } catch (error) {
      setErreur(error.message);
    }
  };

  /* =====================================================
     SUPPRIMER UNE VIGNETTE
  ===================================================== */

  const supprimerVignette = async (id) => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer cette vignette ?"
    );

    if (!confirmation) {
      return;
    }

    setErreur("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/vignettes/${id}`,
        {
          method: "DELETE",

          headers: {
            Accept: "application/json",
          },
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible de supprimer la vignette."
        );
      }

      setVignettes((anciennes) =>
        anciennes.filter(
          (vignette) =>
            vignette.id !== id
        )
      );

      setMessage(
        "✓ Vignette supprimée avec succès."
      );
    } catch (error) {
      setErreur(error.message);
    }
  };

  /* =====================================================
     AFFICHER LE VEHICULE
  ===================================================== */

  const trouverVehicule = (id) => {
    return vehicules.find(
      (vehicule) =>
        Number(vehicule.id) === Number(id)
    );
  };

  /* =====================================================
     AFFICHAGE
  ===================================================== */

  return (
    <div className="vignettes-page">

      {/* =================================================
          EN-TÊTE
      ================================================= */}

      <div className="page-header">

        <div>
          <span className="page-kicker">
            ADMINISTRATION
          </span>

          <h1>
            Gestion des vignettes
          </h1>

          <p>
            Gérez les vignettes enregistrées
            dans la base de données.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={
            afficherFormulaire
              ? fermerFormulaire
              : ouvrirFormulaire
          }
        >
          {afficherFormulaire
            ? "Fermer le formulaire"
            : "+ Ajouter une vignette"}
        </button>

      </div>

      {/* =================================================
          MESSAGES
      ================================================= */}

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {erreur && (
        <div className="alert alert-error">
          {erreur}
        </div>
      )}

      {/* =================================================
          FORMULAIRE
      ================================================= */}

      {afficherFormulaire && (
        <section className="data-section vignette-form-section">

          <div className="section-heading">

            <div>
              <span className="page-kicker">
                VIGNETTE
              </span>

              <h2>
                {modeModification
                  ? "Modifier une vignette"
                  : "Nouvelle vignette"}
              </h2>

              <p>
                Renseignez les informations
                de la vignette.
              </p>
            </div>

          </div>

          <form
            className="vignette-form"
            onSubmit={
              modeModification
                ? modifierVignette
                : ajouterVignette
            }
          >

            {/* NUMERO */}

            <div className="form-field">

              <label htmlFor="numero_vignette">
                Numéro de vignette *
              </label>

              <input
                type="text"
                id="numero_vignette"
                value={numeroVignette}
                onChange={(event) =>
                  setNumeroVignette(
                    event.target.value
                  )
                }
                placeholder="Ex : VG-2026-00001"
                required
              />

            </div>

            {/* VEHICULE */}

            <div className="form-field">

              <label htmlFor="vehicule_id">
                Véhicule *
              </label>

              <select
                id="vehicule_id"
                value={vehiculeId}
                onChange={(event) =>
                  setVehiculeId(
                    event.target.value
                  )
                }
                required
              >

                <option value="">
                  {vehicules.length > 0
                    ? "Sélectionner un véhicule"
                    : "Chargement des véhicules..."}
                </option>

                {vehicules.map((vehicule) => (
                  <option
                    key={vehicule.id}
                    value={vehicule.id}
                  >
                    {vehicule.plaque || "Sans plaque"}
                    {" — "}
                    {vehicule.type || "Véhicule"}
                    {vehicule.marque
                      ? ` — ${vehicule.marque}`
                      : ""}
                    {vehicule.modele
                      ? ` ${vehicule.modele}`
                      : ""}
                  </option>
                ))}

              </select>

              {vehicules.length === 0 &&
                !chargement && (
                  <small className="form-help">
                    Aucun véhicule n'a été chargé.
                  </small>
                )}

            </div>

            {/* DATE DE DELIVRANCE */}

            <div className="form-field">

              <label htmlFor="date_delivrance">
                Date de délivrance *
              </label>

              <input
                type="date"
                id="date_delivrance"
                value={dateDelivrance}
                onChange={(event) =>
                  setDateDelivrance(
                    event.target.value
                  )
                }
                required
              />

            </div>

            {/* DATE D'EXPIRATION */}

            <div className="form-field">

              <label htmlFor="date_expiration">
                Date d'expiration *
              </label>

              <input
                type="date"
                id="date_expiration"
                value={dateExpiration}
                onChange={(event) =>
                  setDateExpiration(
                    event.target.value
                  )
                }
                required
              />

            </div>

            {/* STATUT */}

            <div className="form-field">

              <label htmlFor="statut">
                Statut *
              </label>

              <select
                id="statut"
                value={statut}
                onChange={(event) =>
                  setStatut(
                    event.target.value
                  )
                }
                required
              >

                <option value="valide">
                  Valide
                </option>

                <option value="expire">
                  Expirée
                </option>

                <option value="annule">
                  Annulée
                </option>

              </select>

            </div>

            {/* BOUTONS */}

            <div className="form-actions">

              <button
                type="submit"
                className="primary-button"
                disabled={
                  chargement ||
                  vehicules.length === 0
                }
              >
                {modeModification
                  ? "✓ Enregistrer la modification"
                  : "+ Enregistrer la vignette"}
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={fermerFormulaire}
              >
                Annuler
              </button>

            </div>

          </form>

        </section>
      )}

      {/* =================================================
          LISTE DES VIGNETTES
      ================================================= */}

      <section className="data-section">

        <div className="section-heading">

          <div>

            <span className="page-kicker">
              DONNÉES
            </span>

            <h2>
              Liste des vignettes
            </h2>

            {!chargement && (
              <p>
                {vignettes.length} vignette(s)
                enregistrée(s)
              </p>
            )}

          </div>

        </div>

        {/* CHARGEMENT */}

        {chargement && (
          <div className="loading-card">

            <p>
              Chargement des données...
            </p>

          </div>
        )}

        {/* TABLEAU */}

        {!chargement &&
          vignettes.length > 0 && (

            <div className="table-container">

              <table className="data-table">

                <thead>

                  <tr>
                    <th>Numéro</th>
                    <th>Véhicule</th>
                    <th>Plaque</th>
                    <th>Date de début</th>
                    <th>Date d'expiration</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>

                </thead>

                <tbody>

                  {vignettes.map(
                    (vignette) => {

                      const vehicule =
                        vignette.vehicule ||
                        trouverVehicule(
                          vignette.vehicule_id
                        );

                      return (
                        <tr
                          key={vignette.id}
                        >

                          <td>
                            <strong>
                              {
                                vignette.numero_vignette
                              }
                            </strong>
                          </td>

                          <td>
                            {vehicule
                              ? `${vehicule.marque || ""} ${vehicule.modele || ""}`.trim() ||
                                vehicule.type ||
                                "Véhicule"
                              : "—"}
                          </td>

                          <td>
                            <strong>
                              {vehicule
                                ? vehicule.plaque
                                : "—"}
                            </strong>
                          </td>

                          <td>
                            {
                              vignette.date_delivrance
                            }
                          </td>

                          <td>
                            {
                              vignette.date_expiration
                            }
                          </td>

                          <td>

                            {vignette.statut ===
                            "valide" ? (

                              <span className="status-badge status-ok">
                                ✓ Valide
                              </span>

                            ) : vignette.statut ===
                              "expire" ? (

                              <span className="status-badge status-danger">
                                ⚠ Expirée
                              </span>

                            ) : (

                              <span className="status-badge status-danger">
                                ⚠ Annulée
                              </span>

                            )}

                          </td>

                          <td>

                            <div className="table-actions">

                              <button
                                type="button"
                                className="secondary-button"
                                onClick={() =>
                                  preparerModification(
                                    vignette
                                  )
                                }
                              >
                                Modifier
                              </button>

                              <button
                                type="button"
                                className="danger-button"
                                onClick={() =>
                                  supprimerVignette(
                                    vignette.id
                                  )
                                }
                              >
                                Supprimer
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>
          )}

        {/* AUCUNE VIGNETTE */}

        {!chargement &&
          vignettes.length === 0 && (

            <div className="empty-card">

              <div className="empty-icon">
                🎫
              </div>

              <h3>
                Aucune vignette enregistrée
              </h3>

              <p>
                Ajoutez une première vignette
                pour commencer.
              </p>

            </div>
          )}

      </section>

    </div>
  );
}

export default Vignettes;
