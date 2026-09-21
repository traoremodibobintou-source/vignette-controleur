import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function AjouterVehicule() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const id = searchParams.get("id");
  const modeModification = Boolean(id);

  const API_URL =
    "https://vignette-controleur.onrender.com/api";

  const [proprietaires, setProprietaires] = useState([]);

  const [chargement, setChargement] = useState(true);
  const [enregistrement, setEnregistrement] = useState(false);

  const [erreur, setErreur] = useState("");
  const [message, setMessage] = useState("");

  const [formulaire, setFormulaire] = useState({
    plaque: "",
    type: "",
    marque: "",
    modele: "",
    couleur: "",
    annee: "",
    proprietaire_id: "",
    statut_vol: "non_signale",
  });

  /* =========================
     CHARGEMENT
  ========================= */

  useEffect(() => {
    const chargerDonnees = async () => {
      try {
        /* Charger les propriétaires */

        const proprietairesResponse =
          await fetch(
            `${API_URL}/proprietaires`,
            {
              headers: {
                Accept: "application/json",
              },
            }
          );

        const proprietairesData =
          await proprietairesResponse.json();

        if (!proprietairesResponse.ok) {
          throw new Error(
            proprietairesData.message ||
              "Impossible de charger les propriétaires."
          );
        }

        setProprietaires(
          Array.isArray(proprietairesData)
            ? proprietairesData
            : []
        );

        /* Charger le véhicule en modification */

        if (modeModification) {
          const vehiculeResponse =
            await fetch(
              `${API_URL}/vehicules/${id}`,
              {
                headers: {
                  Accept: "application/json",
                },
              }
            );

          const vehiculeData =
            await vehiculeResponse.json();

          if (!vehiculeResponse.ok) {
            throw new Error(
              vehiculeData.message ||
                "Impossible de charger le véhicule."
            );
          }

          setFormulaire({
            plaque: vehiculeData.plaque || "",
            type: vehiculeData.type || "",
            marque: vehiculeData.marque || "",
            modele: vehiculeData.modele || "",
            couleur: vehiculeData.couleur || "",
            annee: vehiculeData.annee || "",
            proprietaire_id:
              vehiculeData.proprietaire_id || "",
            statut_vol:
              vehiculeData.statut_vol ||
              "non_signale",
          });
        }
      } catch (error) {
        setErreur(error.message);
      } finally {
        setChargement(false);
      }
    };

    chargerDonnees();
  }, [id, modeModification]);

  /* =========================
     MODIFIER UN CHAMP
  ========================= */

  const modifierChamp = (event) => {
    const { name, value } = event.target;

    setFormulaire((ancien) => ({
      ...ancien,
      [name]: value,
    }));
  };

  /* =========================
     ENREGISTRER
  ========================= */

  const enregistrerVehicule = async (event) => {
    event.preventDefault();

    setErreur("");
    setMessage("");
    setEnregistrement(true);

    try {
      const url = modeModification
        ? `${API_URL}/vehicules/${id}`
        : `${API_URL}/vehicules`;

      const response = await fetch(url, {
        method: modeModification ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify({
          plaque: formulaire.plaque,
          type: formulaire.type,
          marque: formulaire.marque,
          modele: formulaire.modele,
          couleur: formulaire.couleur,
          annee: formulaire.annee || null,
          proprietaire_id:
            formulaire.proprietaire_id
              ? Number(formulaire.proprietaire_id)
              : null,
          statut_vol:
            formulaire.statut_vol,
        }),
      });

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
            "Impossible d'enregistrer le véhicule."
        );
      }

      setMessage(
        modeModification
          ? "✓ Véhicule modifié avec succès."
          : "✓ Véhicule enregistré avec succès."
      );

      setTimeout(() => {
        navigate("/gestion-vehicules");
      }, 800);
    } catch (error) {
      setErreur(error.message);
    } finally {
      setEnregistrement(false);
    }
  };

  /* =========================
     CHARGEMENT
  ========================= */

  if (chargement) {
    return (
      <div className="page-container">
        <div className="loading-card">
          Chargement du formulaire...
        </div>
      </div>
    );
  }

  /* =========================
     AFFICHAGE
  ========================= */

  return (
    <div className="page-container form-page">

      {/* EN-TÊTE */}

      <div className="page-header">

        <div>

          <span className="hero-badge">
            ADMINISTRATION
          </span>

          <h1>
            {modeModification
              ? "Modifier un véhicule"
              : "Ajouter un véhicule"}
          </h1>

          <p>
            {modeModification
              ? "Modifiez les informations du véhicule enregistré dans la base de données."
              : "Enregistrez un nouveau véhicule dans la base de données."}
          </p>

        </div>

      </div>

      {/* RETOUR */}

      <button
        type="button"
        className="secondary-button form-back-button"
        onClick={() =>
          navigate("/gestion-vehicules")
        }
      >
        ← Retour
      </button>

      {/* ERREUR */}

      {erreur && (
        <div className="alert alert-error">
          {erreur}
        </div>
      )}

      {/* SUCCÈS */}

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {/* FORMULAIRE */}

      <section className="form-section">

        <div className="section-heading">

          <div>

            <div className="detail-icon">
              🚗
            </div>

            <h2>
              Informations du véhicule
            </h2>

            <p>
              Renseignez les caractéristiques
              du véhicule.
            </p>

          </div>

        </div>

        <form
          className="vehicle-form"
          onSubmit={enregistrerVehicule}
        >

          <div className="form-grid">

            {/* PLAQUE */}

            <div className="form-group">

              <label htmlFor="plaque">
                Numéro de plaque *
              </label>

              <input
                type="text"
                id="plaque"
                name="plaque"
                value={formulaire.plaque}
                onChange={modifierChamp}
                placeholder="Ex : AB1234MD"
                required
              />

            </div>

            {/* TYPE */}

            <div className="form-group">

              <label htmlFor="type">
                Type de véhicule *
              </label>

              <select
                id="type"
                name="type"
                value={formulaire.type}
                onChange={modifierChamp}
                required
              >

                <option value="">
                  Sélectionner un type
                </option>

                <option value="Moto">
                  Moto
                </option>

                <option value="Voiture">
                  Voiture
                </option>

                <option value="Taxi">
                  Taxi
                </option>

                <option value="Minibus">
                  Minibus
                </option>

                <option value="Bus">
                  Bus
                </option>

                <option value="Camion">
                  Camion
                </option>

                <option value="Camion-remorque">
                  Camion-remorque
                </option>

                <option value="Tracteur/Engin">
                  Tracteur / Engin
                </option>

                <option value="Autre">
                  Autre
                </option>

              </select>

            </div>

            {/* MARQUE */}

            <div className="form-group">

              <label htmlFor="marque">
                Marque
              </label>

              <input
                type="text"
                id="marque"
                name="marque"
                value={formulaire.marque}
                onChange={modifierChamp}
                placeholder="Ex : Toyota"
              />

            </div>

            {/* MODELE */}

            <div className="form-group">

              <label htmlFor="modele">
                Modèle
              </label>

              <input
                type="text"
                id="modele"
                name="modele"
                value={formulaire.modele}
                onChange={modifierChamp}
                placeholder="Ex : Corolla"
              />

            </div>

            {/* COULEUR */}

            <div className="form-group">

              <label htmlFor="couleur">
                Couleur
              </label>

              <input
                type="text"
                id="couleur"
                name="couleur"
                value={formulaire.couleur}
                onChange={modifierChamp}
                placeholder="Ex : Rouge"
              />

            </div>

            {/* ANNEE */}

            <div className="form-group">

              <label htmlFor="annee">
                Année
              </label>

              <input
                type="number"
                id="annee"
                name="annee"
                value={formulaire.annee}
                onChange={modifierChamp}
                placeholder="Ex : 2020"
              />

            </div>

            {/* PROPRIETAIRE */}

            <div className="form-group">

              <label htmlFor="proprietaire_id">
                Propriétaire *
              </label>

              <select
                id="proprietaire_id"
                name="proprietaire_id"
                value={formulaire.proprietaire_id}
                onChange={modifierChamp}
                required
              >

                <option value="">
                  Sélectionner un propriétaire
                </option>

                {proprietaires.map(
                  (proprietaire) => (
                    <option
                      key={proprietaire.id}
                      value={proprietaire.id}
                    >
                      {proprietaire.prenom}{" "}
                      {proprietaire.nom}
                      {" — "}
                      {proprietaire.telephone}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* STATUT DU VEHICULE */}

            <div className="form-group">

              <label htmlFor="statut_vol">
                Statut du véhicule *
              </label>

              <select
                id="statut_vol"
                name="statut_vol"
                value={formulaire.statut_vol}
                onChange={modifierChamp}
                required
              >

                <option value="non_signale">
                  ✓ Non signalé
                </option>

                <option value="signale">
                  ⚠ Signalé
                </option>

              </select>

              <small className="form-help">
                Sélectionnez « Signalé » si le
                véhicule fait l'objet d'un
                signalement de vol.
              </small>

            </div>

          </div>

          {/* ACTIONS */}

          <div className="form-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                navigate("/gestion-vehicules")
              }
              disabled={enregistrement}
            >
              Annuler
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={enregistrement}
            >
              {enregistrement
                ? "Enregistrement..."
                : modeModification
                ? "✓ Enregistrer les modifications"
                : "+ Enregistrer le véhicule"}
            </button>

          </div>

        </form>

      </section>

    </div>
  );
}

export default AjouterVehicule;
