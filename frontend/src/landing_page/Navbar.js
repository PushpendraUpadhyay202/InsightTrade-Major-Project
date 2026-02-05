import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  return (
    <>
      <nav className="navbar-main">
        {/* LEFT - LOGO */}
        <div className="nav-left">
          <Link to="/">
            <img src="/images/logo" alt="InsightTrade" className="logo" />
          </Link>
        </div>

        {/* CENTER - LINKS */}
        <ul className="nav-center">
          {[
            { name: "Signup", path: "/signup" },
            { name: "About", path: "/about" },
            { name: "Support", path: "/support" },
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

        {/* RIGHT - ICON */}
        <div className="nav-right">
          <i className="fa-solid fa-bars"></i>
        </div>
      </nav>

      {/* 🌈 STYLING */}
      <style>{`
        .navbar-main {
          position: sticky;
          top: 0;
          z-index: 100;

          height: 90px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 80px;
          transition: all 0.3s ease;
        }

        .nav-left .logo {
          width: 130px;
          transition: transform 0.3s ease;
        }

        .nav-left .logo:hover {
          transform: scale(1.05);
        }

        .nav-center {
          display: flex;
          gap: 120px;
          list-style: none;
          margin: 29px;
          padding: 20px;
          padding-right: 102px;
        }

        .nav-center a {
          text-decoration: none;
          font-size: 1.1rem;
          font-weight: 500;
          color: #555;
          position: relative;
          padding-bottom: 6px;
          transition: color 0.3s ease;
        }

        .nav-center a::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 0%;
          height: 2px;
          background: linear-gradient(90deg, #387ed1, #6aa9ff);
          transition: width 0.3s ease;
          border-radius: 2px;
        }

        .nav-center a:hover {
          color: #000;
        }

        .nav-center a:hover::after {
          width: 100%;
        }

        .nav-center a.active {
          color: #387ed1;
        }

        .nav-center a.active::after {
          width: 100%;
        }

        .nav-right {
          font-size: 1.4rem;
          color: #444;
          cursor: pointer;
          padding: 10px;
          border-radius: 50%;
          transition: background 0.3s ease, transform 0.2s ease;
        }

        .nav-right:hover {
          background: rgba(0, 0, 0, 0.06);
          transform: rotate(90deg);
        }

        /* 📱 Mobile */
        @media (max-width: 768px) {
          .nav-center {
            display: none;
          }

          .navbar-main {
            padding: 0 24px;
          }
        }
      `}</style>
    </>
  );
}

export default Navbar;
