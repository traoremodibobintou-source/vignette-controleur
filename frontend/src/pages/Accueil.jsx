import { useNavigate } from "react-router-dom";

function Accueil() {
  const navigate = useNavigate();

  return (
    <div className="accueil-page">

      {/* HERO */}
      <section className="accueil-hero">
        <div className="hero-left">
          <span className="hero-badge">
            🛡️ Plateforme de contrôle
          </span>

          <h1>
            Vignette
            <span> Contrôleur</span>
          </h1>

          <p className="hero-text">
            Une plateforme simple et rapide pour vérifier les
            véhicules, les vignettes et les informations de leurs
            propriétaires.
          </p>

          <p className="hero-subtext">
            Recherchez un véhicule à partir de son numéro de plaque
            ou de son numéro de vignette.
          </p>

          <div className="hero-buttons">
            <button
              type="button"
              className="accueil-primary-button"
              onClick={() => navigate("/recherche")}
            >
              🔎 Rechercher un véhicule
              <span>→</span>
            </button>

            <button
              type="button"
              className="accueil-secondary-button"
              onClick={() => navigate("/dashboard-controleur")}
            >
              📊 Tableau de bord
            </button>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-shield">
            🛡️
          </div>

          <div className="hero-card">
            <div className="hero-card-icon">✓</div>
            <div>
              <strong>Contrôle rapide</strong>
              <p>Vérification des données du véhicule</p>
            </div>
          </div>

          <div className="hero-card hero-card-small">
            <div className="hero-card-icon">🎫</div>
            <div>
              <strong>Vignette</strong>
              <p>Validité vérifiable</p>
            </div>
          </div>
        </div>
      </section>


      {/* RECHERCHE RAPIDE */}
      <section className="accueil-search-section">
        <div className="section-title">
          <span>🔎</span>
          <div>
            <h2>Recherche rapide</h2>
            <p>
              Vérifiez rapidement les informations d'un véhicule.
            </p>
          </div>
        </div>

        <div className="search-options">

          <button
            type="button"
            className="search-option-card"
            onClick={() => navigate("/recherche")}
          >
            <div className="search-option-icon">
              🚗
            </div>

            <div>
              <h3>Par numéro de plaque</h3>
              <p>
                Recherchez un véhicule grâce à son numéro
                d'immatriculation.
              </p>
            </div>

            <span className="card-arrow">→</span>
          </button>


          <button
            type="button"
            className="search-option-card"
            onClick={() => navigate("/recherche")}
          >
            <div className="search-option-icon">
              🎫
            </div>

            <div>
              <h3>Par numéro de vignette</h3>
              <p>
                Vérifiez une vignette et retrouvez le véhicule
                associé.
              </p>
            </div>

            <span className="card-arrow">→</span>
          </button>

        </div>
      </section>


      {/* FONCTIONNALITÉS */}
      <section className="accueil-features">

        <div className="section-heading-center">
          <span className="section-label">
            Fonctionnalités
          </span>

          <h2>
            Un contrôle simple et efficace
          </h2>

          <p>
            Toutes les informations essentielles réunies sur
            une seule plateforme.
          </p>
        </div>


        <div className="features-grid">

          <div className="feature-card-accueil">
            <div className="feature-icon blue">
              🔎
            </div>

            <h3>Recherche rapide</h3>

            <p>
              Retrouvez rapidement un véhicule à partir de son
              numéro de plaque ou de sa vignette.
            </p>
          </div>


          <div className="feature-card-accueil">
            <div className="feature-icon green">
              🚗
            </div>

            <h3>Informations du véhicule</h3>

            <p>
              Consultez les informations du véhicule et de son
              propriétaire.
            </p>
          </div>


          <div className="feature-card-accueil">
            <div className="feature-icon orange">
              🎫
            </div>

            <h3>Vérification de vignette</h3>

            <p>
              Vérifiez le numéro, la validité et le statut de
              la vignette.
            </p>
          </div>

        </div>
      </section>


      {/* SÉCURITÉ */}
      <section className="accueil-security">

        <div className="security-icon-large">
          🛡️
        </div>

        <div className="security-content">
          <span className="security-label">
            SÉCURITÉ
          </span>

          <h2>
            Contrôle sécurisé des informations
          </h2>

          <p>
            Les informations affichées sont récupérées depuis
            la base de données de la plateforme afin de permettre
            une vérification rapide et structurée.
          </p>
        </div>

      </section>

    </div>
  );
}

export default Accueil;