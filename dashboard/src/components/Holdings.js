import React, { useState, useEffect } from 'react';
import axios from "axios";
import { VerticalGraph } from './VerticalGraph';

const Holdings = () => {
    const [allHoldings, setAllHoldings] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (userId && userId !== "undefined") {
            axios.get(`http://localhost:3002/allHoldings/${userId}`)
                .then((res) => {
                    setAllHoldings(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Holdings Fetch Error:", err);
                    setLoading(false);
                });
        }
    }, [userId]);

    const totalInvestment = allHoldings.reduce((sum, stock) => sum + (stock.avg * stock.qty), 0);
    const totalCurrentValue = allHoldings.reduce((sum, stock) => sum + (stock.price * stock.qty), 0);
    const totalPnL = totalCurrentValue - totalInvestment;
    const pnlPercentage = totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;

    const data = {
        labels: allHoldings.map((stock) => stock.name),
        datasets: [
            {
                label: "Market Value (₹)",
                data: allHoldings.map((stock) => stock.price * stock.qty),
                backgroundColor: "rgba(0, 71, 255, 0.8)", // Electric Blue
                borderRadius: 8,
            },
        ],
    };

    if (loading) return <div style={styles.loader}>Initializing Portfolio...</div>;

    return (
        <div className="animate-entry" style={styles.container}>
            <header style={styles.header}>
                <h3 style={styles.title}>Holdings <span style={styles.countBadge}>{allHoldings.length}</span></h3>
            </header>

            {/* --- BENTO SUMMARY ROW --- */}
            <div style={styles.summaryGrid}>
                <div className="bento-card" style={styles.summaryBox}>
                    <p style={styles.summaryLabel}>Total Investment</p>
                    <h5 className="data-number" style={styles.summaryValue}>
                        ₹{totalInvestment.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                    </h5>
                </div>
                <div className="bento-card" style={styles.summaryBox}>
                    <p style={styles.summaryLabel}>Current Value</p>
                    <h5 className="data-number" style={styles.summaryValue}>
                        ₹{totalCurrentValue.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                    </h5>
                </div>
                <div className="bento-card" style={{...styles.summaryBox, borderBottom: `4px solid ${totalPnL >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'}`}}>
                    <p style={styles.summaryLabel}>Total P&L</p>
                    <h5 className="data-number" style={{...styles.summaryValue, color: totalPnL >= 0 ? "var(--accent-green)" : "var(--accent-red)"}}>
                        {totalPnL >= 0 ? "+" : ""}₹{totalPnL.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                        <span style={styles.pnlSubText}> ({pnlPercentage.toFixed(2)}%)</span>
                    </h5>
                </div>
            </div>

            {/* --- REFINED DATA TABLE --- */}
            <div className="bento-card" style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Instrument</th>
                            <th style={styles.th}>Qty.</th>
                            <th style={styles.th}>Avg. Cost</th>
                            <th style={styles.th}>LTP</th>
                            <th style={styles.th}>Cur. Val</th>
                            <th style={styles.th}>P&L</th>
                            <th style={styles.th}>Net Chg.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allHoldings.map((stock, index) => {
                            const curValue = stock.price * stock.qty;
                            const pnl = curValue - (stock.avg * stock.qty);
                            const isProfit = pnl >= 0;

                            return (
                                <tr key={index} className="table-row-hover" style={styles.tr}>
                                    <td style={styles.tdInstrument}>{stock.name}</td>
                                    <td style={styles.td} className="data-number">{stock.qty}</td>
                                    <td style={styles.td} className="data-number">{stock.avg.toFixed(2)}</td>
                                    <td style={styles.td} className="data-number">{stock.price.toFixed(2)}</td>
                                    <td style={styles.td} className="data-number">{curValue.toFixed(2)}</td>
                                    <td style={{...styles.td, color: isProfit ? "var(--accent-green)" : "var(--accent-red)"}} className="data-number">
                                        {isProfit ? "+" : ""}{pnl.toFixed(2)}
                                    </td>
                                    <td style={{...styles.td, color: isProfit ? "var(--accent-green)" : "var(--accent-red)"}} className="data-number">
                                        {stock.net}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            
            <div className="bento-card" style={styles.graphContainer}>
                <h3 style={styles.chartTitle}>Visual Distribution</h3>
                {allHoldings.length > 0 ? (
                    <VerticalGraph data={data} />
                ) : (
                    <p style={styles.noData}>No holdings to visualize yet.</p>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { display: "flex", flexDirection: "column", gap: "25px" },
    header: { marginBottom: "10px" },
    title: { fontSize: "22px", fontWeight: "800", color: "var(--text-main)", margin: 0, display: "flex", alignItems: "center", gap: "12px" },
    countBadge: { fontSize: "12px", background: "rgba(0,0,0,0.05)", padding: "4px 10px", borderRadius: "20px", color: "var(--text-muted)" },
    summaryGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" },
    summaryBox: { padding: "20px" },
    summaryLabel: { fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0" },
    summaryValue: { fontSize: "24px", fontWeight: "800", margin: 0 },
    pnlSubText: { fontSize: "14px", fontWeight: "600" },
    tableWrapper: { padding: "0", overflow: "hidden" },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { textAlign: "left", color: "var(--text-muted)", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", padding: "20px", borderBottom: "1px solid rgba(0,0,0,0.03)" },
    tr: { transition: "background 0.2s ease" },
    td: { padding: "18px 20px", fontSize: "14px", borderBottom: "1px solid rgba(0,0,0,0.02)", color: "var(--text-main)", fontWeight: "500" },
    tdInstrument: { padding: "18px 20px", fontSize: "14px", fontWeight: "700", color: "var(--accent-blue)", borderBottom: "1px solid rgba(0,0,0,0.02)" },
    graphContainer: { padding: "30px" },
    chartTitle: { fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "20px" },
    loader: { padding: "100px", textAlign: "center", fontSize: "14px", color: "var(--text-muted)", fontWeight: "600" },
    noData: { color: "#999", textAlign: "center", padding: "40px" }
};

export default Holdings;