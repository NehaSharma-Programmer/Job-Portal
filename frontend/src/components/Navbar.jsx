import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isCurrent = (path) => location.pathname === path;

  return (
    <header className="app-navbar">
      <div className="nav-container">
        <Link to={user?.role === "recruiter" ? "/recruiter" : "/candidate/dashboard"} className="nav-brand">
          <div className="brand-logo-icon">J</div>
          <span className="brand-title">JobLane</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className={`nav-links ${mobileOpen ? "open" : ""}`}>
          {!token ? (
            <>
              <Link
                to="/login"
                className={`nav-link ${isCurrent("/login") ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="nav-btn-primary"
                onClick={() => setMobileOpen(false)}
              >
                Register
              </Link>
            </>
          ) : user?.role === "recruiter" ? (
            <>
              <Link
                to="/recruiter"
                className={`nav-link ${isCurrent("/recruiter") ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                📊 Dashboard
              </Link>
              <Link
                to="/recruiter/create-job"
                className={`nav-link ${isCurrent("/recruiter/create-job") ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                ➕ Post Job
              </Link>
              <Link
                to="/profile"
                className={`nav-link ${isCurrent("/profile") ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                👤 Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/candidate/dashboard"
                className={`nav-link ${isCurrent("/candidate/dashboard") ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                💼 Jobs
              </Link>
              <Link
                to="/profile"
                className={`nav-link ${isCurrent("/profile") ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                👤 My Profile
              </Link>
            </>
          )}

          <div className="nav-controls">
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            {token && (
              <button className="nav-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
