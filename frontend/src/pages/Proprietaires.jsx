import { useEffect, useState } from "react";

function Proprietaires() {
  const [proprietaires, setProprietaires] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [message, setMessage] = useState("");

  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [modeModification, setModeModification] = useState(false);
  const [proprietaireModifieId, setProprietaireModifieId] = useState(null);

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");

  const chargerProprietaires = async () => {
    try {
      setChargement(true);

      const response = await fetch(
        "http://127.0.0.1:8001/api/proprietaires"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Impossible de charger les propriétaires."
        );
      }

      setProprietaires(data);
      setErreur("");
    } catch (error) {
      setErreur(error.message);
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerProprietaires();
  }, []);

  const viderFormulaire = () => {
    setNom("");
    setPrenom("");
    setTelephone("");
    setAdresse("");
    setProprietaireModifieId(null);
    setModeModification(false);
  };

  const ajouterProprietaire = async (event) => {
    event.preventDefault();

    setErreur("");
    setMessage("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8001/api/proprietaires",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nom,
            prenom,
            telephone,
            adresse,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Erreur lors de l'ajout."
        );
      }

      setProprietaires([...proprietaires, data]);

      viderFormulaire();
      setAfficherFormulaire(false);
      setMessage("Propriétaire ajouté avec succès.");
    } catch (error) {
      setErreur(error.message);
    }
  };

  const modifierProprietaire = async (event) => {
    event.preventDefault();

    setErreur("");
    setMessage("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8001/api/proprietaires/${proprietaireModifieId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nom,
            prenom,
            telephone,
            adresse,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Erreur lors de la modification."
        );
      }

      setProprietaires(
        proprietaires.map((proprietaire) =>
          proprietaire.id === proprietaireModifieId
            ? data
            : proprietaire
        )
      );

      viderFormulaire();
      setAfficherFormulaire(false);
      setMessage("Propriétaire modifié avec succès.");
    } catch (error) {
      setErreur(error.message);
    }
  };

  const supprimerProprietaire = async (id) => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer ce propriétaire ?"
    );

    if (!confirmation) {
      return;
    }

    setErreur("");
    setMessage("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8001/api/proprietaires/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible de supprimer le propriétaire."
        );
      }

      setProprietaires(
        proprietaires.filter(
          (proprietaire) => proprietaire.id !== id
        )
      );

      setMessage("Propriétaire supprimé avec succès.");
    } catch (error) {
      setErreur(error.message);
    }
  };

  const preparerModification = (proprietaire) => {
    setNom(proprietaire.nom);
    setPrenom(proprietaire.prenom);
    setTelephone(proprietaire.telephone);
    setAdresse(proprietaire.adresse);

    setProprietaireModifieId(proprietaire.id);
    setModeModification(true);
    setAfficherFormulaire(true);

    setErreur("");
    setMessage("");
  };

  const annulerModification = () => {
    viderFormulaire();
    setAfficherFormulaire(false);
    setErreur("");
    setMessage("");
  };

  return (
    <div className="page-container proprietaires-page">

      {/* EN-TÊTE */}
      <div className="page-header">
        <div>
          <span className="page-kicker">
            ADMINISTRATION
          </span>

          <h1>Gestion des propriétaires</h1>

          <p>
            Gérez les propriétaires enregistrés dans la
            base de données.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => {
            if (afficherFormulaire) {
              viderFormulaire();
            }

            setAfficherFormulaire(!afficherFormulaire);
            setErreur("");
            setMessage("");
          }}
        >
          {afficherFormulaire
            ? "Fermer le formulaire"
            : "+ Ajouter un propriétaire"}
        </button>
      </div>

      {/* MESSAGES */}
      {message && (
        <div className="alert alert-success">
          ✓ {message}
        </div>
      )}

      {erreur && (
        <div className="alert alert-error">
          ⚠ {erreur}
        </div>
      )}

      {/* FORMULAIRE */}
      {afficherFormulaire && (
        <section className="form-section">
          <div className="section-heading">
            <div className="detail-icon">👤</div>

            <h2>
              {modeModification
                ? "Modifier un propriétaire"
                : "Nouveau propriétaire"}
            </h2>

            <p>
              Renseignez les informations du propriétaire.
            </p>
          </div>

          <form
            className="vehicle-form"
            onSubmit={
              modeModification
                ? modifierProprietaire
                : ajouterProprietaire
            }
          >
            <div className="form-grid">

              <div className="form-group">
                <label htmlFor="nom">
                  Nom *
                </label>

                <input
                  type="text"
                  id="nom"
                  value={nom}
                  placeholder="Ex : Traore"
                  onChange={(event) =>
                    setNom(event.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="prenom">
                  Prénom *
                </label>

                <input
                  type="text"
                  id="prenom"
                  value={prenom}
                  placeholder="Ex : Modibo"
                  onChange={(event) =>
                    setPrenom(event.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="telephone">
                  Téléphone *
                </label>

                <input
                  type="text"
                  id="telephone"
                  value={telephone}
                  placeholder="Ex : 70000001"
                  onChange={(event) =>
                    setTelephone(event.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="adresse">
                  Adresse *
                </label>

                <input
                  type="text"
                  id="adresse"
                  value={adresse}
                  placeholder="Ex : Bamako"
                  onChange={(event) =>
                    setAdresse(event.target.value)
                  }
                  required
                />
              </div>

            </div>

            <div className="form-actions">
              {modeModification && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={annulerModification}
                >
                  Annuler
                </button>
              )}

              <button
                type="submit"
                className="primary-button"
              >
                {modeModification
                  ? "Enregistrer la modification"
                  : "+ Enregistrer le propriétaire"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* LISTE */}
      <section className="data-section">

        <div className="section-heading">
          <h2>Liste des propriétaires</h2>

          <p>
            {proprietaires.length} propriétaire(s)
            enregistré(s)
          </p>
        </div>

        {chargement && (
          <div className="loading-card">
            Chargement des propriétaires...
          </div>
        )}

        {!chargement && !erreur && (
          proprietaires.length > 0 ? (
            <div className="table-container">
              <table className="data-table">

                <thead>
                  <tr>
                    <th>Nom complet</th>
                    <th>Téléphone</th>
                    <th>Adresse</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {proprietaires.map(
                    (proprietaire) => (
                      <tr key={proprietaire.id}>

                        <td>
                          <strong className="plate-number">
                            {proprietaire.prenom}{" "}
                            {proprietaire.nom}
                          </strong>
                        </td>

                        <td>
                          {proprietaire.telephone}
                        </td>

                        <td>
                          {proprietaire.adresse}
                        </td>

                        <td>
                          <div className="table-actions">

                            <button
                              type="button"
                              className="secondary-button"
                              onClick={() =>
                                preparerModification(
                                  proprietaire
                                )
                              }
                            >
                              Modifier
                            </button>

                            <button
                              type="button"
                              className="danger-button"
                              onClick={() =>
                                supprimerProprietaire(
                                  proprietaire.id
                                )
                              }
                            >
                              Supprimer
                            </button>

                          </div>
                        </td>

                      </tr>
                    )
                  )}
                </tbody>

              </table>
            </div>
          ) : (
            <div className="empty-card">
              <h3>Aucun propriétaire enregistré</h3>

              <p>
                Ajoutez un propriétaire pour commencer.
              </p>
            </div>
          )
        )}

      </section>
    </div>
  );
}

export default Proprietaires;