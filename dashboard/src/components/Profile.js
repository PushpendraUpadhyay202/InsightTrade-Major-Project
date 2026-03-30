import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [trades, setTrades] = useState([]); // Dynamic trade storage
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      // Parallel fetch for user info and trade history
      Promise.all([
        axios.get(`http://localhost:3002/userDetails/${userId}`),
        axios.get(`http://localhost:3002/allOrders/${userId}`) // Fetching actual trades
      ])
        .then(([userRes, tradesRes]) => {
          setUserData(userRes.data);
          setTrades(tradesRes.data);
        })
        .catch((err) => console.error("Error loading profile data", err));
    }
  }, [userId]);

  if (!userData) return <div style={styles.loader}>🔐 Initializing Secure Profile...</div>;

  // --- DYNAMIC ANALYTICS LOGIC ---
  const initialCapital = 1000000; // Starting virtual cash (10L)
  const currentBalance = Number(userData.balance);
  const careerProfit = currentBalance - initialCapital;
  
  // Calculate Actual Accuracy based on trades
  const totalTrades = trades.length;
  const winningTrades = trades.filter(t => Number(t.pnl) > 0).length;
  const accuracy = totalTrades > 0 ? ((winningTrades / totalTrades) * 100).toFixed(1) : 0;

  // Dynamic Badge Logic
  const getBadge = () => {
    if (totalTrades === 0) return "🐣 New Recruit";
    if (careerProfit > 50000) return "💎 Market Maverick";
    if (careerProfit > 0) return "📈 Rising Trader";
    return "📚 Learning Mode";
  };

  return (
    <div className="animate-entry" style={styles.viewContainer}>
      <div className="bento-card" style={styles.profileCard}>
        
        {/* === 1. USER IDENTITY & STATUS === */}
        <div style={styles.headerSection}>
          <div style={styles.userAvatar}>
            {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div style={styles.userMeta}>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <h2 style={styles.userName}>{userData.name || "Executive Investor"}</h2>
              <span style={styles.statusDot} />
            </div>
            <p style={styles.userEmail}>{userData.email}</p>
            <div style={styles.badgeRow}>
              <span style={styles.segmentBadge}>{getBadge()}</span>
              <span style={styles.verifiedTick}>KYC Verified</span>
            </div>
          </div>
        </div>

        {/* === 2. CAREER ANALYTICS BENTO GRID === */}
        <div style={styles.summaryGrid}>
          {/* Main Liquidity Card */}
          <div className="bento-card" style={{ ...styles.summaryItem, gridColumn: "span 2", background: "#1e293b" }}>
            <span style={{...styles.statLabel, color: "rgba(255,255,255,0.5)"}}>Total Buying Power</span>
            <strong style={{...styles.statValueFunds, color: "#fff"}}>
              ₹{currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </strong>
            <div style={styles.progressContainer}>
                <div style={{...styles.progressFill, width: totalTrades > 0 ? '70%' : '5%'}} />
            </div>
          </div>

          {/* Career Profit/Loss */}
          <div className="bento-card" style={styles.summaryItem}>
            <span style={styles.statLabel}>Career Net P&L</span>
            <strong style={{...styles.statValuePnl, color: careerProfit >= 0 ? "#10b981" : "#ef4444"}}>
              {careerProfit >= 0 ? "+" : ""}₹{careerProfit.toLocaleString('en-IN')}
            </strong>
            <p style={styles.microText}>{totalTrades > 0 ? "Since Inception" : "No Trades Yet"}</p>
          </div>

          {/* Win Rate / Accuracy */}
          <div className="bento-card" style={styles.summaryItem}>
            <span style={styles.statLabel}>Trade Accuracy</span>
            <strong style={styles.statValue}>{totalTrades > 0 ? `${accuracy}%` : "0%"}</strong>
            <p style={styles.microText}>{totalTrades} Total Trades</p>
          </div>
        </div>

        {/* === 3. THE COACH INSIGHT === */}
        <div style={styles.insightBox}>
            <div style={styles.insightHeader}>
                <span style={{fontSize: '14px'}}>💡</span>
                <span style={styles.insightTitle}>PERFORMANCE TIP</span>
            </div>
            <p style={styles.insightText}>
                {totalTrades === 0 
                  ? "Welcome to the terminal! To start building your 'Accuracy' score, head over to the market and pick your first asset. Remember: Focus on learning, not just earning."
                  : (careerProfit >= 0 
                    ? "Your capital is growing. Focus on 'Position Sizing' now—don't risk more than 2% of your buying power on a single trade to protect these gains."
                    : "Every master was once a beginner. Focus on 'Square Off' discipline. Even a small loss is better than a big one. Keep your capital safe!")
                }
            </p>
        </div>

        {/* === 4. COMPLIANCE & TERMINAL DETAILS === */}
        <div style={styles.detailsBox}>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Terminal ID</span>
            <strong style={styles.detailValue}>#UCC-{userId ? userId.slice(-6).toUpperCase() : "PRO-X"}</strong>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Experience Level</span>
            <strong style={styles.detailValue}>
                {totalTrades > 20 ? "Advanced" : (totalTrades > 0 ? "Intermediate" : "Novice")}
            </strong>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Nominee</span>
            <strong style={styles.detailValue}>Registered</strong>
          </div>
        </div>

        <div style={styles.footer}>
          <p style={styles.membershipFooter}>System Member Since March 2026</p>
          <div style={styles.footerLine} />
        </div>
      </div>
    </div>
  );
};

/* ============================ STYLES ============================ */
const styles = {
  viewContainer: { display: "flex", justifyContent: "center", padding: "40px 20px" },
  profileCard: { width: "100%", maxWidth: "580px", padding: "50px", background: '#fff', borderRadius: '32px', boxShadow: '0 10px 50px rgba(0,0,0,0.05)' },
  headerSection: { display: "flex", alignItems: "center", gap: "30px", marginBottom: "45px" },
  userAvatar: { 
    width: "100px", height: "100px", borderRadius: "30px", 
    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", 
    fontSize: "42px", fontWeight: "800", boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
  },
  userMeta: { display: "flex", flexDirection: "column", gap: "6px" },
  userName: { fontSize: "28px", color: "#1e293b", fontWeight: "800", margin: 0, letterSpacing: "-0.03em" },
  statusDot: { width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 10px #10b981" },
  userEmail: { color: "#64748b", margin: 0, fontSize: "14px", fontWeight: "500" },
  badgeRow: { display: "flex", gap: "10px", marginTop: "8px" },
  segmentBadge: { backgroundColor: "#f1f5f9", color: "#475569", padding: "4px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" },
  verifiedTick: { backgroundColor: "rgba(52, 199, 89, 0.08)", color: "#10b981", padding: "4px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" },
  
  summaryGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" },
  summaryItem: { padding: "25px", border: "1px solid #f1f5f9", borderRadius: '24px' },
  statLabel: { color: "#94a3b8", fontSize: "10px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px", display: "block" },
  statValue: { fontSize: "20px", color: "#1e293b", fontWeight: "800" },
  statValueFunds: { fontSize: "32px", fontWeight: "900", letterSpacing: "-0.04em" },
  statValuePnl: { fontSize: "20px", fontWeight: "800" },
  microText: { fontSize: '10px', color: '#cbd5e1', marginTop: '4px', fontWeight: '600', textTransform: 'uppercase' },
  
  progressContainer: { marginTop: '10px', height: '4px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' },
  progressFill: { height: '100%', background: '#38bdf8', borderRadius: '2px', transition: 'width 1s ease' },

  insightBox: { background: "#f8fafc", padding: "20px", borderRadius: "16px", marginBottom: "40px", border: "1px solid #e2e8f0" },
  insightHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' },
  insightTitle: { fontSize: '11px', fontWeight: '800', color: '#64748b', letterSpacing: '0.05em' },
  insightText: { fontSize: '13px', color: '#475569', lineHeight: '1.5', margin: 0, fontWeight: '500' },

  detailsBox: { borderTop: "1px solid #f1f5f9", paddingTop: "35px" },
  detailRow: { display: "flex", justifyContent: "space-between", marginBottom: "20px" },
  detailLabel: { color: "#64748b", fontSize: "14px", fontWeight: "500" },
  detailValue: { color: "#1e293b", fontWeight: "700", fontSize: "14px" },
  
  footer: { textAlign: "center", marginTop: "30px" },
  membershipFooter: { fontSize: "10px", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.2em", margin: 0 },
  footerLine: { height: "2px", width: "40px", background: "#38bdf8", margin: "15px auto 0", borderRadius: "2px" },
  loader: { textAlign: "center", padding: "100px", color: "#64748b", fontWeight: "600", fontSize: "14px" },
};

export default Profile;