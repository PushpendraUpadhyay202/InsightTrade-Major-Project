import React, { useState, useEffect } from "react";
import Menu from "./Menu";

const TopBar = () => {
  // 1. Initial State for Indices
  const [indices, setIndices] = useState({
    nifty: { points: 22011.95, change: -0.73 },
    sensex: { points: 72643.43, change: -0.81 }
  });

  // 2. Market Simulation Logic
  useEffect(() => {
    const tick = () => {
      setIndices(prev => {
        // Random fluctuation between -0.05% and +0.05%
        const niftyMove = (Math.random() - 0.5) * 15; 
        const sensexMove = (Math.random() - 0.5) * 50;

        const newNifty = prev.nifty.points + niftyMove;
        const newSensex = prev.sensex.points + sensexMove;

        return {
          nifty: { 
            points: newNifty, 
            change: ((newNifty - 22011.95) / 22011.95) * 100 
          },
          sensex: { 
            points: newSensex, 
            change: ((newSensex - 72643.43) / 72643.43) * 100 
          }
        };
      });
    };

    const interval = setInterval(tick, 3000); // Updates every 3 seconds
    return () => clearInterval(interval);
  }, []);

  // Helper for dynamic colors
  const getColor = (val) => (val >= 0 ? "#10b981" : "#e11d48");

  return (
    <header className="glass-header" style={styles.topbarContainer}>
      <div style={styles.indicesContainer}>
        
        {/* NIFTY 50 */}
        <div style={styles.indexGroup}>
          <span style={styles.indexLabel}>NIFTY 50</span>
          <div style={styles.valueWrapper}>
            <span className="data-number" style={{...styles.indexPoints, color: getColor(indices.nifty.change)}}>
              {indices.nifty.points.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span style={{...styles.indexPercent, color: getColor(indices.nifty.change)}}>
              {indices.nifty.change >= 0 ? "+" : ""}{indices.nifty.change.toFixed(2)}%
            </span>
          </div>
        </div>

        <div style={styles.verticalDivider} />

        {/* SENSEX */}
        <div style={styles.indexGroup}>
          <span style={styles.indexLabel}>SENSEX</span>
          <div style={styles.valueWrapper}>
            <span className="data-number" style={{...styles.indexPoints, color: getColor(indices.sensex.change)}}>
              {indices.sensex.points.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span style={{...styles.indexPercent, color: getColor(indices.sensex.change)}}>
              {indices.sensex.change >= 0 ? "+" : ""}{indices.sensex.change.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <div style={styles.menuSection}>
        <Menu />
      </div>
    </header>
  );
};

const styles = {
  topbarContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 40px",
    height: "64px",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2000,
    width: "100%", 
    boxSizing: "border-box",
  },
  indicesContainer: { 
    display: "flex", 
    alignItems: "center",
    gap: "30px" 
  },
  indexGroup: { 
    display: "flex", 
    flexDirection: "column", 
    gap: "2px",
    minWidth: "120px" // Prevents layout shift when numbers change
  },
  valueWrapper: {
    display: "flex",
    alignItems: "baseline",
    gap: "8px"
  },
  indexLabel: { 
    fontSize: "10px", 
    fontWeight: "800", 
    color: "#94a3b8",
    letterSpacing: "0.1em", 
    textTransform: "uppercase"
  },
  indexPoints: { 
    fontSize: "15px", 
    fontWeight: "600",
    letterSpacing: "-0.02em",
    transition: "color 0.3s ease" // Smooth color transition
  },
  indexPercent: { 
    fontSize: "11px", 
    fontWeight: "600",
    opacity: 0.8,
    transition: "color 0.3s ease"
  },
  verticalDivider: {
    height: "24px",
    width: "1px",
    backgroundColor: "rgba(0, 0, 0, 0.06)"
  },
  menuSection: { 
    flex: 1, 
    display: "flex", 
    justifyContent: "flex-end",
    alignItems: "center"
  }
};

export default TopBar;