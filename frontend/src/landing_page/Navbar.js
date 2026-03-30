import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  return (
    <>
      <nav className="navbar-main">
        {/* LEFT - LOGO */}
        <div className="nav-left">
          <Link to="/" className="logo-container">
            <span className="logo-icon">📈</span>
            <span className="logo-text">InsightTrade</span>
          </Link>
        </div>

        {/* CENTER - LINKS */}
        <ul className="nav-center">
          {[
            { name: "About", path: "/about" },
            { name: "Support", path: "/support" },
            { name: "Products", path: "/products" },
          ].map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={location.pathname === item.path ? "active" : ""}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* RIGHT - ACTIONS */}
        <div className="nav-right">
          <Link to="/login" className="login-link-simple">Login</Link>
          <Link to="/signup" className="signup-cta">Open Account</Link>
          <div className="mobile-menu-icon">
            <i className="fa-solid fa-bars"></i>
          </div>
        </div>
      </nav>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .navbar-main {
          position: sticky;
          top: 0;
          z-index: 1000;
          height: 72px; /* Standard professional height */
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 5%;
          font-family: 'Inter', sans-serif;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .logo-icon { font-size: 1.5rem; }

        .logo-text {
          font-size: 1.25rem;
          font-weight: 800;
          color: #1e293b;
          letter-spacing: -0.025em;
        }

        .nav-center {
          display: flex;
          gap: 40px; /* Reduced from 120px for a tighter look */
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-center a {
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          color: #64748b;
          transition: all 0.2s ease;
        }

        .nav-center a:hover, .nav-center a.active {
          color: #1e293b;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .login-link-simple {
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 600;
          color: #64748b;
          transition: color 0.2s;
        }

        .login-link-simple:hover { color: #1e293b; }

        .signup-cta {
          text-decoration: none;
          background: #1e293b;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 0.2s;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .signup-cta:hover {
          background: #334155;
          transform: translateY(-1px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .mobile-menu-icon {
          display: none;
          font-size: 1.2rem;
          cursor: pointer;
        }

        /* 📱 Mobile Responsiveness */
        @media (max-width: 900px) {
          .nav-center { display: none; }
          .mobile-menu-icon { display: block; }
          .login-link-simple { display: none; }
        }
      `}</style>
    </>
  );
}

export default Navbar;