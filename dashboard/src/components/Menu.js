import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Get logged-in user name
  const username = localStorage.getItem("loggedInUser") || "User";

  // Close dropdown when clicking outside
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
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    // ✅ FIX: redirect to correct frontend
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
    <div style={styles.container}>
      {/* LEFT MENU */}
      <ul style={styles.menuList}>
        {menus.map((item, index) => (
          <li key={index}>
            <Link
              to={item.path}
              onClick={() => setSelectedMenu(index)}
              style={{
                ...styles.menuItem,
                ...(selectedMenu === index ? styles.menuActive : {}),
              }}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* RIGHT PROFILE */}
      <div style={styles.profileWrapper} ref={dropdownRef}>
        <div
          style={styles.profile}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div style={styles.avatar}>
            {username.charAt(0).toUpperCase()}
          </div>
          <span style={styles.username}>{username}</span>
        </div>

        {showDropdown && (
          <div style={styles.dropdown}>
            <div
              style={styles.dropdownItem}
              onClick={() => navigate("/profile")}
            >
              👤 Profile
            </div>
            <div
              style={{ ...styles.dropdownItem, color: "#e53935" }}
              onClick={handleLogout}
            >
              🚪 Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ===================== STYLES ===================== */

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 160px",
    height: "64px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    fontFamily: "Inter, system-ui, sans-serif",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },

  menuList: {
    display: "flex",
    listStyle: "none",
    gap: "40px",
    margin: 0,
    padding: 0,
  },

  menuItem: {
    textDecoration: "none",
    fontSize: "15px",
    color: "#475569",
    paddingBottom: "6px",
    transition: "all 0.2s ease",
  },

  menuActive: {
    color: "#ff5722",
    borderBottom: "2px solid #ff5722",
    fontWeight: 600,
  },

  profileWrapper: {
    position: "relative",
  },

  profile: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    cursor: "pointer",
    padding: "6px 10px",
    borderRadius: "8px",
    transition: "background 0.2s ease",
  },

  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #ff7043, #ff5722)",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  },

  username: {
    fontSize: "14px",
    color: "#1e293b",
    fontWeight: 500,
  },

  dropdown: {
    position: "absolute",
    top: "48px",
    right: 0,
    width: "160px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
    overflow: "hidden",
    zIndex: 999,
  },

  dropdownItem: {
    padding: "12px 14px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background 0.2s ease",
  },
};

export default Menu;
