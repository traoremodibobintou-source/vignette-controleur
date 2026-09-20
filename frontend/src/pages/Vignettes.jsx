import { useEffect, useState } from "react";

function Vignettes() {
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

  const chargerVignettes = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8001/api/vignettes"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible de charger les vignettes."
        );
      }

      setVignettes(data);
      setErreur("");
    } catch (error) {
      setErreur(error.message);
    }
  };

  const chargerVehicules = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8001/api/vehicules"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible de charger les véhicules."
        );
      }

      setVehicules(data);
    } catch (error) {
      setErreur(error.message);
    }
  };

  useEffect(() => {
    const chargerDonnees = async () => {
      setChargement(true);

      await Promise.all([
        chargerVignettes(),
        chargerVehicules(),
      ]);

      setChargement(false);
    };

    chargerDonnees();
  }, []);

  const viderFormulaire = () => {
    setNumeroVignette("");
    setVehiculeId("");
    setDateDelivrance("");
    setDateExpiration("");
    setStatut("valide");

    setVignetteModifieeId(null);
    setModeModification(false);
  };

  const ajouterVignette = async (event) => {
    event.preventDefault();

    setErreur("");
    setMessage("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8001/api/vignettes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
        throw new Error(
          data.message ||
            "Erreur lors de l'ajout de la vignette."
        );
      }

      setVignettes([...vignettes, data]);

      viderFormulaire();
      setAfficherFormulaire(false);

      setMessage(
        "Vignette ajoutée avec succès."
      );
    } catch (error) {
      setErreur(error.message);
    }
  };

  const preparerModification = (vignette) => {
    setNumeroVignette(
      vignette.numero_vignette
    );

    setVehiculeId(
      String(vignette.vehicule_id)
    );

    setDateDelivrance(
      vignette.date_delivrance
    );

    setDateExpiration(
      vignette.date_expiration
    );

    setStatut(vignette.statut);

    setVignetteModifieeId(vignette.id);
    setModeModification(true);
    setAfficherFormulaire(true);

    setErreur("");
    setMessage("");
  };

  const modifierVignette = async (event) => {
    event.preventDefault();

    setErreur("");
    setMessage("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8001/api/vignettes/${vignetteModifieeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
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
        throw new Error(
          data.message ||
            "Erreur lors de la modification."
        );
      }

      setVignettes(
        vignettes.map((vignette) =>
          vignette.id === vignetteModifieeId
            ? data
            : vignette
        )
      );

      viderFormulaire();
      setAfficherFormulaire(false);

      setMessage(
        "Vignette modifiée avec succès."
      );
    } catch (error) {
      setErreur(error.message);
    }
  };

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
        `http://127.0.0.1:8001/api/vignettes/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible de supprimer la vignette."
        );
      }

      setVignettes(
        vignettes.filter(
          (vignette) =>
            vignette.id !== id
        )
      );

      setMessage(
        "Vignette supprimée avec succès."
      );
    } catch (error) {
      setErreur(error.message);
    }
  };

  const annulerModification = () => {
    viderFormulaire();
    setAfficherFormulaire(false);
    setErreur("");
    setMessage("");
  };

  return (
    <div className="vignettes-page">
      <h1>Gestion des vignettes</h1>

      <button
        type="button"
        onClick={() => {
          viderFormulaire();

          setAfficherFormulaire(
            !afficherFormulaire
          );

          setErreur("");
          setMessage("");
        }}
      >
        {afficherFormulaire
          ? "Fermer le formulaire"
          : "Ajouter une vignette"}
      </button>

      {message && (
        <p>{message}</p>
      )}

      {erreur && (
        <p>{erreur}</p>
      )}

      {afficherFormulaire && (
        <section>
          <h2>
            {modeModification
              ? "Modifier une vignette"
              : "Nouvelle vignette"}
          </h2>

          <form
            onSubmit={
              modeModification
                ? modifierVignette
                : ajouterVignette
            }
          >
            <div>
              <label htmlFor="numero_vignette">
                Numéro de vignette
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
                placeholder="Ex : VG-2026-00003"
                required
              />
            </div>

            <div>
              <label htmlFor="vehicule_id">
                Véhicule
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
                  Sélectionner un véhicule
                </option>

                {vehicules.map((vehicule) => (
                  <option
                    key={vehicule.id}
                    value={vehicule.id}
                  >
                    {vehicule.plaque} -{" "}
                    {vehicule.type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="date_delivrance">
                Date de délivrance
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

            <div>
              <label htmlFor="date_expiration">
                Date d'expiration
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

            <div>
              <label htmlFor="statut">
                Statut
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

            <button type="submit">
              {modeModification
                ? "Enregistrer la modification"
                : "Enregistrer"}
            </button>

            {modeModification && (
              <button
                type="button"
                onClick={annulerModification}
              >
                Annuler
              </button>
            )}
          </form>
        </section>
      )}

      <section>
        <h2>Liste des vignettes</h2>

        {chargement && (
          <p>
            Chargement des vignettes...
          </p>
        )}

        {!chargement && !erreur && (
          <>
            <table>
              <thead>
                <tr>
                  <th>Numéro</th>
                  <th>Plaque</th>
                  <th>Date de début</th>
                  <th>Date d'expiration</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {vignettes.map((vignette) => (
                  <tr key={vignette.id}>
                    <td>
                      {vignette.numero_vignette}
                    </td>

                    <td>
                      {vignette.vehicule
                        ? vignette.vehicule.plaque
                        : "-"}
                    </td>

                    <td>
                      {vignette.date_delivrance}
                    </td>

                    <td>
                      {vignette.date_expiration}
                    </td>

                    <td>
                      {vignette.statut}
                    </td>

                    <td>
                      <button
                        type="button"
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
                        onClick={() =>
                          supprimerVignette(
                            vignette.id
                          )
                        }
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {vignettes.length === 0 && (
              <p>
                Aucune vignette enregistrée.
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default Vignettes;