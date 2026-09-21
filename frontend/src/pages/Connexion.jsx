import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Connexion() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErreur("");
    setChargement(true);

    try {
     const response = await fetch("https://vignette-controleur.onrender.com/api/login", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErreur(data.message || "Email ou mot de passe incorrect.");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        navigate("/dashboard-admin");
      } else if (data.user.role === "controleur") {
        navigate("/dashboard-controleur");
      } else {
        setErreur("Rôle utilisateur non reconnu.");
      }
    } catch (error) {
      setErreur("Impossible de contacter le serveur.");
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="connexion-page">
      <div className="connexion-card">

        <div className="connexion-header">
          <div className="connexion-logo">🛡️</div>

          <h1>VIGNETTE CONTRÔLEUR</h1>

          <p>Connexion à votre espace</p>
        </div>

        {erreur && (
          <div className="alert alert-error">
            {erreur}
          </div>
        )}

        <form onSubmit={handleSubmit} className="connexion-form">

          <div className="connexion-field">
            <label htmlFor="email">Email</label>

            <input
              type="email"
              id="email"
              name="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="connexion-field">
            <label htmlFor="password">Mot de passe</label>

            <input
              type="password"
              id="password"
              name="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="connexion-button"
            disabled={chargement}
          >
            {chargement ? "Connexion..." : "SE CONNECTER"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default Connexion;
