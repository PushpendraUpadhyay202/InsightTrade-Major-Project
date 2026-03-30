import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";

const Orders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/allOrders/${userId}`);
        setAllOrders(response.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchOrders();
  }, [userId]);

  if (loading) return <div style={styles.loader}>Accessing Trade Logs...</div>;

  return (
    <div className="animate-entry" style={styles.container}>
      <header style={styles.header}>
        <h3 style={styles.title}>
          Order Book <span style={styles.countBadge}>{allOrders.length}</span>
        </h3>
      </header>

      {allOrders.length === 0 ? (
        <div className="bento-card" style={styles.emptyState}>
          <div style={styles.emptyIcon}>📂</div>
          <p style={styles.emptyText}>Your order book is empty for this session.</p>
          <Link to={"/"} style={styles.primaryBtn}>Execute First Trade</Link>
        </div>
      ) : (
        <div className="bento-card" style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Timestamp</th>
                <th style={styles.th}>Action</th>
                <th style={styles.th}>Instrument</th>
                <th style={styles.th}>Quantity</th>
                <th style={styles.th}>Execution Price</th>
                <th style={{...styles.th, textAlign: "right"}}>Status</th>
              </tr>
            </thead>
            <tbody>
              {allOrders.map((order, index) => {
                const isBuy = order.mode === "BUY";
                return (
                  <tr key={index} style={styles.tr}>
                    <td style={styles.tdTime}>
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge, 
                        backgroundColor: isBuy ? "rgba(0, 71, 255, 0.1)" : "rgba(255, 59, 48, 0.1)",
                        color: isBuy ? "var(--accent-blue)" : "var(--accent-red)"
                      }}>
                        {order.mode}
                      </span>
                    </td>
                    <td style={styles.tdInstrument}>{order.name}</td>
                    <td style={styles.td} className="data-number">{order.qty}</td>
                    <td style={styles.td} className="data-number">₹{order.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td style={{...styles.td, textAlign: "right"}}>
                      <span style={styles.statusComplete}>
                        <span style={styles.pulseDot} /> COMPLETED
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { display: "flex", flexDirection: "column", gap: "20px" },
  header: { marginBottom: "10px" },
  title: { fontSize: "22px", fontWeight: "800", color: "var(--text-main)", margin: 0, display: "flex", alignItems: "center", gap: "12px" },
  countBadge: { fontSize: "12px", background: "rgba(0,0,0,0.05)", padding: "4px 10px", borderRadius: "20px", color: "var(--text-muted)" },
  
  tableWrapper: { padding: "0", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", color: "var(--text-muted)", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", padding: "20px", borderBottom: "1px solid rgba(0,0,0,0.03)", letterSpacing: "0.05em" },
  tr: { borderBottom: "1px solid rgba(0,0,0,0.02)" },
  td: { padding: "18px 20px", fontSize: "14px", color: "var(--text-main)", fontWeight: "500" },
  tdTime: { padding: "18px 20px", fontSize: "13px", color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" },
  tdInstrument: { padding: "18px 20px", fontSize: "14px", fontWeight: "700", color: "var(--text-main)" },
  
  badge: { padding: "4px 10px", borderRadius: "6px", fontSize: "10px", fontWeight: "800", letterSpacing: "0.02em" },
  statusComplete: { color: "var(--accent-green)", fontSize: "11px", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "6px" },
  pulseDot: { width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--accent-green)", boxShadow: "0 0 0 0 rgba(52, 199, 89, 1)", animation: "pulse-green 2s infinite" },
  
  emptyState: { padding: "80px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "15px" },
  emptyIcon: { fontSize: "40px" },
  emptyText: { color: "var(--text-muted)", fontSize: "15px", fontWeight: "500" },
  primaryBtn: { background: "var(--accent-blue)", color: "white", padding: "12px 24px", borderRadius: "12px", textDecoration: "none", fontSize: "14px", fontWeight: "700", boxShadow: "0 4px 12px rgba(0, 71, 255, 0.2)" },
  loader: { padding: "100px", textAlign: "center", fontSize: "14px", color: "var(--text-muted)", fontWeight: "600" }
};

export default Orders;