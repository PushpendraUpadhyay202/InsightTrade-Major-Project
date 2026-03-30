import React, { useState, useEffect } from "react";
import axios from "axios";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  
  const userId = localStorage.getItem("userId");

  const fetchPositions = async () => {
    if (!userId) return;
    try {
      const response = await axios.get("http://localhost:3002/allPositions");
      const myPositions = response.data.filter(pos => pos.user === userId || pos.userId === userId);
      setAllPositions(myPositions);
    } catch (err) {
      console.error("Error syncing terminal:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
    const interval = setInterval(fetchPositions, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const handleSquareOff = (stock) => {
    setSelectedStock(stock);
    setIsPanelOpen(true);
  };

  const executeSell = async (positionId, stockName, qty, price) => {
    try {
      const response = await axios.post(`http://localhost:3002/buyStock`, {
        userId,
        stockSymbol: stockName,
        qty: Number(qty),
        price: Number(price),
        mode: "SELL",
        positionId: positionId
      });
      
      if (response.data.success) {
        setIsPanelOpen(false);
        fetchPositions();
      }
    } catch (err) {
      console.error("Sell Error:", err);
      alert("Execution failed: Market volatility or network error.");
    }
  };

  if (loading) return <div style={styles.loader}>Syncing active terminals...</div>;

  return (
    <div className="animate-entry" style={styles.container}>
      <header style={styles.header}>
        <h3 style={styles.title}>
          Active Positions <span style={styles.countBadge}>{allPositions.length}</span>
        </h3>
        <div style={styles.marketStatus}>
          <span style={styles.pulseDot} /> Market Live
        </div>
      </header>

      {allPositions.length === 0 ? (
        <div className="bento-card" style={styles.emptyState}>
          <div style={styles.emptyIcon}>📉</div>
          <p style={styles.emptyText}>No active intraday positions found.</p>
        </div>
      ) : (
        <div className="bento-card" style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Product</th>
                <th style={styles.th}>Instrument</th>
                <th style={styles.th}>Qty.</th>
                <th style={styles.th}>Avg. Price</th>
                <th style={styles.th}>LTP</th>
                <th style={styles.th}>P&L</th>
                <th style={{...styles.th, textAlign: "right"}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {allPositions.map((stock, index) => {
                const avg = Number(stock.avg) || 0;
                const price = Number(stock.price) || 0;
                const qty = Number(stock.qty) || 0;
                const pnl = (price - avg) * qty;
                const isProfit = pnl >= 0;
                
                return (
                  <tr key={index} style={styles.tr}>
                    <td style={styles.td}><span style={styles.productTag}>MIS</span></td>
                    <td style={styles.tdInstrument}>{stock.name}</td>
                    <td style={styles.td}>{qty}</td>
                    <td style={styles.td}>₹{avg.toFixed(2)}</td>
                    <td style={styles.td}>₹{price.toFixed(2)}</td>
                    <td style={{ ...styles.td, color: isProfit ? "#10b981" : "#ef4444", fontWeight: "700" }}>
                      {isProfit ? "+" : ""}₹{pnl.toFixed(2)}
                    </td>
                    <td style={{...styles.td, textAlign: "right"}}>
                      <button style={styles.squareOffBtn} onClick={() => handleSquareOff(stock)}>Exit</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* --- PREMIUM EXIT MODAL --- */}
      {isPanelOpen && selectedStock && (
        <div style={styles.overlay} onClick={() => { setIsPanelOpen(false); setShowGuide(false); }}>
          <div className="animate-pop" style={styles.modal} onClick={e => e.stopPropagation()}>
            
            {/* Minimalist Header with Accent Top-Border */}
            <div style={{
                ...styles.modalHeader, 
                borderTop: `6px solid ${(selectedStock.price - selectedStock.avg) >= 0 ? "#10b981" : "#ef4444"}`,
            }}>
              <div>
                <span style={styles.modalType}>POSITION TERMINAL</span>
                <h2 style={styles.modalTicker}>{selectedStock.name}</h2>
              </div>
              <button style={styles.guideIconBtn} onClick={() => setShowGuide(true)}>💡 How to Exit?</button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.statsGrid}>
                <div style={styles.statBox}>
                  <label style={styles.statLabel}>Quantity</label>
                  <span style={styles.statValue}>{selectedStock.qty} Units</span>
                </div>
                <div style={styles.statBox}>
                  <label style={styles.statLabel}>Entry Price</label>
                  <span style={styles.statValue}>₹{selectedStock.avg.toFixed(2)}</span>
                </div>
                <div style={styles.statBox}>
                  <label style={styles.statLabel}>Market Price</label>
                  <span style={{...styles.statValue, color: "#4184f3"}}>₹{selectedStock.price.toFixed(2)}</span>
                </div>
              </div>

              {/* Raised P&L Statement Card */}
              <div style={styles.pnlCard}>
                <div style={styles.pnlHeader}>
                  <span style={styles.pnlLabel}>ESTIMATED RESULT</span>
                  <div style={styles.pnlValueGroup}>
                    <span style={{ 
                        color: (selectedStock.price - selectedStock.avg) >= 0 ? "#10b981" : "#ef4444",
                        fontWeight: "800",
                        fontSize: "24px",
                        letterSpacing: "-0.04em"
                    }}>
                        {((selectedStock.price - selectedStock.avg) * selectedStock.qty) >= 0 ? "+" : ""}
                        ₹{((selectedStock.price - selectedStock.avg) * selectedStock.qty).toFixed(2)}
                    </span>
                    <span style={styles.pnlSubText}>Instant Settlement</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button 
                style={{
                    ...styles.confirmBtn,
                    backgroundColor: (selectedStock.price - selectedStock.avg) >= 0 ? "#10b981" : "#ef4444",
                    boxShadow: `0 8px 20px rgba(${(selectedStock.price - selectedStock.avg) >= 0 ? "16, 185, 129, 0.25" : "239, 68, 68, 0.25"})`
                }} 
                onClick={() => executeSell(selectedStock._id, selectedStock.name, selectedStock.qty, selectedStock.price)}
              >
                SQUARE OFF & CLOSE TRADE
              </button>
              <p style={styles.disclaimer}>Market order. Funds will be returned to your Virtual Balance.</p>
            </div>

            {/* --- ARJUN'S EXIT GUIDE OVERLAY --- */}
            {showGuide && (
              <div style={styles.guideInnerOverlay} onClick={() => setShowGuide(false)}>
                <div style={styles.guideCard} onClick={e => e.stopPropagation()}>
                    <h3 style={{color: "#38bdf8", margin: "0 0 10px 0", fontWeight: '800'}}>The Exit Strategy</h3>
                    <p style={{fontSize: "13px", color: "#94a3b8", marginBottom: "25px", lineHeight: '1.5'}}>Exiting is where Arjun turns his trades into results.</p>
                    
                    <div style={styles.guidePoint}>
                        <div style={{...styles.pointIcon, backgroundColor: "#10b981"}}>1</div>
                        <p style={styles.pointText}><strong>Booking Profits:</strong> When green, exiting secures the profit before the market moves. It adds virtual cash back to your capital.</p>
                    </div>

                    <div style={styles.guidePoint}>
                        <div style={{...styles.pointIcon, backgroundColor: "#ef4444"}}>2</div>
                        <p style={styles.pointText}><strong>Cutting Losses:</strong> When red, exiting protects your remaining capital. It stops the loss from getting bigger.</p>
                    </div>

                    <button style={styles.guideCloseBtn} onClick={() => setShowGuide(false)}>Got it, let's execute!</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { display: "flex", flexDirection: "column", gap: "20px", padding: "20px", fontFamily: "'Inter', sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: "22px", fontWeight: "800", margin: 0, display: "flex", alignItems: "center", gap: "12px", color: "#1e293b" },
  countBadge: { fontSize: "12px", background: "rgba(0,0,0,0.05)", padding: "4px 10px", borderRadius: "20px", color: "#64748b" },
  marketStatus: { fontSize: "11px", fontWeight: "700", color: "#10b981", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px" },
  pulseDot: { width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#10b981" },
  
  tableWrapper: { overflow: "hidden", borderRadius: "12px", background: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", padding: "16px 20px", borderBottom: "1px solid #f1f5f9" },
  tr: { borderBottom: "1px solid #f8fafc", transition: "background 0.2s" },
  td: { padding: "16px 20px", fontSize: "14px", fontWeight: "500", color: "#334155" },
  tdInstrument: { padding: "16px 20px", fontSize: "14px", fontWeight: "700", color: "#1e293b" },
  productTag: { padding: "2px 6px", background: "#f1f5f9", borderRadius: "4px", fontSize: "10px", fontWeight: "800", color: "#64748b" },
  squareOffBtn: { background: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", cursor: "pointer", transition: "opacity 0.2s" },

  overlay: { 
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%", 
    backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(8px)", 
    zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center" 
  },
  modal: { 
    width: "420px", background: "#ffffff", borderRadius: "24px", padding: "32px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", display: "flex", flexDirection: "column", gap: "24px",
    position: "relative", overflow: "hidden", border: "1px solid #e2e8f0"
  },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", margin: "-32px -32px 24px -32px", padding: "24px 32px 20px 32px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" },
  modalType: { fontSize: "10px", fontWeight: "800", color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase" },
  modalTicker: { fontSize: "28px", fontWeight: "900", margin: "4px 0 0 0", color: "#1e293b", letterSpacing: "-0.04em" },
  guideIconBtn: { background: "#ffffff", border: "1px solid #e2e8f0", padding: "6px 12px", borderRadius: "20px", color: "#475569", fontSize: "11px", fontWeight: "600", cursor: "pointer" },
  
  modalBody: { display: "flex", flexDirection: "column", gap: "20px" },
  statsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" },
  statBox: { background: "#ffffff", padding: "16px", borderRadius: "14px", display: "flex", flexDirection: "column", border: "1px solid #f1f5f9" },
  statLabel: { fontSize: "11px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px", textTransform: "uppercase" },
  statValue: { fontSize: "16px", fontWeight: "800", color: "#1e293b", letterSpacing: "-0.02em" },
  
  pnlCard: { background: "#ffffff", padding: "20px", borderRadius: "16px", color: "#1e293b", border: "1px solid #e2e8f0", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)" },
  pnlHeader: { display: "flex", flexDirection: "column", gap: "4px", textAlign: "left" },
  pnlLabel: { fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" },
  pnlValueGroup: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  pnlSubText: { fontSize: "11px", color: "#94a3b8", fontWeight: "500" },

  modalFooter: { display: "flex", flexDirection: "column", gap: "12px" },
  confirmBtn: { 
    color: "#ffffff", border: "none", padding: "18px", 
    borderRadius: "14px", fontSize: "15px", fontWeight: "800", cursor: "pointer",
    transition: "transform 0.2s ease",
  },
  disclaimer: { fontSize: "11px", color: "#94a3b8", textAlign: "center", margin: "10px 0 0 0", fontWeight: '500' },
  
  guideInnerOverlay: {
    position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
    backgroundColor: "rgba(15, 23, 42, 0.95)", zIndex: 100,
    display: "flex", alignItems: "center", padding: "40px", color: "white", backdropFilter: "blur(4px)"
  },
  guideCard: { textAlign: "left" },
  guidePoint: { display: "flex", gap: "15px", marginBottom: "20px", alignItems: 'start' },
  pointIcon: { minWidth: "22px", minHeight: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "900", color: "white", flexShrink: 0, marginTop: '2px' },
  pointText: { fontSize: "13px", color: "#cbd5e1", margin: 0, lineHeight: "1.6" },
  guideCloseBtn: { width: "100%", padding: "14px", background: "#ffffff", color: "#1e293b", border: "none", borderRadius: "10px", fontWeight: "800", marginTop: "15px", cursor: "pointer", fontSize: '14px' },

  loader: { padding: "100px", textAlign: "center", fontSize: "14px", color: "#64748b" },
  emptyState: { padding: "60px", textAlign: "center", background: '#fff', borderRadius: '12px' },
  emptyIcon: { fontSize: "32px", marginBottom: '10px' },
  emptyText: { color: "#64748b", fontWeight: '500' }
};

export default Positions;