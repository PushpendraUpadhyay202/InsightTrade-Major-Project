import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Menu = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const username = localStorage.getItem("loggedInUser") || "User";

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const idFromUrl = queryParams.get("userId");
    const nameFromUrl = queryParams.get("userName");

    if (idFromUrl) {
      localStorage.setItem("userId", idFromUrl);
      localStorage.setItem("loggedInUser", nameFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "http://localhost:3000/login";
  };

  const menus = [
    { name: "Dashboard", path: "/" },
    { name: "Orders", path: "/orders" },
    { name: "Holdings", path: "/holdings" },
    { name: "Positions", path: "/positions" },
    { name: "Funds", path: "/funds" },
  ];

  return (
    <div style={styles.menuWrapper}>
      {/* NAVIGATION LINKS */}
      <nav>
        <ul style={styles.menuList}>
          {menus.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={index}>
                <Link
                  to={item.path}
                  style={{
                    ...styles.menuItem,
                    ...(isActive ? styles.menuActive : {}),
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.target.style.color = "var(--text-main)";
                    if (!isActive) e.target.style.backgroundColor = "rgba(0,0,0,0.03)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.target.style.color = "var(--text-muted)";
                    if (!isActive) e.target.style.backgroundColor = "transparent";
                  }}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* PROFILE SECTION */}
      <div style={styles.profileWrapper} ref={dropdownRef}>
        <div
          style={styles.profile}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div style={styles.avatar}>
            {username.charAt(0).toUpperCase()}
          </div>
          <span style={styles.username}>{username}</span>
          <span style={styles.chevron}>{showDropdown ? "▴" : "▾"}</span>
        </div>

        {/* GLASS DROPDOWN */}
        {showDropdown && (
          <div className="animate-entry" style={styles.dropdown}>
            <div
              style={styles.dropdownItem}
              onClick={() => {
                navigate("/profile");
                setShowDropdown(false);
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#f8fafc"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
            >
              <span style={{ fontSize: "16px" }}>👤</span>
              <span>Account Profile</span>
            </div>
            
            <div style={styles.divider} />
            
            <div
              style={{ ...styles.dropdownItem, color: "var(--accent-red)" }}
              onClick={handleLogout}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#fff1f2"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
            >
              <span style={{ fontSize: "16px" }}>⎋</span>
              <span style={{ fontWeight: "600" }}>Sign Out</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ===================== EXTREME STYLES ===================== */

const styles = {
  menuWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "40px",
  },
  menuList: {
    display: "flex",
    listStyle: "none",
    gap: "8px", // Tight gap for pill-style buttons
    margin: 0,
    padding: 0,
    alignItems: "center",
  },
  menuItem: {
    textDecoration: "none",
    fontSize: "13px",
    color: "var(--text-muted)",
    padding: "8px 16px",
    borderRadius: "20px", // Pill shape
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fontWeight: "500",
    letterSpacing: "-0.01em",
  },
  menuActive: {
    color: "var(--accent-blue)",
    backgroundColor: "rgba(0, 71, 255, 0.06)",
    fontWeight: "600",
  },
  profileWrapper: {
    position: "relative",
    paddingLeft: "20px",
    borderLeft: "1px solid rgba(0,0,0,0.06)",
  },
  profile: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    padding: "6px 12px",
    borderRadius: "12px",
    transition: "background 0.2s ease",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "10px", // Modern squircle instead of circle
    background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  username: {
    fontSize: "14px",
    color: "var(--text-main)",
    fontWeight: "600",
    letterSpacing: "-0.02em",
  },
  chevron: {
    fontSize: "10px",
    color: "var(--text-muted)",
  },
  dropdown: {
    position: "absolute",
    top: "55px",
    right: 0,
    width: "200px",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "16px",
    boxShadow: "var(--shadow-float)",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    padding: "8px",
    zIndex: 3000,
  },
  dropdownItem: {
    padding: "12px 14px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    color: "var(--text-main)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderRadius: "10px",
    transition: "all 0.2s ease",
  },
  divider: {
    height: "1px",
    backgroundColor: "rgba(0,0,0,0.04)",
    margin: "8px 0",
  }
};

export default Menu;