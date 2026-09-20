import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function AjouterVehicule() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const id = searchParams.get("id");
  const modeModification = Boolean(id);

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
  });

  useEffect(() => {
    const chargerDonnees = async () => {
      try {
        const proprietairesResponse = await fetch(
          "http://127.0.0.1:8001/api/proprietaires"
        );

        const proprietairesData =
          await proprietairesResponse.json();

        if (!proprietairesResponse.ok) {
          throw new Error(
            proprietairesData.message ||
              "Impossible de charger les propriétaires."
          );
        }

        setProprietaires(proprietairesData);

        if (modeModification) {
          const vehiculeResponse = await fetch(
            `http://127.0.0.1:8001/api/vehicules/${id}`
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

  const modifierChamp = (event) => {
    const { name, value } = event.target;

    setFormulaire((ancien) => ({
      ...ancien,
      [name]: value,
    }));
  };

  const enregistrerVehicule = async (event) => {
    event.preventDefault();

    setErreur("");
    setMessage("");
    setEnregistrement(true);

    try {
      const url = modeModification
        ? `http://127.0.0.1:8001/api/vehicules/${id}`
        : "http://127.0.0.1:8001/api/vehicules";

      const response = await fetch(url, {
        method: modeModification ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...formulaire,
          annee: formulaire.annee || null,
          proprietaire_id: formulaire.proprietaire_id
            ? Number(formulaire.proprietaire_id)
            : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422 && data.errors) {
          const erreurs = Object.values(data.errors)
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

  if (chargement) {
    return (
      <div className="page-container">
        <div className="loading-card">
          Chargement du formulaire...
        </div>
      </div>
    );
  }

  return (
    <div className="page-container form-page">

      {/* En-tête */}
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

      {/* Retour */}
      <button
        type="button"
        className="secondary-button form-back-button"
        onClick={() => navigate("/gestion-vehicules")}
      >
        ← Retour
      </button>

      {/* Erreur */}
      {erreur && (
        <div className="alert alert-error">
          {erreur}
        </div>
      )}

      {/* Succès */}
      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {/* Formulaire */}
      <section className="form-section">

        <div className="section-heading">
          <div>
            <div className="detail-icon">
              🚗
            </div>

            <h2>Informations du véhicule</h2>

            <p>
              Renseignez les caractéristiques du véhicule.
            </p>
          </div>
        </div>

        <form
          className="vehicle-form"
          onSubmit={enregistrerVehicule}
        >

          <div className="form-grid">

            {/* Plaque */}
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

            {/* Type */}
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

                <option value="Moto">Moto</option>
                <option value="Voiture">Voiture</option>
                <option value="Taxi">Taxi</option>
                <option value="Minibus">Minibus</option>
                <option value="Bus">Bus</option>
                <option value="Camion">Camion</option>
                <option value="Camion-remorque">
                  Camion-remorque
                </option>
                <option value="Tracteur/Engin">
                  Tracteur / Engin
                </option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            {/* Marque */}
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

            {/* Modèle */}
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

            {/* Couleur */}
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

            {/* Année */}
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

            {/* Propriétaire */}
            <div className="form-group form-group-full">
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

                {proprietaires.map((proprietaire) => (
                  <option
                    key={proprietaire.id}
                    value={proprietaire.id}
                  >
                    {proprietaire.prenom}{" "}
                    {proprietaire.nom} —{" "}
                    {proprietaire.telephone}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Actions */}
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