import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, roles }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/connexion" replace />;
  }

  if (!roles.includes(user.role)) {
    if (user.role === "admin") {
      return <Navigate to="/dashboard-admin" replace />;
    }

    if (user.role === "controleur") {
      return <Navigate to="/dashboard-controleur" replace />;
    }

    return <Navigate to="/connexion" replace />;
  }

  return children;
}

export default ProtectedRoute;