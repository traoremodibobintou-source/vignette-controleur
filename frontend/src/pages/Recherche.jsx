import { useState } from "react";

function Recherche() {
  const API_URL = "https://vignette-controleur.onrender.com/api";

  const [mode, setMode] = useState("plaque");
  const [valeur, setValeur] = useState("");
  const [resultat, setResultat] = useState(null);
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  const rechercher = async (e) => {
    e.preventDefault();

    setErreur("");
    setResultat(null);
    setChargement(true);

    try {
      let url;

      if (mode === "plaque") {
        url = `${API_URL}/vehicules/search?plaque=${encodeURIComponent(
          valeur
        )}`;
      } else {
        url = `${API_URL}/vignettes/search?number=${encodeURIComponent(
          valeur
        )}`;
      }

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Aucun résultat trouvé.");
      }

      setResultat(data);
    } catch (error) {
      setErreur(error.message);
    } finally {
      setChargement(false);
    }
  };

  const changerMode = (nouveauMode) => {
    setMode(nouveauMode);
    setValeur("");
    setResultat(null);
    setErreur("");
  };

  const statutVol = (statut) => {
    if (statut === "signale") {
      return (
        <span className="status-badge status-danger">
          ⚠ Véhicule signalé
        </span>
      );
    }

    return (
      <span className="status-badge status-success">
        ✓ Aucun vol signalé
      </span>
    );
  };

  return (
    <div className="recherche-page">
      <div className="page-header">
        <div>
          <h1>Recherche</h1>

          <p>
            Vérifiez rapidement les informations d'un véhicule ou d'une
            vignette.
          </p>
        </div>
      </div>

      <section className="search-card">
        <div className="search-tabs">
          <button
            type="button"
            className={
              mode === "plaque" ? "search-tab active" : "search-tab"
            }
            onClick={() => changerMode("plaque")}
          >
            🔎 Par numéro de plaque
          </button>

          <button
            type="button"
            className={
              mode === "vignette" ? "search-tab active" : "search-tab"
            }
            onClick={() => changerMode("vignette")}
          >
            🎫 Par numéro de vignette
          </button>
        </div>

        <form onSubmit={rechercher} className="search-form">
          <div className="search-field">
            <label htmlFor="recherche">
              {mode === "plaque"
                ? "Numéro de plaque"
                : "Numéro de vignette"}
            </label>

            <input
              type="text"
              id="recherche"
              value={valeur}
              onChange={(e) => setValeur(e.target.value)}
              placeholder={
                mode === "plaque"
                  ? "Ex : AB1234MD"
                  : "Ex : VG-2026-00001"
              }
              required
            />
          </div>

          <button
            type="submit"
            className="search-button"
            disabled={chargement}
          >
            {chargement ? "Recherche..." : "Rechercher"}
          </button>
        </form>

        {erreur && (
          <div className="error-message">
            ⚠ {erreur}
          </div>
        )}
      </section>

      {resultat && (
        <section className="result-section">
          <div className="result-header">
            <div>
              <h2>Résultat de la recherche</h2>
              <p>Informations trouvées dans la base de données.</p>
            </div>
          </div>

          {mode === "plaque" ? (
            <div className="result-grid">
              <div className="info-card main-info">
                <div className="info-card-title">
                  <span>🚗</span>
                  <h3>Véhicule</h3>
                </div>

                <div className="info-row highlight">
                  <span>Numéro de plaque</span>
                  <strong>{resultat.plaque}</strong>
                </div>

                <div className="info-row">
                  <span>Type</span>
                  <strong>{resultat.type}</strong>
                </div>

                <div className="info-row">
                  <span>Marque</span>
                  <strong>
                    {resultat.marque || "Non renseignée"}
                  </strong>
                </div>

                <div className="info-row">
                  <span>Modèle</span>
                  <strong>
                    {resultat.modele || "Non renseigné"}
                  </strong>
                </div>

                <div className="info-row">
                  <span>Couleur</span>
                  <strong>
                    {resultat.couleur || "Non renseignée"}
                  </strong>
                </div>

                <div className="info-row">
                  <span>Année</span>
                  <strong>
                    {resultat.annee || "Non renseignée"}
                  </strong>
                </div>

                <div className="vehicle-status">
                  {statutVol(resultat.statut_vol)}
                </div>
              </div>

              <div className="info-card">
                <div className="info-card-title">
                  <span>👤</span>
                  <h3>Propriétaire</h3>
                </div>

                <div className="owner-name">
                  {resultat.proprietaire?.prenom}{" "}
                  {resultat.proprietaire?.nom}
                </div>

                <div className="info-row">
                  <span>Téléphone</span>
                  <strong>
                    {resultat.proprietaire?.telephone ||
                      "Non renseigné"}
                  </strong>
                </div>

                <div className="info-row">
                  <span>Adresse</span>
                  <strong>
                    {resultat.proprietaire?.adresse ||
                      "Non renseignée"}
                  </strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="result-grid">
              <div className="info-card main-info">
                <div className="info-card-title">
                  <span>🎫</span>
                  <h3>Vignette</h3>
                </div>

                <div className="info-row highlight">
                  <span>Numéro de vignette</span>
                  <strong>{resultat.numero_vignette}</strong>
                </div>

                <div className="info-row">
                  <span>Statut</span>
                  <strong>{resultat.statut}</strong>
                </div>

                <div className="info-row">
                  <span>Date de délivrance</span>
                  <strong>{resultat.date_delivrance}</strong>
                </div>

                <div className="info-row">
                  <span>Date d'expiration</span>
                  <strong>{resultat.date_expiration}</strong>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card-title">
                  <span>🚗</span>
                  <h3>Véhicule associé</h3>
                </div>

                <div className="info-row highlight">
                  <span>Numéro de plaque</span>
                  <strong>{resultat.vehicule?.plaque}</strong>
                </div>

                <div className="info-row">
                  <span>Type</span>
                  <strong>{resultat.vehicule?.type}</strong>
                </div>

                <div className="info-row">
                  <span>Marque</span>
                  <strong>
                    {resultat.vehicule?.marque ||
                      "Non renseignée"}
                  </strong>
                </div>

                <div className="owner-block">
                  <h4>Propriétaire</h4>

                  <p>
                    {resultat.vehicule?.proprietaire?.prenom}{" "}
                    {resultat.vehicule?.proprietaire?.nom}
                  </p>

                  <p>
                    Téléphone :{" "}
                    {resultat.vehicule?.proprietaire?.telephone ||
                      "Non renseigné"}
                  </p>
                </div>

                <div className="vehicle-status">
                  {statutVol(resultat.vehicule?.statut_vol)}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      <style>{`
        .recherche-page {
          width: 100%;
        }

        .page-header {
          margin-bottom: 25px;
        }

        .page-header h1 {
          margin-bottom: 6px;
        }

        .page-header p {
          margin: 0;
        }

        .search-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 24px;
          box-shadow: 0 3px 12px rgba(15, 23, 42, 0.06);
        }

        .search-tabs {
          display: flex;
          gap: 8px;
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 22px;
        }

        .search-tab {
          background: transparent !important;
          color: #64748b !important;
          border-radius: 8px 8px 0 0 !important;
          margin: 0 !important;
          padding: 12px 18px !important;
          font-weight: 600;
        }

        .search-tab:hover {
          background: #eff6ff !important;
          color: #2563eb !important;
        }

        .search-tab.active {
          background: #2563eb !important;
          color: #ffffff !important;
        }

        .search-form {
          display: flex;
          align-items: flex-end;
          gap: 15px;
        }

        .search-field {
          flex: 1;
        }

        .search-field label {
          display: block;
          color: #334155;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 7px;
        }

        .search-field input {
          max-width: none !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 13px 14px !important;
        }

        .search-button {
          min-width: 140px;
          height: 44px;
          margin: 0 !important;
        }

        .error-message {
          margin-top: 18px;
          padding: 13px 15px;
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
          border-radius: 8px;
        }

        .result-section {
          margin-top: 28px;
        }

        .result-header {
          margin-bottom: 15px;
        }

        .result-header h2 {
          margin-bottom: 4px;
        }

        .result-header p {
          margin: 0;
        }

        .result-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .info-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 22px;
          box-shadow: 0 3px 12px rgba(15, 23, 42, 0.06);
        }

        .info-card-title {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-bottom: 15px;
          margin-bottom: 4px;
          border-bottom: 1px solid #e2e8f0;
        }

        .info-card-title span {
          font-size: 22px;
        }

        .info-card-title h3 {
          margin: 0;
          color: #0f172a;
          font-size: 19px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 12px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .info-row span {
          color: #64748b;
        }

        .info-row strong {
          color: #1e293b;
          text-align: right;
        }

        .info-row.highlight {
          background: #eff6ff;
          margin: 8px -10px;
          padding: 13px 10px;
          border-radius: 7px;
          border: none;
        }

        .info-row.highlight strong {
          color: #2563eb;
        }

        .owner-name {
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          margin: 18px 0;
        }

        .vehicle-status {
          margin-top: 18px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
        }

        .status-success {
          color: #166534;
          background: #dcfce7;
        }

        .status-danger {
          color: #991b1b;
          background: #fee2e2;
        }

        .owner-block {
          margin-top: 18px;
          padding: 14px;
          background: #f8fafc;
          border-radius: 8px;
        }

        .owner-block h4 {
          margin: 0 0 8px;
          color: #334155;
        }

        .owner-block p {
          margin: 5px 0;
          font-size: 14px;
        }

        @media (max-width: 800px) {
          .search-card {
            padding: 17px;
          }

          .search-tabs {
            flex-direction: column;
            border-bottom: none;
          }

          .search-tab {
            width: 100%;
            border-radius: 8px !important;
          }

          .search-form {
            flex-direction: column;
            align-items: stretch;
          }

          .search-button {
            width: 100%;
          }

          .result-grid {
            grid-template-columns: 1fr;
          }

          .info-row {
            flex-direction: column;
            gap: 4px;
          }

          .info-row strong {
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
}

export default Recherche;
