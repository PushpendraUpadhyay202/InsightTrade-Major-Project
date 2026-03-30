import React, { useState, useEffect } from "react";
import axios from "axios";

const Funds = () => {
  const [funds, setFunds] = useState({ available: 0, used: 0, opening: 0 });
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState(""); 
  
  const userId = localStorage.getItem("userId");

  const fetchFundsData = async () => {
    if (!userId) return;
    try {
      const userRes = await axios.get(`http://localhost:3002/userDetails/${userId}`);
      const availableCash = Number(userRes.data.balance);

      const holdingsRes = await axios.get(`http://localhost:3002/allHoldings/${userId}`);
      let totalUsedMargin = 0;
      holdingsRes.data.forEach(stock => {
        totalUsedMargin += (Number(stock.avg) * Number(stock.qty));
      });

      setFunds({
        available: availableCash,
        used: totalUsedMargin,
        opening: availableCash + totalUsedMargin
      });
    } catch (err) {
      console.error("Error fetching funds:", err);
    }
  };

  useEffect(() => { fetchFundsData(); }, [userId]);

  // Logic for the Teaching Simulator: Calculate Health
  const utilizationRate = funds.opening > 0 ? (funds.used / funds.opening) * 100 : 0;
  
  const getHealthStatus = () => {
    if (utilizationRate > 85) return { label: "High Risk", color: "#ef4444", tip: "You are 'Over-leveraged'. A small market dip could freeze your account." };
    if (utilizationRate > 60) return { label: "Aggressive", color: "#f59e0b", tip: "Most of your capital is at work. Ensure you have enough cash for 'Buy the Dip' opportunities." };
    return { label: "Healthy", color: "#10b981", tip: "Great balance! You have enough liquidity to act if the market changes." };
  };

  const health = getHealthStatus();

  const handleTransaction = async () => {
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    const endpoint = transactionType === "Add" ? "addFunds" : "withdrawFunds";
    try {
      const response = await axios.post(`http://localhost:3002/${endpoint}`, { userId, amount: numAmount });
      if (response.data.success) {
        setShowModal(false);
        setAmount("");
        fetchFundsData(); 
      }
    } catch (err) {
      alert(err.response?.data?.message || "Transaction failed");
    }
  };

  return (
    <div className="animate-entry" style={styles.container}>
      {/* --- HEADER --- */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Capital Management</h2>
          <p style={styles.subtitle}>Simulator Mode: Practice Capital Allocation</p>
        </div>
        <div style={styles.buttonGroup}>
          <button style={styles.primaryBtn} onClick={() => { setTransactionType("Add"); setShowModal(true); }}>
            + Add Capital
          </button>
        </div>
      </div>

      {/* --- MAIN BALANCE CARD --- */}
      <div className="bento-card" style={styles.mainCard}>
        <div style={styles.cardHeader}>
          <span style={styles.cardTag}>Live Buying Power</span>
          <div style={styles.livePulse} />
        </div>
        <h1 className="data-number" style={styles.mainAmount}>
          ₹{funds.available.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </h1>
        
        {/* TEACHING ELEMENT: Liquidity Gauge */}
        <div style={styles.gaugeWrapper}>
            <div style={styles.gaugeTrack}>
                <div style={{...styles.gaugeFill, width: `${utilizationRate}%`, backgroundColor: health.color}} />
            </div>
            <div style={styles.gaugeLabels}>
                <span>Utilization: {utilizationRate.toFixed(1)}%</span>
                <span style={{color: health.color, fontWeight: '700'}}>{health.label}</span>
            </div>
        </div>
        
        <div style={{...styles.educationBox, borderLeft: `4px solid ${health.color}`}}>
            <strong>💡 Pro Tip:</strong> {health.tip}
        </div>
      </div>

      {/* --- METRIC GRID --- */}
      <div style={styles.grid}>
        <div className="bento-card" style={styles.statCard}>
          <div style={styles.labelWithTooltip}>
            <span style={styles.statLabel}>Margins Used</span>
            <span className="tooltip-icon">?</span>
            <div className="tooltip-text">Capital currently tied up in stock holdings.</div>
          </div>
          <h3 className="data-number" style={{ ...styles.statValue, color: "#1e293b" }}>
            ₹{funds.used.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h3>
        </div>

        <div className="bento-card" style={styles.statCard}>
          <div style={styles.labelWithTooltip}>
            <span style={styles.statLabel}>Opening Balance</span>
            <span className="tooltip-icon">?</span>
            <div className="tooltip-text">Total value (Cash + Stocks) when the session started.</div>
          </div>
          <h3 className="data-number" style={styles.statValue}>
            ₹{funds.opening.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h3>
        </div>

        <div className="bento-card" style={styles.statCard}>
          <span style={styles.statLabel}>Account Standing</span>
          <h3 className="data-number" style={{ ...styles.statValue, color: health.color }}>
            {health.label}
          </h3>
        </div>
      </div>

      {/* --- MODAL REMAINS SAME FOR FUNCTIONALITY --- */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div className="bento-card animate-entry" style={styles.modal}>
            <h3 style={styles.modalTitle}>{transactionType} Virtual Capital</h3>
            <p style={styles.modalSub}>Simulate a bank transfer to increase your buying power.</p>
            <div style={styles.inputWrapper}>
              <span style={styles.currencySymbol}>₹</span>
              <input 
                type="number" 
                placeholder="0.00" 
                style={styles.input} 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                autoFocus
              />
            </div>
            <div style={styles.modalButtons}>
              <button 
                style={{...styles.confirmBtn, backgroundColor: "#1e293b"}} 
                onClick={handleTransaction}
              >
                Confirm {transactionType}
              </button>
              <button style={styles.cancelBtn} onClick={() => { setShowModal(false); setAmount(""); }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .tooltip-icon {
            background: #e2e8f0;
            width: 16px;
            height: 16px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            font-size: 10px;
            cursor: help;
            margin-left: 6px;
            color: #64748b;
        }
        .labelWithTooltip { position: relative; display: flex; align-items: center; margin-bottom: 12px; }
        .tooltip-text {
            visibility: hidden;
            width: 200px;
            background-color: #1e293b;
            color: #fff;
            text-align: center;
            padding: 8px;
            border-radius: 6px;
            position: absolute;
            z-index: 1;
            bottom: 125%;
            left: 0;
            opacity: 0;
            transition: opacity 0.3s;
            font-size: 12px;
            font-weight: 400;
        }
        .labelWithTooltip:hover .tooltip-text { visibility: visible; opacity: 1; }
      `}</style>
      {/* --- SIMULATOR GUIDE SECTION --- */}
      <div className="bento-card" style={styles.guideContainer}>
        <h4 style={styles.guideTitle}>Understanding Your Capital Health</h4>
        <div style={styles.guideGrid}>
          <div style={styles.guideItem}>
            <div style={{...styles.statusDot, background: "#10b981"}}></div>
            <div>
              <span style={styles.guideLabel}>Healthy (0-60%)</span>
              <p style={styles.guideDesc}>Ideal for beginners. You have plenty of cash to buy during market crashes.</p>
            </div>
          </div>
          <div style={styles.guideItem}>
            <div style={{...styles.statusDot, background: "#f59e0b"}}></div>
            <div>
              <span style={styles.guideLabel}>Aggressive (60-85%)</span>
              <p style={styles.guideDesc}>Your money is working hard, but you are losing "Liquidity" (emergency cash).</p>
            </div>
          </div>
          <div style={styles.guideItem}>
            <div style={{...styles.statusDot, background: "#ef4444"}}></div>
            <div>
              <span style={styles.guideLabel}>High Risk (85%+)</span>
              <p style={styles.guideDesc}>Over-leveraged. If your stocks drop, you won't have any funds to lower your average price.</p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
    
  );
};

const styles = {
  guideContainer: { 
    marginTop: "40px", 
    padding: "30px", 
    background: "#ffffff", 
    border: "1px dashed #cbd5e1",
    borderRadius: "20px" 
  },
  guideTitle: { 
    fontSize: "18px", 
    fontWeight: "700", 
    color: "#1e293b", 
    marginBottom: "20px", 
    textAlign: "left" 
  },
  guideGrid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(3, 1fr)", 
    gap: "30px" 
  },
  guideItem: { 
    display: "flex", 
    gap: "12px", 
    textAlign: "left" 
  },
  statusDot: { 
    minWidth: "10px", 
    height: "10px", 
    borderRadius: "50%", 
    marginTop: "5px" 
  },
  guideLabel: { 
    fontSize: "14px", 
    fontWeight: "700", 
    color: "#334155", 
    display: "block", 
    marginBottom: "4px" 
  },
  guideDesc: { 
    fontSize: "12px", 
    color: "#64748b", 
    lineHeight: "1.5", 
    margin: 0 
  },
  container: { display: "flex", flexDirection: "column", gap: "24px", maxWidth: "1000px", padding: "40px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: "28px", fontWeight: "800", color: "#1e293b", margin: 0, letterSpacing: "-0.02em" },
  subtitle: { color: "#64748b", fontSize: "14px", margin: "4px 0 0 0" },
  
  buttonGroup: { display: "flex", gap: "12px" },
  primaryBtn: { backgroundColor: "#1e293b", color: "white", border: "none", padding: "10px 24px", borderRadius: "10px", fontWeight: "600", cursor: "pointer" },
  
  mainCard: { padding: "40px", background: "white", borderRadius: "24px", border: "1px solid #f1f5f9", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" },
  cardHeader: { display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginBottom: "12px" },
  cardTag: { fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" },
  livePulse: { width: "8px", height: "8px", background: "#10b981", borderRadius: "50%" },
  mainAmount: { fontSize: "52px", fontWeight: "800", color: "#1e293b", margin: 0 },

  gaugeWrapper: { marginTop: "30px", width: "100%", maxWidth: "400px", margin: "30px auto 0" },
  gaugeTrack: { height: "8px", background: "#f1f5f9", borderRadius: "10px", overflow: "hidden" },
  gaugeFill: { height: "100%", transition: "width 0.5s ease-in-out" },
  gaugeLabels: { display: "flex", justifyContent: "space-between", marginTop: "10px", fontSize: "12px", color: "#64748b" },
  
  educationBox: { marginTop: "24px", padding: "16px", background: "#f8fafc", borderRadius: "12px", fontSize: "14px", color: "#475569", textAlign: "left" },

  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" },
  statCard: { padding: "24px", background: "white", borderRadius: "20px", border: "1px solid #f1f5f9" },
  statLabel: { fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" },
  statValue: { fontSize: "22px", fontWeight: "700", margin: "8px 0 0 0" },
  
  modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modal: { padding: "40px", width: "400px", background: "white", borderRadius: "24px", textAlign: "center" },
  modalTitle: { fontSize: "24px", fontWeight: "800", color: "#1e293b", marginBottom: "8px" },
  modalSub: { color: "#64748b", fontSize: "14px", marginBottom: "30px" },
  inputWrapper: { display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "2px solid #f1f5f9", marginBottom: "30px" },
  currencySymbol: { fontSize: "24px", fontWeight: "800", color: "#1e293b", marginRight: "8px" },
  input: { width: "150px", border: "none", fontSize: "32px", fontWeight: "800", outline: "none", color: "#1e293b" },
  modalButtons: { display: "flex", flexDirection: "column", gap: "12px" },
  confirmBtn: { color: "#fff", border: "none", padding: "14px", borderRadius: "10px", cursor: "pointer", fontWeight: "700" },
  cancelBtn: { background: "none", color: "#64748b", border: "none", cursor: "pointer", fontSize: "14px" }
};

export default Funds;