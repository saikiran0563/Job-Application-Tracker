
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">J</div>

          <div className="brand-text">
            <span className="brand-name">JobTrack</span>
            <span className="brand-tagline">Application Manager</span>
          </div>
        </Link>

        {user && (
          <>
            <nav className="navbar-links">
              <Link to="/" className="navbar-link">
                Dashboard
              </Link>
            </nav>

            <div className="navbar-profile">
              <div className="profile-avatar">
                {(user.name || user.email || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="profile-info">
                <span className="profile-name">
                  {user.name || "User"}
                </span>
                <span className="profile-role">
                  {user.email}
                </span>
              </div>

              <button
                type="button"
                className="navbar-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
